'use client';

import { useState, useEffect } from 'react';
import { bayerMatrix } from './constants';

export default function AquariumBorder() {
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const topCanvas = document.getElementById('top-border-canvas');
    const bottomCanvas = document.getElementById('bottom-border-canvas');

    if (!topCanvas || !bottomCanvas) return;

    const topCtx = topCanvas.getContext('2d');
    const bottomCtx = bottomCanvas.getContext('2d');

    if (!topCtx || !bottomCtx) return;

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

    function resize() {
      drawDitheredBorder(topCanvas, topCtx);
      drawDitheredBorder(bottomCanvas, bottomCtx);
    }

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

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
        
        {/* Overlay on bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-20 flex items-center pointer-events-none" style={{ paddingLeft: '100px', paddingRight: '50px' }}>
          {/* nurfarahana text on the left */}
          <div className="text-gray-800 font-bold text-xl tracking-wide">
            Nurfarahana
          </div>
          
            {/* Spacer to push switch to the right */}
            <div className="flex-grow"></div>


          {/* Rocker Toggle Switch on the right */}
          <div className="pointer-events-auto flex items-center">
            <label style={{
              display: 'inline-block',
              position: 'relative',
              fontSize: '0.75em',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#ddd',
              width: '7em',
              height: '4em',
              overflow: 'hidden',
              borderBottom: '0.5em solid #444',
              cursor: 'pointer',
            }}>
              {/* Background frame */}
              <div style={{
                content: '""',
                position: 'absolute',
                top: '0.5em',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#555',
                border: '0.5em solid #444',
                borderBottom: 0,
              }}></div>

              <input
                type="checkbox"
                checked={isOn}
                onChange={() => setIsOn(!isOn)}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
              />

              {/* Left side - 0 */}
              <span style={{
                cursor: 'pointer',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: isOn ? '2.4em' : '2.5em',
                width: isOn ? '2.75em' : '3em',
                transition: '0.2s',
                userSelect: 'none',
                left: isOn ? '0.85em' : '0.5em',
                bottom: isOn ? '0.4em' : '0',
                backgroundColor: isOn ? '#666' : '#1a1a1a',
                color: '#ddd',
                transform: isOn ? 'rotate(15deg) skewX(15deg)' : 'rotate(0deg) skewX(0deg)',
              }}>
                <div style={{
                  content: '""',
                  position: 'absolute',
                  width: '0.4em',
                  height: '2.45em',
                  bottom: '-0.45em',
                  backgroundColor: isOn ? '#555' : 'transparent',
                  transform: 'skewY(-65deg)',
                  left: '-0.4em',
                }}></div>
                <span style={{ transform: 'rotate(90deg)' }}>0</span>
              </span>

              {/* Right side - | */}
              <span style={{
                cursor: 'pointer',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: isOn ? '2.5em' : '2.4em',
                width: isOn ? '3em' : '2.75em',
                transition: '0.2s',
                userSelect: 'none',
                right: isOn ? '0.5em' : '0.8em',
                bottom: isOn ? '0' : '0.4em',
                backgroundColor: isOn ? '#1a1a1a' : '#666',
                color: '#ddd',
                transform: isOn ? 'rotate(0deg) skewX(0deg)' : 'rotate(-15deg) skewX(-15deg)',
              }}>
                <div style={{
                  content: '""',
                  position: 'absolute',
                  width: '0.4em',
                  height: '2.45em',
                  bottom: '-0.45em',
                  backgroundColor: isOn ? 'transparent' : '#555',
                  transform: 'skewY(65deg)',
                  right: '-0.375em',
                }}></div>
                ━
              </span>
            </label>
          </div>
        </div>
      </div>

    </>
  );
}