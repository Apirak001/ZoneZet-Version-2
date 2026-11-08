import React from 'react';
import { LayoutDashboard, TrendingUp, DollarSign, Users, GitCompare, Bookmark, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, compareCount, watchlistCount }) {
  const navItems = [
    { id: 'home', label: 'ภาพรวมระบบ (OVERVIEW)', icon: LayoutDashboard, badge: null },
    { id: 'gdp', label: 'GDP GROWTH', icon: TrendingUp, badge: null },
    { id: 'inflation', label: 'INFLATION RATE', icon: DollarSign, badge: null },
    { id: 'unemployment', label: 'UNEMPLOYMENT', icon: Users, badge: null },
    { id: 'compare', label: 'COMPARE HUB', icon: GitCompare, badge: compareCount > 0 ? compareCount : null },
    { id: 'watchlist', label: 'WATCHLIST', icon: Bookmark, badge: watchlistCount > 0 ? watchlistCount : null }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/img/logo.png" alt="ZoneZet" className="sidebar-brand-logo" onError={(e) => { e.target.style.display = 'none'; }} />
        <div className="sidebar-brand-name">ZoneZet</div>
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
              <Icon size={16} strokeWidth={2} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-pill-badge">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', marginBottom: '0.35rem', fontWeight: 600 }}>
          <ShieldCheck size={14} />
          <span>Express Gateway: Active</span>
        </div>
        <div>หลักสูตร 801201 · กลุ่ม 2 คน</div>
      </div>
    </aside>
  );
}
