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
  
  const [isModalVisible, setIsModalVisible] = useState(false); 
  
  const router = useRouter();

  useEffect(() => {
    fetch('/api/story')
      .then(res => res.json())
      .then(data => setStories(data))
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
      onClick={openModal} 
      className="p-4 group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      }}
    >
      <div 
        className="create-card relative flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-2xl"
      >
        <div 
          className="icon-large group-hover:scale-120 animate-float transition-transform duration-300"
          style={{ color: 'var(--hearth-glow)' }}
        >
          +
        </div>
        <h3 
          className="font-bold"
          style={{ color: 'var(--hearth-glow)' }}
        >
          創造新故事
        </h3>
        <p
          className="text-center" 
          style={{ color: 'var(--cream-dark)' }}>
          點擊開始<br />你的故事創作之旅
        </p>
      </div>
    </div>
  )

  return (
    <div className="p-4 appear">
      {/* Header */}
      <div className="appear" style={{marginBottom: '32px'}}>
        <h1 
          className="font-bold flex items-center gap-4"
          style={{ color: 'var(--muted-ink)' }}
        >
          <span className="icon-xl">📚</span>
          故事收藏櫃
        </h1>
      </div>

      {/* Stories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {stories.length > 0 ? (
          stories.map((story, idx) => (
            <div key={story._id} className="appear" style={{animationDelay: `${idx * 0.08}s`}}>
              <StoryCard story={story} onClick={handleSelect} />
            </div>
          ))
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2"
            style={{ color: 'var(--muted-ink)' }}
          >
            <div className="icon-large mb-4">📖</div>
            <p>還沒有故事</p>
          </div>
        )}
        <div className="appear" style={{animationDelay: `${stories.length * 0.08}s`}}>
          <CreateStoryCard />
        </div>
      </div>

      {/* Modal */}
      {isModalVisible && (
        <Modal isVisible={isModalVisible} onClose={closeModal}>
          <>
            <h2 
              style={{
                fontWeight: 900,
                color: 'var(--muted-ink)',
                marginBottom: '24px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                borderBottom: '2px solid rgba(214,168,87,0.2)',
                paddingBottom: '16px'
              }}
            >
              <span className="icon-lg">✒️</span>
              創造一本新故事書
            </h2>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* Title input */}
              <div>
                <label 
                  style={{
                    display: 'block',
                    fontWeight: 700,
                    color: 'var(--muted-ink)',
                    marginBottom: '8px'
                  }}
                >
                  故事標題
                </label>
                <input
                  type="text"
                  placeholder="給你的故事取個溫暖的名字..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid rgba(90,31,26,0.12)',
                    borderRadius: '16px',
                    fontFamily: 'inherit',
                    background: 'linear-gradient(135deg, white, #f9f5f2)',
                    color: 'var(--muted-ink)',
                    transition: 'all 0.3s ease',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)',
                    opacity: isUploading ? 0.6 : 1
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--brick-red)';
                    e.target.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.02), 0 0 0 3px rgba(139,43,43,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(90,31,26,0.12)';
                    e.target.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.02)';
                  }}
                />
              </div>

              {/* Story text input */}
              <div>
                <label 
                  style={{
                    display: 'block',
                    fontWeight: 700,
                    color: 'var(--muted-ink)',
                    marginBottom: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  故事文字
                  <span style={{ color: 'rgba(59,50,43,0.6)', fontWeight: 500}}>
                    {text.length} / 推薦 500+ 字
                  </span>
                </label>
                <textarea
                  placeholder="開始寫下你溫暖的故事吧... 建議 500 字以上以獲得更好的互動體驗"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  required
                  rows="6"
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid rgba(90,31,26,0.12)',
                    borderRadius: '16px',
                    fontFamily: 'inherit',
                    background: 'linear-gradient(135deg, white, #f9f5f2)',
                    color: 'var(--muted-ink)',
                    transition: 'all 0.3s ease',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)',
                    resize: 'vertical',
                    opacity: isUploading ? 0.6 : 1
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--brick-red)';
                    e.target.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.02), 0 0 0 3px rgba(139,43,43,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(90,31,26,0.12)';
                    e.target.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.02)';
                  }}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isUploading || !title || !text}
                style={{
                  background: isUploading ? 'linear-gradient(135deg, var(--deep-wood), var(--pine-green))' : 'linear-gradient(135deg, var(--hearth-glow), var(--brick-red))',
                  color: 'white',
                  fontWeight: 800,
                  borderRadius: '16px',
                  padding: '14px 24px',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 12px 32px rgba(${isUploading ? '90,31,26' : '229,91,60'},0.25)`,
                  border: 'none',
                  cursor: isUploading || !title || !text ? 'not-allowed' : 'pointer',
                  opacity: isUploading || !title || !text ? 0.65 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (!isUploading && title && text) {
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {isUploading ? (
                  <>
                    <svg 
                      className="animate-spin" 
                      width="18" 
                      height="18" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      style={{animation: 'spin 1s linear infinite'}}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>正在生成你的故事...</span>
                  </>
                ) : (
                  <>
                    <span>✨確認並生成故事</span>
                  </>
                )}
              </button>
            </form>
          </>
        </Modal>
      )}

      {/* Loading overlay */}
      {isUploading && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{animation: 'fadeIn 0.3s ease-out'}}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(45,31,24,0.3), rgba(90,31,26,0.3))',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
          />
          <div className="z-50 w-full max-w-md p-8">
            <LoadingPage message="正在上傳並生成故事，請稍候..." />
          </div>
        </div>
      )}
    </div>
  )
}