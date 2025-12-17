'use client';
import React, { useState } from 'react';

export default function Question({ question, onAnswer, isLastQuestion, currentIndex, totalQuestions }) {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = (e) => {
    if(e) e.preventDefault();
    if(answer) onAnswer(answer);
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
              {question.text}
              <span className="quote">」</span>
            </p>
          </div>
        </div>

        {/* Options display */}
        {question.options && question.options.length > 0 ? (
          <div className="options-grid">
            {question.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              
              return (
                <button 
                  key={i} 
                  className={`option-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedOption(i);
                    setAnswer(opt);
                    setTimeout(() => onAnswer(opt), 400);
                  }}
                  aria-pressed={isSelected}
                >
                  {isSelected && <span className="option-checkmark">✓</span>}
                  <div className="option-shimmer" />
                  <span className="option-text">{opt}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="answer-form">
            <div className="textarea-wrapper">
              <textarea
                className="answer-textarea"
                placeholder="在此輸入您的回答..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                required
                rows="5"
              />
            </div>

            {/* Submit button */}
            <div className="submit-wrapper">
              <button 
                type="submit"
                disabled={!answer.trim()}
                className={`submit-button ${answer.trim() ? 'enabled' : 'disabled'}`}
              >
                <span className="submit-icon">{isLastQuestion ? '🎉' : '▶️'}</span>
                <span>{isLastQuestion ? '完成回答' : '繼續下一題'}</span>
              </button>
            </div>
          </form>
        )}
        
        <style jsx>{`
          .question-container {
            width: 100%;
            padding: var(--spacing-md);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-2xl);
          }

          /* Step Indicators */
          .step-indicators {
            display: flex;
            gap: var(--spacing-sm);
            justify-content: center;
            flex-wrap: wrap;
            animation-delay: 0.1s;
          }

          .step-indicator {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            fontSize: 18px;
            font-weight: 700;
            transition: all var(--transition-smooth);
            position: relative;
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

          .step-indicator.pending {
            border: 2px solid var(--color-border-light);
            transform: scale(1);
            cursor: default;
          }

          .checkmark {
            position: absolute;
            font-size: 24px;
            color: #fff;
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

          .question-box {
            padding: var(--spacing-2xl);
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

          .shimmer-effect {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
            animation: shimmer-slide 3s ease-in-out infinite;
          }

          .question-text {
            font-size: clamp(1.25rem, 2.5vw, 1.75rem);
            margin: 0;
            font-weight: 500;
            color: var(--color-text-primary);
            position: relative;
            z-index: 1;
          }

          .quote {
            font-size: 28px;
            color: var(--color-gold-light);
            font-weight: 700;
          }

          /* Options Grid */
          .options-grid {
            padding: 0 var(--spacing-lg);
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--spacing-md);
            max-width: 900px;
            margin: 0 auto;
            width: 100%;
          }

          .option-button {
            padding: var(--spacing-lg);
            font-size: clamp(0.9rem, 1.8vw, 1.1rem);
            font-weight: 600;
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
            bottom: 5px;
            right: 15px;
            font-size: 30px;
            color: var(--color-gold-light);
            animation: checkmark-appear 0.3s ease-out;
          }

          .option-shimmer {
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .option-button:hover:not(.selected) .option-shimmer {
            opacity: 1;
            animation: shimmer 2s ease-in-out infinite;
          }

          .option-button.selected .option-shimmer {
            opacity: 1;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
            animation: shimmer 3s ease-in-out infinite;
          }

          .option-text {
            position: relative;
            z-index: 1;
          }

          /* Form */
          .answer-form {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-xl);
          }

          .textarea-wrapper {
            padding: 0 var(--spacing-lg);
            position: relative;
            max-width: 820px;
            margin: 0 auto;
            width: 100%;
          }

          .answer-textarea {
            padding: var(--spacing-lg);
            width: 100%;
            resize: none;
            font-size: clamp(0.9rem, 1.8vw, 1.1rem);
            border-radius: var(--radius-lg);
            min-height: 200px;
            border: 2px solid var(--color-border-light);
            background: linear-gradient(135deg, var(--color-starlight-cream) 0%, var(--color-starlight-medium) 100%);
            backdrop-filter: blur(12px);
            box-shadow: var(--shadow-md);
            transition: all var(--transition-smooth);
            color: var(--color-text-dark);
            outline: none;
            transform: scale(1);
          }

          .answer-textarea:focus {
            border: 2px solid var(--color-gold);
            box-shadow: 0 0 0 3px var(--color-gold-glow), var(--shadow-lg);
            transform: scale(1.015);
          }

          .answer-textarea::placeholder {
            color: var(--color-brown-cream);
            opacity: 0.6;
            transition: opacity 0.3s ease;
          }

          .answer-textarea:focus::placeholder {
            opacity: 0.4;
          }

          /* Submit Button */
          .submit-wrapper {
            display: flex;
            justify-content: center;
            padding: 0 var(--spacing-lg);
          }

          .submit-button {
            padding: 20px 56px;
            width: 100%;
            max-width: 420px;
            font-size: clamp(1rem, 2vw, 1.25rem);
            font-weight: 700;
            border-radius: var(--radius-xl);
            transition: all var(--transition-smooth);
            position: relative;
            overflow: hidden;
            letter-spacing: normal;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-xs);
            outline: none;
          }

          .submit-button.enabled {
            background: var(--gradient-secondary);
            color: var(--color-text-primary);
            border: 2px solid var(--color-gold);
            box-shadow: var(--shadow-2xl), var(--shadow-glow);
            cursor: pointer;
          }

          .submit-button.enabled:hover {
            transform: translateY(-6px) scale(1.05);
            box-shadow: var(--shadow-2xl), var(--shadow-glow-strong), 0 0 0 6px var(--color-gold-glow);
          }

          .submit-button.enabled:active {
            transform: translateY(-3px) scale(1.02);
            box-shadow: var(--shadow-xl), var(--shadow-glow);
          }

          .submit-button.disabled {
            background: var(--gradient-tertiary);
            color: var(--color-text-muted);
            border: 2px solid var(--color-border-lighter);
            box-shadow: var(--shadow-sm);
            cursor: not-allowed;
            opacity: 0.65;
          }

          .submit-icon {
            font-size: 48px;
            transition: transform 0.3s ease;
          }

          .submit-button.enabled:hover .submit-icon {
            transform: scale(1.15) rotate(5deg);
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
      </div>
    </>
  );
}
