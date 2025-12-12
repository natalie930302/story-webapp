'use client'
import React, { useEffect, useState } from 'react'

export default function Modal({ isVisible, onClose, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const ANIMATION_DURATION = 350

  useEffect(() => {
    let t
    if (isVisible) {
      setShouldRender(true)
      // Small delay to ensure render before animation
      t = setTimeout(() => setIsOpen(true), 10)
    } else {
      setIsOpen(false)
      t = setTimeout(() => setShouldRender(false), ANIMATION_DURATION)
    }
    return () => clearTimeout(t)
  }, [isVisible])

  if (!shouldRender && !isOpen) return null

  const bgOpacity = isVisible ? 1 : 0
  const bgClass = isVisible ? 'opacity-100' : 'opacity-0'

  return (
    <div className="fixed inset-0 z-50 p-4 flex justify-center items-center appear" style={{animationDelay: '0s'}}>
      {/* Backdrop */}
      <div 
        className={`modal-backdrop transition-opacity duration-300 ${bgClass}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          opacity: bgOpacity,
          transition: `opacity ${ANIMATION_DURATION}ms ease-in-out`,
          cursor: 'pointer'
        }}
      />

      {/* Modal Panel */}
      <div 
        className={`modal-panel z-10 transform transition-all duration-300 ${isVisible ? 'animate-modal-in' : 'animate-modal-out'}`}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '500px',
          width: '100%',
          padding: '32px'
        }}
      >
        {/* Children content */}
        <div className="appear" style={{animationDelay: '0.08s'}}>
          {children}
        </div>
      </div>
    </div>
  )
}