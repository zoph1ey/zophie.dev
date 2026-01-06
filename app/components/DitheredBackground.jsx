'use client';

import { useEffect, useRef } from 'react';
import { bayerMatrix } from './constants';

const SCALE = 2.5;

const fishSprite = [
  [0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 1, 1, 1, 2, 0, 0, 0, 0],
  [0, 0, 0, 2, 2, 0, 0, 0, 2, 1, 2, 2, 2, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 2, 0, 2, 1, 1, 1, 1, 1, 1, 3, 2, 2, 0],
  [0, 0, 0, 0, 2, 1, 2, 1, 3, 3, 3, 3, 3, 3, 5, 4, 3, 2],
  [0, 0, 0, 0, 2, 1, 1, 3, 3, 3, 3, 3, 1, 3, 5, 5, 3, 2],
  [0, 0, 0, 0, 2, 1, 2, 1, 3, 3, 3, 3, 1, 3, 3, 3, 3, 2],
  [0, 0, 0, 2, 1, 2, 0, 2, 1, 1, 1, 1, 1, 1, 3, 2, 2, 0],
  [0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const seaweedSprite = [
  [0, 0, 1, 2, 0],
  [0, 1, 2, 3, 0],
  [0, 1, 2, 0, 0],
  [1, 2, 3, 0, 0],
  [1, 2, 0, 0, 0],
  [1, 2, 3, 0, 0],
  [0, 1, 2, 0, 0],
  [0, 1, 2, 3, 0],
  [0, 0, 1, 2, 0],
  [0, 1, 2, 3, 0],
  [0, 1, 2, 0, 0],
  [1, 2, 0, 0, 0],
  [1, 2, 3, 0, 0],
  [0, 1, 2, 0, 0],
  [0, 1, 2, 3, 0],
  [0, 0, 1, 2, 0],
  [0, 1, 2, 3, 0],
  [0, 1, 2, 0, 0],
  [1, 2, 0, 0, 0],
  [1, 2, 3, 0, 0],
  [0, 1, 2, 0, 0],
  [0, 1, 2, 3, 0],
  [0, 0, 1, 2, 0],
  [0, 1, 2, 3, 0],
  [0, 1, 2, 0, 0],
  [1, 2, 0, 0, 0],
  [1, 2, 3, 0, 0],
  [0, 1, 2, 0, 0],
  [0, 1, 2, 3, 0],
  [0, 0, 1, 2, 0],
  [0, 1, 2, 3, 0],
  [0, 0, 1, 2, 0],
];

const roundCoralSprite = [
  [0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0],
  [0, 0, 2, 3, 3, 4, 4, 3, 3, 2, 0, 0],
  [0, 2, 3, 4, 3, 3, 3, 3, 4, 3, 2, 0],
  [0, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 0],
  [1, 2, 3, 2, 3, 4, 4, 3, 2, 3, 2, 1],
  [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
  [1, 2, 2, 3, 4, 3, 3, 4, 3, 2, 2, 1],
  [0, 1, 2, 3, 3, 4, 4, 3, 3, 2, 1, 0],
  [0, 2, 3, 4, 3, 3, 3, 3, 4, 3, 2, 0],
  [1, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 1],
  [1, 2, 3, 2, 3, 4, 4, 3, 2, 3, 2, 1],
  [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1],
  [1, 2, 2, 3, 4, 3, 3, 4, 3, 2, 2, 1],
  [0, 1, 2, 3, 3, 3, 3, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 3, 4, 4, 3, 2, 2, 1, 0],
  [0, 0, 1, 2, 3, 3, 3, 3, 2, 1, 0, 0],
  [0, 0, 1, 2, 2, 3, 3, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
];

const fanCoralSprite = [
  [0, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 3, 2, 3, 2, 3, 0, 0, 0, 0],
  [0, 0, 0, 2, 3, 2, 1, 2, 3, 2, 3, 0, 0, 0],
  [0, 0, 2, 3, 2, 0, 1, 2, 0, 3, 2, 3, 0, 0],
  [0, 2, 3, 2, 0, 0, 1, 2, 0, 0, 3, 2, 3, 0],
  [0, 3, 2, 0, 2, 3, 1, 2, 2, 3, 0, 3, 2, 0],
  [2, 3, 0, 2, 3, 2, 1, 2, 3, 2, 3, 0, 3, 2],
  [3, 2, 0, 3, 2, 0, 1, 2, 0, 3, 2, 0, 2, 3],
  [0, 0, 2, 3, 0, 0, 1, 2, 0, 0, 3, 2, 0, 0],
  [0, 2, 3, 2, 3, 0, 1, 2, 0, 2, 3, 2, 3, 0],
  [2, 3, 0, 3, 2, 0, 1, 2, 0, 3, 2, 0, 3, 2],
  [3, 2, 0, 0, 3, 2, 1, 2, 3, 2, 0, 0, 2, 3],
  [0, 0, 2, 3, 0, 3, 1, 2, 2, 0, 3, 2, 0, 0],
  [0, 2, 3, 2, 0, 0, 1, 2, 0, 0, 3, 2, 3, 0],
  [2, 3, 0, 3, 2, 0, 1, 2, 0, 3, 2, 0, 3, 2],
  [3, 2, 0, 2, 3, 0, 1, 2, 0, 2, 3, 0, 2, 3],
  [0, 0, 2, 3, 2, 0, 1, 2, 0, 3, 2, 3, 0, 0],
  [0, 0, 3, 2, 3, 0, 1, 2, 0, 2, 3, 2, 0, 0],
  [0, 0, 0, 3, 2, 0, 1, 2, 0, 3, 2, 0, 0, 0],
  [0, 0, 0, 0, 3, 2, 1, 2, 3, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 1, 2, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
];

const tubeCoralSprite = [
  [0, 0, 2, 3, 3, 2, 0, 0],
  [0, 2, 3, 4, 4, 3, 2, 0],
  [0, 2, 3, 3, 3, 3, 2, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];

const seaweedPalettes = [
  { dark: [60, 140, 100], mid: [90, 180, 130], light: [140, 210, 170] },
  { dark: [50, 130, 120], mid: [80, 170, 155], light: [130, 205, 190] },
  { dark: [70, 145, 90], mid: [100, 185, 120], light: [150, 215, 165] },
];

const coralPalettes = [
  { dark: [255, 80, 130], mid: [255, 130, 170], light: [255, 180, 200], highlight: [255, 215, 230] },
  { dark: [255, 120, 50], mid: [255, 160, 100], light: [255, 200, 150], highlight: [255, 230, 200] },
  { dark: [180, 80, 220], mid: [210, 130, 255], light: [230, 175, 255], highlight: [245, 210, 255] },
  { dark: [0, 200, 220], mid: [80, 230, 245], light: [150, 245, 255], highlight: [200, 255, 255] },
  { dark: [255, 70, 90], mid: [255, 120, 130], light: [255, 170, 175], highlight: [255, 210, 215] },
  { dark: [255, 200, 0], mid: [255, 225, 80], light: [255, 240, 140], highlight: [255, 250, 190] },
];

const fishPalettes = [
  { body: [255, 116, 36], bodyDark: [128, 80, 3], bodyLight: [255, 177, 163], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  { body: [240, 34, 140], bodyDark: [145, 9, 52], bodyLight: [252, 149, 182], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  { body: [0, 220, 220], bodyDark: [0, 160, 180], bodyLight: [100, 255, 255], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  { body: [63, 242, 206], bodyDark: [28, 107, 91], bodyLight: [167, 250, 223], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  { body: [17, 104, 191], bodyDark: [8, 14, 120], bodyLight: [143, 195, 247], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  { body: [62, 153, 54], bodyDark: [15, 59, 11], bodyLight: [173, 227, 168], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  { body: [101, 34, 189], bodyDark: [37, 6, 79], bodyLight: [163, 121, 219], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  { body: [255, 209, 56], bodyDark: [214, 76, 6], bodyLight: [255, 229, 181], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
];

const FISH_WIDTH = 18;
const FISH_HEIGHT = 16;
const SEAWEED_WIDTH = 5;
const SEAWEED_HEIGHT = 32;
const ROUND_CORAL_WIDTH = 12;
const ROUND_CORAL_HEIGHT = 20;
const FAN_CORAL_WIDTH = 14;
const FAN_CORAL_HEIGHT = 32;
const TUBE_CORAL_WIDTH = 8;
const TUBE_CORAL_HEIGHT = 28;

function generateSeaweed(w, h) {
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

function generateCorals(w, h) {
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

function generateFish(w, h) {
  const fish = [];
  const numFish = 10 + Math.floor(Math.random() * 7); // Increased by ~20% (was 8-13, now 10-16)
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
    fish.push({
      x: x || Math.random() * w, // Fallback if no valid position found
      y: y || h * 0.1 + Math.random() * (h * 0.45),
      size: size,
      speed: 0.4 + Math.random() * 0.6, // Increased from 0.2-0.6 to 0.4-1.0
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

export default function DitheredBackground({ isOn, activeSection }) {
  const isOnRef = useRef(isOn);
  const activeSectionRef = useRef(activeSection);

  // Update refs when props change
  useEffect(() => {
    isOnRef.current = isOn;
  }, [isOn]);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const canvas = document.getElementById('bayer-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ripples = [];
    const trailRipples = [];
    let allPlants = [];
    let animationId;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let fishList = [];
    let scaledWidth = 0;
    let scaledHeight = 0;
    let time = 0;
    let scrollOffset = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      scaledWidth = Math.ceil(canvas.width / SCALE);
      scaledHeight = Math.ceil(canvas.height / SCALE);
      
      const seaweedList = generateSeaweed(scaledWidth, scaledHeight);
      const coralList = generateCorals(scaledWidth, scaledHeight);
      fishList = generateFish(scaledWidth, scaledHeight);

      allPlants = [
        ...seaweedList.map(s => ({ ...s, plantType: 'seaweed' })),
        ...coralList.map(c => ({ ...c, plantType: 'coral' })),
      ].sort((a, b) => a.layer - b.layer);
    }

    function handleClick(e) {
      ripples.push({
        x: e.clientX / SCALE,
        y: e.clientY / SCALE,
        radius: 0,
        maxRadius: 64, // Reduced from 80 to 64 (20% less area)
        speed: 5,
        strength: 1
      });
    }

    function handleMouseMove(e) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 8) {
        trailRipples.push({
          x: e.clientX / SCALE,
          y: e.clientY / SCALE,
          radius: 0,
          maxRadius: 48, // Reduced from 60 to 48 (20% less area)
          speed: 4,
          strength: 1
        });
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    }

    // Listen for chest opening to scatter fish
    function handleChestOpened() {
      for (const fish of fishList) {
        const centerX = scaledWidth / 2;
        
        // Very minimal movement
        if (fish.x < centerX) {
          fish.vx -= 1.5;
        } else {
          fish.vx += 1.5;
        }
        fish.vy -= 1.5;
      }
    }

    function getSeaweedPixelSingle(px, py, time, sw, scrollOffset) {
      const spriteH = SEAWEED_HEIGHT * sw.size;

      const relYFromBottom = sw.baseY - py;
      if (relYFromBottom < 0 || relYFromBottom > spriteH) return null;

      const heightRatio = relYFromBottom / spriteH;
      const sway = Math.sin(time * sw.speed + sw.phase) * (3 + heightRatio * 8);

      // Render at multiple positions to ensure full screen coverage
      // Render from -2*width to +2*width for complete filling
      for (let offset = -scaledWidth * 2; offset <= scaledWidth * 2; offset += scaledWidth) {
        const adjustedX = sw.x - scrollOffset + offset;
        const swayedX = adjustedX + sway * heightRatio;
        const localX = (px - swayedX) / sw.size;
        const localY = (SEAWEED_HEIGHT - 1) - (relYFromBottom / sw.size);

        const spriteX = Math.floor(localX + SEAWEED_WIDTH / 2);
        const spriteY = Math.floor(localY);

        if (spriteX >= 0 && spriteX < SEAWEED_WIDTH && spriteY >= 0 && spriteY < SEAWEED_HEIGHT) {
          const pixelType = seaweedSprite[spriteY][spriteX];
          if (pixelType > 0) {
            const palette = seaweedPalettes[sw.paletteIndex];
            switch (pixelType) {
              case 1: return palette.dark;
              case 2: return palette.mid;
              case 3: return palette.light;
            }
          }
        }
      }
      return null;
    }

    function getCoralPixelSingle(px, py, coral, scrollOffset) {
      let sprite, spriteW, spriteH;

      if (coral.type === 'round') {
        sprite = roundCoralSprite;
        spriteW = ROUND_CORAL_WIDTH;
        spriteH = ROUND_CORAL_HEIGHT;
      } else if (coral.type === 'fan') {
        sprite = fanCoralSprite;
        spriteW = FAN_CORAL_WIDTH;
        spriteH = FAN_CORAL_HEIGHT;
      } else {
        sprite = tubeCoralSprite;
        spriteW = TUBE_CORAL_WIDTH;
        spriteH = TUBE_CORAL_HEIGHT;
      }

      const scaledH = spriteH * coral.size;

      const relYFromBottom = coral.baseY - py;
      if (relYFromBottom < 0 || relYFromBottom > scaledH) return null;

      // Render at multiple positions to ensure full screen coverage
      // Render from -2*width to +2*width for complete filling
      for (let offset = -scaledWidth * 2; offset <= scaledWidth * 2; offset += scaledWidth) {
        const adjustedX = coral.x - scrollOffset + offset;
        const localX = (px - adjustedX) / coral.size;
        const localY = (spriteH - 1) - (relYFromBottom / coral.size);

        const spriteX = Math.floor(localX + spriteW / 2);
        const spriteY = Math.floor(localY);

        if (spriteX >= 0 && spriteX < spriteW && spriteY >= 0 && spriteY < spriteH) {
          const pixelType = sprite[spriteY][spriteX];
          if (pixelType > 0) {
            const palette = coralPalettes[coral.paletteIndex];
            switch (pixelType) {
              case 1: return palette.dark;
              case 2: return palette.mid;
              case 3: return palette.light;
              case 4: return palette.highlight;
            }
          }
        }
      }
      return null;
    }

    function getPlantPixel(px, py, time, scrollOffset) {
      let color = null;
      for (const plant of allPlants) {
        let c = null;
        if (plant.plantType === 'seaweed') {
          c = getSeaweedPixelSingle(px, py, time, plant, scrollOffset);
        } else {
          c = getCoralPixelSingle(px, py, plant, scrollOffset);
        }
        if (c) {
          color = c;
        }
      }
      return color;
    }

    function updateFish() {
      for (const fish of fishList) {
        // Apply ripple forces from clicks
        for (const ripple of ripples) {
          // Check distance from all rendered positions (accounting for wraparound)
          let minDist = Infinity;
          let bestDx = 0;
          let bestDy = 0;

          for (let offset = -scaledWidth; offset <= scaledWidth; offset += scaledWidth) {
            const renderedX = fish.x - scrollOffset + offset;
            const dx = renderedX - ripple.x;
            const dy = fish.y - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDist) {
              minDist = dist;
              bestDx = dx;
              bestDy = dy;
            }
          }

          if (minDist < ripple.maxRadius && minDist > 0) {
            const force = (1 - minDist / ripple.maxRadius) * ripple.strength * 0.96; // Reduced from 1.2 to 0.96 (20% less)
            fish.vx += (bestDx / minDist) * force;
            fish.vy += (bestDy / minDist) * force;
          }
        }

        // Apply ripple forces from mouse trails
        for (const ripple of trailRipples) {
          // Check distance from all rendered positions (accounting for wraparound)
          let minDist = Infinity;
          let bestDx = 0;
          let bestDy = 0;

          for (let offset = -scaledWidth; offset <= scaledWidth; offset += scaledWidth) {
            const renderedX = fish.x - scrollOffset + offset;
            const dx = renderedX - ripple.x;
            const dy = fish.y - ripple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDist) {
              minDist = dist;
              bestDx = dx;
              bestDy = dy;
            }
          }

          if (minDist < ripple.maxRadius && minDist > 0) {
            const force = (1 - minDist / ripple.maxRadius) * ripple.strength * 0.64; // Reduced from 0.8 to 0.64 (20% less)
            fish.vx += (bestDx / minDist) * force;
            fish.vy += (bestDy / minDist) * force;
          }
        }

        // Apply velocities from ripples (ALWAYS, even when scrolling)
        fish.x += fish.vx;
        fish.y += fish.vy;

        // Apply damping (more damping = fish move less)
        fish.vx *= 0.94; // Increased from 0.92 to 0.94 (more damping)
        fish.vy *= 0.94;

        // Handle different movement modes
        if (activeSectionRef.current) {
          // Section slide mode: fish slide away to the left, don't regenerate
          // Fish appear to slide left (same direction as background scroll)
          // No wrapping - they just slide off screen
        } else if (!isOnRef.current) {
          // Normal mode: fish swim independently
          fish.x += fish.speed * fish.direction;

          const wobble = Math.sin(time * fish.wobbleSpeed + fish.wobblePhase) * 0.2;
          fish.y += wobble;

          const fishW = FISH_WIDTH * fish.size;
          if (fish.direction === 1 && fish.x > scaledWidth + fishW) {
            fish.x = -fishW;
            fish.y = scaledHeight * 0.1 + Math.random() * (scaledHeight * 0.45);
          } else if (fish.direction === -1 && fish.x < -fishW) {
            fish.x = scaledWidth + fishW;
            fish.y = scaledHeight * 0.1 + Math.random() * (scaledHeight * 0.45);
          }
        }

        // Keep fish within bounds (Y axis)
        if (fish.y < 10) fish.y = 10;
        if (fish.y > scaledHeight * 0.55) fish.y = scaledHeight * 0.55;

        // Keep fish within bounds (X axis)
        if (!activeSectionRef.current) {
          // Normal/toggle mode: wrap around to prevent drifting off-screen
          const margin = 100;
          if (fish.x < -margin) fish.x = scaledWidth + (fish.x % scaledWidth);
          if (fish.x > scaledWidth + margin) fish.x = fish.x % scaledWidth;
        }
        // In section slide mode: let fish slide off screen without wrapping

        fish.tailPhase += 0.3;
      }
    }

    function getFishPixel(px, py, scrollOffset) {
      for (const fish of fishList) {
        const tailWiggle = Math.sin(fish.tailPhase) * 1.5;

        // In section slide mode, only render fish once (no wrapping)
        // In normal/toggle mode, render at wrapped positions for infinite scroll
        const offsets = activeSectionRef.current
          ? [0]  // Only render at original position
          : [-scaledWidth, 0, scaledWidth]; // Render at wrapped positions

        for (const offset of offsets) {
          const adjustedX = fish.x - scrollOffset + offset;

          let localX, localY;
          if (fish.direction === 1) {
            localX = (px - adjustedX) / fish.size;
            localY = (py - fish.y) / fish.size;
          } else {
            localX = (FISH_WIDTH - 1) - ((px - adjustedX) / fish.size);
            localY = (py - fish.y) / fish.size;
          }

          if (localX < 6) {
            localY -= tailWiggle * (1 - localX / 6);
          }

          const spriteX = Math.floor(localX);
          const spriteY = Math.floor(localY);

          if (spriteX >= 0 && spriteX < FISH_WIDTH && spriteY >= 0 && spriteY < FISH_HEIGHT) {
            const pixelType = fishSprite[spriteY][spriteX];
            if (pixelType > 0) {
              const palette = fishPalettes[fish.paletteIndex];
              switch (pixelType) {
                case 1: return palette.body;
                case 2: return palette.bodyDark;
                case 3: return palette.bodyLight;
                case 4: return palette.eyeWhite;
                case 5: return palette.pupil;
              }
            }
          }
        }
      }
      return null;
    }

    function draw() {
      time += 0.02;

      // Scroll the background when isOn is true OR when activeSection is set
      if (isOnRef.current) {
        // Toggle switch scrolling: left to right
        scrollOffset -= 1.5; // Increased from 0.8
        if (scrollOffset <= -scaledWidth) {
          scrollOffset += scaledWidth;
        }
      } else if (activeSectionRef.current) {
        // Section slide: right to left (opposite direction) - ULTRA FAST
        // Check if all fish are off screen (scrolled off the LEFT edge)
        const allFishGone = fishList.every(fish => {
          const fishW = FISH_WIDTH * fish.size;
          // Fish slides left, so check if it's gone past the left edge
          return (fish.x - scrollOffset) < -fishW;
        });

        if (!allFishGone) {
          // Keep scrolling until fish are gone - 50% FASTER
          scrollOffset += 27; // Was 18, now 27 (50% faster!)
          // DON'T wrap around in section mode
        }
        // Once fish are gone, scrollOffset stops changing (corals freeze)
      }

      updateFish();
      
      const imageData = ctx.createImageData(scaledWidth, scaledHeight);
      const data = imageData.data;
      
      const centerX = scaledWidth / 2;
      const centerY = scaledHeight / 2;

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += ripples[i].speed;
        ripples[i].strength = 1 - (ripples[i].radius / ripples[i].maxRadius);
        if (ripples[i].radius > ripples[i].maxRadius) ripples.splice(i, 1);
      }

      for (let i = trailRipples.length - 1; i >= 0; i--) {
        trailRipples[i].radius += trailRipples[i].speed;
        trailRipples[i].strength = 1 - (trailRipples[i].radius / trailRipples[i].maxRadius);
        if (trailRipples[i].radius > trailRipples[i].maxRadius) trailRipples.splice(i, 1);
      }

      for (let y = 0; y < scaledHeight; y++) {
        for (let x = 0; x < scaledWidth; x++) {
          const i = (y * scaledWidth + x) * 4;
          
          const fishColor = getFishPixel(x, y, scrollOffset);
          if (fishColor) {
            data[i] = fishColor[0];
            data[i + 1] = fishColor[1];
            data[i + 2] = fishColor[2];
            data[i + 3] = 255;
            continue;
          }

          const plantColor = getPlantPixel(x, y, time, scrollOffset);
          if (plantColor) {
            data[i] = plantColor[0];
            data[i + 1] = plantColor[1];
            data[i + 2] = plantColor[2];
            data[i + 3] = 255;
            continue;
          }
          
          const dx = (x - centerX) / scaledWidth;
          const dy = (y - centerY) / scaledHeight;
          const distance = Math.sqrt(dx * dx + dy * dy);
          let pattern = Math.sin(distance * 8) * 0.5 + 0.5;
          
          for (const ripple of ripples) {
            const rdx = x - ripple.x;
            const rdy = y - ripple.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            if (rdist < ripple.maxRadius + 10) {
              const fadeFactor = 1 - rdist / (ripple.maxRadius + 10);
              const wave = Math.sin((rdist - ripple.radius) * 0.3) * ripple.strength;
              pattern += wave * 0.3 * fadeFactor;
            }
          }

          for (const ripple of trailRipples) {
            const rdx = x - ripple.x;
            const rdy = y - ripple.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            if (rdist < ripple.maxRadius + 10) {
              const fadeFactor = 1 - rdist / (ripple.maxRadius + 10);
              const wave = Math.sin((rdist - ripple.radius) * 0.4) * ripple.strength;
              pattern += wave * 0.25 * fadeFactor;
            }
          }
          
          const gradientValue = pattern * 0.6 + 0.2;
          const threshold = bayerMatrix[y % 8][x % 8] / 64;
          const isDark = gradientValue < threshold;
          
          if (isDark) {
            data[i] = 37;
            data[i + 1] = 99;
            data[i + 2] = 235;
          } else {
            data[i] = 240;
            data[i + 1] = 248;
            data[i + 2] = 255;
          }
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, canvas.width, canvas.height);
      
      animationId = requestAnimationFrame(draw);
    }

    resize();
    document.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resize);
    window.addEventListener('chestOpened', handleChestOpened);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('chestOpened', handleChestOpened);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <canvas
      id="bayer-canvas"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}