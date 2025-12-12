'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Question from '../../../components/Question';
import LoadingPage from '../../../components/LoadingPage'; 

export default function QuestionsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
    if(!id) return;
    setIsLoadingQuestions(true);
    fetch(`/api/story/${id}/questions`)
      .then(res => res.json())
      .then(data => {
        const shuffled = data.modificationQuestions.sort(() => Math.random() - 0.5);
        const randomCount = Math.floor(Math.random() * 3) + 4; 
        setQuestions(shuffled.slice(0, randomCount));
        setIsLoadingQuestions(false);
      })
      .catch(() => setIsLoadingQuestions(false));
  }, [id]);

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if(currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsLoading(true);
      const startAt = Date.now();

      const res = await fetch(`/api/story/generate`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ storyId: id, answers: newAnswers })
      });

      const elapsed = Date.now() - startAt;
      if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('newStory', JSON.stringify(data));
        router.push(`/newstory/${id}`);
      } else {
        alert('故事生成失敗');
        setIsLoading(false);
      }
    }
  };

  if(isLoadingQuestions) return (
    <div className="flex justify-center items-center h-full py-16 appear" style={{animationDelay: '0s'}}>
      <div style={{textAlign: 'center'}}>
        <div className="icon-xl" style={{ marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>❓</div>
        <p style={{fontWeight: 600, color: 'var(--brick-red)'}}>正在準備您的獨特提問...</p>
        <p style={{ color: 'rgba(59,50,43,0.6)', marginTop: 8}}>每個問題都是打造你故事的機會</p>
      </div>
    </div>
  );

  if(questions.length === 0) return (
    <div className="flex justify-center items-center h-full py-16 appear" style={{animationDelay: '0s'}}>
      <div style={{textAlign: 'center'}}>
        <div className="icon-xl" style={{ marginBottom: 16 }}>⚠️</div>
        <p style={{fontWeight: 600, color: 'var(--deep-wood)'}}>無法載入提問</p>
        <button 
          onClick={() => router.push(`/story/${id}`)}
          style={{
            marginTop: 16,
            padding: '10px 20px',
            background: 'linear-gradient(135deg, var(--hearth-glow), var(--brick-red))',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          返回故事
        </button>
      </div>
    </div>
  );

  if(isLoading) return <LoadingPage message="您的故事正在根據您的選擇進行編寫與塑造" />;

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="p-4 max-w-3xl mx-auto pt-4 animate-fade-in-up" style={{animation: 'fadeInUp 0.6s ease-out'}}>
      {/* Header */}
      <div style={{marginBottom: 28, animation: 'fadeInUp 0.6s ease-out'}}>
        <h1 
          style={{
            fontWeight: 900,
            marginBottom: 12,
            color: 'var(--muted-ink)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12
          }}
        >
          <span className="icon-md">✨</span>
          你的創作，你的故事線
        </h1>
        <p 
          style={{
            color: 'rgba(59,50,43,0.6)',
            textAlign: 'center'
          }}
        >
          每個回答都會塑造你的獨特故事結局
        </p>
      </div>
      
      {/* Progress section */}
      <div 
        style={{
          marginBottom: 28, 
          padding: 20, 
          background: 'linear-gradient(135deg, rgba(255,250,246,0.95), rgba(247,243,240,0.9))',
          borderRadius: 24, 
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)', 
          border: '2px solid rgba(214,168,87,0.15)',
          animation: 'fadeInUp 0.6s ease-out'
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
          <span style={{ fontWeight: 700, color: 'var(--muted-ink)'}}>
            <span style={{color: 'var(--brick-red)', fontWeight: 900}}>第 {currentIndex + 1} 題</span>
            {' '} / 共 {questions.length} 題
          </span>
          <span style={{ fontWeight: 700, color: 'var(--hearth-glow)', background: 'rgba(229,91,60,0.1)', padding: '4px 10px', borderRadius: 12}}>
            {Math.round(progressPercentage)}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{width: '100%', background: 'rgba(90,31,26,0.08)', height: 8, borderRadius: 999, overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.04)'}}>
          <div 
            style={{
              width: `${progressPercentage}%`,
              height: 8,
              borderRadius: 999,
              background: 'linear-gradient(90deg, var(--hearth-glow), var(--brick-red))',
              transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 0 16px rgba(229,91,60,0.3)'
            }}
          />
        </div>

        {/* Visual step indicators */}
        <div style={{display: 'flex', gap: 6, marginTop: 16, justifyContent: 'center'}}>
          {questions.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: idx <= currentIndex 
                  ? 'linear-gradient(135deg, var(--hearth-glow), var(--brick-red))'
                  : 'rgba(90,31,26,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: idx <= currentIndex ? 'white' : 'rgba(59,50,43,0.5)',
                fontWeight: 700,
                transition: 'all 0.3s ease',
                boxShadow: idx <= currentIndex ? '0 4px 12px rgba(229,91,60,0.25)' : 'none',
                transform: idx === currentIndex ? 'scale(1.1)' : 'scale(1)',
                animation: idx === currentIndex ? 'glow-pulse 1.5s ease-in-out infinite' : 'none'
              }}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Question panel */}
      <div className="reader-panel">
        <Question 
          key={currentIndex} 
          question={questions[currentIndex]} 
          onAnswer={handleAnswer} 
          isLastQuestion={currentIndex === questions.length - 1}
        />
      </div>

      {/* Tips section */}
      <div 
        style={{
          marginTop: 24,
          padding: 16,
          background: 'linear-gradient(135deg, rgba(214,168,87,0.08), rgba(229,91,60,0.04))',
          borderLeft: '4px solid var(--golden)',
          borderRadius: 16,
          color: 'rgba(59,50,43,0.7)',
          animation: 'fadeInUp 0.7s ease-out 0.2s both'
        }}
      >
        <span style={{fontWeight: 700, color: 'var(--brick-red)'}}>💡 提示：</span> 你的每個回答都很重要，它們將直接影響故事的結局。盡情表達你的想法吧！
      </div>
    </div>
  );
}