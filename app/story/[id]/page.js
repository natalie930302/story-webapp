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
    return <LoadingPage message="正在準備您的故事..." />;

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
            padding: 64px 0;
          }

          .error-content {
            text-align: center;
          }

          .error-icon {
            font-size: 64px;
            margin-bottom: 16px;
          }

          .error-title {
            font-size: max(1.25rem,min(2.5vw,1.75rem));
            font-weight: 600;
            color: var(--color-starlight-cream);
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
          paragraphs={story.segments} 
          onNext={() => router.push(`/questions/${id}`)} 
          buttonText="開始互動問卷"
        />
      </div>

      <style jsx>{`
        .header-section {
          margin-bottom: var(--spacing-xl);
        }

        .page-title {
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          color: var(--color-text-primary);
          font-size: max(2rem,min(4vw,2.5rem));
        }
      `}</style>
    </>
  );
}