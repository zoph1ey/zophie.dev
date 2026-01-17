// Chest color palette
// 1: black
// 2: dark brown (inside chest)
// 3: dark cream (chest edge)
// 4: light cream (chest edge)
// 5: brown (wood)
// 6: light brown (wood)
// 7: dark brown (connecting wood)
// 8: medium dark brown (connecting wood)
// 9: light gold (gold)
// 10: gold (gold)
// 11: dark gold (gold)
// 12: red (treasure)
// 13: dark red (treasure)
// 14: light green (treasure)
// 15: green (treasure)
// 16: dark green (treasure)
// 17: light purple (treasure)
// 18: purple (treasure)
// 19: dark purple (treasure)
// 20: light blue (treasure)
// 21: blue (treasure)
// 22: dark blue (treasure)

export const chestPalette = {
  1: [0, 0, 0],
  2: [71, 44, 4],
  3: [163, 148, 98],
  4: [219, 206, 162],
  5: [186, 118, 50],
  6: [232, 165, 97],
  7: [107, 73, 37],
  8: [153, 107, 58],
  9: [255, 251, 145],
  10: [186, 180, 28],
  11: [143, 121, 10],
  12: [255, 64, 64],
  13: [166, 18, 18],
  14: [237, 255, 237],
  15: [168, 230, 168],
  16: [33, 158, 33],
  17: [249, 217, 255],
  18: [217, 122, 235],
  19: [112, 33, 128],
  20: [207, 231, 255],
  21: [90, 161, 232],
  22: [31, 92, 153],
};

export const shellPalette = {
  1: [138, 62, 64],
  2: [232, 149, 141],
  3: [251, 202, 189],
  4: [254, 235, 212],
};

export const gemPalette = {
  1: [80, 40, 120],
  2: [120, 60, 180],
  3: [160, 100, 220],
  4: [200, 150, 255],
  5: [230, 200, 255],
};

export const pearlPalette = {
  1: [180, 180, 190],
  2: [210, 210, 220],
  3: [235, 235, 245],
  4: [250, 250, 255],
  5: [255, 255, 255],
};

// Scale constants
export const CHEST_SCALE = 6;
export const TREASURE_SCALE = 6;
