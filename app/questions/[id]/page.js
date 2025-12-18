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
        // Store original questions with their indices
        const questionsWithIndex = data.questions.map((q, idx) => ({ ...q, originalIndex: idx }));
        
        // Shuffle and apply smart filtering
        const shuffled = questionsWithIndex.sort(() => Math.random() - 0.5);
        const randomCount = Math.floor(Math.random() * 3) + 4;
        
        // Select questions while avoiding incompatible pairs
        const selectedQuestions = [];
        const excludedIndices = new Set();
        
        for (let q of shuffled) {
          if (excludedIndices.has(q.originalIndex)) continue;
          
          selectedQuestions.push(q);
          
          // Mark incompatible questions as excluded
          if (q.incompatibleWith && Array.isArray(q.incompatibleWith)) {
            q.incompatibleWith.forEach(idx => excludedIndices.add(idx));
          }
          
          if (selectedQuestions.length >= randomCount) break;
        }
        
        setQuestions(selectedQuestions);
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

  if(isLoadingQuestions) return <LoadingPage message="正在準備互動問題" />;

  if(questions.length === 0) 
    return (
    <div className="empty-questions-container appear">
      <div className="empty-questions-content">
        <div className="empty-questions-icon">⚠️</div>
        <p className="empty-questions-title">無法載入提問</p>
        <button 
          onClick={() => router.push(`/story/${id}`)}
          className="back-button"
        >
          返回故事
        </button>
      </div>

      <style jsx>{`
        .empty-questions-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: var(--spacing-3xl) 0;
        }

        .empty-questions-content {
          text-align: center;
        }

        .empty-questions-icon {
          font-size: var(--text-5xl);
          margin-bottom: var(--spacing-md);
        }

        .empty-questions-title {
          font-size: var(--text-2xl);
          color: var(--color-starlight-cream);
          margin-bottom: var(--spacing-md);
        }

        .back-button {
          padding: var(--spacing-sm) var(--spacing-lg);
          font-size: var(--text-lg);
          color: var(--color-white);
          background: var(--gradient-secondary);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-lg);
          margin-top: var(--spacing-md);
        }

        .back-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );

  if(isLoading) return <LoadingPage message="正在改編新故事" />;

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
          key={currentIndex} 
          question={questions[currentIndex]} 
          onAnswer={handleAnswer} 
          isLastQuestion={currentIndex === questions.length - 1}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
        />
      </div>

      <style jsx>{`
        .header-section {
          margin-bottom: var(--spacing-xl);
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

        .title-icon {
          animation: float 3s ease-in-out infinite;
        }

        .page-subtitle {
          color: var(--color-text-secondary);
          text-align: center;
          font-size: var(--text-lg);
          animation-delay: 0.15s;
        }
      `}</style>
    </>
  );
}