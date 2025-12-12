'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { href: '/', icon: '📚', label: '故事書架', emoji: '📚' },
    { href: '/modules', icon: '🤖', label: '互動模組', emoji: '⚙️' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <aside className="sidebar-rail" aria-label="主要導覽">
      {/* Decorative background pattern */}
      <div className="sidebar-bg" />
      <div className="sidebar-inner">

        {/* Navigation items */}
        <nav className="sidebar-nav">
          {navItems.map((item, idx) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`pill ${isActive(item.href) ? 'active' : ''} appear`}
              title={item.label}
              style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Hover glow effect */}
              {hoveredItem === item.href && (
                <div className="pill-glow" />
              )}
              <span>{item.icon}</span>
              
              {/* Label tooltip */}
              {hoveredItem === item.href && (
                <div className="pill-tooltip">{item.label}</div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}