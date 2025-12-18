'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import StoryPlayer from '../../../components/StoryPlayer';
import LoadingPage from '../../../components/LoadingPage';

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
    return <LoadingPage message="正在準備故事" />;

  if (!story)
    return (
      <div className="error-container appear">
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
            height: 100%;
            padding: var(--spacing-3xl) 0;
          }

          .error-content {
            text-align: center;
          }

          .error-icon {
          font-size: var(--text-5xl);
            margin-bottom: var(--spacing-md);
          }

          .error-title {
            font-size: var(--text-2xl);
            color: var(--color-starlight-cream);
            margin-bottom: var(--spacing-md);
          }

          .button-container {
            margin-top: var(--spacing-md);
          }

          .home-button {
            padding: var(--spacing-md) var(--spacing-lg);
            font-size: var(--text-lg);
            color: var(--color-white);
            background: var(--gradient-secondary);
            border: none;
          border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all var(--transition-smooth);
            box-shadow: var(--shadow-md);
          }

          .home-button:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
          }
        `}</style>
      </div>
    );

  return (
    <>
      {/* Header section */}
      <div className="header-section appear">
        <h1 className="page-title appear">
          {story.title}
        </h1>
      </div>
      
      {/* Story player section */}
      <div className="story-player-section appear">
        <StoryPlayer 
          segments={story.segments} 
          onNext={() => router.push(`/questions/${id}`)} 
          buttonText="開始互動問題"
        />
      </div>

      <style jsx>{`
        .header-section {
          margin-bottom: var(--spacing-xl);
        }

        .page-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          color: var(--color-text-primary);
          font-size: var(--text-5xl);
        }
      `}</style>
    </>
  );
}