'use client';
import React, { useState } from 'react';

export default function Question({ questions, onSubmit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      onSubmit(newAnswers);
    }
  };

  return (
    <>
      <div className="question-container appear">
        {/* Visual step indicators */}
        {totalQuestions > 1 && (
          <div className="step-indicators appear">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const isCompleted = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isPending = idx > currentIndex;
              return (
                <div
                  key={idx}
                  className={`step-indicator ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}`}
                >
                  {isCompleted && <div className="checkmark">✓</div>}
                  {isCurrent && (
                    <>
                      <div className="pulse-ring pulse-ring-1" />
                      <div className="pulse-ring pulse-ring-2" />
                    </>
                  )}
                  {!isCompleted && (idx + 1)}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Question display */}
        <div className="question-wrapper">
          <div className="question-box">
            <div className="shimmer-effect" />
            <p className="question-text">
              <span className="quote">「</span>
              {currentQuestion.text}
              <span className="quote">」</span>
            </p>
          </div>
        </div>

        {/* Options display */}
        {currentQuestion.options?.length > 0 && (
          <div className="options-grid">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              
              return (
                <button 
                  key={i} 
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedOption(i);
                    setTimeout(() => handleAnswer(opt), 400);
                  }}
                  aria-pressed={isSelected}
                >
                  {isSelected && <span className="option-checkmark">✓</span>}
                  <span className="option-text">{opt}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
        
      <style jsx>{`
        .question-container {
          width: 100%;
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }
        
        @media (max-width: 768px) {
          .question-container {
            padding: var(--spacing-sm);
            gap: var(--spacing-lg);
          }
        }

        /* Step Indicators */
        .step-indicators {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
          animation-delay: 0.1s;
        }
        
        @media (max-width: 768px) {
          .step-indicators {
            gap: var(--spacing-sm);
          }
        }

        .step-indicator {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-smooth);
          position: relative;
          font-weight: 700;
          text-shadow: var(--shadow-md);
        }
        
        @media (max-width: 768px) {
          .step-indicator {
            width: 40px;
            height: 40px;
            font-size: var(--text-sm);
          }
        }
        
        @media (max-width: 480px) {
          .step-indicator {
            width: 36px;
            height: 36px;
            font-size: var(--text-sm);
          }
        }

        .step-indicator.completed,
        .step-indicator.current {
          background: var(--gradient-primary);
          color: var(--color-text-secondary);
          box-shadow: 0 8px 20px var(--color-gold-glow), var(--shadow-md);
        }

        .step-indicator.pending {
          background: var(--gradient-tertiary);
          color: var(--color-text-muted);
          box-shadow: var(--shadow-sm);
          border: 2px solid var(--color-border-light);
          transform: scale(1);
          cursor: default;
        }

        .step-indicator.current {
          border: 3px solid var(--color-gold);
          transform: scale(1.25);
          animation: glow 2s ease-in-out infinite;
        }

        .step-indicator.completed {
          border: 2.5px solid var(--color-gold-dark);
          transform: scale(1.05);
          cursor: pointer;
        }

        .checkmark {
          position: absolute;
          font-size: var(--text-lg);
          color: var(--color-text-secondary);
        }

        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid var(--color-gold);
          animation: pulseRingExpand 2s ease-out infinite;
        }

        .pulse-ring-2 {
          border: 2px solid var(--color-gold-light);
          animation-delay: 0.5s;
        }

        /* Question Display */
        .question-wrapper {
          text-align: center;
          padding: 0 var(--spacing-md);
        }
        
        @media (max-width: 768px) {
          .question-wrapper {
            padding: 0 var(--spacing-sm);
          }
        }

        .question-box {
          padding: var(--spacing-2xl) var(--spacing-3xl);
          background: var(--gradient-tertiary);
          border-radius: var(--radius-lg);
          max-width: 820px;
          margin: 0 auto;
          border: 2px solid var(--color-border-primary);
          box-shadow: var(--shadow-2xl), var(--shadow-glow-strong);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(16px);
          transition: all var(--transition-smooth);
        }
        
        @media (max-width: 768px) {
          .question-box {
            padding: var(--spacing-xl) var(--spacing-lg);
            border-radius: var(--radius-md);
          }
        }
        
        @media (max-width: 480px) {
          .question-box {
            padding: var(--spacing-lg) var(--spacing-md);
          }
        }

        .shimmer-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #ffffff00 0%, #ffffff12 50%, #ffffff00 100%)
          animation: shimmer-slide 3s ease-in-out infinite;
        }

        .question-text {
          font-size: var(--text-2xl);
          color: var(--color-text-primary);
          position: relative;
          z-index: 1;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .question-text {
            font-size: var(--text-xl);
            line-height: 1.5;
          }
        }
        
        @media (max-width: 480px) {
          .question-text {
            font-size: var(--text-lg);
          }
        }

        .quote {
          font-size: var(--text-2xl);
          color: var(--color-gold-light);
        }
        
        @media (max-width: 768px) {
          .quote {
            font-size: var(--text-xl);
          }
        }
        
        @media (max-width: 480px) {
          .quote {
            font-size: var(--text-lg);
          }
        }

        /* Options Grid */
        .options-grid {
          padding: 0 var(--spacing-lg);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-xl);
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }
        
        @media (max-width: 768px) {
          .options-grid {
            padding: 0 var(--spacing-sm);
            gap: var(--spacing-md);
            grid-template-columns: 1fr;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .options-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }

        .option-button {
          padding: var(--spacing-lg);
          font-size: var(--text-xl);
          border-radius: var(--radius-lg);
          background: var(--color-starlight-cream);
          color: var(--color-text-dark);
          border: 2px solid var(--color-border-light);
          box-shadow: var(--shadow-md);
          transition: all var(--transition-smooth);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(12px);
          cursor: pointer;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(0) scale(1);
          outline: none;
          text-align: center;
          line-height: 1.4;
        }
        
        @media (max-width: 768px) {
          .option-button {
            padding: var(--spacing-md);
            font-size: var(--text-lg);
            min-height: 64px;
            border-radius: var(--radius-md);
          }
        }
        
        @media (max-width: 480px) {
          .option-button {
            padding: var(--spacing-sm) var(--spacing-md);
            font-size: var(--text-base);
            min-height: 56px;
          }
        }

        .option-button:hover:not(.selected) {
          color: var(--color-text-primary);
          background: var(--gradient-secondary);
          border: 2px solid var(--color-gold);
          box-shadow: var(--shadow-xl), var(--shadow-glow);
          transform: translateY(-5px) scale(1.02);
        }

        .option-button:active:not(.selected) {
          transform: translateY(-2px) scale(0.98);
        }

        .option-button.selected {
          background: var(--gradient-secondary);
          color: var(--color-text-primary);
          border: 2px solid var(--color-gold);
          box-shadow: var(--shadow-2xl), var(--shadow-glow-strong);
          transform: translateY(-8px) scale(1.04);
        }

        .option-checkmark {
          position: absolute;
          bottom: var(--spacing-xs);
          right: var(--spacing-md);
          font-size: var(--text-3xl);
          color: var(--color-gold-light);
          animation: checkmark-appear 0.3s ease-out;
        }

        .option-text {
          position: relative;
          z-index: 1;
        }

        /* Animations */
        @keyframes shimmer-slide {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes checkmark-appear {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulseRingExpand {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
