'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const SENTENCE_SPLIT_REGEX = /([。？！.?!；;，\r\n\uFE30-\uFFA0()（）「」]+)/g;
const PUNCTUATION_REGEX = /^[。？！.?!；;，\r\n\uFE30-\uFFA0()（）「」]+$/;

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

export default function StoryPlayer({ paragraphs, onNext, buttonText = "下一段" }) {
  const [index, setIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1); 
  const [slideDirection, setSlideDirection] = useState('forward');

  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);

  const currentParagraph = paragraphs[index];
  const currentText = currentParagraph?.text || '';
  const segments = useMemo(() => 
    currentText.split(SENTENCE_SPLIT_REGEX).filter(s => s.trim().length > 0),
    [currentText]
  );
  const isPunctuation = (segment) => PUNCTUATION_REGEX.test(segment);

  const stopAudio = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (utteranceRef.current) {
      utteranceRef.current = null;
    }
    setIsPlaying(false);
    setCurrentSegmentIndex(-1);
  }, []);

  const playAudio = useCallback((text) => {
    const synth = synthRef.current;
    if (!synth || !text) return;
    
    stopAudio();

    let charOffset = 0;
    const segmentOffsets = segments.map(segment => {
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
          setCurrentSegmentIndex(mid);
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
      setCurrentSegmentIndex(0);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentSegmentIndex(-1);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentSegmentIndex(-1);
      utteranceRef.current = null;
    };

    synth.speak(utterance);
  }, [segments, stopAudio]);

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
    if (index < paragraphs.length - 1) {
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

  const moduleHints = currentParagraph?.moduleHints;

  return (
    <div className="player-container">
      <div className="player-header">
        <div className="header-container">
          <div className="header-icon">🎧</div>
          <h2 className="header-title">故事閱讀器</h2>
        </div>
        <div className="progress">
          <div className="progress-track">
            <div 
              className="progress-bar"
              style={{ width: `${((index + 1) / paragraphs.length) * 100}%` }}
            >
            </div>
            <div className="progress-shine" />
          </div>
          <div className="progress-info">
            <span className="progress-label">第 {index + 1} 段</span>
            <span className="progress-divider">/</span>
            <span className="progress-total">共 {paragraphs.length} 段</span>
          </div>
        </div>
      </div>

      <div
        className={`text-card ${slideDirection === 'forward' ? 'slide-forward' : 'slide-backward'}`}
        key={index}
      >
        <div className="notebook-lines"></div>
        <div className="quote-mark quote-left">"</div>
        <div className="quote-mark quote-right">"</div>
        
        {moduleHints && moduleHints.length > 0 && (
          <div className="modules-floating">
            <div className="modules-content">
              <span className="floating-label">建議使用</span>
              {moduleHints.map((hint, idx) => {
                const config = moduleConfig[hint];
                if (!config) return null;
                return (
                  <div 
                    key={`${hint}-${idx}`}
                    className="module-badge"
                    style={{ 
                      background: `linear-gradient(
                          120deg, 
                          ${config.color} 0%, 
                          color-mix(in srgb, ${config.color} 53%, transparent) 50%, 
                          ${config.color} 100%
                      )`,
                      borderColor: config.color
                    }}
                    title={config.description}
                  >
                    <span className="module-emoji">{config.icon}</span>
                    <span className="module-name">{config.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="text-content">
          {segments.length === 0 ? (
            <p className="empty-text">等待故事內容...</p>
          ) : (
            segments.map((segment, i) => {
              const shouldHighlight = i === currentSegmentIndex && !isPunctuation(segment);
              return (
                <span key={i} className={shouldHighlight ? 'text-segment highlighted' : 'text-segment'}>
                  {segment}
                </span>
              );
            })
          )}
        </div>
      </div>

      <div className="controls-card">
        <button 
          onClick={handlePrevious} 
          disabled={index === 0} 
          aria-label="上一段"
          className={`control-btn btn-nav btn-prev ${index === 0 ? 'disabled' : ''}`}
        >
          <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M15 18l-6-6 6-6" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="btn-text">上一段</span>
        </button>

        <button 
          onClick={togglePlay} 
          aria-label={isPlaying ? '停止播放' : '開始播放'} 
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
          aria-label={index < paragraphs.length - 1 ? '下一段' : buttonText || '故事結束'} 
          className="control-btn btn-nav btn-next"
        >
          <span className="btn-text">{index < paragraphs.length - 1 ? '下一段' : (buttonText || '故事結束')}</span>
          <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 6l6 6-6 6" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    <style jsx>{`
      .player-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: var(--spacing-md);
        animation: fadeInUp 0.6s ease-out;
        display: flex;
        flex-direction: column;
      }

      .player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px var(--spacing-lg);
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
        font-size: 26px;
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
        font-size: 24px;
        font-weight: 800;
        color: var(--color-starlight-cream);
        margin: 0;
      }

      .progress {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }
      
      .progress-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: 15px;
        color: var(--color-starlight-cream);
      }

      .progress-label {
        font-weight: 600;
      }

      .progress-divider {
        color: var(--color-starlight-medium);
      }

      .progress-total {
        font-weight: 600;
      }

      .text-card {
        position: relative;
        padding: var(--spacing-2xl) 56px;
        background: var(--color-starlight-cream);
        min-height: 280px;
        display: flex;
        align-items: center;
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
            transparent 39px,
            var(--color-beige-dark) 39px,
            var(--color-beige-darker) 40px
          );
        pointer-events: none;
        opacity: 0.25;
      }

      .quote-mark {
        position: absolute;
        font-family: BIZ UDPMincho, serif;
        font-size: 80px;
        font-weight: bold;
        color: var(--color-brown-text);
        opacity: 0.18;
        line-height: 1;
        user-select: none;
        pointer-events: none;
      }

      .quote-left {
        top: 20px;
        left: 24px;
      }

      .quote-right {
        bottom: 20px;
        right: 24px;
        transform: rotate(180deg);
      }

      .text-card.slide-forward {
        animation: slideInRight 0.5s ease-out;
      }

      .text-card.slide-backward {
        animation: slideInLeft 0.5s ease-out;
      }

      .text-content {
        font-size: 22px;
        line-height: 2.0;
        color: var(--color-text-dark);
        position: relative;
        z-index: 1;
        width: 100%;
        padding: 8px 0;
      }

      .empty-text {
        color: var(--color-brown-text);
        font-size: 18px;
        text-align: center;
        padding: 80px 0;
        opacity: 0.5;
      }

      .text-segment {
        transition: all 0.3s ease;
        color: var(--color-text-dark);
        font-weight: 500;
      }

      .text-segment.highlighted {
        color: var(--color-gold);
        font-weight: 700;
        text-shadow: 0 0 12px var(--color-gold-glow);
        animation: textGlow 1.5s ease-in-out infinite;
        display: inline-block;
      }

      .modules-floating {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background: var(--color-starlight-cream);
        backdrop-filter: blur(12px);
        border-radius: var(--radius-md);
        padding: var(--spacing-sm) 18px;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--color-border-primary);
        z-index: 10;
        animation: floatIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .modules-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .floating-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--color-text-dark);
        white-space: nowrap;
      }

      .module-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px var(--spacing-md);
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        animation: badgeFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
      }

      .module-badge:nth-child(2) { animation-delay: 0.08s; }
      .module-badge:nth-child(3) { animation-delay: 0.16s; }
      .module-badge:nth-child(4) { animation-delay: 0.24s; }
      .module-badge:nth-child(5) { animation-delay: 0.32s; }

      @keyframes badgeFadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .module-badge:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        filter: brightness(1.05);
      }

      .module-emoji {
        font-size: 18px;
        filter: drop-shadow(var(--shadow-sm));
      }

      .module-badge .module-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--color-text-dark);
      }

      .progress-track {
        position: relative;
        width: 240px;
        max-width: 100%;
        height: 8px;
        background: var(--color-night-light);
        border-radius: var(--radius-full);
        overflow: hidden;
      }

      .progress-bar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: var(--gradient-primary);
        border-radius: var(--radius-full);
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
        height: 52px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: var(--color-starlight-cream);
        border: 2px solid var(--color-border-light);
        border-radius: 26px;
        color: var(--color-text-dark);
        cursor: pointer;
        transition: all var(--transition-smooth);
        position: absolute;
        white-space: nowrap;
      }

      .btn-prev {
        left: 24px;
      }

      .btn-next {
        right: 24px;
      }

      .btn-text {
        font-size: 14px;
        font-weight: 600;
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

      .btn-icon {
        flex-shrink: 0;
      }

      /* Animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

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
    </div>
  );
}