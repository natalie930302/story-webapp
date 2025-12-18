'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import StoryPlayer from '../../../components/StoryPlayer';
import LoadingPage from '../../../components/LoadingPage';
import ErrorPage from '../../../components/ErrorPage';

export default function StoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/story/${id}`)
      .then(res => res.json())
      .then(data => data.segments && setStory(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <LoadingPage message="正在準備故事" />;

  if (!story) return <ErrorPage title = '無法載入故事' buttonText = '返回首頁' onButtonClick={() => router.push('/')} />;

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
        
        @media (max-width: 768px) {
          .header-section {
            margin-bottom: var(--spacing-lg);
            text-align: center;
          }
        }

        .page-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          color: var(--color-text-primary);
          font-size: var(--text-5xl);
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: var(--text-4xl);
          }
        }
        
        @media (max-width: 480px) {
          .page-title {
            font-size: var(--text-3xl);
          }
        }
      `}</style>
    </>
  );
}