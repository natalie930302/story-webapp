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

  if (!story) return <LoadingPage message="您的故事正在根據您的選擇進行編寫與塑造" />

  return (
    <>
      <div className="header-section">
        <h1 className="page-title">
          <span className="title-icon">🎬</span>
          你導演的新故事
          <span className="title-icon">🎬</span>
        </h1>
      </div>

      {/* Story player */}
      <StoryPlayer 
        paragraphs={story.segments} 
        onNext={() => router.push('/end')} 
        buttonText="故事結局"
      />

      <style jsx>{`
        .header-section {
          text-align: center;
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

        .title-icon {
          font-size: clamp(2rem, 4vw, 2.5rem);
          animation: floatIcon 3s ease-in-out infinite;
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
    </>
  );
}