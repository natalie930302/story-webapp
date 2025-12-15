'use client'
import React, { useEffect, useState, useCallback } from 'react'
import StoryCard from '../components/StoryCard'
import { useRouter } from 'next/navigation'
import Modal from '../components/Modal'
import LoadingPage from '../components/LoadingPage'

export default function IndexPage() {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  
  const [isModalVisible, setIsModalVisible] = useState(false); 
  
  const router = useRouter();

  useEffect(() => {
    fetch('/api/story')
      .then(res => res.json())
      .then(data => {
        setStories(data);
        setIsLoadingStories(false);
      })
      .catch(() => setIsLoadingStories(false));
  }, [])

  const handleSelect = (id) => {
    router.push(`/story/${id}`);
  };

  const openModal = () => setIsModalVisible(true)

  const closeModal = useCallback(() => {
    if (isUploading) return
    setIsModalVisible(false)
    setTitle('')
    setText('')
  }, [isUploading])

  const handleUpload = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    const startUploadAt = Date.now();
    setIsUploading(true);

    const res = await fetch('/api/story/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        storyText: text,
      })
    });

    if (res.ok) {
      const newStory = await res.json();
      setStories(prev => [...prev, newStory]);
      const elapsed = Date.now() - startUploadAt;
      if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));
      setIsUploading(false);
      setIsModalVisible(false);
      setTitle('');
      setText('');
    } else {
      const elapsed = Date.now() - startUploadAt;
      if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));
      alert('上傳失敗');
      setIsUploading(false);
    }
  };

  const CreateStoryCard = () => (
    <div 
      className="create-story-card"
      onClick={openModal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      }}
    >
      <div className="sparkle-overlay" />

      <div className="particle-background">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
      </div>

      <div className="icon-wrapper">
        <span className="sparkle-icon">✨</span>
      </div>

      <h3 className="card-title">創造新故事</h3>

      <style jsx>{`
        .create-story-card {
          width: 100%;
          max-width: 200px;
          height: 240px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-night-light) 0%, var(--color-night-medium) 100%);
          border-radius: var(--radius-lg);
          border: 2px solid var(--color-border-light);
          padding: var(--spacing-2xl) var(--spacing-xl);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all var(--transition-smooth);
          box-shadow: var(--shadow-lg);
          transform: translateY(0) scale(1);
        }

        .create-story-card:hover {
          box-shadow: var(--shadow-2xl), var(--shadow-glow-strong);
          transform: translateY(-8px) scale(1.02);
        }

        .create-story-card:active {
          transform: translateY(-4px) scale(0.99);
        }

        .sparkle-overlay {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.2), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .create-story-card:hover .sparkle-overlay {
          opacity: 1;
        }

        .particle-background {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          overflow: hidden;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .create-story-card:hover .particle-background {
          opacity: 1;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, var(--color-gold-glow) 0%, transparent 70%);
          border-radius: 50%;
          top: 20%;
        }

        .particle-1 {
          left: 50%;
          animation: magicFloat 4s ease-in-out infinite;
        }

        .particle-2 {
          left: 70%;
          animation: magicFloat 4s ease-in-out infinite;
          animation-delay: 0.3s;
        }

        .particle-3 {
          left: 30%;
          animation: magicFloat 4s ease-in-out infinite;
          animation-delay: 0.6s;
        }

        .icon-wrapper {
          font-size: 48px;
          color: var(--color-gold);
          margin-bottom: 24px;
          position: relative;
          z-index: 10;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: float 3s ease-in-out infinite;
        }

        .create-story-card:hover .icon-wrapper {
          transform: scale(1.25);
        }

        .sparkle-icon {
          font-size: 48px;
          animation: sparkle 2s ease-in-out infinite;
        }

        .card-title {
          font-weight: bold;
          font-size: 24px;
          line-height: 32px;
          margin-bottom: 12px;
          position: relative;
          z-index: 10;
          text-align: center;
          color: var(--color-starlight-cream);
          transition: color 0.3s ease;
        }

        .create-story-card:hover .card-title {
          color: var(--color-gold);
        }

        @keyframes magicFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(10px, -20px) scale(1.2); opacity: 0.9; }
          50% { transform: translate(-5px, -40px) scale(0.8); opacity: 0.4; }
          75% { transform: translate(-15px, -20px) scale(1.1); opacity: 0.7; }
        }
        
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
        }
      `}</style>
    </div>
  )

  if (isLoadingStories) {
    return <LoadingPage message="正在載入故事收藏櫃..." />;
  }

  return (
    <>
      {/* Header section */}
      <div className="header-section appear">
        <h1 className="page-title appear">
          <span className="title-icon">📚</span>
          故事收藏櫃
        </h1>
      </div>

      {/* Stories section */}
      <div className="stories-section appear">{stories.length > 0 ? (
          stories.map((story, idx) => (
            <div key={story._id} className="story-item appear" style={{ animationDelay: `${idx * 0.2}s` }}>
              <StoryCard story={story} onClick={handleSelect} />
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <p>還沒有故事</p>
          </div>
        )}
        <div className="story-item appear" style={{ animationDelay: `${stories.length * 0.2}s` }}>
          <CreateStoryCard />
        </div>
      </div>

      {/* Modal section */}
      {isModalVisible && (
        <Modal isVisible={isModalVisible} onClose={closeModal}>
          <div className="modal-header">
            <h2 className="modal-title">
              <span>✨</span>
              <span>創造一本新故事書</span>
            </h2>
          </div>

          <div className="modal-body">
            <form onSubmit={handleUpload} className="upload-form">
              <div className="form-group">
                <label className="form-label">故事標題</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="給你的故事取個溫暖的名字..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>故事文字</span>
                  <span className="char-count">
                    {text.length} / 推薦 500+ 字
                  </span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="開始寫下你溫暖的故事吧... 建議 500 字以上以獲得更好的互動體驗"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  required
                  rows="6"
                  disabled={isUploading}
                />
              </div>

              <button
                type="submit"
                className={`submit-button ${isUploading ? 'uploading' : ''}`}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg 
                      className="loading-spinner"
                      width="18" 
                      height="18" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>正在生成你的故事...</span>
                  </>
                ) : (
                  <span>✨確認並生成故事</span>
                )}
              </button>
            </form>
          </div>
        </Modal>
      )}

      <style jsx>{`
        .header-section {
          margin-bottom: var(--spacing-xl);
        }

        .page-title {
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          color: var(--color-text-primary);
          font-size: max(2rem,min(4vw,2.5rem));
        }

        .title-icon {
          font-size: 48px;
        }

        .stories-section {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .story-item {
          padding: var(--spacing-md);
        }

        .empty-state {
          font-size: max(1.25rem,min(2.5vw,1.75rem));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          color: var(--color-text-secondary);
          padding: var(--spacing-2xl) var(--spacing-md);
          grid-column: 1 / -1;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .modal-header {
          padding: 0;
        }

        .modal-title {
          font-size: 28px;
          line-height: 36px;
          font-weight: bold;
          margin-bottom: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-text-primary);
        }

        .modal-body {
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          color: var(--color-gold-dark);
        }

        .char-count {
          color: var(--color-text-secondary);
          font-weight: 500;
          font-size: var(--text-sm);
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: var(--spacing-sm) 18px;
          font-size: var(--text-base);
          line-height: 1.5;
          color: var(--color-text-dark);
          background-color: rgba(245, 242, 234, 0.6);
          border: 2px solid var(--color-border-primary);
          border-radius: var(--radius-sm);
          outline: none;
          transition: all var(--transition-smooth);
          font-family: inherit;
        }

        .form-input:disabled,
        .form-textarea:disabled {
          opacity: 0.6;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: var(--color-gold);
          background-color: var(--color-starlight-cream);
          box-shadow: 0 0 0 3px var(--color-gold-glow), 0 8px 24px rgb(0 0 0 / 0.12);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-button {
          width: 100%;
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--color-text-primary);
          background: var(--gradient-secondary);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-smooth);
          opacity: 1;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl), 0 0 24px rgba(157, 121, 242, 0.4), 0 0 16px rgba(242, 147, 176, 0.3);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button.uploading {
          background: linear-gradient(135deg, rgba(157, 121, 242, 0.5) 0%, rgba(242, 147, 176, 0.5) 100%);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        .spinner-circle {
          opacity: 0.25;
        }

        .spinner-path {
          opacity: 0.75;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
