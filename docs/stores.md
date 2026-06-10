# State Management (Zustand Stores)

Dungeon Battler menggunakan [Zustand](https://github.com/pmndrs/zustand) untuk mengelola *global state* pada sisi client (frontend).

---

## 1. `useBattleStore`
**Path:** `apps/web/lib/stores/battleStore.ts`

Mengatur segala state temporal dan siklus yang terjadi saat dalam pertarungan.

**State:**
- `playerParty: BattleUnit[]` - Kondisi terkini hero milik player di battle.
- `enemies: BattleUnit[]` - Kondisi terkini musuh di battle.
- `turnOrder: BattleUnit[]` - Urutan antrian giliran berdasarkan SPD.
- `currentTurnIndex: number` - Menunjuk ke unit yang sedang mengambil giliran.
- `isBattleOver: boolean` - True jika musuh habis atau party habis.
- `winner: "player" | "enemy" | null` - Status pemenang.
- Animasi: `attackingId`, `targetId`, `damagePopups`

**Actions Utama:**
- `startBattle(party, enemies)` - Inisialisasi battle.
- `attack(targetId)` - Menjalankan logika serangan, kalkulasi damage, trigger animasi, dan penentuan kondisi selesai/mati. Asynchronous (menunggu animasi selesai).
- `swapPositions(id1, id2)` - Menukar posisi dua unit dalam party dan mengonsumsi 1 giliran.
- `nextTurn()` - Pindah giliran ke unit selanjutnya yang masih hidup.

---

## 2. `useHeroStore`
**Path:** `apps/web/lib/stores/heroStore.ts`

Mengatur hero apa saja yang dimiliki oleh akun player.

**State:**
- `ownedHeroes: OwnedHero[]` - Seluruh inventaris hero milik player. Masing-masing memiliki `instanceId` unik.
- `partyIds: string[]` - Array `instanceId` (maksimal 3) yang menandakan hero mana yang diikutsertakan dalam pertarungan aktif.

**Actions Utama:**
- `pullGacha()` - Bayar 100 Gold. Pilih template hero secara acak, buat instance baru dengan level 1, tambahkan ke `ownedHeroes`.
- `levelUpHero(instanceId)` - Cek biaya Gold (level * 50), bayar Gold, naikkan stat dasar sebesar +10%.
- `setParty(ids)` - Mengubah formasi party aktif.

*Catatan: Setiap aksi yang mengubah state hero akan otomatis memanggil `save.persistAll()` untuk menyimpan ke IndexedDB.*

---

## 3. `useStoryStore`
**Path:** `apps/web/lib/game/storyProgress.ts`

Mengatur progres campaign cerita dan resource general (mata uang utama).

**State:**
- `currentFloor: number` - Lantai (stage) saat ini.
- `maxFloorReached: number` - Lantai tertinggi yang pernah diselesaikan.
- `gold: number` - Mata uang utama player.

**Actions Utama:**
- `completeFloor(floor, goldReward)` - Update lantai sekarang, rekam `maxFloorReached` jika ini pencapaian baru, dan tambahkan `goldReward`.

*Store ini menggunakan middleware `persist` dari Zustand, sehingga nilainya tersimpan otomatis di `localStorage` web browser (Terpisah dari IndexedDB).*

---

## 4. `useShopStore`
**Path:** `apps/web/lib/stores/shopStore.ts`

Mengatur sistem inventaris item (selain hero).

**State:**
- `inventory: Record<string, number>` - Map ID item (seperti ramuan, perlengkapan) terhadap kuantitas yang dimiliki.

**Actions Utama:**
- `buyItem(item)` - Cek kecukupan `gold` di `storyStore`, jika cukup potong `gold` dan increment `inventory[item.id]`. Panggil `persistAll()`.

---

## 5. `useSaveStore`
**Path:** `apps/web/lib/stores/saveStore.ts`

Jembatan (Facade) antara Zustand Stores dengan Database Lokal (Dexie/IndexedDB).

**State:**
- `isSaving: boolean` - Indikator loading saat menyimpan data.
- `lastSaved: number | null` - Timestamp simpanan terakhir.

**Actions Utama:**
- `persistAll()` - Mengumpulkan data dari berbagai store (seperti `storyStore`, hero ids, dsb) dan menulisnya ke database Dexie secara asinkron.
- `initializeFromDB()` - Membaca data terakhir yang tersimpan di Dexie, lalu melakukan injeksi/setState kembali ke Zustand stores masing-masing saat game pertama kali dimuat.
