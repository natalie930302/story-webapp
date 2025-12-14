'use client';
import React, { useEffect, useState } from 'react';

export default function LoadingPage({ message = "正在為您編寫獨特的故事..." }) {
  return (
    <div className="loading-container">
      {/* Decorative animated SVG */}
      <div className="svg-wrapper">
        <svg 
          viewBox="0 0 160 100" 
          xmlns="http://www.w3.org/2000/svg" 
          className="loading-svg"
        >
          <g transform="translate(20,20)">
            <rect x="0" y="60" width="120" height="18" rx="6" fill="var(--color-neon-purple)" stroke="var(--color-neon-pink)" strokeWidth="1" 
              className="rect-1" />
            <rect x="8" y="36" width="104" height="18" rx="6" fill="var(--color-gold)" stroke="var(--color-gold-dark)" strokeWidth="1" 
              className="rect-2" />
            <rect x="16" y="12" width="88" height="18" rx="6" fill="var(--color-neon-teal)" stroke="var(--color-neon-blue)" strokeWidth="1" 
              className="rect-3" />
            <path d="M96 84 L112 92 L96 100 Z" fill="var(--color-neon-blue)" 
              className="play-icon" />
          </g>
        </svg>
      </div>

      {/* Loading message */}
      <p className="loading-message">
        {message}
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
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .svg-wrapper {
          position: relative;
          margin-bottom: var(--spacing-lg);
          filter: drop-shadow(0 8px 24px rgb(0 0 0 / 0.2));
        }

        .loading-svg {
          width: 150px;
          height: 150px;
          display: block;
          filter: drop-shadow(0 0 30px var(--color-gold-glow)) drop-shadow(0 0 60px rgba(157, 121, 242, 0.3));
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
        
        .loading-message {
          color: var(--color-starlight-cream);
          text-shadow: 0 0 20px var(--color-gold-glow);
          font-weight: 600;
          text-align: center;
          margin-bottom: var(--spacing-md);
          font-size: max(1.25rem,min(2.5vw,1.75rem));
        }

        .dots-container {
          padding: var(--spacing-md);
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .dot {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-pink));
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6), 0 0 14px rgba(242, 147, 176, 0.6);
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