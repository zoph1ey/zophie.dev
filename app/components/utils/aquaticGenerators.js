import { seaweedPalettes, coralPalettes, fishPalettes } from '../palettes/aquaticPalettes';
import { FISH_WIDTH } from '../sprites/aquaticSprites';

export function generateSeaweed(w, h) {
  const seaweed = [];
  const num = Math.floor(w / 25);

  for (let i = 0; i < num; i++) {
    const size = 2.5 + Math.random() * 2.5;
    seaweed.push({
      x: (i * (w / num)) + Math.random() * 15 - 7,
      baseY: h,
      size: size,
      paletteIndex: Math.floor(Math.random() * seaweedPalettes.length),
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
      layer: Math.random(),
    });
  }
  return seaweed;
}

export function generateCorals(w, h) {
  const corals = [];
  const num = Math.floor(w / 50);

  for (let i = 0; i < num; i++) {
    const types = ['round', 'fan', 'tube'];
    const type = types[Math.floor(Math.random() * types.length)];
    const size = 2 + Math.random() * 2;

    corals.push({
      x: (i * (w / num)) + Math.random() * 35 - 17,
      baseY: h,
      type: type,
      size: size,
      paletteIndex: Math.floor(Math.random() * coralPalettes.length),
      layer: Math.random(),
    });
  }
  return corals;
}

export function generateFish(w, h, isMobile) {
  const fish = [];
  // Mobile: 5-8 fish (50% less), Desktop: 10-16 fish
  const numFish = isMobile
    ? 5 + Math.floor(Math.random() * 4)
    : 10 + Math.floor(Math.random() * 7);
  const minDistance = 100; // Minimum distance between fish to prevent clustering

  for (let i = 0; i < numFish; i++) {
    let attempts = 0;
    let validPosition = false;
    let x, y;

    // Try to find a position that's far enough from other fish
    while (!validPosition && attempts < 50) {
      x = Math.random() * w;
      y = h * 0.1 + Math.random() * (h * 0.45);

      validPosition = true;
      // Check distance from all existing fish
      for (const otherFish of fish) {
        const dx = x - otherFish.x;
        const dy = y - otherFish.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDistance) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }

    const size = 2 + Math.random() * 2;
    // Desktop: 50% faster (0.6-1.5), Mobile: original speed (0.4-1.0)
    const speed = isMobile
      ? 0.4 + Math.random() * 0.6
      : 0.6 + Math.random() * 0.9;
    fish.push({
      x: x || Math.random() * w, // Fallback if no valid position found
      y: y || h * 0.1 + Math.random() * (h * 0.45),
      size: size,
      speed: speed,
      direction: Math.random() > 0.5 ? 1 : -1,
      paletteIndex: Math.floor(Math.random() * fishPalettes.length),
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 1.5 + Math.random() * 1.5,
      tailPhase: Math.random() * Math.PI * 2,
      vx: 0,
      vy: 0,
    });
  }
  return fish;
}
