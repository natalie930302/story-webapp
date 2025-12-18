'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: '📚', label: '故事書架', emoji: '📚' },
    { href: '/modules', icon: '🤖', label: '互動模組', emoji: '⚙️' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <aside className="sidebar">
      <div className="bg-pattern" />
      <div className="sidebar-content">
        <nav className="nav-container">
          {navItems.map((item, idx) => {
            const isItemActive = isActive(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                title={item.label}
                style={{ animationDelay: `${0.2 + idx * 0.2}s` }}
              >
                <div className={`nav-item ${isItemActive ? 'active' : ''}`}>
                  <span>{item.icon}</span>
                  <div className="tooltip">{item.label}</div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <style jsx>{`
        .sidebar {
          width: 110px;
          background: var(--gradient-sidebar);
          padding: var(--spacing-lg) var(--spacing-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-lg);
          color: var(--color-text-primary);
          position: relative;
          border-right: 1px solid var(--color-border-light);
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background: radial-gradient(circle at 20% 50%, var(--color-neon-teal) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, var(--color-neon-purple) 0%, transparent 50%);
        }

        .sidebar-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .nav-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          align-items: center;
          margin-top: var(--spacing-sm);
        }

        .nav-item {
          transition: all var(--transition-smooth);
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          background: var(--gradient-card);
          border: 2px solid var(--color-border-turquoise);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          font-size: var(--text-3xl);
          color: var(--color-text-primary);
          text-decoration: none;
          cursor: pointer;
          transform: none;
          position: relative;
          text-shadow: var(--shadow-md);
        }

        .nav-item.active {
          background: var(--gradient-primary);
          border: 2px solid var(--color-gold);
          box-shadow: var(--shadow-lg), var(--shadow-glow-strong);
          color: var(--color-bg-dark);
        }

        .nav-item:hover {
          box-shadow: var(--shadow-xl), var(--shadow-glow);
          transform: translateY(-6px) scale(1.08);
        }

        .glow-effect {
          position: absolute;
          bottom: calc(-1 * var(--spacing-md));
          left: 50%;
          transform: translateY(-50%);
          width: 80%;
          height: 24px;
          background: radial-gradient(ellipse 100% 100% at 50% 0%, var(--color-gold-glow) 0%, transparent 70%);
          filter: blur(8px);
          opacity: 0;
          transition: var(--transition-base);
        }

        .nav-item:hover .glow-effect {
          opacity: 1;
          animation: glow-spread 0.4s ease-out forwards;
        }

        .tooltip {
          position: absolute;
          left: 95%;
          margin-left: var(--spacing-md);
          background: var(--gradient-tertiary);
          color: var(--color-text-primary);
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-sm);
          white-space: nowrap;
          font-size: var(--text-sm);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border-primary);
          z-index: 10;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .nav-item:hover .tooltip {
          opacity: 1;
          animation: tooltip-appear 0.2s ease-out;
        }

        @keyframes glow-spread {
          from { opacity: 0; height: 10px; }
          to { opacity: 1; height: 24px; }
        }
        
        @keyframes tooltip-appear {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </aside>
  );
}