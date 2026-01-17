'use client';

import { useEffect, useRef } from 'react';
import { bayerMatrix } from './constants';
import {
  fishSprite,
  seaweedSprite,
  roundCoralSprite,
  fanCoralSprite,
  tubeCoralSprite,
  FISH_WIDTH,
  FISH_HEIGHT,
  SEAWEED_WIDTH,
  SEAWEED_HEIGHT,
  ROUND_CORAL_WIDTH,
  ROUND_CORAL_HEIGHT,
  FAN_CORAL_WIDTH,
  FAN_CORAL_HEIGHT,
  TUBE_CORAL_WIDTH,
  TUBE_CORAL_HEIGHT,
} from './sprites/aquaticSprites';
import { seaweedPalettes, coralPalettes, fishPalettes } from './palettes/aquaticPalettes';
import { generateSeaweed, generateCorals, generateFish } from './utils/aquaticGenerators';

const SCALE = 2.5;

export default function DitheredBackground({ isOn, activeSection, isReturning, onReturnComplete }) {
  const isOnRef = useRef(isOn);
  const activeSectionRef = useRef(activeSection);
  const isReturningRef = useRef(isReturning);
  const onReturnCompleteRef = useRef(onReturnComplete);

  // Update refs when props change
  useEffect(() => {
    isOnRef.current = isOn;
  }, [isOn]);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    isReturningRef.current = isReturning;
  }, [isReturning]);

  useEffect(() => {
    onReturnCompleteRef.current = onReturnComplete;
  }, [onReturnComplete]);

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

      const isMobile = window.innerWidth < 768;
      const seaweedList = generateSeaweed(scaledWidth, scaledHeight);
      const coralList = generateCorals(scaledWidth, scaledHeight);
      fishList = generateFish(scaledWidth, scaledHeight, isMobile);

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
        maxRadius: 64,
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
          maxRadius: 48,
          speed: 4,
          strength: 1
        });
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    }

    function handleChestOpened() {
      for (const fish of fishList) {
        const centerX = scaledWidth / 2;

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

      for (let offset = -scaledWidth; offset <= scaledWidth; offset += scaledWidth) {
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
            const force = (1 - minDist / ripple.maxRadius) * ripple.strength * 0.96;
            fish.vx += (bestDx / minDist) * force;
            fish.vy += (bestDy / minDist) * force;
          }
        }

        // Apply ripple forces from mouse trails
        for (const ripple of trailRipples) {
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
            const force = (1 - minDist / ripple.maxRadius) * ripple.strength * 0.64;
            fish.vx += (bestDx / minDist) * force;
            fish.vy += (bestDy / minDist) * force;
          }
        }

        // Apply velocities from ripples
        fish.x += fish.vx;
        fish.y += fish.vy;

        // Apply damping
        fish.vx *= 0.94;
        fish.vy *= 0.94;

        // Handle different movement modes
        if (activeSectionRef.current && !isReturningRef.current) {
          // Section slide mode: fish slide away to the left
        } else if (isReturningRef.current) {
          fish.x += fish.speed * fish.direction;
          const wobble = Math.sin(time * fish.wobbleSpeed + fish.wobblePhase) * 0.2;
          fish.y += wobble;
        } else if (!isOnRef.current) {
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
        if (!activeSectionRef.current || isReturningRef.current) {
          const margin = 100;
          if (fish.x < -margin) fish.x = scaledWidth + (fish.x % scaledWidth);
          if (fish.x > scaledWidth + margin) fish.x = fish.x % scaledWidth;
        }

        fish.tailPhase += 0.3;
      }
    }

    function getFishPixel(px, py, scrollOffset) {
      for (const fish of fishList) {
        const tailWiggle = Math.sin(fish.tailPhase) * 1.5;

        const offsets = (activeSectionRef.current && !isReturningRef.current)
          ? [0]
          : [-scaledWidth, 0, scaledWidth];

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

      if (isOnRef.current) {
        scrollOffset -= 1.5;
        if (scrollOffset <= -scaledWidth) {
          scrollOffset += scaledWidth;
        }
      } else if (isReturningRef.current) {
        if (scrollOffset > 1) {
          scrollOffset *= 0.55;
        } else if (scrollOffset > 0) {
          scrollOffset = 0;
          if (onReturnCompleteRef.current) {
            onReturnCompleteRef.current();
          }
        }
      } else if (activeSectionRef.current) {
        const allFishGone = fishList.every(fish => {
          const fishW = FISH_WIDTH * fish.size;
          return (fish.x - scrollOffset) < -fishW;
        });

        if (!allFishGone) {
          scrollOffset += 27;
        }
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
  }, []);

  return (
    <canvas
      id="bayer-canvas"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
