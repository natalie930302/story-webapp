'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StoryPlayer from '../../components/StoryPlayer';
import LoadingPage from '../../components/LoadingPage';
import ErrorPage from '../../components/ErrorPage';

export default function NewStoryPage() {
  const router = useRouter();
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem('newStory'));
      if (data && data.segments) setStory(data);
    } catch (error) {
      console.log('Failed to load new story from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, [])

  if (isLoading) return <LoadingPage message="正在改編新故事" />;

  if (!story) return <ErrorPage title = '無法載入故事' buttonText = '返回首頁' onButtonClick={() => router.push('/')} />;

  return (
    <>
      {/* Header section */}
      <div className="header-section appear">
        <h1 className="page-title appear">
          <span className="title-icon">🎬</span>
          你導演的新故事
          <span className="title-icon">🎬</span>
        </h1>
      </div>

      {/* Story player section */}
      <div className="story-player-section appear">
        <StoryPlayer 
          segments={story.segments} 
          onNext={() => router.push('/end')} 
          buttonText="故事結局"
        />
      </div>

      <style jsx>{`
        .header-section {
          text-align: center;
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

        .title-icon {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}