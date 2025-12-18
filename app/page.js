'use client'
import React, { useEffect, useState, useCallback } from 'react'
import StoryCard from '../components/StoryCard'
import { useRouter } from 'next/navigation'
import Modal from '../components/Modal'
import LoadingPage from '../components/LoadingPage'

export default function IndexPage() {
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); 

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/story')
      .then(res => res.json())
      .then(data => data && setStories(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [])

  const openModal = () => setIsModalVisible(true)

  const closeModal = useCallback(() => {
    if (isUploading) return
    setIsModalVisible(false)
  }, [isUploading])

  const handleUpload = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const storyText = formData.get('text');
    
    const startUploadAt = Date.now();
    setIsUploading(true);

    const res = await fetch('/api/story/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        storyText,
      })
    });

    if (res.ok) {
      const newStory = await res.json();
      setStories(prev => [...prev, newStory]);
      const elapsed = Date.now() - startUploadAt;
      if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));
      setIsUploading(false);
      setIsModalVisible(false);
      e.target.reset(); // 重置表單
    } else {
      const elapsed = Date.now() - startUploadAt;
      if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));
      alert('上傳失敗');
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <LoadingPage message="正在載入故事收藏櫃" />;
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
      <div className="stories-section appear">
        {stories.length > 0 && (
          stories.map((story, idx) => (
              <div key={story._id} className="story-item appear" style={{ animationDelay: `${idx * 0.2}s` }}>
                <StoryCard story={story} onClick={() => router.push(`/story/${story._id}`)} />
              </div>
          ))
        )}
        <div className="story-item appear" style={{ animationDelay: `${stories.length * 0.2}s` }}>
          <div 
            className="create-story-card"
            onClick={openModal}
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

            <h3 className="card-title">創造<br/>新故事</h3>
          </div>
        </div>
      </div>

      {/* Modal section */}
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
                  name="title"
                  className="form-input"
                  placeholder="給你的故事取個溫暖的名字..."
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>故事文字</span>
                  <span className="char-count" id="char-count">
                    0 / 推薦 500+ 字
                  </span>
                </label>
                <textarea
                  name="text"
                  className="form-textarea"
                  placeholder="開始寫下你溫暖的故事吧... 建議 500 字以上以獲得更好的互動體驗"
                  onChange={(e) => {
                    const charCount = document.getElementById('char-count');
                    if (charCount) {
                      charCount.textContent = `${e.target.value.length} / 推薦 500+ 字`;
                    }
                  }}
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
                  <>
                    <span>✨</span>
                    <span>確認並生成故事</span>
                  </>
                )}
              </button>
            </form>
          </div>
      </Modal>

      <style jsx>{`
        .header-section {
          margin-bottom: var(--spacing-xl);
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          color: var(--color-text-primary);
          font-size: var(--text-5xl);
        }

        .stories-section {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .story-item {
          padding: var(--spacing-md);
        }

        .modal-header {
          padding: 0;
        }

        .modal-title {
          font-size: var(--text-3xl);
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
          margin-bottom: var(--spacing-xs);
          color: var(--color-gold-dark);
        }

        .char-count {
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: var(--text-base);
          color: var(--color-text-dark);
          background-color: var(--color-starlight-cream);
          border: 2px solid var(--color-border-primary);
          border-radius: var(--radius-sm);
          outline: none;
          transition: all var(--transition-smooth);
        }

        .form-input:disabled,
        .form-textarea:disabled {
          opacity: 0.6;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: var(--color-gold);
          background-color: var(--color-starlight-cream);
          box-shadow: var(--shadow-lg), var(--shadow-glow-strong);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-button {
          width: 100%;
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: var(--text-lg);
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
          box-shadow: var(--shadow-xl);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button.uploading {
          background: var(--gradient-tertiary);
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
        
        .create-story-card {
          width: 100%;
          aspect-ratio: 3/4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          background: var(--gradient-tertiary);
          border-radius: var(--radius-lg);
          border: 2px solid var(--color-border-light);
          padding: var(--spacing-2xl) var(--spacing-xl);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all var(--transition-smooth);
          box-shadow: var(--shadow-lg);
          transform: translateY(0) scale(1);
          container-type: inline-size;
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
          border-radius: var(--radius-lg);
          background: radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.2), transparent 70%);
          opacity: 0;
          transition: opacity var(--transition-base);
          pointer-events: none;
        }

        .create-story-card:hover .sparkle-overlay {
          opacity: 1;
        }

        .particle-background {
          position: absolute;
          inset: 0;
          border-radius: var(--radius-lg);
          overflow: hidden;
          opacity: 0;
          transition: opacity var(--transition-slow);
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
          color: var(--color-gold);
          position: relative;
          z-index: 10;
          transition: transform var(--transition-smooth);
          animation: float 3s ease-in-out infinite;
        }

        .create-story-card:hover .icon-wrapper {
          transform: scale(1.25);
        }

        .sparkle-icon {
          font-size: var(--text-5xl);
          animation: sparkle 2s ease-in-out infinite;
        }

        .card-title {
          font-size: var(--text-2xl);
          position: relative;
          z-index: 10;
          text-align: center;
          color: var(--color-starlight-cream);
          transition: color var(--transition-base);
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
    </>
  );
}
