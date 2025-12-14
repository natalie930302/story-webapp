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

  if (!story) return <LoadingPage message="正在為您加載最終故事內容..." />

  return (
    <>
      <div className="header-section">
        <span className="story-badge">🎬 你導演的新故事 🎬</span>
        <h1 className="story-title">{story.title}</h1>
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
          margin-bottom: 24px;
        }

        .story-badge {
          display: inline-block;
          padding: 8px 20px;
          border-radius: 999px;
          background: rgba(139, 64, 73, 0.12);
          color: var(--color-brick-red);
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .story-title {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 900;
          margin-top: 16px;
          color: var(--color-text-dark);
          text-shadow: 0 0 20px var(--color-gold-glow);
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
    </>
  )
}