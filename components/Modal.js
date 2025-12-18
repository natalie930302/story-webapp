'use client'
import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ isVisible, onClose, children }) {
  const [animationState, setAnimationState] = useState('closed') // 'closed' | 'opening' | 'open' | 'closing'
  const [mounted, setMounted] = useState(false)
  const ANIMATION_DURATION = 300

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    let openTimer, closeTimer

    if (isVisible) {
      // 開始開啟動畫
      setAnimationState('opening')
      openTimer = setTimeout(() => {
        setAnimationState('open')
      }, 10)
    } else if (animationState === 'open' || animationState === 'opening') {
      // 開始關閉動畫
      setAnimationState('closing')
      closeTimer = setTimeout(() => {
        setAnimationState('closed')
      }, ANIMATION_DURATION)
    }

    return () => {
      clearTimeout(openTimer)
      clearTimeout(closeTimer)
    }
  }, [isVisible])

  // 不渲染的情況
  if (animationState === 'closed') return null
  if (!mounted) return null

  const isAnimatedOpen = animationState === 'open'

  const modalContent = (
    <div className="modal-wrapper">
      {/* Backdrop */}
      <div 
        className={`modal-backdrop ${isAnimatedOpen ? 'open' : ''}`} 
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div 
        className={`modal-panel ${isAnimatedOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="modal-content">
          {children}
        </div>
      </div>

      <style jsx>{`
        .modal-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: var(--spacing-md);
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .modal-wrapper {
            padding: var(--spacing-sm);
            align-items: flex-end;
          }
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background: var(--overlay-dark);
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          cursor: pointer;
          opacity: 0;
          transition: opacity var(--transition-base), backdrop-filter var(--transition-base), -webkit-backdrop-filter var(--transition-base);
          pointer-events: auto;
        }

        .modal-backdrop.open {
          opacity: 1;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .modal-panel {
          max-width: 640px;
          width: 100%;
          pointer-events: auto;
          background: var(--gradient-tertiary);
          border-radius: var(--radius-lg);
          box-shadow: 
            var(--shadow-2xl),
            0 0 0 2px var(--color-border-primary),
            var(--shadow-glow);
          padding: 0;
          max-height: 90vh;
          position: relative;
          z-index: 10000;
          transition: opacity var(--transition-base), transform var(--transition-base), filter var(--transition-base);
          opacity: 0;
          transform: scale(0.9) translateY(30px);
          filter: blur(8px);
        }

        .modal-panel.open {
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0);
        }

        .modal-close {
          position: absolute;
          top: var(--spacing-lg);
          right: var(--spacing-lg);
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border-primary);
          background: var(--color-night-medium);
          color: var(--color-gold);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-smooth);
          z-index: 10;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .modal-close:hover {
          background: var(--color-night-medium);
          border-color: var(--color-gold);
          transform: rotate(90deg) scale(1.1);
          box-shadow: var(--shadow-glow);
        }

        .modal-close:active {
          transform: rotate(90deg) scale(0.95);
        }

        .modal-content {
          overflow-y: auto;
          max-height: 90vh;
          padding: var(--spacing-2xl);
          color: var(--color-text-primary);
        }

        @media (max-width: 640px) {
          .modal-wrapper {
            padding: var(--spacing-sm);
          }

          .modal-panel {
            border-radius: var(--radius-md);
            max-height: 95vh;
          }

          .modal-content {
            padding: var(--spacing-xl) var(--spacing-lg);
          }

          .modal-close {
            top: var(--spacing-sm);
            right: var(--spacing-sm);
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  )

  return createPortal(modalContent, document.body)
}