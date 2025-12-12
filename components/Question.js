'use client';
import React, { useState } from 'react';

export default function Question({ question, onAnswer, isLastQuestion }) {
  const [answer, setAnswer] = useState('');
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleSubmit = (e) => {
    if(e) e.preventDefault();
    if(answer) onAnswer(answer);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Question display */}
      <div className="text-center">
        <p 
          className="question-quote" 
          style={{
            animation: 'fadeInUp 0.6s ease-out'
          }}
        >
          <span className="quote-mark">「</span>
          {question.text}
          <span className="quote-mark">」</span>
        </p>
      </div>

      {/* Options display */}
      {question.options && question.options.length > 0 ? (
        <div 
          style={{
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            gap: 12,
            animation: 'fadeInUp 0.7s ease-out'
          }}
        >
          {question.options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => onAnswer(opt)}
              onMouseEnter={() => setHoveredOption(i)}
              onMouseLeave={() => setHoveredOption(null)}
              className="option-button"
              aria-pressed={answer === opt}
              style={{
                animation: `bounce-in 0.5s var(--transition-spring) forwards`,
                animationDelay: `${i * 0.1}s`
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        /* Text input for free-form questions */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div style={{position: 'relative'}}>
            <textarea
              placeholder="輸入回答"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              required
              rows="4"
              className="question-textarea w-full resize-none"
              style={{
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#913d40';
                e.target.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.05), 0 0 0 4px rgba(145, 61, 64, 0.15), 0 0 16px rgba(212, 175, 55, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                e.target.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.05)';
              }}
            />
            <span className="visually-hidden">{answer.length} 字</span>
          </div>

          {/* Submit button */}
          <div className="flex justify-center">
            <button 
              type="submit"
              className="option-button"
              disabled={!answer.trim()}
              style={{
                width: '100%',
                maxWidth: '300px',
              }}
              onMouseEnter={(e) => {
                if (answer.trim()) {
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {isLastQuestion ? '🎉' : '▶️'}
              <span style={{marginLeft: '6px'}}>{isLastQuestion ? '完成' : '下一題'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Submit button for options */}
      {question.options && question.options.length > 0 && answer && (
        <div className="flex justify-center" >
          <button 
            onClick={() => onAnswer(answer)}
            className="option-button"
            style={{
              minWidth: '180px',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
            >{isLastQuestion ? '完成' : '下一題'}</button>
        </div>
      )}
    </div>
  );
}