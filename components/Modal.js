'use client'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ isVisible, onClose, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ANIMATION_DURATION = 300

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    let t
    if (isVisible) {
      setShouldRender(true)
      t = setTimeout(() => setIsOpen(true), 10)
    } else {
      setIsOpen(false)
      t = setTimeout(() => setShouldRender(false), ANIMATION_DURATION)
    }
    return () => clearTimeout(t)
  }, [isVisible])

  if (!shouldRender && !isOpen) return null
  if (!mounted) return null

  const modalContent = (
    <div className="modal-wrapper">
      {/* Backdrop */}
      <div 
        className={`modal-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div 
        className={`modal-panel ${isOpen ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="關閉">
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

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(
            135deg, 
            rgba(26, 21, 20, 0.92) 0%, 
            rgba(42, 31, 29, 0.94) 25%, 
            rgba(47, 107, 95, 0.88) 50%, 
            rgba(42, 31, 29, 0.94) 75%, 
            rgba(26, 21, 20, 0.92) 100%
          );
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          cursor: pointer;
          opacity: 0;
          transition: all var(--transition-base);
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
          background: linear-gradient(
            145deg,
            var(--color-beige) 0%,
            var(--color-beige-dark) 50%,
            var(--color-beige-darker) 100%
          );
          border-radius: var(--radius-lg);
          box-shadow: 
            var(--shadow-2xl),
            0 0 0 2px var(--color-border-primary),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          padding: 0;
          max-height: 90vh;
          position: relative;
          z-index: 10000;
          transition: all var(--transition-smooth);
          opacity: 0;
          transform: scale(0.85) translateY(40px);
          filter: blur(10px);
        }

        .modal-panel.open {
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0);
        }

        .modal-close {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          border: none;
          background: rgba(139, 64, 73, 0.1);
          color: var(--color-brick-red);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-smooth);
          z-index: 10;
          backdrop-filter: blur(8px);
        }

        .modal-close:hover {
          background: rgba(139, 64, 73, 0.2);
          transform: rotate(90deg) scale(1.1);
          box-shadow: 0 4px 12px rgba(139, 64, 73, 0.2);
        }

        .modal-close:active {
          transform: rotate(90deg) scale(0.95);
        }

        .modal-content {
          overflow-y: auto;
          max-height: 90vh;
          padding: 40px;
          scrollbar-width: thin;
          scrollbar-color: var(--color-gold) transparent;
        }

        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: var(--color-gold);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: var(--color-gold-dark);
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