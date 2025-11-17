'use client';

import { useState, useEffect } from 'react';
import { bayerMatrix } from './constants';

export default function AquariumBorder() {
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const topCanvas = document.getElementById('top-border-canvas');
    const bottomCanvas = document.getElementById('bottom-border-canvas');
    const buttonCanvas = document.getElementById('button-canvas');

    if (!topCanvas || !bottomCanvas || !buttonCanvas) return;

    const topCtx = topCanvas.getContext('2d');
    const bottomCtx = bottomCanvas.getContext('2d');
    const buttonCtx = buttonCanvas.getContext('2d');

    if (!topCtx || !bottomCtx || !buttonCtx) return;

    function drawDitheredBorder(canvas, ctx) {
      canvas.width = window.innerWidth;
      canvas.height = canvas.id === 'top-border-canvas' ? 64 : 80;

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          
          const greyValue = 0.5;
          
          const threshold = bayerMatrix[y % 8][x % 8] / 64;
          const isDark = greyValue < threshold;
          
          if (isDark) {
            data[i] = 100;
            data[i + 1] = 100;
            data[i + 2] = 100;
          } else {
            data[i] = 180;
            data[i + 1] = 180;
            data[i + 2] = 180;
          }
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function drawDitheredButton(isOnState) {
      buttonCanvas.width = 96; // button width
      buttonCanvas.height = 40; // button height

      const imageData = buttonCtx.createImageData(buttonCanvas.width, buttonCanvas.height);
      const data = imageData.data;

      for (let y = 0; y < buttonCanvas.height; y++) {
        for (let x = 0; x < buttonCanvas.width; x++) {
          const i = (y * buttonCanvas.width + x) * 4;
          
          const threshold = bayerMatrix[y % 8][x % 8] / 64;
          const value = 0.5;
          const isDark = value < threshold;
          
          if (isOnState) {
            // Green dithered when ON
            if (isDark) {
              data[i] = 34;      // dark green
              data[i + 1] = 197;
              data[i + 2] = 94;
            } else {
              data[i] = 134;     // light green
              data[i + 1] = 239;
              data[i + 2] = 172;
            }
          } else {
            // Dark grey dithered when OFF
            if (isDark) {
              data[i] = 55;
              data[i + 1] = 65;
              data[i + 2] = 81;
            } else {
              data[i] = 107;
              data[i + 1] = 114;
              data[i + 2] = 128;
            }
          }
          data[i + 3] = 255;
        }
      }

      buttonCtx.putImageData(imageData, 0, 0);
    }

    function resize() {
      drawDitheredBorder(topCanvas, topCtx);
      drawDitheredBorder(bottomCanvas, bottomCtx);
      drawDitheredButton(isOn);
    }

    resize();
    drawDitheredButton(isOn);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [isOn]);

  return (
    <>
      {/* Top Border */}
      <div className="fixed top-0 left-0 right-0 h-16 z-50">
        <canvas
          id="top-border-canvas"
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Bottom Border */}
      <div className="fixed bottom-0 left-0 right-0 h-20 z-50">
        <canvas
          id="bottom-border-canvas"
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* On/Off Button overlay on bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-20 flex items-center justify-between px-8 pointer-events-none">
          {/* Decorative elements on the left */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-900"></div>
            <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-900"></div>
            <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-900"></div>
          </div>

          {/* Dithered On/Off Button */}
          <button
            onClick={() => setIsOn(!isOn)}
            className="pointer-events-auto relative transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <canvas
              id="button-canvas"
              width="96"
              height="40"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-sm text-white mix-blend-difference">
              {isOn ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Optional: Light indicator */}
      {isOn && (
        <div className="fixed bottom-24 right-8 z-40">
          <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse shadow-[0_0_20px_rgba(74,222,128,0.8)]"></div>
        </div>
      )}
    </>
  );
}