'use client';
import React, { useEffect, useState } from 'react';

const YachtAnimation = () => {
  /* generate particle positions only after mount */
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const temp = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${3 + Math.random() * 2}s`
    }));
    setParticles(temp);
  }, []);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-[4px] h-[4px] bg-blue-200 rounded-full opacity-30 animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration
            }}
          />
        ))}
      </div>

      {/* Yacht SVG wrapper */}
      <div className="relative w-full h-full flex items-center justify-center">
      {/* Water Surface */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/30 to-blue-700/20 rounded-lg overflow-hidden">
        {/* Water waves animation */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 bg-blue-300 rounded-full animate-pulse"
              style={{
                left: `${i * 12}%`,
                top: `${Math.random() * 60 + 20}%`,
                width: `${Math.random() * 40 + 20}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Ship Container - positioned to float on water */}
      <div className="relative animate-[float_8s_ease-in-out_infinite] transform-gpu" style={{ marginBottom: '60px' }}>
        <svg 
          width="600" 
          height="350" 
          viewBox="0 0 600 350" 
          className="drop-shadow-2xl"
        >
          {/* Definitions for gradients and effects */}
          <defs>
            <linearGradient id="hullRed" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b0000" />
              <stop offset="50%" stopColor="#dc143c" />
              <stop offset="100%" stopColor="#8b0000" />
            </linearGradient>
            <linearGradient id="hullGray" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e5e7eb" />
              <stop offset="50%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>
            <linearGradient id="deckWood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d2b48c" />
              <stop offset="50%" stopColor="#daa520" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>
            <linearGradient id="smokeStack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2d3748" />
              <stop offset="100%" stopColor="#1a202c" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Water reflection under ship */}
          <ellipse cx="300" cy="320" rx="280" ry="25" 
                   fill="url(#hullRed)" 
                   opacity="0.2" 
                   className="animate-[wave_4s_ease-in-out_infinite]"/>

          {/* Main Hull - Lower Section (Red) */}
          <path d="M50 240 Q300 220 550 240 L540 280 Q300 260 60 280 Z" 
                fill="url(#hullRed)" 
                filter="url(#shadow)"/>
          
          {/* Hull Waterline */}
          <path d="M60 240 Q300 225 540 240" 
                fill="none" 
                stroke="#000" 
                strokeWidth="2" 
                opacity="0.6"/>

          {/* Upper Hull - Gray Section */}
          <path d="M70 200 Q300 185 530 200 L520 240 Q300 225 80 240 Z" 
                fill="url(#hullGray)" 
                filter="url(#shadow)"/>

          {/* Main Deck */}
          <ellipse cx="300" cy="200" rx="230" ry="18" 
                   fill="url(#deckWood)"/>

          {/* Deck planking lines */}
          {[...Array(12)].map((_, i) => (
            <line key={`plank-${i}`} 
                  x1={90 + i * 35} 
                  y1="190" 
                  x2={90 + i * 35} 
                  y2="210" 
                  stroke="#8b4513" 
                  strokeWidth="0.5" 
                  opacity="0.4"/>
          ))}

          {/* Forward Superstructure */}
          <rect x="120" y="140" width="120" height="60" rx="8" 
                fill="url(#hullGray)" 
                filter="url(#shadow)"/>

          {/* Main Superstructure Block */}
          <rect x="200" y="110" width="200" height="90" rx="6" 
                fill="url(#hullGray)" 
                filter="url(#shadow)"/>

          {/* Aft Superstructure */}
          <rect x="360" y="130" width="140" height="70" rx="8" 
                fill="url(#hullGray)" 
                filter="url(#shadow)"/>

          {/* Bridge/Command Tower */}
          <rect x="260" y="80" width="80" height="35" rx="4" 
                fill="url(#hullGray)" 
                filter="url(#shadow)"/>

          {/* Smoke Stacks */}
          <rect x="180" y="60" width="20" height="50" rx="10" 
                fill="url(#smokeStack)" 
                filter="url(#shadow)"/>
          <rect x="220" y="55" width="22" height="55" rx="11" 
                fill="url(#smokeStack)" 
                filter="url(#shadow)"/>
          <rect x="320" y="65" width="18" height="45" rx="9" 
                fill="url(#smokeStack)" 
                filter="url(#shadow)"/>

          {/* Smoke from stacks */}
          {[180, 220, 320].map((x, i) => (
            <g key={`smoke-${i}`}>
              <circle cx={x + 10} cy={45 - i * 5} r="4" 
                      fill="#6b7280" 
                      opacity="0.3" 
                      className="animate-pulse"/>
              <circle cx={x + 15} cy={35 - i * 3} r="6" 
                      fill="#9ca3af" 
                      opacity="0.2" 
                      className="animate-pulse"/>
            </g>
          ))}

          {/* Main Masts */}
          <line x1="160" y1="140" x2="160" y2="40" 
                stroke="#4a5568" 
                strokeWidth="4"/>
          <line x1="440" y1="130" x2="440" y2="50" 
                stroke="#4a5568" 
                strokeWidth="4"/>

          {/* Radar/Communication Equipment */}
          <rect x="155" y="35" width="10" height="8" rx="2" 
                fill="#2d3748"/>
          <rect x="435" y="45" width="10" height="8" rx="2" 
                fill="#2d3748"/>

          {/* Gun Turrets */}
          <circle cx="140" cy="170" r="15" 
                  fill="#4a5568" 
                  filter="url(#shadow)"/>
          <rect x="125" y="165" width="30" height="8" rx="4" 
                fill="#2d3748"/>
          
          <circle cx="320" cy="160" r="18" 
                  fill="#4a5568" 
                  filter="url(#shadow)"/>
          <rect x="302" y="154" width="36" height="10" rx="5" 
                fill="#2d3748"/>

          <circle cx="460" cy="165" r="14" 
                  fill="#4a5568" 
                  filter="url(#shadow)"/>
          <rect x="446" y="160" width="28" height="8" rx="4" 
                fill="#2d3748"/>

          {/* Portholes along the hull */}
          {[...Array(18)].map((_, i) => (
            <circle key={`porthole-${i}`} 
                    cx={90 + i * 25} 
                    cy="220" 
                    r="4" 
                    fill="#1a365d" 
                    stroke="#4a5568" 
                    strokeWidth="1"/>
          ))}

          {/* Bridge Windows */}
          {[...Array(6)].map((_, i) => (
            <rect key={`bridge-window-${i}`} 
                  x={265 + i * 12} 
                  y="88" 
                  width="8" 
                  height="12" 
                  rx="2" 
                  fill="#1a365d" 
                  stroke="#4a5568" 
                  strokeWidth="0.5"/>
          ))}

          {/* Superstructure Windows */}
          {[...Array(15)].map((_, i) => (
            <rect key={`super-window-${i}`} 
                  x={130 + i * 20} 
                  y="150" 
                  width="12" 
                  height="18" 
                  rx="3" 
                  fill="#1a365d" 
                  stroke="#4a5568" 
                  strokeWidth="0.5"/>
          ))}

          {/* Anchor */}
          <g transform="translate(80, 230)">
            <path d="M0 0 L8 15 L0 20 L-8 15 Z" 
                  fill="#2d3748" 
                  opacity="0.8"/>
            <circle cx="0" cy="10" r="6" 
                    fill="none" 
                    stroke="#2d3748" 
                    strokeWidth="2" 
                    opacity="0.8"/>
          </g>

          {/* Navigation Lights */}
          <circle cx="75" cy="215" r="3" 
                  fill="#ef4444" 
                  className="animate-pulse"/>
          <circle cx="525" cy="215" r="3" 
                  fill="#22c55e" 
                  className="animate-pulse"/>
          <circle cx="300" cy="75" r="2" 
                  fill="#ffffff" 
                  className="animate-pulse"/>

          {/* Water Wake/Bow Wave */}
          <path d="M50 245 Q30 250 20 260 Q15 270 10 280" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                opacity="0.5" 
                className="animate-pulse"/>
          <path d="M550 245 Q570 250 580 260 Q585 270 590 280" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                opacity="0.5" 
                className="animate-pulse"/>

          {/* Deck Details */}
          <rect x="150" y="185" width="12" height="12" rx="2" 
                fill="#4a5568" 
                opacity="0.7"/>
          <rect x="350" y="185" width="12" height="12" rx="2" 
                fill="#4a5568" 
                opacity="0.7"/>
          <rect x="450" y="185" width="12" height="12" rx="2" 
                fill="#4a5568" 
                opacity="0.7"/>

          {/* Hull Numbers/Text */}
         
        </svg>
      </div>

      {/* Floating particles for atmosphere */}
      
    </div>
    </div>
  
  );
};

export default YachtAnimation;
