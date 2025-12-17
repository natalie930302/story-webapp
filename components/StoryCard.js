"use client"
import React, { useState } from "react"

export default function StoryCard({ story = {}, onClick }) {
  const palettes = [
      'linear-gradient(135deg, var(--color-neon-purple) 0%, var(--color-neon-pink) 50%, var(--color-neon-blue) 100%)',
      'linear-gradient(135deg, var(--color-neon-pink) 0%, var(--color-neon-purple) 50%, var(--color-gold) 100%)',
      'linear-gradient(135deg, var(--color-neon-blue) 0%, var(--color-neon-teal) 50%, var(--color-neon-purple) 100%)',
      'linear-gradient(135deg, var(--color-neon-teal) 0%, var(--color-neon-blue) 50%, var(--color-neon-pink) 100%)',
      'linear-gradient(135deg, var(--color-gold) 0%, var(--color-neon-pink) 50%, var(--color-neon-purple) 100%)',
      'linear-gradient(135deg, var(--color-neon-purple) 0%, var(--color-gold) 50%, var(--color-neon-teal) 100%)'
  ];

  const rawSeed = story._id 
      ? [...String(story._id)].reduce((s, c) => ((s * 31) + c.charCodeAt(0)) | 0, 0) 
      : Math.floor(Math.random() * 100000);
  const seed = Math.abs(rawSeed);
      
  const bg = palettes[seed % palettes.length];
  const patternType = seed % 3;

  const handleActivate = () => onClick && onClick(story._id);

  return (
    <div 
      className="card-wrapper"
      role="button"
      tabIndex={0}
      onClick={handleActivate}
    >
      <div className="book-container">

        <div className="book-cover" style={{ background: bg }}>
          <div className="pattern-container">
            <svg className="pattern-svg" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" >
              <defs>
                <linearGradient id={`g${seed}`} x1="0" x2="1">
                  <stop offset="0" stopColor="rgba(255,255,255,0.18)" />
                  <stop offset="1" stopColor="rgba(255,255,255,0.04)" />
                </linearGradient>
              </defs>

              {patternType === 0 && (
                <g >
                  <g opacity="0.26" stroke={`url(#g${seed})`} strokeWidth="8" strokeLinecap="round">
                    <path d="M-60 30 L240 330" />
                    <path d="M-20 0 L220 320" />
                    <path d="M20 -20 L220 260" />
                  </g>
                  <g opacity="0.14" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round">
                    <path d="M-60 30 L240 330" strokeDasharray="6 10" />
                  </g>
                  <g opacity="0.18" fill="none" stroke="#fff" strokeWidth="1">
                    <path d="M10 40 L190 320" strokeOpacity="0.12" />
                  </g>
                </g>
              )}

              {patternType === 1 && (
                <g >
                  <g opacity="0.28" fill="var(--color-beige)" transform="translate(-6,-6)">
                    <circle cx="40" cy="60" r="22" fillOpacity="0.08" />
                    <circle cx="120" cy="120" r="34" fillOpacity="0.06" />
                    <circle cx="80" cy="200" r="18" fillOpacity="0.08" />
                  </g>
                  <g opacity="0.22" fill="none" stroke="var(--color-beige-dark)" strokeWidth="2">
                    <circle cx="40" cy="60" r="20" />
                    <circle cx="120" cy="120" r="28" />
                    <circle cx="80" cy="200" r="16" />
                  </g>
                  <g opacity="0.18" fill="#fff" transform="translate(4,4)">
                    <polygon points="120,120 126,130 116,130" fillOpacity="0.9" />
                  </g>
                </g>
              )}

              {patternType === 2 && (
                <g >
                  <g opacity="0.3" stroke="var(--color-beige)" strokeWidth="1.8" fill="none">
                    <path d="M18 20 C60 8 120 8 160 40" />
                    <path d="M18 260 C60 280 120 280 160 240" />
                    <path d="M10 40 C40 70 80 70 120 40" strokeOpacity="0.9" />
                  </g>
                  <g opacity="0.12" fill="#fff" transform="translate(0,0)">
                    <circle cx="24" cy="40" r="3" />
                    <circle cx="152" cy="44" r="3" />
                  </g>
                </g>
              )}
            </svg>
          </div>

          <h3 className="page-title">{story.title || '無標題故事'}</h3>

          <div className="ribbon">
            <svg viewBox="0 0 512 512" height="45" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id={`ribbonGrad${seed}`} x1="0" x2="1">
                  <stop offset="0" stopColor="var(--color-neon-purple)" />
                  <stop offset="1" stopColor="var(--color-neon-pink)" />
                </linearGradient>
              </defs>
              <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" fill={`url(#ribbonGrad${seed})`} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </svg>
          </div>

          <div className="badge-star">
            <span className="star-icon">✦</span>
          </div>
        </div>
        
        <div className="book-spine" />
      </div>
      
      <style jsx>{`
        .card-wrapper {
          width: 100%;
          perspective: 1200px;
          cursor: pointer;
        }

        .book-container {
          width: 100%;
          max-width: 200px;
          height: 240px;
          border-radius: var(--radius-lg);
          transform-origin: center left;
          transform-style: preserve-3d;
          transition: transform var(--transition-smooth), box-shadow var(--transition-smooth);
          box-shadow: var(--shadow-xl), var(--shadow-glow);
          background: var(--gradient-secondary);
          overflow: visible;
          position: relative;
          border: 1px solid var(--color-border-primary);
          padding-bottom: 20px;
          z-index: 3;
          will-change: transform, box-shadow;
        }

        .book-container:hover {
          transform: translateY(-16px) rotateX(6deg) rotateY(-10deg) scale(1.05);
          box-shadow: var(--shadow-2xl), var(--shadow-glow-strong);
        }

        .book-cover {
          width: 100%;
          height: 100%;
          position: relative;
          top: -2px;
          left: 5px;
          border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) 6px;
          overflow: hidden;
          transform-origin: left center;
          transition: transform var(--transition-slow);
          backface-visibility: hidden;
          transform-style: preserve-3d;
          z-index: 6;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .book-cover:hover {
          transform: rotateY(-35deg) translateX(-2px) scale(1.02) translateZ(5px);
        }

        .pattern-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .pattern-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .page-title {
          font-weight: 700;
          color: var(--color-text-primary);
          font-size: 2rem;
          text-align: center;
          padding: var(--spacing-lg);
          z-index: 8;
          position: relative;
          text-shadow: var(--shadow-md);
          margin: 0;
        }

        .ribbon {
          position: absolute;
          right: 16px;
          top: -5px;
          pointer-events: none;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          transform-origin: top center;
        }

        .badge-star {
          position: absolute;
          left: var(--spacing-sm);
          top: var(--spacing-sm);
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          border: 1px solid var(--color-border-primary);
          animation: swing 3s ease-in-out infinite;
        }

        .star-icon {
          font-size: 18px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .book-spine {
          position: absolute;
          left: 10px;
          top: -2px;
          bottom: 10px;
          width: calc(100% - 8px);
          border-radius: var(--radius-lg);
          background: var(--color-starlight-cream);
          box-shadow: inset -6px 0 12px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        @keyframes swing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  )
}