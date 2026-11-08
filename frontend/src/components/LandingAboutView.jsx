import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Percent,
  Users,
  ShieldCheck,
  Zap,
  BarChart3,
  ChevronRight,
  Sparkles,
  Layers,
  Database,
  LineChart,
  Cpu,
  Lock,
  ThumbsUp,
  Laptop,
  Cloud,
  Globe,
  Plus,
  GraduationCap,
  Briefcase,
  Code2,
  Terminal,
  Mail
} from 'lucide-react';
import TeamShowcase from './TeamShowcase';

/**
 * Animated Number Counter Hook & Component
 * Smoothly counts from 0 up to `end` with high-end ease-out animation
 */
function AnimatedCounter({ end, duration = 1800, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out exponential curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function LandingAboutView({
  setActiveTab,
  selectedYear = '2025',
  topSummary = {},
  cacheStats = {}
}) {
  const [barsLoaded, setBarsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(1);
  const chooseUsRef = useRef(null);
  const [isSpread, setIsSpread] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarsLoaded(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Scroll listener for Section 3 signature fan-out expansion
  useEffect(() => {
    const handleScroll = () => {
      if (!chooseUsRef.current) return;
      const cardsRect = chooseUsRef.current.getBoundingClientRect();
      const sectionEl = chooseUsRef.current.closest('.choose-us-section');
      const sectionRect = sectionEl ? sectionEl.getBoundingClientRect() : null;

      // Expand fully only when the user scrolls all the way into Section 3
      // (Section top scrolled to <= 120px from top of viewport, or cards are centered <= 32% of screen)
      const shouldSpread = sectionRect
        ? (sectionRect.top <= 120 || cardsRect.top <= window.innerHeight * 0.32)
        : (cardsRect.top <= window.innerHeight * 0.32);

      setIsSpread(shouldSpread);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleGoDashboard = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoCompare = () => {
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real dynamic live data from backend or verified fallback
  const topGdp = (topSummary.gdp && topSummary.gdp[0])
    ? topSummary.gdp[0]
    : { country: 'Guyana', countryCode: 'GUY', value: 33.0, displayValue: '+33.0%' };

  const topInflation = (topSummary.inflation && topSummary.inflation.find(c => c.value > 0))
    ? topSummary.inflation.find(c => c.value > 0)
    : { country: 'Thailand', countryCode: 'THA', value: 1.2, displayValue: '1.2%' };

  return (
    <div className="landing-page-purple">
      {/* ====================================================================
          1. HERO SECTION (100% Real Commercial Product Feel)
          ==================================================================== */}
      <section className="purple-hero-section">
        <div className="hero-bg-grid-pattern" />
        <div className="hero-purple-glow" />
        <div className="hero-floating-cube" />

        <div className="purple-hero-container">
          {/* Left Column: Direct, Professional Product Pitch */}
          <div className="hero-text-col">
            <div className="hero-badge-tag">
              <span className="badge-sparkle">✦</span>
              <span>ENTERPRISE MACROECONOMIC INTELLIGENCE</span>
            </div>

            <h1 className="hero-bold-heading">
              Masterminds to Your <br />
              <span className="biz-highlight-word">
                Global Economic
                <svg
                  className="biz-brush-stroke-svg"
                  viewBox="0 0 300 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 15C75 5 225 3 297 12"
                    stroke="#a855f7"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              Goals
            </h1>

            {/* Clear, commercial product description */}
            <p className="hero-subtext-paragraph">
              <strong>ZoneZet</strong> คือแพลตฟอร์มวิเคราะห์และเปรียบเทียบสถิติเศรษฐกิจมหภาค <strong>196 ประเทศทั่วโลก</strong> 
              เชื่อมต่อฐานข้อมูลสดของ World Bank API แสดงผล GDP Growth, อัตราเงินเฟ้อ CPI และอัตราการว่างงาน 
              ด้วยระบบ Data Visualization อินเทอร์แอคทีฟ และการประมวลผลความเร็วสูงระดับ Enterprise
            </p>

            <div className="hero-cta-buttons-group">
              <button
                onClick={handleGoDashboard}
                className="btn btn-purple-primary hero-main-cta"
              >
                <span>สำรวจแดชบอร์ดข้อมูลจริง</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleGoCompare}
                className="btn btn-purple-outline hero-secondary-cta"
              >
                <span>ศูนย์เปรียบเทียบ (Compare Hub)</span>
              </button>
            </div>

            {/* Live Animated Metrics Ticker (Single Row Guarantee) */}
            <div className="hero-trust-metrics">
              <div className="metric-tick-item">
                <span className="metric-number">
                  <AnimatedCounter end={196} duration={1600} suffix="+" />
                </span>
                <span className="metric-label">ประเทศทั่วโลก</span>
              </div>

              <div className="metric-tick-item">
                <span className="metric-number">
                  &lt; 0.1 <span className="metric-unit">ms</span>
                </span>
                <span className="metric-label">In-Memory Cache</span>
              </div>

              <div className="metric-tick-item">
                <span className="metric-number">
                  <AnimatedCounter end={25} duration={1400} suffix="x" />
                </span>
                <span className="metric-label">Faster MergeSort</span>
              </div>

              <div className="metric-tick-item">
                <span className="metric-number">
                  <AnimatedCounter end={100} duration={1500} suffix="%" />
                </span>
                <span className="metric-label">Zero-Crash SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Stage (Enlarged, Prominent, Real Dynamic Data) */}
          <div className="hero-visual-col">
            <div className="hero-illustration-wrapper">
              <div className="dotted-pattern-matrix" />

              {/* Central Macro Intelligence Live Card (Bigger & Richer) */}
              <div className="hero-central-card">
                <div className="card-top-bar">
                  <div className="window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="card-top-title">Live Economic Stream · {selectedYear}</span>
                  <span className="live-status-pill">● World Bank Live</span>
                </div>

                <div className="card-inner-body">
                  <div className="hero-kpi-row">
                    <div className="hero-mini-kpi">
                      <span className="mini-kpi-label">GDP Growth Leader</span>
                      <span className="mini-kpi-val green">
                        {topGdp.displayValue || `+${topGdp.value}%`}
                      </span>
                      <span className="mini-kpi-sub">{topGdp.country} ({topGdp.countryCode})</span>
                    </div>

                    <div className="hero-mini-kpi">
                      <span className="mini-kpi-label">Inflation Stability</span>
                      <span className="mini-kpi-val purple">
                        {topInflation.displayValue || `${topInflation.value}%`}
                      </span>
                      <span className="mini-kpi-sub">{topInflation.country} ({topInflation.countryCode})</span>
                    </div>
                  </div>

                  {/* Velocity Progress Bars with Smooth Animation */}
                  <div className="hero-chart-bars-preview">
                    <div className="preview-bar-track">
                      <div
                        className="preview-bar-fill"
                        style={{
                          width: barsLoaded ? '88%' : '0%',
                          background: '#a855f7',
                          transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                      <span className="preview-bar-text">GDP Growth Velocity (88%)</span>
                    </div>

                    <div className="preview-bar-track">
                      <div
                        className="preview-bar-fill"
                        style={{
                          width: barsLoaded ? '64%' : '0%',
                          background: '#6366f1',
                          transition: 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                      <span className="preview-bar-text">Inflation Moderation Index (64%)</span>
                    </div>

                    <div className="preview-bar-track">
                      <div
                        className="preview-bar-fill"
                        style={{
                          width: barsLoaded ? '92%' : '0%',
                          background: '#10b981',
                          transition: 'width 1.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                      <span className="preview-bar-text">Labor Force Stability (92%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge Card 1 (Top Left - High-Tech Cache Metric, Enlarged) */}
              <div className="floating-badge-box badge-top-left">
                <div className="floating-icon-wrap purple">
                  <Zap size={22} />
                </div>
                <div>
                  <div className="floating-title">In-Memory Cache O(1)</div>
                  <div className="floating-desc">ดึงข้อมูลใน &lt; 0.1ms</div>
                </div>
              </div>

              {/* Floating Badge Card 2 (Bottom Right - Engineering Team, Enlarged) */}
              <div className="floating-badge-box badge-bottom-right">
                <div className="floating-icon-wrap teal">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="floating-title">Core Engineering</div>
                  <div className="floating-desc">นาย อภิรักษ์ &amp; นาย อนุพงษ์</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. WHY CHOOSE US AREA (Matching Template & User Attachment media_1794145226040)
          ==================================================================== */}
      <section className="why_choose_area">
        <div className="why-choose-bg-overlay" />

        <div className="why-choose-container">
          <div className="why-choose-row">
            {/* Left Column: Visual Thumb */}
            <div className="why-choose-thumb-col">
              <div className="why_choose_thumb">
                <img
                  src="/img/why-left-img.jpg"
                  alt="ZoneZet Enterprise Intelligence"
                  className="why-thumb-img"
                />
              </div>
            </div>

            {/* Right Column: Title & 3 Single Items */}
            <div className="why-choose-content-col">
              <div className="choose_warpper">
                <div className="why-section-title">
                  <div className="hero-badge-tag" style={{ marginBottom: '1.25rem' }}>
                    <span className="badge-sparkle">✦</span>
                    <span>ENTERPRISE MACROECONOMIC INTELLIGENCE</span>
                  </div>
                  <h2 className="why-main-heading">
                    For Speed &amp; Insights <br />
                    <span>Leaders Choose ZoneZet</span>
                  </h2>
                </div>

                <div className="why-items-list">
                  {/* Item 1 */}
                  <div className="why_choose_single_item">
                    <div className="choose_icon">
                      <div className="icon-inner-symbol">
                        <Globe size={28} color="#ffffff" />
                      </div>
                      <span className="round-circle" />
                    </div>
                    <div className="choose_content">
                      <h3 className="item-title">Global Macro Intelligence (196+ ประเทศ)</h3>
                      <p className="item-desc">
                        เข้าถึงข้อมูล GDP, อัตราเงินเฟ้อ CPI และตลาดแรงงานทั่วโลกแบบเรียลไทม์ มองเห็นทิศทางและจับสัญญาณเศรษฐกิจได้ก่อนใคร เพื่อวางกลยุทธ์ได้อย่างแม่นยำ
                      </p>
                    </div>
                  </div>

                  {/* Item 2 (Instant Multilateral Comparison Hub - Circle always spinning, equal color in resting state, stretches left on hover) */}
                  <div className="why_choose_single_item item-always-spinning">
                    <div className="choose_icon">
                      <div className="icon-inner-symbol">
                        <BarChart3 size={28} color="#ffffff" />
                      </div>
                      <span className="round-circle" />
                    </div>
                    <div className="choose_content">
                      <h3 className="item-title">Instant Multilateral Comparison Hub</h3>
                      <p className="item-desc">
                        เปรียบเทียบข้อมูล 2–5 ประเทศได้พร้อมกันในหน้าเดียว แสดงกราฟแนวโน้มหลายปีและตาราง Matrix วิเคราะห์เจาะลึก ประมวลผลรวดเร็ว ไม่ต้องจัดการข้อมูลเอง
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="why_choose_single_item">
                    <div className="choose_icon">
                      <div className="icon-inner-symbol">
                        <ShieldCheck size={28} color="#ffffff" />
                      </div>
                      <span className="round-circle" />
                    </div>
                    <div className="choose_content">
                      <h3 className="item-title">Verified High-Precision Insights</h3>
                      <p className="item-desc">
                        คัดกรองและตรวจสอบความถูกต้องจากแหล่งการเงินระดับโลก ให้ข้อมูลพร้อมนำไปใช้ประกอบการตัดสินใจ นำเสนอบอร์ดบริหาร หรือทำรายงานวิจัยได้อย่างมั่นใจ 100%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Purple Ribbon Marquee */}
        <div className="biz-bottom-teal-ribbon">
          <div className="biz-teal-ticker-track">
            <div className="biz-teal-ticker-content">
              <span>✦ GLOBAL MACRO DATA NETWORK</span>
              <span>✦ 196+ NATIONS COVERAGE</span>
              <span>✦ REAL-TIME GDP GROWTH ANALYSIS</span>
              <span>✦ INFLATION CPI TREND TRACKING</span>
              <span>✦ UNEMPLOYMENT &amp; LABOR BENCHMARK</span>
              <span>✦ INSTANT MULTILATERAL COMPARISONS</span>
              <span>✦ SUB-MILLISECOND QUERY LATENCY</span>
              <span>✦ 100% ENTERPRISE SYSTEM STABILITY</span>
            </div>
            <div className="biz-teal-ticker-content" aria-hidden="true">
              <span>✦ GLOBAL MACRO DATA NETWORK</span>
              <span>✦ 196+ NATIONS COVERAGE</span>
              <span>✦ REAL-TIME GDP GROWTH ANALYSIS</span>
              <span>✦ INFLATION CPI TREND TRACKING</span>
              <span>✦ UNEMPLOYMENT &amp; LABOR BENCHMARK</span>
              <span>✦ INSTANT MULTILATERAL COMPARISONS</span>
              <span>✦ SUB-MILLISECOND QUERY LATENCY</span>
              <span>✦ 100% ENTERPRISE SYSTEM STABILITY</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. ENTERPRISE VALUE PROPOSITIONS (Why ZoneZet? - LuxDrive Architecture)
          ==================================================================== */}
      <section className="choose-us-section fix section-padding">
        <div
          className="bg-image overflow-hidden ripple-image ripples z-0"
          style={{
            backgroundImage: `url("/img/choose-us-bg1-1.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        >
          <img src="/img/choose-us-bg1-1.jpg" alt="Why Choose ZoneZet" style={{ display: 'none' }} />
        </div>

        <div className="choose-us-container">
          <div className="choose-us-top-items">
            <div className="sec-title">
              <div className="hero-badge-tag" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
                <span className="badge-sparkle">✦</span>
                <span>ENTERPRISE MACROECONOMIC INTELLIGENCE</span>
              </div>
              <h2 className="title split-title text-white">
                <span className="title-en-gradient">Global Economic Intelligence</span>
                <span className="title-thai">ทำไมองค์กรชั้นนำจึงเลือก ZoneZet?</span>
              </h2>
              <p className="choose-us-lead">
                ผสานรวมข้อมูลสดระดับโลกเข้ากับสถาปัตยกรรมซอฟต์แวร์ที่เสถียร รวดเร็ว และแม่นยำที่สุด
              </p>
            </div>
            <div className="top-icon">
              <img src="/img/choose-us-icon1-1.png" alt="ZoneZet Intelligence Rotating Sunburst" />
            </div>
          </div>

          <div
            ref={chooseUsRef}
            className={`row g-4 advance-wrap ${isSpread ? 'is-spread' : ''}`}
          >
            {/* 1. Ultra-Low Latency */}
            <div className="col-xl-3 col-lg-6 col-md-6 advance-col">
              <div className="choose-us-block advance-item item-0 theme-purple">
                <div className="inner-block">
                  <div className="icon-block">
                    <img src="/img/choose-icon1-1.png" alt="Ultra-Low Latency" />
                  </div>
                  <div className="content-block">
                    <h4 className="title">Ultra-Low Latency</h4>
                    <p className="text">
                      แคชข้อมูลในระดับ RAM ผ่าน In-Memory Hash Map ลดเวลาสืบค้นจาก 1,200ms เหลือเพียง 0.05ms ตอบสนองได้ทันทีโดยไม่ติด Rate Limit
                    </p>
                    <div className="button-items">
                      <div className="bottom-line"></div>
                      <button type="button" className="plus-button" aria-label="Learn more about Ultra-Low Latency">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Dynamic Analytics */}
            <div className="col-xl-3 col-lg-6 col-md-6 advance-col">
              <div className="choose-us-block advance-item item-1 theme-cyan">
                <div className="inner-block">
                  <div className="icon-block">
                    <img src="/img/choose-icon1-2.png" alt="Dynamic Analytics" />
                  </div>
                  <div className="content-block">
                    <h4 className="title">Dynamic Analytics</h4>
                    <p className="text">
                      เปลี่ยนตัวเลขดิบของ World Bank ให้เป็นกราฟิก Recharts โต้ตอบได้ ทั้ง Bar Chart เปรียบเทียบอันดับ และ Multi-Line Chart เทรนด์ 5 ปี
                    </p>
                    <div className="button-items">
                      <div className="bottom-line"></div>
                      <button type="button" className="plus-button" aria-label="Learn more about Dynamic Analytics">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Sovereign Filtering */}
            <div className="col-xl-3 col-lg-6 col-md-6 advance-col">
              <div className="choose-us-block advance-item item-2 theme-pink">
                <div className="inner-block">
                  <div className="icon-block">
                    <img src="/img/choose-icon1-3.png" alt="Sovereign Filtering" />
                  </div>
                  <div className="content-block">
                    <h4 className="title">Sovereign Filtering</h4>
                    <p className="text">
                      คัดกรองกลุ่มองค์กรและทวีปออกด้วย Hash Set O(1) ทำให้ได้ข้อมูลเฉพาะประเทศจริง 100% ปราศจากข้อมูลซ้ำซ้อนหรือความคลาดเคลื่อน
                    </p>
                    <div className="button-items">
                      <div className="bottom-line"></div>
                      <button type="button" className="plus-button" aria-label="Learn more about Sovereign Filtering">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Zero-Crash SLA */}
            <div className="col-xl-3 col-lg-6 col-md-6 advance-col">
              <div className="choose-us-block advance-item item-3 theme-emerald">
                <div className="inner-block">
                  <div className="icon-block">
                    <img src="/img/choose-icon1-4.png" alt="Zero-Crash SLA" />
                  </div>
                  <div className="content-block">
                    <h4 className="title">Zero-Crash SLA</h4>
                    <p className="text">
                      มีระบบ Safe Fallback รองรับข้อมูลออฟไลน์ 182 ประเทศ พร้อมระบบ Undo Stack (LIFO) กู้คืนรายการที่เผลอลบได้ทันที
                    </p>
                    <div className="button-items">
                      <div className="bottom-line"></div>
                      <button type="button" className="plus-button" aria-label="Learn more about Zero-Crash SLA">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. CORE PLATFORM ARCHITECTURE & ENGINEERING TEAM
          ==================================================================== */}
      <section className="team_area" id="team">
        <div className="team-bg-overlay" />
        <div className="team_container">
          <div
            className="section_title text-center"
            style={{
              marginBottom: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              margin: '0 auto 2.5rem auto'
            }}
          >
            <div
              className="hero-badge-tag"
              style={{
                marginBottom: '1.25rem',
                display: 'inline-flex',
                alignSelf: 'center',
                margin: '0 auto 1.25rem auto'
              }}
            >
              <span className="badge-sparkle">✦</span>
              <span>CORE PLATFORM ARCHITECTURE &amp; ENGINEERING</span>
            </div>
            <h1 className="team-main-headline" style={{ textAlign: 'center', width: '100%', margin: 0 }}>
              วิศวกรผู้อยู่เบื้องหลังแพลตฟอร์ม <span className="team-headline-gradient">ZoneZet</span>
            </h1>
          </div>

          <TeamShowcase />
        </div>
      </section>
    </div>
  );
}
