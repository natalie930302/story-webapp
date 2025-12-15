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

  if(isLoadingQuestions) return <LoadingPage message="正在準備您的獨特提問" />;

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
          padding: 64px 0;
        }

        .empty-questions-content {
          text-align: center;
        }

        .empty-questions-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-questions-title {
          font-size: max(1.25rem,min(2.5vw,1.75rem));
          font-weight: 600;
          color: var(--color-starlight-cream);
          margin-bottom: 16px;
        }

        .back-button {
          padding: var(--spacing-sm) var(--spacing-lg);
          font-size: var(--text-lg);
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #e55b3c 0%, #d87885 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-top: 16px;
        }

        .back-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );

  if(isLoading) return <LoadingPage message="您的故事正在根據您的選擇進行編寫與塑造" />;

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
          回答這些問題，讓您的故事更加獨特與私人化
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
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          color: var(--color-text-primary);
          font-size: max(2rem,min(4vw,2.5rem));
          margin-bottom: var(--spacing-md);
        }

        .title-icon {
          font-size: clamp(2rem, 4vw, 2.5rem);
          animation: float 3s ease-in-out infinite;
        }

        .page-subtitle {
          color: var(--color-text-secondary);
          text-align: center;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          line-height: 1.75;
          font-weight: 500;
          animation-delay: 0.15s;
        }
      `}</style>
    </>
  );
}