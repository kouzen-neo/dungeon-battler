# Database & Persistence

Dungeon Battler dirancang sebagai Web App progresif. Saat ini aplikasi menggunakan arsitektur **Local-First** melalui IndexedDB, dengan struktur skema disiapkan untuk masa depan yang mendukung sinkronisasi sisi server (Server-Side).

---

## 1. Local Persistence (Dexie.js / IndexedDB)
**Path:** `apps/web/lib/db/dexie.ts`

Agar data tidak hilang saat tab browser ditutup, game menyimpan state kompleks ke dalam IndexedDB menggunakan library `dexie`.

### Struktur GameSave
```ts
export interface GameSave {
  id?: number;
  currentFloor: number;
  maxFloorReached: number;
  gold: number;
  partyIds: string[];
  inventory: Array<{ itemId: string; quantity: number }>;
  updatedAt: number;
}
```

### Mekanisme Simpan/Muat
- **Menyimpan (Save):** Pemanggilan `saveGame(data)` akan me-*replace* (upsert) baris data dengan `id: 1`. Game ini pada prinsipnya hanya menggunakan 1 slot *save file*.
- **Memuat (Load):** Pemanggilan `loadGame()` dipicu pada saat startup aplikasi lewat `saveStore.initializeFromDB()`.

*Catatan: Saat ini skema IndexedDB masih dalam tahap sederhana (placeholder untuk struktur kompleks seperti inventori/hero `instanceId` penuh).*

---

## 2. Future Server Schema (Prisma / SQLite)
**Path:** `apps/web/lib/db/schema.prisma`

Proyek ini telah memiliki inisialisasi Prisma ORM dengan SQLite. Skema ini merepresentasikan bentuk final jika game dihubungkan ke backend online lengkap dengan login, transaksi, dan leaderboard.

### Model Utama yang Disiapkan:
1. **`User`**: Data autentikasi, kepemilikan resource (`gems`, `gold`), hubungan ke inventori.
2. **`Hero`**: Instance hero gacha milik player. Mencatat level, stat spesifik (hp, atk, def, spd), dan bintang/upgrades. Berelasi banyak-ke-satu dengan `User`.
3. **`Party`**: Menyimpan slot spesifik (hero1Id, hero2Id, hero3Id) yang mendefinisikan lineup saat pertarungan.
4. **`StoryProgress` & `EndlessProgress`**: Mencatat *high score*, lantai tertinggi, dan capaian per user.
5. **`Upgrade`**: Sistem relasional untuk mencatat seberapa jauh satu aspek hero telah ditingkatkan.
6. **`Inventory`**: Kepemilikan barang.
7. **`Transaction`**: Sistem in-app purchase (IAP).
8. **`Leaderboard`**: Tabel peringkat untuk mode endless atau event PVP/PVE musiman.

### Integrasi
Client prisma (`lib/db/client.ts`) telah tersedia dan diisolasi dengan aman untuk *development mode* (mencegah *hot-reload connection leaks*), meski saat ini API Routes yang mengeksekusi *query* Prisma belum diimplementasikan di *frontend view*.
