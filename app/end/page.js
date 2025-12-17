'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function EndPage() {
  const router = useRouter();
  return (
    <>
      <div className="end-container">
        <div className="check-circle">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        <h1 className="end-title">圓滿謝幕</h1>

        <p className="end-message">感謝您的閱讀與互動！期待您下次的奇幻旅程。</p>

        <button onClick={() => router.push('/')} className="home-button">
          返回書架
        </button>
      </div>
      <style jsx>{`
        .end-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 64px 0;
        }
        
        .check-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          box-shadow: 0 20px 48px var(--color-gold-glow), 0 8px 24px rgba(0, 0, 0, 0.15);
          animation: glowPulse 2s ease-in-out infinite;
        }

        .end-title {
          font-size: max(2rem,min(4vw,2.5rem));
          font-weight: 900;
          margin-bottom: 24px;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.025em;
        }

        .end-message {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--color-text-secondary);
          opacity: 0.8;
          margin-bottom: 40px;
          max-width: 600px;
        }

        .home-button {
          padding: 18px var(--spacing-2xl);
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--color-text-primary);
          background: var(--gradient-secondary);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-smooth);
          box-shadow: 0 12px 32px rgba(157, 121, 242, 0.4), 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .home-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 48px rgba(157, 121, 242, 0.5), 0 10px 24px rgba(242, 147, 176, 0.3), 0 0 32px var(--color-gold-glow);
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 20px 48px var(--color-gold-glow), 0 8px 24px rgba(0, 0, 0, 0.15);
          }
          50% {
            box-shadow: 0 20px 48px rgba(212, 175, 55, 0.55), 0 8px 24px rgba(0, 0, 0, 0.25), 0 0 40px var(--color-gold-glow);
          }
        }
      `}</style>
    </>
  );
}