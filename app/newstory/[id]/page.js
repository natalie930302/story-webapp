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
    <div className="p-4 pt-6 max-w-4xl mx-auto appear" style={{animationDelay: '0s'}}>
      <div style={{textAlign:'center', marginBottom:24}}
      >
        <span style={{display:'inline-block', background:'rgba(229,91,60,0.08)', color:'var(--hearth-glow)', fontWeight:800, padding:'10px 16px', borderRadius:16}}>🎬 你導演的新故事 🎬</span>
        <h1 style={{fontWeight:900, marginTop:18, color:'var(--muted-ink)'}}>{story.title}</h1>
      </div>

      {/* Story player */}
      <StoryPlayer 
        paragraphs={story.segments} 
        onNext={() => router.push('/end')} 
        buttonText="故事結局"
      />
    </div>
  )
}