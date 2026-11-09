import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Menu,
  X,
  Home,
  LayoutDashboard,
  GitCompare,
  Bookmark,
  TrendingUp,
  Percent,
  Users,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  compareCount = 0,
  watchlistCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [mobileDashboardExpanded, setMobileDashboardExpanded] = useState(true);
  const dropdownWrapperRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Sub-items for Dashboard Dropdown (Simplified & Clean)
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
      label: 'อัตราเงินเฟ้อ (CPI)',
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

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsDashboardOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDashboardOpen(false);
    }, 180);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownWrapperRef.current && !dropdownWrapperRef.current.contains(event.target)) {
        setIsDashboardOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Pure, clean corporate navigation items with Lucide Icons
  const navItems = [
    { id: 'landing', label: 'หน้าแรก', icon: Home },
    { id: 'home', label: 'แดชบอร์ดข้อมูล', icon: LayoutDashboard, hasDropdown: true },
    { id: 'compare', label: 'ศูนย์เปรียบเทียบ', icon: GitCompare, badge: compareCount },
    { id: 'watchlist', label: 'รายการบันทึก', icon: Bookmark, badge: watchlistCount }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setIsDashboardOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboardActive = ['home', 'gdp', 'inflation', 'unemployment', 'health'].includes(activeTab);

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

        {/* Center: Desktop Navigation with Dropdown on Hover */}
        <nav className="biz-nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;

            // Special item: แดชบอร์ดข้อมูล with hover & click toggle dropdown
            if (item.hasDropdown) {
              return (
                <div
                  key={item.id}
                  ref={dropdownWrapperRef}
                  className="biz-nav-dropdown-wrapper"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDashboardOpen((prev) => !prev);
                    }}
                    className={`biz-nav-link ${isDashboardActive ? 'active' : ''}`}
                    title="คลิกหรือวางเมาส์เพื่อเปิดเมนูแดชบอร์ด"
                  >
                    <Icon size={16} className="biz-nav-icon" />
                    <span>{item.label}</span>
                    <ChevronDown
                      size={13}
                      className={`biz-nav-chevron ${isDashboardOpen ? 'rotate' : ''}`}
                    />
                  </button>

                  {/* Floating Dropdown on Hover or Click */}
                  {isDashboardOpen && (
                    <div className="biz-nav-dropdown-bridge">
                      <div className="biz-nav-dropdown-menu">
                        {dashboardSubItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = activeTab === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                handleNavClick(sub.id);
                                setIsDashboardOpen(false);
                              }}
                              className={`biz-nav-dropdown-item ${isSubActive ? 'active' : ''}`}
                              style={
                                isSubActive
                                  ? {
                                      borderColor: `${sub.color}60`,
                                      background: `linear-gradient(90deg, ${sub.color}22 0%, rgba(17, 8, 34, 0.6) 100%)`,
                                      boxShadow: `0 0 14px ${sub.color}30`
                                    }
                                  : {}
                              }
                            >
                              <div
                                className="biz-nav-item-icon-box"
                                style={{
                                  background: `${sub.color}18`,
                                  color: sub.color,
                                  border: `1px solid ${sub.color}35`
                                }}
                              >
                                <SubIcon size={16} />
                              </div>
                              <span className="biz-nav-item-title">{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Normal Navigation Links
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

            if (item.hasDropdown) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => setMobileDashboardExpanded(prev => !prev)}
                    className={`biz-mobile-link ${isDashboardActive ? 'active' : ''}`}
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Icon size={18} className="biz-nav-icon" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={15}
                      style={{
                        transform: mobileDashboardExpanded ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </button>

                  {mobileDashboardExpanded && (
                    <div className="biz-mobile-subgroup">
                      {dashboardSubItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = activeTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleNavClick(sub.id)}
                            className={`biz-mobile-sublink ${isSubActive ? 'active' : ''}`}
                          >
                            <SubIcon size={15} style={{ color: sub.color }} />
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

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
