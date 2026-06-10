# Characters & Enemies

Dokumentasi sistem hero (karakter yang dapat dimainkan), musuh, serta mekanik upgrade dan gacha.

---

## File-File Terkait

| Path | Keterangan |
|---|---|
| `apps/web/lib/game/heroData.ts` | Template dasar seluruh hero |
| `apps/web/lib/stores/heroStore.ts` | State management untuk hero yang dimiliki, gacha, level up |
| `apps/web/lib/game/enemy.ts` | Definisi template dasar musuh |

---

## 1. Hero System

Hero memiliki dua representasi: **Template** (data dasar statis) dan **OwnedInstance** (data dinamis milik player).

### `HeroTemplate`
```ts
// Path: apps/web/lib/game/heroData.ts

export interface HeroTemplate {
  id: string;          // Identifier unik template (misal: "warrior")
  name: string;        // Nama display (misal: "Flame Knight")
  type: string;        // Class (Warrior, Mage, Rogue, Tank, Assassin)
  baseStats: CombatStats; // HP, ATK, DEF, SPD, element pada Level 1
  rarity: "R" | "SR" | "SSR";
  icon: string;        // Emoji (legacy, sekarang diganti sprite)
}
```

### Hero Tersedia
| ID | Nama | Class | Elemen | Rarity | Ciri Khas Stat |
|---|---|---|---|---|---|
| `warrior` | Flame Knight | Warrior | FIRE | R | Seimbang |
| `mage` | Frost Mage | Mage | WATER | R | ATK tinggi, DEF rendah |
| `rogue` | Wind Rogue | Rogue | WIND | R | SPD sangat tinggi |
| `paladin` | Holy Bastion | Tank | EARTH | SR | HP dan DEF masif |
| `assassin` | Shadow Blade | Assassin | WIND | SSR | ATK dan SPD tertinggi |

### `OwnedHero`
```ts
// Path: apps/web/lib/stores/heroStore.ts

export interface OwnedHero extends HeroTemplate {
  instanceId: string;  // ID unik per hasil gacha (misal "init-1", "hx8v2m")
  level: number;       // Level saat ini
  exp: number;         // EXP saat ini (belum sepenuhnya diimplementasikan)
}
```

---

## 2. Gacha System (Summon)

Fungsi `pullGacha` ada di dalam `useHeroStore`.

**Mekanisme:**
1. Cek apakah player memiliki cukup gold (Biaya: **100 Gold**).
2. Jika cukup, potong 100 Gold dari `useStoryStore`.
3. Pilih template hero secara acak dari `heroTemplates` (saat ini uniform random, semua rarity punya peluang sama).
4. Buat `OwnedHero` baru:
   - Copy stat dasar dari template.
   - Set `level = 1`, `exp = 0`.
   - Generate `instanceId` unik (menggunakan `Math.random().toString(36)`).
5. Tambahkan ke array `ownedHeroes`.
6. Simpan otomatis ke database via `save.persistAll()`.

---

## 3. Level Up System

Fungsi `levelUpHero(instanceId)` ada di dalam `useHeroStore`.

**Mekanisme & Formula:**
- **Biaya Gold:** `Level Saat Ini × 50`
  - *Contoh:* Level 1 ke 2 butuh 50 Gold. Level 10 ke 11 butuh 500 Gold.
- **Peningkatan Stat:** `+10% dari Base Stat` (Dibulatkan ke bawah).
  - Berlaku untuk HP, ATK, dan DEF.
  - SPD tetap (tidak naik per level).

```ts
baseStats: {
  ...h.baseStats,
  hp: Math.floor(h.baseStats.hp * 1.1),
  atk: Math.floor(h.baseStats.atk * 1.1),
  def: Math.floor(h.baseStats.def * 1.1),
}
```

---

## 4. Enemy System

### `EnemyTemplate`
```ts
// Path: apps/web/lib/game/enemy.ts

export interface EnemyTemplate {
  id: string;
  name: string;
  stats: CombatStats;  // Stat dasar musuh
  spriteName: string;  // Identifier untuk merender sprite
}
```

### Musuh Dasar
| ID | Nama | Elemen | Sprite |
|---|---|---|---|
| `goblin` | Goblin | EARTH | `goblinSprite` |
| `orc` | Orc | FIRE | `orcSprite` |
| `skeleton`| Skeleton | WIND | `skeletonSprite`|

*Catatan: Musuh di mode cerita biasanya menggunakan stat override yang didefinisikan spesifik per lantai di `storyData.ts` untuk mengatur tingkat kesulitan (scaling).*
