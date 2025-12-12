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
    <div className="p-4 appear">
      <h1 className="page-title">🤖 數位互動模組</h1>

      <h2 className="section-title rose">模組設計理念</h2>

      <p className="lead">
        為了給予兒童有更好的媒介與故事互動，我們選用了像是風扇、熱燈、震動馬達等在感覺上具有明顯差異的模組。我們透過這些感官上的刺激，讓兒童能夠身臨其境。<br/>我們並未對於模組規定相對應的場景，皆由兒童自行想像發揮，於未來亦會增加更多的模組設計。
      </p>

      <h2 className="section-title">現有感官模組</h2>

      <div className="module-grid">
        {modules.map((mod, index) => (
          <div
            key={index}
            className="module-card appear"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="module-card-header">
              <div className="module-icon icon-md">{mod.icon}</div>
              <h3 className="module-name">{mod.name}</h3>
            </div>
            <p className="module-desc">{mod.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}