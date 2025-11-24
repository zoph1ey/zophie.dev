'use client';

import { useEffect } from 'react';
import { bayerMatrix } from './constants';

const SCALE = 1.6; // Less pixelated now

const coralColors = [
  { dark: [0, 128, 0], light: [144, 238, 144] },       // Green 0
  { dark: [0, 100, 80], light: [100, 200, 150] },     // Teal 1
  { dark: [34, 139, 34], light: [152, 251, 152] },    // Forest 2
  { dark: [255, 105, 180], light: [255, 182, 203] },  // Pink 3
  { dark: [255, 127, 80], light: [255, 200, 160] },   // Orange 4
  { dark: [148, 0, 211], light: [221, 160, 221] },    // Purple 5
  { dark: [0, 139, 139], light: [175, 238, 238] },    // Cyan 6
  { dark: [220, 20, 60], light: [255, 160, 180] },    // Red 7
];

function generateSeaweed(w, h) {
  const seaweed = [];
  const num = Math.floor(w / 25);
  
  for (let i = 0; i < num; i++) {
    seaweed.push({
      x: (i * (w / num)) + Math.random() * 15 - 7,
      baseY: h,
      width: 3 + Math.random() * 4,
      height: h * 0.3 + Math.random() * (h * 0.2),
      colorIndex: Math.floor(Math.random() * 3), // Green colors only
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
      height: h * 0.15 + Math.random() * (h * 0.15),
      type: type,
      colorIndex: 3 + Math.floor(Math.random() * 5),
    });
  }
  return corals;
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

    // Check if point is inside any seaweed (with sway animation)
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

    function draw() {
      time += 0.02;
      
      const imageData = ctx.createImageData(scaledWidth, scaledHeight);
      const data = imageData.data;
      
      const centerX = scaledWidth / 2;
      const centerY = scaledHeight / 2;

      // Update ripples
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

      // Only check seaweed in bottom portion of screen
      const seaweedStartY = Math.floor(scaledHeight * 0.4);

      for (let y = 0; y < scaledHeight; y++) {
        for (let x = 0; x < scaledWidth; x++) {
          const i = (y * scaledWidth + x) * 4;
          
          // Check static corals first
          let colorIdx = staticCoralMap[y * scaledWidth + x];
          
          // Check animated seaweed only in bottom portion
          if (colorIdx === 0 && y > seaweedStartY) {
            colorIdx = getSeaweedColor(x, y, time);
          }
          
          const dx = (x - centerX) / scaledWidth;
          const dy = (y - centerY) / scaledHeight;
          const distance = Math.sqrt(dx * dx + dy * dy);
          let pattern = Math.sin(distance * 8) * 0.5 + 0.5;
          
          // Ripple effects
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

      // Draw scaled up with pixelated look
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