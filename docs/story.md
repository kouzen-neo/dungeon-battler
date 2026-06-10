# Story & Campaign System

Dungeon Battler menggunakan sistem cerita berbasis lantai/stage (Floor). Setiap penyelesaian lantai akan memberikan hadiah dan membuka lantai berikutnya.

---

## 1. Definisi Data (Story Data)
**Path:** `apps/web/lib/game/storyData.ts`

Data lantai tidak di-generate secara acak, melainkan ditentukan secara terstruktur dalam bentuk array statis.

### Struktur Data `FloorData`
```ts
export interface EnemyInstance {
  name: string;        // Nama musuh spesifik lantai tersebut
  stats: CombatStats;  // Overrides stat template dasar musuh (untuk scaling)
}

export interface FloorData {
  floorNumber: number;
  enemies: EnemyInstance[]; // Komposisi musuh yang harus dilawan
  rewardGold: number;       // Hadiah jika memenangkan battle
}
```

### Chapter 1 (Lantai 1-10)
Saat ini game memuat `storyChapter1` yang terdiri dari 10 lantai. Semakin tinggi lantainya, HP, ATK, dan tingkat kesulitan musuh semakin bertambah, diiringi peningkatan hadiah gold.

**Highlights:**
- **Lantai 1-5:** Melawan kelompok Goblin dengan elemen variatif. Hadiah berkisar 10-35 Gold.
- **Lantai 6-8:** Pengenalan ras musuh baru: Orc dan Skeleton Archer. Hadiah 50-80 Gold.
- **Lantai 10 (Boss):** Melawan `Forest Wolf (BOSS)`. HP masif (200), Speed sangat tinggi (18), bertipe WIND. Memberikan 500 Gold jika dikalahkan.

---

## 2. Progresi Pemain (Story Progress)
**Path:** `apps/web/lib/game/storyProgress.ts`

Menyimpan rekam jejak pemain pada mode cerita via `useStoryStore`.

**Mekanisme:**
1. Pemain memulai di `currentFloor` 1.
2. Saat pemain menekan "Start", `storyData` untuk `currentFloor` diambil. Musuh yang ada di `FloorData` dikirim ke `useBattleStore` untuk diinisiasi.
3. Setelah pemain menang, fungsi `completeFloor(floor, reward)` dipanggil.
4. `currentFloor` naik 1 tingkat. `maxFloorReached` dicatat untuk melacak seberapa jauh kampanye telah terselesaikan. Hadiah `goldReward` ditambahkan ke saldo pemain.

*Catatan Teknis:* Data ini disimpan melalui `persist` middleware milik Zustand secara langsung ke LocalStorage browser, dengan key `dungeon-story-storage`. Hal ini berbeda dari data Save utama (Dexie) untuk memisahkan data sesi UI dan data persisten server.
