'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const SENTENCE_SPLIT_REGEX = /([。？！.?!；;，\r\n\uFE30-\uFFA0()（）「」]+)/g;

const moduleConfig = {
  wind: { 
    name: '風扇模組', 
    description: '感受涼涼的風吹過來，好像在奔跑一樣！', 
    icon: '🌬️',
    color: 'var(--color-neon-teal)'
  },
  heat: { 
    name: '熱燈模組', 
    description: '感受溫暖的陽光照在身上，好舒服喔！', 
    icon: '🔆',
    color: 'var(--color-gold)'
  },
  vibration: { 
    name: '震動馬達模組', 
    description: '感受震動的感覺，像是心臟跳動或車子行駛！', 
    icon: '⚙️',
    color: 'var(--color-neon-purple)'
  },
  recording: { 
    name: '錄音模組', 
    description: '錄下你的聲音，讓故事變得更特別！', 
    icon: '🎙️',
    color: 'var(--color-neon-pink)'
  },
};

export default function StoryPlayer({ segments, onNext, buttonText = "下一段" }) {
  const [index, setIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentTextIndex, setCurrentTextIndex] = useState(-1); 
  const [slideDirection, setSlideDirection] = useState('forward');

  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);

  const currentSegment = segments[index];
  const currentText = currentSegment?.text || '';
  const currentTextArray = useMemo(() => 
    currentText.split(SENTENCE_SPLIT_REGEX).filter(s => s.trim().length > 0),
    [currentText]
  );
  const currentModuleHints = currentSegment?.moduleHints;

  const stopAudio = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (utteranceRef.current) {
      utteranceRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTextIndex(-1);
  }, []);

  const playAudio = useCallback((text) => {
    const synth = synthRef.current;
    if (!synth || !text) return;
    
    stopAudio();

    let charOffset = 0;
    const segmentOffsets = currentTextArray.map(segment => {
      const start = charOffset;
      charOffset += segment.length;
      return { start, length: segment.length };
    });
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utteranceRef.current = utterance;
    
    utterance.onboundary = (event) => {
      const absCharIndex = event.charIndex;
      
      let left = 0;
      let right = segmentOffsets.length - 1;
      
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const seg = segmentOffsets[mid];
        
        if (absCharIndex >= seg.start && absCharIndex < seg.start + seg.length) {
          setCurrentTextIndex(mid);
          break;
        } else if (absCharIndex < seg.start) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
    };
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentTextIndex(0);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTextIndex(-1);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentTextIndex(-1);
      utteranceRef.current = null;
    };

    synth.speak(utterance);
  }, [currentTextArray, stopAudio]);

  useEffect(() => {
    stopAudio();
  }, [index, stopAudio]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const handlePrevious = () => {
    if (index > 0) {
      setSlideDirection('backward');
      stopAudio();
      setIndex(index - 1);
    }
  };

  const handleNext = () => {
    stopAudio();
    if (index < segments.length - 1) {
      setSlideDirection('forward');
      setIndex(index + 1);
    } else {
      onNext();
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio(currentText);
    }
  };

  return (
    <>
    <div className="player-container">
      <div className="player-header">
        <div className="header-container">
          <div className="header-icon">🎧</div>
          <h2 className="header-title">故事閱讀器</h2>
        </div>
        <div className="progress-info">
          <span className="progress-label">第 {index + 1} 段</span>
          <span className="progress-divider">/</span>
          <span className="progress-total">共 {segments.length} 段</span>
        </div>
      </div>

      <div
        className={`text-card ${slideDirection === 'forward' ? 'slide-forward' : 'slide-backward'}`}
        key={index}
      >
        <div className="notebook-lines"></div>
        <div className="quote-mark quote-left">"</div>
        <div className="quote-mark quote-right">"</div>
        
        {currentModuleHints && currentModuleHints.length > 0 && (
          <div className="modules-floating">
            <div className="modules-list">
              {currentModuleHints.map((hintItem, idx) => {
                let moduleKey = "";
                let actionText = "";

                if (typeof hintItem === 'string') {
                    moduleKey = hintItem;
                } else if (typeof hintItem === 'object' && hintItem !== null) {
                    moduleKey = hintItem.module;
                    actionText = hintItem.action;
                }

                const config = moduleConfig[moduleKey];
                if (!config) return null;
                return (
                  <div 
                    key={`${moduleKey}-${idx}`}
                    className="module-card"
                    style={{ 
                      '--module-color': config.color,
                      '--border-color': config.color
                    }}
                  >
                    <div className="module-icon-wrapper">
                        <span className="module-emoji">{config.icon}</span>
                    </div>
                    <div className="module-info">
                        <span className="module-name">{config.name}</span>
                        {actionText && (
                            <span className="module-action">{actionText}</span>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="text-content">
          {currentTextArray.length === 0 ? (
            <p className="empty-text">等待故事內容...</p>
          ) : (
            currentTextArray.map((segment, i) => {
              return (
                <span key={i} className={i === currentTextIndex ? 'text-segment highlighted' : 'text-segment'}>
                  {segment}
                </span>
              );
            })
          )}
        </div>
      </div>

      <div className="progress-track">
        <div 
          className="progress-bar"
          style={{ width: `${((index + 1) / segments.length) * 100}%` }}
        >
        </div>
        <div className="progress-shine" />
      </div>

      <div className="controls-card">
        <button 
          onClick={handlePrevious} 
          disabled={index === 0}
          className={`control-btn btn-nav btn-prev ${index === 0 ? 'disabled' : ''}`}
        >
          <svg className="btn-icon" width="15" height="15" viewBox="6 4 12 16" fill="none">
            <path 
              d="M15 18l-6-6 6-6" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="btn-text">上一段</span>
        </button>

        <button 
          onClick={togglePlay}
          className={`control-btn btn-play ${isPlaying ? 'playing' : ''}`}
        >
          {isPlaying ? (
            <svg className="play-icon" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="2"/>
              <rect x="14" y="4" width="4" height="16" rx="2"/>
            </svg>
          ) : (
            <svg className="play-icon" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <button 
          onClick={handleNext}
          className="control-btn btn-nav btn-next"
        >
          <span className="btn-text">{index < segments.length - 1 ? '下一段' : (buttonText || '故事結束')}</span>
          <svg className="btn-icon" width="15" height="15" viewBox="6 4 12 16" fill="none">
            <path 
              d="M9 6l6 6-6 6" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <style jsx>{`
      .player-container {
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
      }

      .player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-lg);
        background: var(--gradient-dark);
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        box-shadow: var(--shadow-sm);
      }

      .header-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .header-icon {
        width: 48px;
        height: 48px;
        background: var(--gradient-primary);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-glow);
        font-size: var(--text-3xl);
        animation: iconFloat 3s ease-in-out infinite;
      }

      @keyframes iconFloat {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-2px);
        }
      }

      .header-title {
        font-size: var(--text-2xl);
        color: var(--color-starlight-cream);
        margin: 0;
      }
      
      .progress-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: var(--text-base);
        color: var(--color-starlight-cream);
      }

      .progress-divider {
        color: var(--color-starlight-medium);
      }

      .text-card {
        position: relative;
        padding: var(--spacing-2xl) var(--spacing-3xl);
        background: var(--color-starlight-cream);
        min-height: 290px;
        display: flex;
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .notebook-lines {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: 
          repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 44px,
            var(--color-starlight-dark) 44px,
            var(--color-starlight-dark) 45px
          );
        pointer-events: none;
        opacity: 0.25;
      }

      .quote-mark {
        position: absolute;
        font-family: BIZ UDPMincho, serif;
        font-size: var(--text-7xl);
        color: var(--color-text-brown);
        opacity: 0.18;
        user-select: none;
        pointer-events: none;
      }

      .quote-left {
        top: var(--spacing-md);
        left: var(--spacing-lg);
      }

      .quote-right {
        bottom: var(--spacing-md);
        right: var(--spacing-lg);
        transform: rotate(180deg);
      }

      .text-card.slide-forward {
        animation: slideInRight 0.5s ease-out;
      }

      .text-card.slide-backward {
        animation: slideInLeft 0.5s ease-out;
      }

      .text-content {
        font-size: var(--text-2xl);
        line-height: 1.8;
        color: var(--color-text-dark);
        position: relative;
        z-index: 1;
        width: 100%;
      }

      .empty-text {
        color: var(--color-text-brown);
        font-size: var(--text-lg);
        text-align: center;
        padding: var(--spacing-3xl) 0;
        opacity: 0.5;
      }

      .text-segment {
        transition: all 0.3s ease;
        color: var(--color-text-dark);
      }

      .text-segment.highlighted {
        color: var(--color-gold);
        text-shadow: 0 0 12px var(--color-gold-glow);
        animation: textGlow 1.5s ease-in-out infinite;
      }

      .modules-floating {
        position: absolute;
        bottom: var(--spacing-lg);
        right: var(--spacing-lg);
        z-index: 10;
        animation: floatIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        width: auto;
        max-width: 400px;
        transform-origin: bottom right;
        pointer-events: none;
      }

      .modules-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: flex-end;
      }

      .module-card {
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(12px);
        border-radius: 16px;
        box-shadow: 
          0 4px 20px -4px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.8) inset;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        width: fit-content;
        max-width: 100%;
      }
      
      .module-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 5px;
        background: var(--module-color);
        opacity: 1;
      }

      .module-card:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 32px -8px rgba(0,0,0,0.15);
        background: #fff;
      }

      .module-icon-wrapper {
        font-size: var(--text-xl);
        width: 36px;
        height: 36px;
        background: color-mix(in srgb, var(--module-color) 12%, transparent);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .module-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        flex: 1;
      }

      .module-name {
        font-size: var(--text-sm);
        color: var(--color-text-dark);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
      }

      .module-action {
        font-size: var(--text-sm);
        color: var(--color-text-dark);
        opacity: 0.8;
      }

      .progress-track {
        position: relative;
        width: 100%;
        height: 8px;
        background: var(--color-night-light);
        overflow: hidden;
      }

      .progress-bar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: var(--gradient-primary);
        border-radius: 0 var(--radius-full) var(--radius-full) 0;
        transition: width var(--transition-smooth);
      }

      .progress-shine {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent 0%, 
          var(--color-gold-light) 50%, 
          transparent 100%);
        opacity: 0.6;
        animation: progressShine 2s ease-in-out infinite;
      }

      .controls-card {
        background: var(--gradient-sidebar);
        border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-lg);
        position: relative;
      }

      .btn-play {
        width: 72px;
        height: 72px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--gradient-primary);
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        transition: all var(--transition-smooth);
        box-shadow: var(--shadow-glow);
        position: relative;
        z-index: 2;
      }

      .btn-play.playing {
        background: var(--gradient-secondary);
        box-shadow: var(--shadow-glow);
        animation: playingPulse 2s ease-in-out infinite;
      }

      @keyframes playingPulse {
        0%, 100% {
          box-shadow: var(--shadow-glow);
        }
        50% {
          box-shadow: var(--shadow-glow-strong);
        }
      }

      .btn-play:hover {
        transform: scale(1.06);
        box-shadow: var(--shadow-glow-strong);
      }

      .btn-play:active {
        transform: scale(0.95);
      }

      .play-icon {
        filter: drop-shadow(var(--shadow-sm));
        color: var(--color-starlight-cream);
      }

      .btn-nav {
        padding: var(--spacing-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
        background: var(--color-starlight-cream);
        border: 2px solid var(--color-border-light);
        border-radius: 26px;
        color: var(--color-text-dark);
        cursor: pointer;
        transition: all var(--transition-smooth);
        position: absolute;
      }

      .btn-prev {
        left: var(--spacing-lg);
        padding-right: var(--spacing-md);
      }

      .btn-next {
        right: var(--spacing-lg);
        padding-left: var(--spacing-md);
      }

      .btn-text {
        font-size: var(--text-md);
        color: var(--color-text-dark);
      }

      .btn-nav:hover:not(.disabled) {
        background: var(--color-starlight-medium);
        border-color: var(--color-gold);
        transform: translateY(-2px);
        box-shadow: var(--shadow-glow);
      }

      .btn-nav:active:not(.disabled) {
        transform: scale(0.95);
      }

      .btn-nav.disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      /* Animations */
      @keyframes progressShine {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes textGlow {
        0%, 100% {
          text-shadow: 0 0 12px var(--color-gold-glow);
        }
        50% {
          text-shadow: 0 0 20px var(--color-gold-glow), 0 0 30px var(--color-gold-glow);
        }
      }

      @keyframes floatIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    </>
  );
}