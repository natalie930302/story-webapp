'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function EndPage() {
  const router = useRouter();
  return (
    <div className="end-hero appear">
      <div className="end-badge">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>

      <h1 className="end-title">圓滿謝幕</h1>

      <p className="end-desc">感謝您的閱讀與互動！期待您下次的奇幻旅程。</p>

      <button onClick={() => router.push('/')} className="btn-primary btn-cta">返回書架</button>
    </div>
  );
}