'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import StoryPlayer from '../../../components/StoryPlayer'
import LoadingPage from '../../../components/LoadingPage'

export default function NewStoryPage() {
  const router = useRouter()
  const [story, setStory] = useState(null)

  useEffect(() => {
    const start = Date.now();
    const stored = localStorage.getItem('newStory')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        const elapsed = Date.now() - start
        const wait = Math.max(0, 2000 - elapsed)
        if (wait > 0) {
          setTimeout(() => setStory(data), wait)
        } else {
          setStory(data)
        }
      } catch (err) {
        console.error('parse error', err)
      }
    }
  }, [])

  if (!story) return <LoadingPage message="正在改編新故事" />

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