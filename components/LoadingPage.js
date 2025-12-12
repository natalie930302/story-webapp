'use client';
import React, { useEffect, useState } from 'react';

export default function LoadingPage({ message = "正在為您編寫獨特的故事..." }) {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] p-8 appear"
    >
      {/* Decorative animated SVG */}
      <div style={{position: 'relative', marginBottom: 24}}>
        <svg 
          className="loading-illustration" 
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg" 
          aria-hidden
          style={{
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          {/* Decorative book stack */}
          <g transform="translate(20,20)">
            <rect x="0" y="60" width="120" height="18" rx="6" stroke="#5a1f1a" strokeWidth="1" style={{animation: 'slideInRight 1.5s ease-in-out infinite'}} />
            <rect x="8" y="36" width="104" height="18" rx="6" stroke="#c9952f" strokeWidth="1" style={{animation: 'slideInRight 1.2s ease-in-out infinite'}} />
            <rect x="16" y="12" width="88" height="18" rx="6" stroke="#cd4426" strokeWidth="1" style={{animation: 'slideInRight 0.9s ease-in-out infinite'}} />
            <path d="M96 84 L112 92 L96 100 Z" fill="#2b1f1a" style={{animation: 'float 2s ease-in-out infinite'}} />
          </g>
        </svg>
      </div>

      {/* Progress bar */}
      <div 
        style={{
          width: '240px',
          background: 'rgba(81,45,58,0.15)',
          borderRadius: '999px',
          height: '12px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}
      >
        <div 
          className="animate-progress-bar" 
          style={{
            width: '100%',
            height: '12px',
            borderRadius: '999px',
            animationDuration: '4s',
          }}
        />
      </div>

      {/* Loading message */}
      <p className="loading-text-primary" style={{ textAlign: 'center', marginBottom: 8 }}>
        {message}
        <span style={{display: 'inline-block', width: '20px'}}>{'.'.repeat(dotCount)}</span>
      </p>

      {/* Sub message */}
      <p className="loading-text-secondary" style={{ textAlign: 'center' }}>
        這是在為你創造一個獨特的故事時刻
      </p>

      {/* Decorative elements */}
      <div style={{marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center'}}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="loading-dots"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              animation: `dot-pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}