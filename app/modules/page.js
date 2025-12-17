'use client';
import React from 'react';

const modules = [
  { name: '風扇模組', description: '透過風扇對使用者吹風，帶來風吹、奔跑等情境，感受涼爽或動態。', color: 'bg-blue-100', icon: '🌬️' },
  { name: '熱燈模組', description: '透過熱燈加熱，讓兒童有溫暖和明亮的感覺，模擬陽光、火焰等情境。', color: 'bg-yellow-100', icon: '🔆' },
  { name: '震動馬達模組', description: '透過震動馬達讓兒童有震動的感覺，模擬地震、心跳、車輛行駛等情境。', color: 'bg-purple-100', icon: '⚙️' },
  { name: '錄音模組', description: '讓使用者可以錄製音效或是對話，將自己的聲音融入故事中，增加互動性。', color: 'bg-green-100', icon: '🎙️' },
];

export default function ModulesPage() {
  return (
    <>
      {/* Header section */}
      <div className="header-section appear">
        <h1 className="page-title appear">🤖 數位互動模組</h1>
      </div>

      {/* Concept section */}
      <div className="concept-section appear">
        <h2 className="section-title appear">模組設計理念</h2>
        <p className="description">
          為了給予兒童有更好的媒介與故事互動，<br />我們選用了像是風扇、熱燈、震動馬達等在感覺上具有明顯差異的模組。<br />我們透過這些感官上的刺激，讓兒童能夠身臨其境。<br/>我們並未對於模組規定相對應的場景，皆由兒童自行想像發揮，<br />於未來亦會增加更多的模組設計。
        </p>
      </div>

      {/* Modules section */}
      <div className="modules-section appear">
        <h2 className="section-title appear">現有感官模組</h2>
        <div className="modules-grid appear">
          {modules.map((mod, index) => (
            <div
              key={index}
              className="module-card appear"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="module-header">
                <div className="module-icon">{mod.icon}</div>
                <h3 className="module-name">{mod.name}</h3>
              </div>
              <p className="module-description">{mod.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .page-title {
          font-size: var(--text-5xl);
          margin-bottom: var(--spacing-xl);
          color: var(--color-text-primary);
          text-align: center;
        }

        .section-title {
          font-size: var(--text-3xl);
          margin-bottom: var(--spacing-lg);
          color: var(--color-text-primary);
          text-align: center;
        }

        .description {
          font-size: var(--text-lg);
          margin-bottom: var(--spacing-xl);
          color: var(--color-text-secondary);
          text-align: center;
          max-width: 900px;
          margin: 0 auto var(--spacing-2xl);
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .module-card {
          padding: var(--spacing-lg);
          background: var(--gradient-beige);
          border-radius: var(--radius-lg);
          border: 2px solid var(--color-border-primary);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.06);
          cursor: pointer;
        }

        .module-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1), 0 0 24px var(--color-gold-glow);
        }

        .module-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
          font-size: var(--text-2xl);
        }

        .module-name {
          color: var(--color-text-dark);
        }

        .module-description {
          font-size: var(--text-base);
          color: var(--color-text-dark);
          opacity: 0.8;
        }
      `}</style>
    </>
  );
}