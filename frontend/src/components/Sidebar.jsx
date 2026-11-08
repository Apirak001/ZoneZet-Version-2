import React from 'react';
import { Home, TrendingUp, DollarSign, Users, Scale, Bookmark, Activity } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, compareCount, watchlistCount }) {
  const navItems = [
    { id: 'home', label: 'HOME', icon: Home, badge: null },
    { id: 'gdp', label: 'GDP GROWTH', icon: TrendingUp, badge: null },
    { id: 'inflation', label: 'INFLATION', icon: DollarSign, badge: null },
    { id: 'unemployment', label: 'UNEMPLOYMENT', icon: Users, badge: null },
    { id: 'compare', label: 'COMPARE HUB', icon: Scale, badge: compareCount > 0 ? compareCount : 'NEW' },
    { id: 'watchlist', label: 'WATCHLIST', icon: Bookmark, badge: watchlistCount > 0 ? watchlistCount : null }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/img/logo.png" alt="ZoneZet" className="sidebar-brand-logo" onError={(e) => { e.target.style.display = 'none'; }} />
        <div>
          <div className="sidebar-brand-name">ZoneZet</div>
          <span className="sidebar-version-badge">v2.0 React+Express</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-pill-badge ${item.badge === 'NEW' ? 'badge-new' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', marginBottom: '0.3rem' }}>
          <Activity size={14} />
          <span>Express Backend Online</span>
        </div>
        <div>Course 801201 · Team of 2</div>
      </div>
    </aside>
  );
}
