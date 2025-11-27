'use client';

import { useEffect } from 'react';
import { bayerMatrix } from './constants';

const SCALE = 2.5;

// Detailed fish sprite (18x16 pixels) matching reference
// 0 = transparent
// 1 = body main
// 2 = body dark
// 3 = body light
// 4 = eye white
// 5 = eye pupil
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
  // Fresh mint green
  { dark: [60, 140, 100], mid: [90, 180, 130], light: [140, 210, 170] },
  // Soft teal green
  { dark: [50, 130, 120], mid: [80, 170, 155], light: [130, 205, 190] },
  // Spring green
  { dark: [70, 145, 90], mid: [100, 185, 120], light: [150, 215, 165] },
];

const coralPalettes = [
  // Hot pink
  { dark: [255, 80, 130], mid: [255, 130, 170], light: [255, 180, 200], highlight: [255, 215, 230] },
  // Bright orange
  { dark: [255, 120, 50], mid: [255, 160, 100], light: [255, 200, 150], highlight: [255, 230, 200] },
  // Violet purple
  { dark: [180, 80, 220], mid: [210, 130, 255], light: [230, 175, 255], highlight: [245, 210, 255] },
  // Cyan blue
  { dark: [0, 200, 220], mid: [80, 230, 245], light: [150, 245, 255], highlight: [200, 255, 255] },
  // Cherry red
  { dark: [255, 70, 90], mid: [255, 120, 130], light: [255, 170, 175], highlight: [255, 210, 215] },
  // Golden yellow
  { dark: [255, 200, 0], mid: [255, 225, 80], light: [255, 240, 140], highlight: [255, 250, 190] },
];

// Fish palettes - 9 color slots per fish
// 1=body, 2=bodyDark, 3=bodyLight, 4=eyeWhite, 5=pupil
const fishPalettes = [
  // Bright Orange (clownfish vibes)
  { body: [255, 140, 50], bodyDark: [230, 90, 20], bodyLight: [255, 200, 100], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  // Hot Pink
  { body: [255, 100, 150], bodyDark: [220, 60, 120], bodyLight: [255, 170, 200], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  // Electric Cyan
  { body: [0, 220, 220], bodyDark: [0, 160, 180], bodyLight: [100, 255, 255], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  // Vivid Blue
  { body: [60, 140, 255], bodyDark: [30, 90, 200], bodyLight: [130, 190, 255], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  // Lime Green
  { body: [180, 230, 40], bodyDark: [120, 180, 20], bodyLight: [220, 255, 100], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  // Bright Purple
  { body: [180, 80, 255], bodyDark: [130, 40, 200], bodyLight: [220, 150, 255], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  // Coral Red
  { body: [255, 90, 90], bodyDark: [220, 50, 60], bodyLight: [255, 160, 150], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
  // Sunny Yellow
  { body: [255, 220, 60], bodyDark: [230, 180, 30], bodyLight: [255, 245, 140], eyeWhite: [255, 255, 255], pupil: [20, 20, 40] },
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
  const numFish = 8 + Math.floor(Math.random() * 6);
  
  for (let i = 0; i < numFish; i++) {
    const size = 2 + Math.random() * 2;
    fish.push({
      x: Math.random() * w,
      y: h * 0.1 + Math.random() * (h * 0.45),
      size: size,
      speed: 0.2 + Math.random() * 0.4,
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

export default function DitheredBackground() {
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
        maxRadius: 50,
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
          maxRadius: 40,
          speed: 4,
          strength: 1
        });
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    }

    function getSeaweedPixelSingle(px, py, time, sw) {
      const spriteH = SEAWEED_HEIGHT * sw.size;
      
      const relYFromBottom = sw.baseY - py;
      if (relYFromBottom < 0 || relYFromBottom > spriteH) return null;
      
      const heightRatio = relYFromBottom / spriteH;
      const sway = Math.sin(time * sw.speed + sw.phase) * (3 + heightRatio * 8);
      
      const swayedX = sw.x + sway * heightRatio;
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
      return null;
    }

    function getCoralPixelSingle(px, py, coral) {
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
      
      const localX = (px - coral.x) / coral.size;
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
      return null;
    }

    function getPlantPixel(px, py, time) {
      let color = null;
      for (const plant of allPlants) {
        let c = null;
        if (plant.plantType === 'seaweed') {
          c = getSeaweedPixelSingle(px, py, time, plant);
        } else {
          c = getCoralPixelSingle(px, py, plant);
        }
        if (c) {
          color = c;
        }
      }
      return color;
    }

    function updateFish() {
      for (const fish of fishList) {
        for (const ripple of ripples) {
          const dx = fish.x - ripple.x;
          const dy = fish.y - ripple.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < ripple.maxRadius && dist > 0) {
            const force = (1 - dist / ripple.maxRadius) * ripple.strength * 0.5;
            fish.vx += (dx / dist) * force;
            fish.vy += (dy / dist) * force;
          }
        }
        
        for (const ripple of trailRipples) {
          const dx = fish.x - ripple.x;
          const dy = fish.y - ripple.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < ripple.maxRadius && dist > 0) {
            const force = (1 - dist / ripple.maxRadius) * ripple.strength * 0.3;
            fish.vx += (dx / dist) * force;
            fish.vy += (dy / dist) * force;
          }
        }
        
        fish.x += fish.speed * fish.direction + fish.vx;
        fish.y += fish.vy;
        
        fish.vx *= 0.95;
        fish.vy *= 0.95;
        
        fish.tailPhase += 0.3;
        const wobble = Math.sin(time * fish.wobbleSpeed + fish.wobblePhase) * 0.2;
        fish.y += wobble;
        
        if (fish.y < 10) fish.y = 10;
        if (fish.y > scaledHeight * 0.55) fish.y = scaledHeight * 0.55;
        
        const fishW = FISH_WIDTH * fish.size;
        if (fish.direction === 1 && fish.x > scaledWidth + fishW) {
          fish.x = -fishW;
          fish.y = scaledHeight * 0.1 + Math.random() * (scaledHeight * 0.45);
        } else if (fish.direction === -1 && fish.x < -fishW) {
          fish.x = scaledWidth + fishW;
          fish.y = scaledHeight * 0.1 + Math.random() * (scaledHeight * 0.45);
        }
      }
    }

    function getFishPixel(px, py) {
      for (const fish of fishList) {
        const tailWiggle = Math.sin(fish.tailPhase) * 1.5;
        
        let localX, localY;
        if (fish.direction === 1) {
          localX = (px - fish.x) / fish.size;
          localY = (py - fish.y) / fish.size;
        } else {
          localX = (FISH_WIDTH - 1) - ((px - fish.x) / fish.size);
          localY = (py - fish.y) / fish.size;
        }
        
        // Tail wiggle effect on the tail/left side
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
      return null;
    }

    function draw() {
      time += 0.02;
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
          
          const fishColor = getFishPixel(x, y);
          if (fishColor) {
            data[i] = fishColor[0];
            data[i + 1] = fishColor[1];
            data[i + 2] = fishColor[2];
            data[i + 3] = 255;
            continue;
          }
          
          const plantColor = getPlantPixel(x, y, time);
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
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      id="bayer-canvas"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}