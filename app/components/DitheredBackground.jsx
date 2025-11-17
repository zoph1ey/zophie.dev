'use client';

import { useEffect } from 'react';
import { bayerMatrix } from './constants';

export default function DitheredBackground() {
  useEffect(() => {
    const canvas = document.getElementById('bayer-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ripples = [];
    const trailRipples = []; // Ripples from mouse movement
    let animationId;
    let lastMouseX = 0;
    let lastMouseY = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Regular click ripple
    function addRipple(x, y) {
      ripples.push({
        x: x,
        y: y,
        radius: 0,
        maxRadius: 100,
        speed: 10,
        strength: 1
      });
    }

    function handleClick(e) {
      addRipple(e.clientX, e.clientY);
    }

    function handleMouseMove(e) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Only add ripples if mouse moved enough (every ~8px)
      if (distance > 8) {
        // Add expanding ripple at current mouse position
        trailRipples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          maxRadius: 80,  // How far it spreads
          speed: 8,        // How fast it expands
          strength: 1
        });
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    }

    function draw() {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Update click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += ripples[i].speed;
        ripples[i].strength = 1 - (ripples[i].radius / ripples[i].maxRadius);
        
        if (ripples[i].radius > ripples[i].maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Update trail ripples
      for (let i = trailRipples.length - 1; i >= 0; i--) {
        trailRipples[i].radius += trailRipples[i].speed;
        trailRipples[i].strength = 1 - (trailRipples[i].radius / trailRipples[i].maxRadius);
        
        if (trailRipples[i].radius > trailRipples[i].maxRadius) {
          trailRipples.splice(i, 1);
        }
      }

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          
          const dx = (x - centerX) / canvas.width;
          const dy = (y - centerY) / canvas.height;
          const distance = Math.sqrt(dx * dx + dy * dy);
          let pattern = Math.sin(distance * 8) * 0.5 + 0.5;
          
          // Add click ripple effects
          for (const ripple of ripples) {
            const rdx = x - ripple.x;
            const rdy = y - ripple.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            const edgeDistance = rdist / (ripple.maxRadius + 20);

            if (edgeDistance < 1) {
              const fadeFactor = 1 - edgeDistance;
              const wave = Math.sin((rdist - ripple.radius) * 0.1) * ripple.strength;
              pattern += wave * 0.3 * fadeFactor;
            }
          }

          // Add trail ripple effects (spreading from mouse path)
          for (const ripple of trailRipples) {
            const rdx = x - ripple.x;
            const rdy = y - ripple.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            const edgeDistance = rdist / (ripple.maxRadius + 20);

            if (edgeDistance < 1) {
              const fadeFactor = 1 - edgeDistance;
              const wave = Math.sin((rdist - ripple.radius) * 0.15) * ripple.strength;
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
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
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