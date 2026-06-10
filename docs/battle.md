# Battle System

Dokumentasi lengkap sistem pertarungan turn-based Dungeon Battler.

---

## File-File Terkait

| Path | Keterangan |
|---|---|
| `apps/web/lib/game/combat.ts` | Fungsi kalkulasi damage, elemen, turn order |
| `apps/web/lib/stores/battleStore.ts` | State management seluruh sesi battle |
| `apps/web/hooks/useBattle.ts` | Hook React — auto AI turn, state binding ke UI |
| `apps/web/app/game/page.tsx` | Halaman battle — init, render, aksi user |
| `apps/web/components/game/BattleCanvas.tsx` | Canvas renderer — animasi sprite & damage popup |
| `apps/web/components/game/ActionButtons.tsx` | Tombol aksi: ATTACK, SWAP POS |
| `apps/web/components/game/PartyStatus.tsx` | Panel HP party (kiri), highlight giliran |
| `apps/web/components/game/EnemyStatus.tsx` | Panel HP musuh (kanan), highlight giliran |

---

## 1. Unit & Posisi

### Tipe `BattleUnit`
```ts
// Path: apps/web/lib/stores/battleStore.ts

export type UnitPosition = 'FRONT' | 'MID' | 'BACK' | 'ENEMY';

export interface BattleUnit {
  id: string;          // Unique ID dalam sesi battle (misal "p1", "e1")
  name: string;        // Nama display
  stats: CombatStats;  // Stat aktif (sudah termasuk efek level)
  currentHp: number;   // HP saat ini (berkurang saat diserang)
  isEnemy: boolean;    // true = musuh, false = party player
  position: UnitPosition;
}
```

### Penugasan Posisi Party
Posisi diset saat battle dimulai di `apps/web/app/game/page.tsx`:

```ts
const positions: UnitPosition[] = ['FRONT', 'MID', 'BACK'];

const partyUnits: BattleUnit[] = activeParty.map((hero, i) => ({
  id: `p${i + 1}`,
  name: hero.name,
  stats: { ...hero.baseStats },
  currentHp: hero.baseStats.hp,
  isEnemy: false,
  position: positions[i] ?? 'BACK',
}));
```

| Slot | Posisi | Probabilitas Diserang AI |
|---|---|---|
| 0 (pertama di party) | `FRONT` | **50%** |
| 1 | `MID` | **30%** |
| 2 | `BACK` | **20%** |

---

## 2. Turn Order

### Fungsi `determineTurnOrder`
```ts
// Path: apps/web/lib/game/combat.ts

export const determineTurnOrder = <T extends { stats: CombatStats }>(units: T[]): T[] => {
  return [...units].sort((a, b) => b.stats.spd - a.stats.spd);
};
```

- Semua unit (party + musuh) diurutkan berdasarkan stat `spd` secara **descending**.
- Unit dengan `spd` tertinggi bertindak pertama.
- Turn order dihitung ulang setiap kali ada unit yang mati (via `determineTurnOrder` di dalam `attack` dan `swapPositions`).

### `currentUnit`
```ts
// Path: apps/web/hooks/useBattle.ts

const currentUnit = turnOrder[currentTurnIndex];
```

`currentTurnIndex` diincrement oleh `nextTurn()`:

```ts
// Path: apps/web/lib/stores/battleStore.ts

nextTurn: () => {
  set((state) => {
    let nextIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
    // Skip unit yang sudah mati
    while (state.turnOrder[nextIndex].currentHp <= 0) {
      nextIndex = (nextIndex + 1) % state.turnOrder.length;
    }
    return { currentTurnIndex: nextIndex };
  });
},
```

---

## 3. Kalkulasi Damage

### Fungsi `calculateDamage`
```ts
// Path: apps/web/lib/game/combat.ts

export const calculateDamage = (attacker: CombatStats, defender: CombatStats): number => {
  const baseDamage    = Math.max(1, attacker.atk - defender.def); // minimum 1
  const randomVariance = Math.floor(Math.random() * 5) - 2;       // -2 sampai +2
  const multiplier    = getElementMultiplier(attacker.element, defender.element);

  return Math.floor((baseDamage + randomVariance) * multiplier);
};
```

**Formula:**
```
damage = floor((max(1, ATK - DEF) + rand(-2..+2)) × elementMultiplier)
```

---

## 4. Sistem Elemen

### Chart Keunggulan Elemen
```ts
// Path: apps/web/lib/game/combat.ts

const chart: Record<ElementType, Partial<Record<ElementType, number>>> = {
  FIRE:  { WIND: 1.5, WATER: 0.5 },
  WATER: { FIRE: 1.5, EARTH: 0.5 },
  EARTH: { WATER: 1.5, WIND: 0.5 },
  WIND:  { EARTH: 1.5, FIRE: 0.5 },
  NONE:  {},
};
```

| Penyerang | Lawan | Multiplier |
|---|---|---|
| FIRE | WIND | ×1.5 (kuat) |
| FIRE | WATER | ×0.5 (lemah) |
| WATER | FIRE | ×1.5 |
| WATER | EARTH | ×0.5 |
| EARTH | WATER | ×1.5 |
| EARTH | WIND | ×0.5 |
| WIND | EARTH | ×1.5 |
| WIND | FIRE | ×0.5 |
| Apapun | NONE | ×1.0 (netral) |

### Fungsi `getElementMultiplier`
```ts
// Path: apps/web/lib/game/combat.ts

export const getElementMultiplier = (attacker: ElementType, defender: ElementType): number => {
  return chart[attacker]?.[defender] ?? 1.0; // default netral
};
```

---

## 5. Aksi Battle

### `attack(targetId: string): Promise<void>`
```ts
// Path: apps/web/lib/stores/battleStore.ts
```

**Flow:**
1. Ambil `attacker` = `turnOrder[currentTurnIndex]`
2. Temukan `target` berdasarkan `targetId` dari `playerParty + enemies`
3. Set `attackingId` dan `targetId` → trigger animasi di `BattleCanvas`
4. Hitung `damage` via `calculateDamage`
5. Tambah `damagePopup` dengan koordinat X (musuh: 300, party: 80)
6. `await setTimeout(600ms)` — jeda animasi serangan
7. Update `currentHp` target
8. Cek kondisi kemenangan:
   - Semua musuh HP = 0 → `winner = "player"`
   - Semua party HP = 0 → `winner = "enemy"`
9. Jika battle belum selesai → panggil `nextTurn()`

### `swapPositions(id1: string, id2: string): void`
```ts
// Path: apps/web/lib/stores/battleStore.ts
```

**Flow:**
1. Temukan `unit1` dan `unit2` di `playerParty`
2. Tukar nilai field `position` keduanya
3. Update `playerParty` + hitung ulang `turnOrder`
4. Tambah log swap
5. Panggil `nextTurn()` — aksi swap mengonsumsi 1 giliran

---

## 6. AI Enemy Turn

### `useBattle` Hook — Auto-attack Logic
```ts
// Path: apps/web/hooks/useBattle.ts

useEffect(() => {
  if (isBattleOver || !currentUnit) return;

  if (currentUnit.isEnemy) {
    const timer = setTimeout(() => {
      // Weighted targeting berdasarkan posisi party
      const weightedTargets = targets.map(target => {
        let weight = 10;
        if (target.position === 'FRONT') weight = 50;
        else if (target.position === 'MID') weight = 30;
        else if (target.position === 'BACK') weight = 20;
        return { target, weight };
      });

      // Pilih target dengan weighted random
      const totalWeight = weightedTargets.reduce((sum, t) => sum + t.weight, 0);
      let randomNum = Math.random() * totalWeight;
      for (const item of weightedTargets) {
        randomNum -= item.weight;
        if (randomNum <= 0) { selectedTarget = item.target; break; }
      }

      attack(selectedTarget.id);
    }, 1000); // Delay 1 detik sebelum AI menyerang
  }
}, [currentUnit, isBattleOver, playerParty, attack]);
```

AI menyerang **1 detik** setelah gilirannya tiba, memilih target dengan **weighted random** berdasarkan posisi.

---

## 7. Kondisi Akhir Battle

```ts
// Path: apps/web/lib/stores/battleStore.ts (dalam attack())

const allEnemiesDead = nextEnemies.every(e => e.currentHp <= 0);
const allPlayerDead  = nextPlayerParty.every(p => p.currentHp <= 0);

if (allEnemiesDead) set({ isBattleOver: true, winner: "player" });
if (allPlayerDead)  set({ isBattleOver: true, winner: "enemy" });
```

Kondisi menang/kalah dicek **setelah setiap serangan**. `isBattleOver` menjadi `true` menghentikan AI useEffect.

---

## 8. Battle Canvas & Animasi

### `BattleCanvas` Component
```ts
// Path: apps/web/components/game/BattleCanvas.tsx

interface BattleCanvasProps {
  partySprites:  number[][][][]; // Array of resolved RGBA sprite grids
  enemySprites:  number[][][][]; // Array of resolved RGBA sprite grids
  attackingId:   string | null;  // ID unit yang sedang menyerang
  targetId:      string | null;  // ID unit yang sedang diserang
  damagePopups:  Array<{ id: number, value: number, x: number, y: number }>;
}
```

| Animasi | Kondisi | Efek |
|---|---|---|
| Idle float | Selalu | `y += sin(frame × 0.1 + i) × 3` |
| Serangan | `attackingId === id` | `x += 40` (maju ke depan) |
| Terkena | `targetId === id` | `x += sin(frame × 0.5) × 5` (shake) |
| Damage popup | Ada entry di `damagePopups` | Teks melayang ke atas, hilang setelah 1000ms |

### `drawSprite` (fungsi lokal)
```ts
// Path: apps/web/components/game/BattleCanvas.tsx

export const drawSprite = (
  ctx:   CanvasRenderingContext2D,
  sprite: number[][][],  // 16×16 RGBA pixel grid
  x: number,
  y: number,
  scale: number = 4,     // Default: 4px per pixel → sprite 64×64px
  flip: boolean = false  // true untuk sprite musuh (menghadap kiri)
)
```

Musuh di-render dengan `flip: true` sehingga menghadap ke kiri (ke arah party).
