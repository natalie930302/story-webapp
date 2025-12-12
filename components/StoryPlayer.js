'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

const SENTENCE_SPLIT_REGEX = /([。？！.?!；;，\r\n\uFE30-\uFFA0()（）「」]+)/g;

export default function StoryPlayer({ paragraphs, onNext, buttonText = "下一段" }) {
  const [index, setIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1); 
  const [charProgress, setCharProgress] = useState(0); 
  const [slideDirection, setSlideDirection] = useState('forward');

  const currentText = paragraphs[index]?.text || '';
  const synth = useMemo(() => (typeof window !== 'undefined' ? window.speechSynthesis : null), []);
  
  const segments = useMemo(() => 
    currentText.split(SENTENCE_SPLIT_REGEX).filter(s => s.trim().length > 0)
  , [currentText]);

  const totalCharacters = currentText.length;
  
  const isPunctuation = (segment) => /^[。？！.?!；;，\r\n\uFE30-\uFFA0()（）「」]+$/.test(segment);

  const stopAudio = useCallback(() => {
    if (synth) {
      synth.cancel(); 
    }
    setIsPlaying(false);
    setCurrentSegmentIndex(-1);
    setCharProgress(0); 
  }, [synth]);

  const playAudio = useCallback((text) => {
    if (!synth || !text) return;
    stopAudio(); 

    let charOffset = 0;
    const segmentOffsets = segments.map(segment => {
        const start = charOffset;
        charOffset += segment.length;
        return { text: segment, start };
    });
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0; 
    
    utterance.onboundary = (event) => {
      const absCharIndex = event.charIndex;
      setCharProgress(absCharIndex);
      
      const currentIdx = segmentOffsets.findIndex(seg => 
        absCharIndex >= seg.start && absCharIndex < (seg.start + seg.text.length)
      );
      
      if (currentIdx !== -1 && currentIdx !== currentSegmentIndex) {
        setCurrentSegmentIndex(currentIdx);
      }
    };
    
    utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentSegmentIndex(0);
        setCharProgress(0);
    }
    
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentSegmentIndex(-1);
      setCharProgress(totalCharacters); 
    };

    synth.speak(utterance);
  }, [synth, stopAudio, totalCharacters, segments, currentSegmentIndex]); 

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

  return (
    <div className="reader-panel max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header with progress indicator */}
      <div className="reader-header">
        <h2 className="reader-title">
          <span className="icon-md animate-float">🎧</span>
          故事閱讀
        </h2>
        <div className="progress-wrap">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${((index + 1) / paragraphs.length) * 100}%` }} />
          </div>
          <span className="reader-badge">{index + 1} / {paragraphs.length}</span>
        </div>
      </div>

      {/* Text display area with animation */}
      <div className={`reader-text-area ${slideDirection === 'forward' ? 'slide-in-right' : 'slide-in-left'}`}>
        {segments.length > 0 ? (
            segments.map((segment, i) => {
                const isCurrent = i === currentSegmentIndex;
                const shouldHighlight = isCurrent && !isPunctuation(segment);

                return (
                    <span
                        key={i}
                        className={
                          `transition-all duration-200 ease-in-out ${shouldHighlight ? 'highlight-text-shadow highlight-pulse' : 'text-stone-700 font-normal'}`
                        }
                    >
                        {segment}
                    </span>
                );
            })
        ) : (
            <p className="text-stone-500 italic text-center py-12">請提供段落文本以開始播放。</p>
        )}
      </div>
      
      {/* Module hints: show compact animated SVG shapes (less text) */}
      {paragraphs[index]?.moduleHints && paragraphs[index].moduleHints.length > 0 && (
        <div className="module-hints-wrapper">
          <div className="hint-grid" aria-hidden>
            {paragraphs[index].moduleHints.map((hint, idx) => (
              <div key={idx} className="module-hint animated" role="img" aria-label={hint} title={hint}>
                {/* SVG visuals per hint type */}
                {hint === 'wind' && (
                  <svg className="module-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" stroke="#5A1F1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 24c8-6 18-6 26-2s18 2 26-4" className="pulse"/>
                      <path d="M10 36c6-4 14-4 20-2s14 1 22-2" className="pulse"/>
                    </g>
                  </svg>
                )}

                {hint === 'heat' && (
                  <svg className="module-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id={`g-heat-${idx}`} cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#ffd89b" />
                        <stop offset="100%" stopColor="#e55b3c" />
                      </radialGradient>
                    </defs>
                    <circle cx="32" cy="28" r="12" fill={`url(#g-heat-${idx})`} className="pulse" />
                    <g stroke="#d64a6d" strokeWidth="2" fill="none">
                      <path d="M32 6v6"/>
                      <path d="M12 32h6"/>
                      <path d="M46 32h6"/>
                      <path d="M32 46v6"/>
                    </g>
                  </svg>
                )}

                {hint === 'vibration' && (
                  <svg className="module-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <rect x="12" y="20" width="40" height="24" rx="6" fill="#f4e6d0" stroke="#c9952f" />
                    <path d="M16 32c4-6 8-6 12 0s8 6 12 0 8-6 12 0" fill="none" stroke="#5A1F1A" strokeWidth="3"/>
                  </svg>
                )}

                {hint === 'recording' && (
                  <svg className="module-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <rect x="22" y="14" width="20" height="26" rx="10" fill="#fff" stroke="#5a1f1a" strokeWidth="2" />
                    <path d="M32 42v8" stroke="#5a1f1a" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="32" cy="40" r="3" fill="#e55b3c" />
                  </svg>
                )}

                {/* fallback icon */}
                {!['wind','heat','vibration','recording'].includes(hint) && (
                  <svg className="module-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="18" fill="#f0e3d6" stroke="#c9952f" />
                  </svg>
                )}
                <span className="visually-hidden">{hint}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Control buttons */}
      <div className="reader-controls">
        {/* Previous button */}
        <button 
          onClick={handlePrevious} 
          disabled={index === 0} 
          aria-label="上一段"
          className="control-btn btn-ghost"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M11 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          上一步
        </button>

        {/* Play/Pause button - prominent center button */}
        <button 
          onClick={togglePlay} 
          aria-label={isPlaying ? '停止播放' : '開始播放'} 
          className={`control-btn btn-play ${isPlaying ? 'playing' : 'not-playing'}`}
        >
          {isPlaying ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Next button */}
        <button 
          onClick={handleNext} 
          aria-label={index < paragraphs.length - 1 ? '下一段' : buttonText || '故事結束'} 
          className="control-btn btn-primary"
        >
          {index < paragraphs.length - 1 ? '下一步' : (buttonText || '故事結束')}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}