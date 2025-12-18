'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Question from '../../../components/Question';
import LoadingPage from '../../../components/LoadingPage';
import ErrorPage from '../../../components/ErrorPage';

export default function QuestionsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/story/${id}/questions`)
      .then(res => res.json())
      .then(data => {
        if (data.questions) {
          const questionsWithIndex = data.questions.map((q, idx) => ({ ...q, originalIndex: idx }));
          const shuffled = questionsWithIndex.sort(() => Math.random() - 0.5);
          const randomCount = Math.floor(Math.random() * 3) + 4;
          const selectedQuestions = [];
          const excludedIndices = new Set();
          for (let q of shuffled) {
            if (excludedIndices.has(q.originalIndex)) continue;
            selectedQuestions.push(q);
            if (q.incompatibleWith && Array.isArray(q.incompatibleWith)) {
              q.incompatibleWith.forEach(idx => excludedIndices.add(idx));
            }
            if (selectedQuestions.length >= randomCount) break;
          }
          setQuestions(selectedQuestions);
          setIsLoading(false);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleGenerateStory = async (answers) => {
    setIsGenerating(true);
    const res = await fetch(`/api/story/generate`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ storyId: id, answers })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('newStory', JSON.stringify(data));
      router.push(`/newstory`);
    } else {
      alert('故事生成失敗');
      setIsGenerating(false);
    }
  };

  if(isLoading) return <LoadingPage message="正在準備互動問題" />;

  if(isGenerating) return <LoadingPage message="正在改編新故事" />;

  if (!questions || questions.length === 0) return <ErrorPage title = '無法載入問題' buttonText = '返回故事' onButtonClick={() => router.push(`/story/${id}`)} />;

  return (
    <>
      {/* Header section */}
      <div className="header-section appear">
        <h1 className="page-title appear">
          <span className="title-icon">✨</span>
          你的創作，你的故事線
          <span className="title-icon">✨</span>
        </h1>
        <p className="page-subtitle appear">
          回答這些問題，讓你的故事更加特別
        </p>
      </div>

      {/* Question section */}
      <div className="question-section appear">
        <Question 
          questions={questions}
          onSubmit={handleGenerateStory}
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
          margin-bottom: var(--spacing-md);
        }
        
        @media (max-width: 768px) {
          .page-title {
            font-size: var(--text-4xl);
            gap: var(--spacing-sm);
          }
        }
        
        @media (max-width: 480px) {
          .page-title {
            font-size: var(--text-3xl);
          }
        }

        .title-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        @media (max-width: 768px) {
          .title-icon {
            font-size: 0.8em;
          }
        }

        .page-subtitle {
          color: var(--color-text-secondary);
          text-align: center;
          font-size: var(--text-lg);
          animation-delay: 0.15s;
        }
        
        @media (max-width: 768px) {
          .page-subtitle {
            font-size: var(--text-base);
          }
        }
        
        @media (max-width: 480px) {
          .page-subtitle {
            font-size: var(--text-sm);
          }
        }
      `}</style>
    </>
  );
}