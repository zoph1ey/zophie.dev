'use client';

import { useEffect } from 'react';
import { bayerMatrix } from './constants';

const SCALE = 2;

const coralColors = [
  { dark: [0, 128, 0], light: [144, 238, 144] },
  { dark: [0, 100, 80], light: [100, 200, 150] },
  { dark: [34, 139, 34], light: [152, 251, 152] },
  { dark: [255, 105, 180], light: [255, 182, 203] },
  { dark: [255, 127, 80], light: [255, 200, 160] },
  { dark: [148, 0, 211], light: [221, 160, 221] },
  { dark: [0, 139, 139], light: [175, 238, 238] },
  { dark: [220, 20, 60], light: [255, 160, 180] },
];

// Better fish sprite (16x10 pixels) - more fish-like shape!
// 0 = transparent, 1 = body, 2 = stripe, 3 = eye white, 4 = pupil, 5 = fin, 6 = belly
const fishSprite = [
  [0, 0, 0, 0, 0, 0, 5, 5, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 5, 5, 0, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0],
  [5, 5, 5, 1, 1, 2, 2, 1, 1, 1, 3, 4, 1, 1, 1, 0],
  [0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 5, 1, 1, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1],
  [5, 5, 5, 1, 1, 2, 2, 1, 6, 6, 6, 1, 1, 1, 0, 0],
  [0, 5, 5, 0, 1, 1, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 5, 5, 1, 1, 0, 0, 0, 0, 0, 0],
];

// Fish color palettes [body, stripe, eyeWhite, pupil, fin, belly]
const fishPalettes = [
  // Clownfish orange
  { body: [255, 140, 0], stripe: [255, 255, 255], eyeWhite: [255, 255, 255], pupil: [0, 0, 0], fin: [255, 100, 0], belly: [255, 200, 150] },
  // Blue tang
  { body: [30, 100, 200], stripe: [255, 220, 0], eyeWhite: [255, 255, 255], pupil: [0, 0, 0], fin: [20, 80, 180], belly: [100, 160, 230] },
  // Purple fish
  { body: [138, 43, 226], stripe: [255, 200, 255], eyeWhite: [255, 255, 255], pupil: [0, 0, 0], fin: [100, 20, 180], belly: [180, 120, 255] },
  // Cyan fish
  { body: [0, 180, 180], stripe: [255, 255, 255], eyeWhite: [255, 255, 255], pupil: [0, 0, 0], fin: [0, 140, 140], belly: [100, 220, 220] },
  // Pink fish
  { body: [255, 105, 180], stripe: [255, 255, 255], eyeWhite: [255, 255, 255], pupil: [0, 0, 0], fin: [255, 80, 150], belly: [255, 180, 210] },
  // Green fish
  { body: [50, 180, 50], stripe: [200, 255, 200], eyeWhite: [255, 255, 255], pupil: [0, 0, 0], fin: [30, 150, 30], belly: [120, 220, 120] },
  // Red fish
  { body: [220, 50, 50], stripe: [255, 200, 200], eyeWhite: [255, 255, 255], pupil: [0, 0, 0], fin: [180, 30, 30], belly: [255, 130, 130] },
  // Gold fish
  { body: [255, 180, 50], stripe: [255, 255, 200], eyeWhite: [255, 255, 255], pupil: [0, 0, 0], fin: [255, 150, 0], belly: [255, 220, 150] },
];

const FISH_WIDTH = 16;
const FISH_HEIGHT = 10;

function generateSeaweed(w, h) {
  const seaweed = [];
  const num = Math.floor(w / 25);
  
  for (let i = 0; i < num; i++) {
    seaweed.push({
      x: (i * (w / num)) + Math.random() * 15 - 7,
      baseY: h,
      width: 3 + Math.random() * 4,
      height: h * 0.45 + Math.random() * (h * 0.3), // 50% taller
      colorIndex: Math.floor(Math.random() * 3),
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
    });
  }
  return seaweed;
}

function generateStaticCorals(w, h) {
  const corals = [];
  const num = Math.floor(w / 40);
  
  for (let i = 0; i < num; i++) {
    const type = Math.random() > 0.5 ? 'fan' : 'round';
    corals.push({
      x: (i * (w / num)) + Math.random() * 30 - 15,
      baseY: h,
      width: 15 + Math.random() * 20,
      height: h * 0.225 + Math.random() * (h * 0.225), // 50% taller
      type: type,
      colorIndex: 3 + Math.floor(Math.random() * 5),
    });
  }
  return corals;
}

function generateFish(w, h) {
  const fish = [];
  const numFish = 8 + Math.floor(Math.random() * 6);
  
  for (let i = 0; i < numFish; i++) {
    const size = 2.25 + Math.random() * 2.25; // 50% bigger (was 1.5-3, now 2.25-4.5)
    fish.push({
      x: Math.random() * w,
      y: h * 0.1 + Math.random() * (h * 0.45), // Adjusted to not overlap with taller plants
      size: size,
      speed: 0.2 + Math.random() * 0.4,
      direction: Math.random() > 0.5 ? 1 : -1,
      paletteIndex: Math.floor(Math.random() * fishPalettes.length),
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 1.5 + Math.random() * 1.5,
      tailPhase: Math.random() * Math.PI * 2,
    });
  }
  return fish;
}

function isInsideStaticCoral(x, y, coral) {
  const relX = x - coral.x;
  const relY = coral.baseY - y;
  
  if (relY < 0 || relY > coral.height) return false;
  if (Math.abs(relX) > coral.width) return false;
  
  const heightRatio = relY / coral.height;
  
  if (coral.type === 'fan') {
    const spread = coral.width * heightRatio * 0.8;
    const currentWidth = coral.width * 0.15 + spread;
    return Math.abs(relX) < currentWidth;
  } else {
    const centerY = coral.height * 0.5;
    const rx = coral.width * 0.5;
    const ry = coral.height * 0.5;
    const normalizedX = relX / rx;
    const normalizedY = (relY - centerY) / ry;
    return (normalizedX * normalizedX + normalizedY * normalizedY) < 1;
  }
}

function renderStaticCoralMap(w, h, corals) {
  const coralMap = new Uint8Array(w * h);
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (const coral of corals) {
        if (isInsideStaticCoral(x, y, coral)) {
          coralMap[y * w + x] = coral.colorIndex + 1;
          break;
        }
      }
    }
  }
  return coralMap;
}

export default function DitheredBackground() {
  useEffect(() => {
    const canvas = document.getElementById('bayer-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ripples = [];
    const trailRipples = [];
    let animationId;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let staticCoralMap = null;
    let seaweedList = [];
    let fishList = [];
    let scaledWidth = 0;
    let scaledHeight = 0;
    let time = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      scaledWidth = Math.ceil(canvas.width / SCALE);
      scaledHeight = Math.ceil(canvas.height / SCALE);
      
      const staticCorals = generateStaticCorals(scaledWidth, scaledHeight);
      staticCoralMap = renderStaticCoralMap(scaledWidth, scaledHeight, staticCorals);
      seaweedList = generateSeaweed(scaledWidth, scaledHeight);
      fishList = generateFish(scaledWidth, scaledHeight);
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

    function getSeaweedColor(x, y, time) {
      for (const sw of seaweedList) {
        const relY = sw.baseY - y;
        if (relY < 0 || relY > sw.height) continue;
        
        const heightRatio = relY / sw.height;
        const sway = Math.sin(time * sw.speed + sw.phase + relY * 0.05) * (5 + heightRatio * 10);
        const relX = x - sw.x - sway * heightRatio;
        const width = sw.width * (1 - heightRatio * 0.4);
        
        if (Math.abs(relX) < width) {
          return sw.colorIndex + 1;
        }
      }
      return 0;
    }

    function updateFish() {
      for (const fish of fishList) {
        fish.x += fish.speed * fish.direction;
        fish.tailPhase += 0.3;
        
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
    }

    function getFishPixel(px, py) {
      for (const fish of fishList) {
        const tailWiggle = Math.sin(fish.tailPhase) * 2;
        
        let localX, localY;
        if (fish.direction === 1) {
          localX = (px - fish.x) / fish.size;
          localY = (py - fish.y) / fish.size;
        } else {
          localX = (FISH_WIDTH - 1) - ((px - fish.x) / fish.size);
          localY = (py - fish.y) / fish.size;
        }
        
        // Tail wiggle on left side
        if (localX < 5) {
          localY -= tailWiggle * (1 - localX / 5);
        }
        
        const spriteX = Math.floor(localX);
        const spriteY = Math.floor(localY);
        
        if (spriteX >= 0 && spriteX < FISH_WIDTH && spriteY >= 0 && spriteY < FISH_HEIGHT) {
          const pixelType = fishSprite[spriteY][spriteX];
          if (pixelType > 0) {
            const palette = fishPalettes[fish.paletteIndex];
            switch (pixelType) {
              case 1: return palette.body;
              case 2: return palette.stripe;
              case 3: return palette.eyeWhite;
              case 4: return palette.pupil;
              case 5: return palette.fin;
              case 6: return palette.belly;
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

      const seaweedStartY = Math.floor(scaledHeight * 0.3); // Adjusted for taller seaweed

      for (let y = 0; y < scaledHeight; y++) {
        for (let x = 0; x < scaledWidth; x++) {
          const i = (y * scaledWidth + x) * 4;
          
          const fishColor = getFishPixel(x, y);
          
          if (fishColor) {
            const dx = (x - centerX) / scaledWidth;
            const dy = (y - centerY) / scaledHeight;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const pattern = Math.sin(distance * 8) * 0.5 + 0.5;
            const gradientValue = pattern * 0.6 + 0.2;
            const threshold = bayerMatrix[y % 8][x % 8] / 64;
            const isDark = gradientValue < threshold;
            
            const factor = isDark ? 0.7 : 1.0;
            data[i] = Math.floor(fishColor[0] * factor);
            data[i + 1] = Math.floor(fishColor[1] * factor);
            data[i + 2] = Math.floor(fishColor[2] * factor);
            data[i + 3] = 255;
            continue;
          }
          
          let colorIdx = staticCoralMap[y * scaledWidth + x];
          
          if (colorIdx === 0 && y > seaweedStartY) {
            colorIdx = getSeaweedColor(x, y, time);
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
          
          if (colorIdx > 0) {
            const colors = coralColors[colorIdx - 1];
            if (isDark) {
              data[i] = colors.dark[0];
              data[i + 1] = colors.dark[1];
              data[i + 2] = colors.dark[2];
            } else {
              data[i] = colors.light[0];
              data[i + 1] = colors.light[1];
              data[i + 2] = colors.light[2];
            }
          } else {
            if (isDark) {
              data[i] = 37;
              data[i + 1] = 99;
              data[i + 2] = 235;
            } else {
              data[i] = 240;
              data[i + 1] = 248;
              data[i + 2] = 255;
            }
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