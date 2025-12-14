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
      <h1 className="page-title">🤖 數位互動模組</h1>

      <h2 className="section-title concept">模組設計理念</h2>

      <p className="description">
        為了給予兒童有更好的媒介與故事互動，我們選用了像是風扇、熱燈、震動馬達等在感覺上具有明顯差異的模組。我們透過這些感官上的刺激，讓兒童能夠身臨其境。<br/>我們並未對於模組規定相對應的場景，皆由兒童自行想像發揮，於未來亦會增加更多的模組設計。
      </p>

      <h2 className="section-title">現有感官模組</h2>

      <div className="modules-grid">
        {modules.map((mod, index) => (
          <div
            key={index}
            className="module-card"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="module-header">
              <div className="module-icon">{mod.icon}</div>
              <h3 className="module-name">{mod.name}</h3>
            </div>
            <p className="module-description">{mod.description}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 48px;
          color: #2a1620;
          text-align: center;
          text-shadow: 0 0 20px rgba(214, 168, 87, 0.2);
          letter-spacing: -0.025em;
        }

        .section-title {
          font-size: clamp(1.5rem, 3vw, 1.875rem);
          font-weight: 700;
          line-height: 1.375;
          margin-bottom: 24px;
          margin-top: 48px;
          color: #2a1620;
          text-align: center;
        }

        .description {
          font-size: 17px;
          line-height: 1.75;
          margin-bottom: 48px;
          color: rgba(42, 22, 32, 0.8);
          text-align: center;
          max-width: 800px;
          margin: 0 auto var(--spacing-2xl);
          padding: 0 var(--spacing-md);
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-md);
        }

        .module-card {
          padding: var(--spacing-xl) var(--spacing-lg);
          background: linear-gradient(135deg, rgba(245, 235, 224, 0.95) 0%, rgba(232, 216, 200, 0.9) 100%);
          border-radius: var(--radius-md);
          border: 2px solid var(--color-border-primary);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.06);
          transition: all var(--transition-smooth);
          animation: appear 0.6s ease-out;
          cursor: pointer;
        }

        .module-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1), 0 0 24px var(--color-gold-glow);
        }

        .module-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .module-icon {
          font-size: 32px;
          line-height: 1;
        }

        .module-name {
          font-size: 20px;
          font-weight: 700;
          color: var(--color-text-dark);
          margin: 0;
        }

        .module-description {
          font-size: 15px;
          line-height: 1.7;
          color: var(--color-text-dark);
          opacity: 0.8;
          margin: 0;
        }

        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}