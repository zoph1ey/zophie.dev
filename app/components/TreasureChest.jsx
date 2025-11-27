'use client';

import { useState, useEffect, useRef } from 'react';

const fontLink = typeof document !== 'undefined' && (() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  })();

// Treasure chest sprite (closed) - 32x20 pixels
const chestClosedSprite = [
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,1,0,0],
  [0,0,1,2,3,3,3,3,3,3,3,3,3,3,6,6,6,6,3,3,3,3,3,3,3,3,3,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,3,6,5,5,6,3,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,3,6,5,5,6,3,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,3,6,6,6,6,3,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,4,3,3,3,3,4,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Treasure chest sprite (open) - 32x28 pixels
const chestOpenSprite = [
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,0,0],
  [0,1,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,1,0],
  [0,1,2,3,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,3,2,1,0],
  [0,1,2,3,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,3,2,1,0],
  [0,1,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,1,0],
  [0,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,1,0,0],
  [0,0,1,2,3,3,3,3,3,3,3,3,3,3,6,6,6,6,3,3,3,3,3,3,3,3,3,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,3,6,5,5,6,3,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,4,1,1,1,1,1,1,4,3,6,5,5,6,3,4,1,1,1,1,1,1,4,3,2,1,0,0],
  [0,0,1,2,3,4,1,5,5,5,5,1,4,3,6,6,6,6,3,4,1,5,5,5,5,1,4,3,2,1,0,0],
  [0,0,1,2,3,4,1,5,5,5,5,1,4,4,3,3,3,3,4,4,1,5,5,5,5,1,4,3,2,1,0,0],
  [0,0,1,2,3,4,1,5,5,5,5,1,4,4,4,4,4,4,4,4,1,5,5,5,5,1,4,3,2,1,0,0],
  [0,0,1,2,3,4,1,1,1,1,1,1,4,4,4,4,4,4,4,4,1,1,1,1,1,1,4,3,2,1,0,0],
  [0,0,1,2,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,2,1,0,0],
  [0,0,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Shell sprite for "About Me" - 16x14
const shellSprite = [
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,2,2,2,2,1,1,0,0,0,0],
  [0,0,0,1,2,3,3,2,2,3,3,2,1,0,0,0],
  [0,0,1,2,3,4,3,2,2,3,4,3,2,1,0,0],
  [0,1,2,3,4,3,2,1,1,2,3,4,3,2,1,0],
  [0,1,2,3,3,2,1,2,2,1,2,3,3,2,1,0],
  [1,2,3,4,3,2,1,2,2,1,2,3,4,3,2,1],
  [1,2,3,3,2,1,2,3,3,2,1,2,3,3,2,1],
  [1,2,3,4,3,2,1,2,2,1,2,3,4,3,2,1],
  [0,1,2,3,3,2,1,1,1,1,2,3,3,2,1,0],
  [0,1,2,3,4,3,2,2,2,2,3,4,3,2,1,0],
  [0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0],
  [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
];

// Gem sprite for "Projects" - 14x16
const gemSprite = [
  [0,0,0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,2,1,0,0,0,0,0],
  [0,0,0,0,1,2,3,3,2,1,0,0,0,0],
  [0,0,0,1,2,3,4,4,3,2,1,0,0,0],
  [0,0,1,2,3,4,4,4,4,3,2,1,0,0],
  [0,1,2,3,4,4,5,5,4,4,3,2,1,0],
  [1,2,3,4,4,5,5,5,5,4,4,3,2,1],
  [1,2,3,4,5,5,5,5,5,5,4,3,2,1],
  [0,1,2,3,4,5,5,5,5,4,3,2,1,0],
  [0,0,1,2,3,4,5,5,4,3,2,1,0,0],
  [0,0,0,1,2,3,4,4,3,2,1,0,0,0],
  [0,0,0,0,1,2,3,3,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,2,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Pearl sprite for "Contacts" - 12x12
const pearlSprite = [
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,1,1,2,2,2,2,1,1,0,0],
  [0,1,2,3,3,3,3,3,3,2,1,0],
  [0,1,2,3,4,4,4,4,3,2,1,0],
  [1,2,3,4,4,5,5,4,4,3,2,1],
  [1,2,3,4,5,5,5,5,4,3,2,1],
  [1,2,3,4,5,5,5,5,4,3,2,1],
  [1,2,3,4,4,5,5,4,4,3,2,1],
  [0,1,2,3,4,4,4,4,3,2,1,0],
  [0,1,2,3,3,3,3,3,3,2,1,0],
  [0,0,1,1,2,2,2,2,1,1,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
];

// Color palettes
const chestPalette = {
  1: [60, 30, 10],
  2: [100, 60, 30],
  3: [140, 90, 50],
  4: [180, 130, 80],
  5: [220, 180, 130],
  6: [180, 160, 50],
};

const shellPalette = {
  1: [180, 120, 140],
  2: [220, 160, 180],
  3: [250, 200, 210],
  4: [255, 230, 240],
};

const gemPalette = {
  1: [80, 40, 120],
  2: [120, 60, 180],
  3: [160, 100, 220],
  4: [200, 150, 255],
  5: [230, 200, 255],
};

const pearlPalette = {
  1: [180, 180, 190],
  2: [210, 210, 220],
  3: [235, 235, 245],
  4: [250, 250, 255],
  5: [255, 255, 255],
};

const CHEST_SCALE = 6;
const TREASURE_SCALE = 6;

export default function TreasureChest() {
  const [isOpen, setIsOpen] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [treasures, setTreasures] = useState([]);
  const canvasRef = useRef(null);
  const burstDoneRef = useRef(false);

  const treasureConfig = [
    { id: 'about', label: 'About Me', sprite: shellSprite, palette: shellPalette, width: 16, height: 14, href: '/about' },
    { id: 'projects', label: 'Projects', sprite: gemSprite, palette: gemPalette, width: 14, height: 16, href: '/projects' },
    { id: 'contacts', label: 'Contacts', sprite: pearlSprite, palette: pearlPalette, width: 12, height: 12, href: '/contacts' },
  ];

  const handleChestClick = () => {
    if (isOpen) return;
    
    setIsOpen(true);
    burstDoneRef.current = false;
    
    window.dispatchEvent(new CustomEvent('chestOpened'));
    
    // Create initial burst of bubbles - fewer bubbles
    const burstBubbles = [];
    for (let i = 0; i < 10; i++) {  // Reduced from 30 to 10
      burstBubbles.push({
        id: Math.random(),
        x: 50 + Math.random() * 40 - 20,
        y: 0,
        size: 15 + Math.random() * 25,
        speed: 4 + Math.random() * 4,
        wobble: Math.random() * Math.PI * 2,
        opacity: 1,
      });
    }
    setBubbles(burstBubbles);
    
    setTimeout(() => {
      const newTreasures = treasureConfig.map((config, index) => ({
        ...config,
        x: 50,
        targetX: index === 0 ? -40 : index === 1 ? 50 : 140, // Way further apart
        y: 50,
        targetY: -200,
        bobPhase: Math.random() * Math.PI * 2,
        visible: true,
        scale: TREASURE_SCALE,
      }));
      setTreasures(newTreasures);
      burstDoneRef.current = true;
    }, 300);
  };

  const handleTreasureClick = (href) => {
    window.location.href = href;
  };

  // Animation loop for bubbles
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setBubbles(prev => {
        let updated = prev
          .map(b => ({
            ...b,
            y: b.y + b.speed, // Move up (y increases = goes up in our coordinate system)
            x: b.x + Math.sin(b.wobble + b.y * 0.03) * 0.5,
            // Pop when reaching top (y > window height basically)
            opacity: b.y > 600 ? b.opacity - 0.15 : b.opacity,
          }))
          .filter(b => b.opacity > 0);
        
        // Add slow continuous bubbles after burst
        if (burstDoneRef.current && Math.random() < 0.05) {
          updated.push({
            id: Math.random(),
            x: 50 + Math.random() * 30 - 15,
            y: 0,
            size: 10 + Math.random() * 15,
            speed: 3 + Math.random() * 3,
            wobble: Math.random() * Math.PI * 2,
            opacity: 0.7,
          });
        }
        
        return updated;
      });
      
      // Animate treasures floating up
      setTreasures(prev => prev.map(t => ({
        ...t,
        x: t.x + (t.targetX - t.x) * 0.04,
        y: t.y + (t.targetY - t.y) * 0.025,
      })));
    }, 30); // Faster interval
    
    return () => clearInterval(interval);
  }, [isOpen]);

  // Draw chest on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const sprite = isOpen ? chestOpenSprite : chestClosedSprite;
    const spriteHeight = isOpen ? 28 : 20;
    
    canvas.width = 32 * CHEST_SCALE;
    canvas.height = spriteHeight * CHEST_SCALE;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < spriteHeight; y++) {
      for (let x = 0; x < 32; x++) {
        const pixel = sprite[y]?.[x];
        if (pixel && pixel > 0) {
          const color = chestPalette[pixel];
          if (color) {
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(x * CHEST_SCALE, y * CHEST_SCALE, CHEST_SCALE, CHEST_SCALE);
          }
        }
      }
    }
  }, [isOpen]);

  return (
    <div 
      className="fixed z-40 flex flex-col items-center"
      style={{ 
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Treasures */}
      {treasures.map((treasure) => (
        <div
          key={treasure.id}
          onClick={() => handleTreasureClick(treasure.href)}
          className="absolute cursor-pointer transition-transform hover:scale-110 flex flex-col items-center"
          style={{
            left: `${treasure.x}%`,
            bottom: `${180 - treasure.y}px`,
            transform: `translate(-50%, 0) translateY(${Math.sin(Date.now() / 500 + treasure.bobPhase) * 8}px)`,
            opacity: treasure.visible ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        >
          <span 
            className="text-black mb-3 whitespace-nowrap pixelify-sans"
            style={{ 
                fontFamily: '"Pixelify Sans", sans-serif',
                fontSize: '22px',
                fontWeight: 600,
                textShadow: '2px 2px 0px rgb(255, 255, 255), -1px -1px 0px rgba(255, 255, 255, 0.8)',
            }}
           >
           {treasure.label}
           </span>
          <canvas
            width={treasure.width * treasure.scale}
            height={treasure.height * treasure.scale}
            style={{ imageRendering: 'pixelated' }}
            ref={el => {
              if (el) {
                const ctx = el.getContext('2d');
                ctx.clearRect(0, 0, el.width, el.height);
                for (let y = 0; y < treasure.height; y++) {
                  for (let x = 0; x < treasure.width; x++) {
                    const pixel = treasure.sprite[y]?.[x];
                    if (pixel && pixel > 0) {
                      const color = treasure.palette[pixel];
                      if (color) {
                        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                        ctx.fillRect(x * treasure.scale, y * treasure.scale, treasure.scale, treasure.scale);
                      }
                    }
                  }
                }
              }
            }}
          />
        </div>
      ))}
      
      {/* Bubbles */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${bubble.x}%`,
            bottom: `${bubble.y + 80}px`,
            width: bubble.size,
            height: bubble.size,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${bubble.opacity}), rgba(200,230,255,${bubble.opacity * 0.5}))`,
            border: `2px solid rgba(255,255,255,${bubble.opacity * 0.6})`,
            transform: 'translate(-50%, 50%)',
          }}
        />
      ))}
      
      {/* Chest */}
      <canvas
        ref={canvasRef}
        onClick={handleChestClick}
        className={`cursor-pointer ${!isOpen ? 'transition-transform hover:scale-105' : ''}`}
        style={{ imageRendering: 'pixelated' }}
      />
      
    </div>
  );
}