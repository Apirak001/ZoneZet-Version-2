import React, { useState, useEffect } from 'react';
import {
  ChevronUp,
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

export default function Footer({ setActiveTab, lenis }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgressFromDOM = () => {
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight || 0;
      const windowHeight = scrollHeight - clientHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

      if (windowHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / windowHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    const activeLenis = lenis || window.__lenis;

    if (activeLenis) {
      const onLenisScroll = (e) => {
        if (typeof e.progress === 'number') {
          // Precise mathematical 0-100% progress matching Lenis scroll position
          setScrollProgress(Math.min(100, Math.max(0, e.progress * 100)));
        } else {
          updateProgressFromDOM();
        }
      };

      activeLenis.on('scroll', onLenisScroll);

      if (typeof activeLenis.progress === 'number') {
        setScrollProgress(Math.min(100, Math.max(0, activeLenis.progress * 100)));
      } else {
        updateProgressFromDOM();
      }

      return () => {
        activeLenis.off('scroll', onLenisScroll);
      };
    }

    // Native fallback
    window.addEventListener('scroll', updateProgressFromDOM, { passive: true });
    window.addEventListener('resize', updateProgressFromDOM, { passive: true });
    updateProgressFromDOM();

    return () => {
      window.removeEventListener('scroll', updateProgressFromDOM);
      window.removeEventListener('resize', updateProgressFromDOM);
    };
  }, [lenis]);

  const handleNav = (tabId) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(tabId);
    }
    const activeLenis = lenis || window.__lenis;
    if (activeLenis) {
      activeLenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    const activeLenis = lenis || window.__lenis;
    if (activeLenis) {
      activeLenis.scrollTo(0, {
        duration: 1.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      return;
    }

    const startY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (startY <= 0) return;

    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight || 0;
    const totalMaxScroll = scrollHeight - clientHeight;

    const duration = 800;
    let startTime = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(t);

      const currentY = Math.max(0, startY * (1 - ease));
      window.scrollTo(0, currentY);

      if (totalMaxScroll > 0) {
        setScrollProgress((currentY / totalMaxScroll) * 100);
      }

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        window.scrollTo(0, 0);
        setScrollProgress(0);
      }
    };

    requestAnimationFrame(animate);
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

      {/* Floating Circular Back-to-Top Button with Circular Scroll Progress */}
      <button
        onClick={scrollToTop}
        className={`floating-back-to-top ${scrollProgress > 3 ? 'is-visible' : ''}`}
        title="เลื่อนกลับขึ้นด้านบน"
        aria-label="Back to Top"
      >
        <svg className="scroll-progress-svg" viewBox="0 0 50 50" aria-hidden="true">
          <defs>
            <linearGradient id="scrollProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          {/* Background circle track */}
          <circle
            cx="25"
            cy="25"
            r="21"
            fill="none"
            stroke="rgba(168, 85, 247, 0.22)"
            strokeWidth="3"
          />
          {/* Animated Progress ring tracking every scroll movement */}
          <circle
            className="scroll-progress-circle"
            cx="25"
            cy="25"
            r="21"
            fill="none"
            stroke="url(#scrollProgressGradient)"
            strokeWidth="3"
            strokeDasharray={131.95}
            strokeDashoffset={131.95 - (scrollProgress / 100) * 131.95}
            strokeLinecap="round"
            transform="rotate(-90 25 25)"
          />
        </svg>
        <span className="scroll-arrow-icon">
          <ChevronUp size={22} strokeWidth={2.8} />
        </span>
      </button>
    </footer>
  );
}
