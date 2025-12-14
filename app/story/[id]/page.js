'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import StoryPlayer from '../../../components/StoryPlayer';

export default function StoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(!id) return;
    setIsLoading(true);
    fetch(`/api/story/${id}`)
      .then(res => res.json())
      .then(data => {
        setStory(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  if (isLoading)
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-icon">📖</div>
          <p className="loading-title">正在準備您的故事...</p>
          <p className="loading-subtitle">這是你獨特的故事時刻</p>
        </div>

        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
            padding: var(--spacing-3xl) var(--spacing-md);
            animation: appear 0.6s ease-out;
          }

          .loading-content {
            text-align: center;
          }

          .loading-icon {
            font-size: 64px;
            margin-bottom: var(--spacing-md);
            animation: floatIcon 3s ease-in-out infinite;
          }

          .loading-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--color-brick-red);
            margin-bottom: var(--spacing-xs);
          }

          .loading-subtitle {
            font-size: 17px;
            line-height: 1.625;
            color: var(--color-brown-cream);
            opacity: 0.8;
            margin-top: var(--spacing-xs);
          }

          @keyframes appear {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes floatIcon {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );

  if (!story)
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <p className="error-title">故事載入失敗</p>
          <div className="button-container">
            <button onClick={() => router.push('/')} className="home-button">
              返回首頁
            </button>
          </div>
        </div>

        <style jsx>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
            padding: var(--spacing-3xl) var(--spacing-md);
            animation: appear 0.6s ease-out;
          }

          .error-content {
            text-align: center;
          }

          .error-icon {
            font-size: 64px;
            margin-bottom: 16px;
          }

          .error-title {
            font-size: 18px;
            font-weight: 600;
            color: #4a3528;
            margin-bottom: 16px;
          }

          .button-container {
            margin-top: 16px;
          }

          .home-button {
            padding: var(--spacing-sm) 28px;
            font-size: var(--text-lg);
            font-weight: 600;
            color: #fff5eb;
            background: linear-gradient(135deg, #e55b3c 0%, #d87885 100%);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .home-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2), 0 6px 16px rgba(0, 0, 0, 0.15);
          }

          @keyframes appear {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );

  return (
    <>
      {/* Header section */}
      <div className="header-section">
        <h1 className="story-title">
          {story.title}
        </h1>
      </div>
      
      {/* Story player */}
      <StoryPlayer 
        paragraphs={story.segments} 
        onNext={() => router.push(`/questions/${id}`)} 
        buttonText="開始互動問卷"
      />

      <style jsx>{`
        .header-section {
          margin-bottom: 24px;
        }

        .story-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 900;
          line-height: 1.2;
          color: var(--color-text-dark);
          text-align: center;
          margin-bottom: 8px;
          animation: appear 0.6s ease-out;
          animation-delay: 0.1s;
          text-shadow: 0 0 20px var(--color-gold-glow);
          letter-spacing: -0.025em;
        }

        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}