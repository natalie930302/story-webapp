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
      <div className="centered-view appear">
        <div className="text-center">
          <div className="icon-xl loading-illustration animate-float" style={{ marginBottom: 16 }}>📖</div>
          <p className="module-name" style={{ color: 'var(--brick-red)', fontWeight: 600 }}>正在準備您的故事...</p>
          <p className="lead" style={{ marginTop: 8 }}>這是你獨特的故事時刻</p>
        </div>
      </div>
    );

  if (!story)
    return (
      <div className="centered-view appear">
        <div className="text-center">
          <div className="icon-xl" style={{ marginBottom: 16 }}>❌</div>
          <p className="module-name" style={{ fontWeight: 600, color: 'var(--deep-wood)' }}>故事載入失敗</p>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => router.push('/')} className="btn-primary">
              返回首頁
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-4 pt-6 max-w-4xl mx-auto animate-fade-in-up">
      {/* Header section */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title appear" style={{ animationDelay: '0.1s' }}>
          {story.title}
        </h1>
      </div>
      
      {/* Story player */}
      <StoryPlayer 
        paragraphs={story.segments} 
        onNext={() => router.push(`/questions/${id}`)} 
        buttonText="開始互動問卷"
      />

      {/* Next section hint */}
      <div className="hint-panel appear" style={{ animationDelay: '0.3s' }}>
        <p className="module-name" style={{ fontWeight: 600, marginBottom: 8 }}>
          💭 當你準備好時，按下「開始互動問卷」進入下一個環節
        </p>
        <p className="lead">你的回答將幫助生成屬於你的獨特故事結局</p>
      </div>
    </div>
  );
}