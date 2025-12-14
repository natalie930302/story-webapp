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
    <div className="loading-container">
      {/* Decorative animated SVG */}
      <div className="svg-wrapper">
        <svg 
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg" 
          className="loading-svg"
        >
          <g transform="translate(20,20)">
            <rect x="0" y="60" width="120" height="18" rx="6" fill="var(--color-brick-red)" stroke="var(--color-brick-red-dark)" strokeWidth="1" 
              className="rect-1" />
            <rect x="8" y="36" width="104" height="18" rx="6" fill="var(--color-gold)" stroke="var(--color-gold-dark)" strokeWidth="1" 
              className="rect-2" />
            <rect x="16" y="12" width="88" height="18" rx="6" fill="var(--color-pink-orange)" stroke="var(--color-pink-orange-dark)" strokeWidth="1" 
              className="rect-3" />
            <path d="M96 84 L112 92 L96 100 Z" fill="var(--color-turquoise-dark)" 
              className="play-icon" />
          </g>
        </svg>
      </div>

      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar" />
      </div>

      {/* Loading message */}
      <p className="loading-message">
        {message}
        <span className="dots">{'.'.repeat(dotCount)}</span>
      </p>

      {/* Sub message */}
      <p className="sub-message">
        這是在為你創造一個獨特的故事時刻
      </p>

      {/* Decorative elements */}
      <div className="dots-container">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="dot"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          padding: var(--spacing-xl);
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .svg-wrapper {
          position: relative;
          margin-bottom: var(--spacing-lg);
          filter: drop-shadow(0 8px 24px rgb(0 0 0 / 0.2));
        }

        .loading-svg {
          width: 160px;
          height: 160px;
          display: block;
          margin: 0 auto 18px;
          filter: drop-shadow(0 0 30px var(--color-gold-glow)) drop-shadow(0 0 60px rgba(139, 64, 73, 0.3));
          animation: float 3s ease-in-out infinite;
        }

        .rect-1 {
          animation: slideInRight 2s ease-in-out infinite;
          transform-origin: left center;
        }

        .rect-2 {
          animation: slideInRight 1.6s ease-in-out infinite;
          transform-origin: left center;
        }

        .rect-3 {
          animation: slideInRight 1.2s ease-in-out infinite;
          transform-origin: left center;
        }

        .play-icon {
          animation: float 2.4s ease-in-out infinite;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
        }

        .progress-container {
          width: 100%;
          max-width: 280px;
          height: 8px;
          background: linear-gradient(90deg, rgba(42, 31, 29, 0.4), rgba(42, 31, 29, 0.5), rgba(42, 31, 29, 0.4));
          border-radius: 9999px;
          overflow: hidden;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15);
          position: relative;
          margin-bottom: 24px;
        }

        .progress-bar {
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          background: linear-gradient(90deg, var(--color-beige) 0%, var(--color-gold) 33%, var(--color-brick-red) 66%, var(--color-gold) 100%);
          background-size: 200% 100%;
          box-shadow: 0 0 20px var(--color-gold-glow), inset 0 2px 4px rgba(0, 0, 0, 0.2);
          animation: progress-bar 4s ease-in-out infinite;
        }

        .loading-message {
          color: var(--color-beige);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          font-weight: 600;
          text-align: center;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .dots {
          display: inline-block;
          width: 20px;
        }

        .sub-message {
          color: rgba(245, 235, 224, 0.7);
          font-style: italic;
          text-align: center;
          font-size: 14px;
        }

        .dots-container {
          margin-top: 24px;
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .dot {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, var(--color-brick-red), var(--color-gold-light));
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6), 0 0 14px var(--color-gold-glow);
          animation: dot-pulse 1.8s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes slideInRight {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50% { transform: scaleX(0.95); opacity: 0.8; }
        }

        @keyframes progress-bar {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }

        @keyframes dot-pulse {
          0%, 100% { opacity: 0.6; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}