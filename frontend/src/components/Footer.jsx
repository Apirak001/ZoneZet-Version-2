import React from 'react';
import {
  ArrowUp,
  Home,
  LayoutDashboard,
  TrendingUp,
  Percent,
  Users,
  GitCompare,
  Bookmark,
  Globe,
  Zap,
  BarChart3,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const handleNav = (tabId) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(tabId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="official-footer">
      <div className="official-footer-container">
        {/* Main 3 Columns */}
        <div className="official-footer-grid">
          {/* Column 1: Brand & Purpose */}
          <div className="official-footer-col brand-col">
            <div className="official-brand" onClick={() => handleNav('landing')}>
              <img
                src="/img/logo.png"
                alt="ZoneZet Logo"
                className="official-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/ZoneZet.png';
                }}
              />
              <span className="official-brand-name">
                zonezet<span className="brand-dot">.</span>
              </span>
            </div>

            <p className="official-brand-desc">
              ศูนย์รวมข้อมูลและวิเคราะห์เศรษฐกิจมหภาคระดับโลก 
              เชื่อมโยงสถิติสด 196 ประเทศจาก World Bank 
              ช่วยให้คุณมองเห็นทิศทางตลาดและตัดสินใจได้อย่างแม่นยำ
            </p>

            <div className="official-status-badge">
              <span className="status-dot-green" />
              <span>All Systems Operational · World Bank Live Data</span>
            </div>
          </div>

          {/* Column 2: Navigation & Indicators */}
          <div className="official-footer-col">
            <h4 className="official-col-heading">Modules &amp; Indicators</h4>
            <ul className="official-links-list">
              <li>
                <button onClick={() => handleNav('landing')} className="official-link-btn">
                  <Home size={15} className="official-nav-icon" />
                  <span>หน้าแรก</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('home')} className="official-link-btn">
                  <LayoutDashboard size={15} className="official-nav-icon" />
                  <span>ภาพรวมระบบ</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gdp')} className="official-link-btn">
                  <TrendingUp size={15} className="official-nav-icon" />
                  <span>การเติบโต GDP</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('inflation')} className="official-link-btn">
                  <Percent size={15} className="official-nav-icon" />
                  <span>ดัชนีเงินเฟ้อ (CPI)</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('unemployment')} className="official-link-btn">
                  <Users size={15} className="official-nav-icon" />
                  <span>อัตราการว่างงาน</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('compare')} className="official-link-btn">
                  <GitCompare size={15} className="official-nav-icon" />
                  <span>ศูนย์เปรียบเทียบ</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('watchlist')} className="official-link-btn">
                  <Bookmark size={15} className="official-nav-icon" />
                  <span>รายการบันทึก</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Architecture & Data */}
          <div className="official-footer-col">
            <h4 className="official-col-heading">Architecture &amp; Data</h4>
            <ul className="official-meta-list">
              <li className="official-meta-item">
                <span className="meta-icon-box">
                  <Globe size={15} color="#38bdf8" />
                </span>
                <span>World Bank Open Data API v2</span>
              </li>
              <li className="official-meta-item">
                <span className="meta-icon-box">
                  <Zap size={15} color="#c084fc" />
                </span>
                <span>High-Speed In-Memory Cache O(1)</span>
              </li>
              <li className="official-meta-item">
                <span className="meta-icon-box">
                  <BarChart3 size={15} color="#a855f7" />
                </span>
                <span>Multi-Dimensional Recharts Graphics</span>
              </li>
              <li className="official-meta-item">
                <span className="meta-icon-box">
                  <ShieldCheck size={15} color="#10b981" />
                </span>
                <span>Zero-Crash Safe Fallback Engine</span>
              </li>
              <li className="official-meta-item">
                <span className="meta-icon-box">
                  <CheckCircle2 size={15} color="#34d399" />
                </span>
                <span>Open Data License (CC-BY 4.0)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Reference */}
        <div className="official-bottom-bar">
          <div className="official-copyright">
            © 2026 <strong>ZoneZet</strong>. All rights reserved. แพลตฟอร์มวิเคราะห์เศรษฐกิจมหภาคพหุภาคีระดับสากล
          </div>

          <div className="official-bottom-links">
            <span>World Bank Open Data API</span>
            <span className="bottom-separator">•</span>
            <span>Creative Commons CC-BY 4.0</span>
            <span className="bottom-separator">•</span>
            <span>Zero-Crash SLA 100%</span>
          </div>
        </div>
      </div>

      {/* Floating Circular Back-to-Top Button (Fixed, Clean & Static) */}
      <button
        onClick={scrollToTop}
        className="floating-back-to-top"
        title="เลื่อนกลับขึ้นด้านบน"
        aria-label="Back to Top"
      >
        <ArrowUp size={22} strokeWidth={2.5} />
      </button>
    </footer>
  );
}
