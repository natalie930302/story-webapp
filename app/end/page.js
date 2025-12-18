'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function EndPage() {
  const router = useRouter();
  
  return (
    <>
      <div className="end-container">
        <div className="check-circle">
          <svg width="90" height="90" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        <h1 className="end-title">圓滿謝幕</h1>

        <p className="end-message">感謝你的閱讀與互動！期待你下次的奇幻旅程。</p>

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
          padding: var(--spacing-3xl) 0;
        }
        
        .check-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--spacing-lg);
          box-shadow: var(--shadow-lg), var(--shadow-glow-strong);
          animation: glowPulse 2s ease-in-out infinite;
        }

        .end-title {
          font-size: var(--text-5xl);
          margin-bottom: var(--spacing-lg);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .end-message {
          font-size: var(--text-2xl);
          color: var(--color-text-secondary);
          opacity: 0.8;
          margin-bottom: var(--spacing-2xl);
        }

        .home-button {
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: var(--text-xl);
          color: var(--color-text-primary);
          background: var(--gradient-secondary);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-smooth);
          box-shadow: var(--shadow-lg);
        }

        .home-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: var(--shadow-lg), var(--shadow-glow);
          }
          50% {
            box-shadow: var(--shadow-lg), var(--shadow-glow-strong);
          }
        }
      `}</style>
    </>
  );
}