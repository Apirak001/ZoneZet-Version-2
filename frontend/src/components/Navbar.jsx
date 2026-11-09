import React, { useState } from 'react';
import {
  ArrowRight,
  Menu,
  X,
  Home,
  LayoutDashboard,
  GitCompare,
  TrendingUp,
  Percent,
  Users
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  compareCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dashboard views shown directly in the navbar
  const dashboardSubItems = [
    {
      id: 'home',
      label: 'ภาพรวมแดชบอร์ด',
      icon: LayoutDashboard,
      color: '#c084fc'
    },
    {
      id: 'gdp',
      label: 'GDP Growth',
      icon: TrendingUp,
      color: '#34d399'
    },
    {
      id: 'inflation',
      label: 'อัตราเงินเฟ้อ',
      icon: Percent,
      color: '#f43f5e'
    },
    {
      id: 'unemployment',
      label: 'อัตราการว่างงาน',
      icon: Users,
      color: '#38bdf8'
    }
  ];

  // Pure, clean corporate navigation items with Lucide Icons
  const navItems = [
    { id: 'landing', label: 'หน้าแรก', icon: Home },
    ...dashboardSubItems,
    { id: 'compare', label: 'ศูนย์เปรียบเทียบ', icon: GitCompare, badge: compareCount }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="biz-header">
      <div className="biz-nav-container">
        {/* Left: Real Project Logo (/img/logo.png) */}
        <div className="biz-brand" onClick={() => handleNavClick('landing')} title="กลับสู่หน้าแรก ZoneZet">
          <img
            src="/img/logo.png"
            alt="ZoneZet Logo"
            className="biz-logo-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/ZoneZet.png';
            }}
          />
          <div className="biz-brand-text">
            <span className="biz-brand-name">zonezet</span>
            <span className="biz-brand-dot">.</span>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="biz-nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`biz-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} className="biz-nav-icon" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="biz-nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Mobile Hamburger Toggle */}
        <div className="biz-nav-actions">
          <button
            className="biz-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="biz-mobile-drawer">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`biz-mobile-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} className="biz-nav-icon" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="biz-nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
          <div className="biz-mobile-cta-box">
            <button
              onClick={() => handleNavClick('home')}
              className="biz-cta-button"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>เข้าสู่แดชบอร์ดข้อมูลจริง</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
