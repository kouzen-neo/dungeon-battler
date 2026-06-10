# Sprite & Visual System

Dungeon Battler menggunakan sistem render sprite berbasis canvas yang dimodifikasi (tinted) secara dinamis. Alih-alih memuat file gambar `.png`, sprite direpresentasikan sebagai array dua dimensi (matriks) di dalam kode sumber TypeScript.

---

## File-File Terkait

| Path | Keterangan |
|---|---|
| `apps/web/lib/assets/spriteSystem.ts` | Definisi indeks warna, palet elemen, fungsi resolver |
| `apps/web/lib/assets/characters/*.ts` | Data matriks sprite spesifik per class |
| `apps/web/components/ui/PixelSprite.tsx` | Komponen React/Canvas untuk merender matriks sprite |
| `apps/web/components/game/BattleCanvas.tsx` | Render engine untuk pertarungan (animasi + sprite grid) |

---

## 1. Indexed Sprite System

Setiap karakter disimpan sebagai matriks 16x16. Tiap angka dalam matriks mewakili sebuah **slot warna (Color Index)**, bukan nilai warna absolut.

### Indeks Warna
```ts
// Path: apps/web/lib/assets/spriteSystem.ts

export const T = 0; // Transparent
export const E = 1; // Element color (main) - Berubah sesuai elemen!
export const D = 2; // Element color (dark) - Berubah sesuai elemen!
export const S = 3; // Skin
export const M = 4; // Metal (grey)
export const m = 5; // Dark metal
export const B = 6; // Black / near-black
export const W = 7; // White / highlight
export const b = 8; // Brown
```

### Warna Dasar Tetap (Base Colors)
T adalah transparan `[0,0,0,0]`. Sisanya (Skin, Metal, Black, dll) memiliki nilai RGBA `[R, G, B, A]` yang tetap (hardcoded).

---

## 2. Sistem Palet Elemen

Piksel yang ditandai dengan indeks `E` (Elemen Utama) dan `D` (Elemen Gelap) adalah piksel dinamis. Warnanya bergantung pada propeti elemen milik hero tersebut.

### Palet
```ts
// Path: apps/web/lib/assets/spriteSystem.ts

export const ELEMENT_PALETTES: Record<ElementType, { main: RGBA; dark: RGBA }> = {
  FIRE:  { main: [220, 38,  60,  255], dark: [153, 27,  27,  255] }, // Merah
  WATER: { main: [56,  130, 246, 255], dark: [29,  78,  216, 255] }, // Biru
  EARTH: { main: [101, 163, 13,  255], dark: [63,  98,  18,  255] }, // Hijau
  WIND:  { main: [6,   182, 212, 255], dark: [14,  116, 144, 255] }, // Cyan
  NONE:  { main: [148, 163, 184, 255], dark: [71,  85,  105, 255] }, // Abu-abu
};
```

---

## 3. Resolusi Sprite

Untuk mengubah matriks indeks menjadi matriks RGBA yang bisa di-draw ke canvas, digunakan fungsi `resolveSprite`.

```ts
export function resolveSprite(sprite: number[][], element: ElementType = 'NONE'): number[][][]
```

Fungsi ini melakukan loop ke setiap sel di matriks 16x16:
- Jika indeks = `E`, ganti dengan warna `main` dari `ELEMENT_PALETTES[element]`.
- Jika indeks = `D`, ganti dengan warna `dark` dari `ELEMENT_PALETTES[element]`.
- Jika indeks lain, ambil dari `BASE_COLORS`.

**Output:** Array 3D `number[][][]` di mana lapisan ketiga adalah nilai `[R, G, B, A]`.

---

## 4. Komponen `PixelSprite`

Komponen UI reusable (`apps/web/components/ui/PixelSprite.tsx`) digunakan di menu Profil, Gacha, dan antarmuka non-battle lainnya.

### Props
- `spriteId: string` - ID hero (e.g., "warrior", "mage").
- `element?: ElementType` - Elemen untuk mewarnai sprite.
- `size?: number` - Ukuran output di layar (default: 32px).
- `cropToHead?: boolean` - Fitur untuk memotong (crop) sprite sehingga hanya menampilkan bagian wajah/kepala.

### Mekanisme `cropToHead`
Ketika `cropToHead = true`, canvas hanya akan me-render area spesifik dari matriks 16x16:
- **Baris (Y):** 0 sampai 7 (Separuh atas)
- **Kolom (X):** 4 sampai 11 (Tengah, selebar 8 piksel)

Hasil crop berupa area 8x8 piksel yang dirender pada kanvas. Menggunakan `image-rendering: pixelated` via CSS memastikan bahwa piksel tidak buram (anti-aliased) saat diperbesar.

---

## 5. Battle Canvas Renderer

`apps/web/components/game/BattleCanvas.tsx` merender pertempuran aktual.

- Menerima prop `partySprites` dan `enemySprites` yang sudah direvsolvsi (`number[][][][]`). (Memoisasi dilakukan di halaman induk untuk menghindari re-resolve mahal).
- Fungsi `drawSprite` melukis kotak piksel secara manual langsung ke `CanvasRenderingContext2D`.
- Musuh di-render dengan argumen `flip = true` agar secara visual menghadap ke arah party pemain.
