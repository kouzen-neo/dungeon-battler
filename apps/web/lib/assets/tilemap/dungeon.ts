// 0: Floor, 1: Wall, 2: Entrance, 3: Exit
export const dungeonTilemap = Array(20).fill(null).map((_, y) => 
  Array(20).fill(null).map((_, x) => {
    if (x === 0 || x === 19 || y === 0 || y === 19) return 1;
    if (x === 1 && y === 1) return 2;
    if (x === 18 && y === 18) return 3;
    return Math.random() > 0.8 ? 1 : 0;
  })
);
