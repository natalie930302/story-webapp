"use client"
import React from "react"

export default function StoryCard({ story = {}, onClick }) {
  const palettes = [
      'linear-gradient(135deg, #8B2B2B 0%, #E55B3C 100%)',
      'linear-gradient(135deg, #1F3A34 0%, #5A1F1A 100%)',
      'linear-gradient(135deg, #5A1F1A 0%, #D6A857 100%)',
      'linear-gradient(135deg, #2c3e4f 0%, #8B2B2B 100%)',
      'linear-gradient(135deg, #E55B3C 0%, #D6A857 100%)',
      'linear-gradient(135deg, #1F3A34 0%, #C84A6D 100%)'
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
      className="p-4 appear"
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
    >
      <div className="book-card group">
        <div className="book-inner relative" aria-hidden>

          <div className="book-front book-cover cover-layer relative overflow-hidden bg-cover bg-center" style={{ background: bg }}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
              <defs>
                <linearGradient id={`g${seed}`} x1="0" x2="1">
                  <stop offset="0" stopColor="rgba(255,255,255,0.14)" />
                  <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
                </linearGradient>
              </defs>

              {patternType === 0 && (
                <g aria-hidden>
                  <g opacity="0.26" stroke={`url(#g${seed})`} strokeWidth="8" strokeLinecap="round">
                    <path d="M-60 30 L240 330" />
                    <path d="M-20 0 L220 320" />
                    <path d="M20 -20 L220 260" />
                  </g>
                  <g opacity="0.14" stroke="rgba(214,168,87,0.7)" strokeWidth="2" strokeLinecap="round">
                    <path d="M-60 30 L240 330" strokeDasharray="6 10" />
                  </g>
                  <g opacity="0.18" fill="none" stroke="#fff" strokeWidth="1">
                    <path d="M10 40 L190 320" strokeOpacity="0.12" />
                  </g>
                </g>
              )}

              {patternType === 1 && (
                <g aria-hidden>
                  <g opacity="0.28" fill="#fff7d6" transform="translate(-6,-6)">
                    <circle cx="40" cy="60" r="22" fillOpacity="0.08" />
                    <circle cx="120" cy="120" r="34" fillOpacity="0.06" />
                    <circle cx="80" cy="200" r="18" fillOpacity="0.08" />
                  </g>
                  <g opacity="0.22" fill="none" stroke="#f6e7c2" strokeWidth="2">
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
                <g aria-hidden>
                  <g opacity="0.3" stroke="#fff7d6" strokeWidth="1.8" fill="none">
                    <path d="M18 20 C60 8 120 8 160 40" />
                    <path d="M18 260 C60 280 120 280 160 240" />
                    <path d="M10 40 C40 70 80 70 120 40" strokeOpacity="0.9" />
                  </g>
                  <g opacity="0.18" stroke="rgba(214,168,87,0.6)" strokeWidth="1">
                    <path d="M22 26 C62 14 118 14 156 44" />
                  </g>
                  <g opacity="0.12" fill="#fff" transform="translate(0,0)">
                    <circle cx="24" cy="40" r="3" />
                    <circle cx="152" cy="44" r="3" />
                  </g>
                </g>
              )}
            </svg>

            <div className="book-title book-title-shadow">{story.title || '無標題故事'}</div>

            <div className="bookmark-ribbon" aria-hidden>
              <svg viewBox="0 0 512 512" height="45" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden className="svg-block">
                <defs>
                  <linearGradient id={`ribbonGrad${seed}`} x1="0" x2="1">
                    <stop offset="0" stopColor="#ff7a7f" />
                    <stop offset="1" stopColor="#d64a6d" />
                  </linearGradient>
                </defs>
                <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" fill={`url(#ribbonGrad${seed})`} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </svg>
            </div>

            <div className="seed-badge" aria-hidden style={{ animation: 'swing 3s ease-in-out infinite' }}>
              <span className="icon-sm">✦</span>
            </div>
          </div>
          
          <div className="book-page" />
        </div>

        <div
          className="book-glow absolute inset-0 rounded-[26px] opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at center, rgba(229,91,60,0.12), transparent)',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  )
}