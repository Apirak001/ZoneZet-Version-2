import React, { useState, useEffect, useRef, memo } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  Globe,
  Plus,
  Target,
  PieChart,
  Activity,
  Earth
} from 'lucide-react';
import TeamShowcase from './TeamShowcase';

const LandingAboutView = memo(function LandingAboutView({
  setActiveTab,
  selectedYear = '2025',
  topSummary = {}
}) {
  const [barsLoaded, setBarsLoaded] = useState(false);
  const chooseUsRef = useRef(null);
  const [isSpread, setIsSpread] = useState(false);
  const isSpreadRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBarsLoaded(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Signature Fan-Out Scroll Expansion for the 4 Value Proposition Cards
  useEffect(() => {
    const handleScroll = () => {
      if (!chooseUsRef.current) return;
      const rect = chooseUsRef.current.getBoundingClientRect();
      const windowH = window.innerHeight || document.documentElement.clientHeight;

      // Expand into 4 columns when cards enter viewport (top <= 75% screen)
      // Fold back into a center deck when scrolling back up (top > 75% screen)
      const shouldSpread = rect.top <= windowH * 0.75;
      if (shouldSpread !== isSpreadRef.current) {
        isSpreadRef.current = shouldSpread;
        setIsSpread(shouldSpread);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Smooth Scroll Reveal Observer
  // Ensures elements smoothly reveal on scroll into view without vanishing or flickering
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        root: null,
        rootMargin: '40px 0px 40px 0px',
        threshold: 0.05,
      }
    );

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
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

  const topUnemployment = (topSummary.unemployment && topSummary.unemployment[0])
    ? topSummary.unemployment[0]
    : { country: 'South Africa', countryCode: 'ZAF', value: 32.9, displayValue: '32.9%' };

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
            <div className="hero-badge-tag reveal-on-scroll">
              <span className="badge-sparkle">✦</span>
              <span>MACROECONOMIC ANALYSIS PLATFORM</span>
            </div>

            <h1 className="hero-bold-heading reveal-on-scroll reveal-delay-1">
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
            <p className="hero-subtext-paragraph reveal-on-scroll reveal-delay-2" lang="th">
              <strong>ZoneZet</strong> คือแพลตฟอร์มวิเคราะห์และเปรียบเทียบข้อมูลเศรษฐกิจมหภาคระดับโลก <span className="text-nowrap">ที่เชื่อมต่อกับ</span>ฐานข้อมูลของ <span className="text-nowrap">World Bank API</span> เพื่อดึงข้อมูลเชิงสถิติแบบเรียลไทม์ <span className="text-nowrap">ระบบถูกออกแบบมาให้</span>แสดงผลตัวชี้วัดที่สำคัญทางเศรษฐกิจ ได้แก่ อัตราการเติบโตของ GDP, อัตราเงินเฟ้อ และอัตราการว่างงานของประเทศต่างๆ ทั่วโลก ผ่านแดชบอร์ดที่ใช้งานง่าย ช่วยลดความซับซ้อนของข้อมูล และสนับสนุนให้ผู้ใช้งานสามารถติดตาม วิเคราะห์ <span className="text-nowrap">หรือเปรียบเทียบ</span>แนวโน้มทางเศรษฐกิจได้อย่างรวดเร็วและแม่นยำ
            </p>

            <div className="hero-cta-buttons-group reveal-on-scroll reveal-delay-3">
              <button
                onClick={handleGoDashboard}
                className="btn btn-purple-primary hero-main-cta"
              >
                <span>สำรวจข้อมูลบนเดชบอร์ด</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleGoCompare}
                className="btn btn-purple-outline hero-secondary-cta"
              >
                <span>ศูนย์เปรียบเทียบ</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Stage (Enlarged, Prominent, Real Dynamic Data) */}
          <div className="hero-visual-col reveal-on-scroll reveal-zoom reveal-delay-2">
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
                  <span className="card-top-title">Live Economic Global · {selectedYear}</span>
                  <span className="live-status-pill">● World Bank API</span>
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

                    <div className="hero-mini-kpi">
                      <span className="mini-kpi-label">Unemployment Rate</span>
                      <span className="mini-kpi-val sky">
                        {topUnemployment.displayValue || `${topUnemployment.value}%`}
                      </span>
                      <span className="mini-kpi-sub">{topUnemployment.country} ({topUnemployment.countryCode})</span>
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
                      <span className="preview-bar-text">GDP Growth Global (88%)</span>
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
                      <span className="preview-bar-text">Inflation Stability Global (64%)</span>
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
                      <span className="preview-bar-text">Labor Force Stability Global (92%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge Card 2 (Bottom Right - Engineering Team, Enlarged) */}
              <div className="floating-badge-box badge-bottom-right">
                <div className="floating-icon-wrap teal">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="floating-title">Core Engineering</div>
                  <div className="floating-desc">นายอภิรักษ์ &amp; นายอนุพงค์</div>
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
            <div className="why-choose-thumb-col reveal-on-scroll reveal-from-left">
              <div className="why_choose_thumb">
                <img
                  src="/img/why-left-img.jpg"
                  alt="ZoneZet Enterprise Intelligence"
                  className="why-thumb-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Right Column: Title & 3 Single Items */}
            <div className="why-choose-content-col">
              <div className="choose_warpper">
                <div className="why-section-title reveal-on-scroll">
                  <div className="hero-badge-tag" style={{ marginBottom: '1.25rem' }}>
                    <span className="badge-sparkle">✦</span>
                    <span>MACROECONOMIC ANALYSIS PLATFORM</span>
                  </div>
                  <h2 className="why-main-heading">
                    For Speed &amp; Insights <br />
                    <span>Leaders Choose ZoneZet</span>
                  </h2>
                </div>

                <div className="why-items-list">
                  {/* Item 1 */}
                  <div className="why_choose_single_item reveal-on-scroll reveal-delay-1">
                    <div className="choose_icon">
                      <div className="icon-inner-symbol">
                        <Globe size={28} color="#ffffff" />
                      </div>
                      <span className="round-circle" />
                    </div>
                    <div className="choose_content">
                      <h3 className="item-title">Global Macro Intelligence (196+ ประเทศ)</h3>
                      <p className="item-desc">
                        เข้าถึงข้อมูล GDP, อัตราเงินเฟ้อ และตลาดแรงงานทั่วโลกแบบเรียลไทม์ มองเห็นทิศทางและจับสัญญาณเศรษฐกิจได้ก่อนใคร เพื่อวางกลยุทธ์ได้อย่างแม่นยำ
                      </p>
                    </div>
                  </div>

                  {/* Item 2 (Instant Multilateral Comparison Hub - Circle always spinning, equal color in resting state, stretches left on hover) */}
                  <div className="why_choose_single_item item-always-spinning reveal-on-scroll reveal-delay-2">
                    <div className="choose_icon">
                      <div className="icon-inner-symbol">
                        <BarChart3 size={28} color="#ffffff" />
                      </div>
                      <span className="round-circle" />
                    </div>
                    <div className="choose_content">
                      <h3 className="item-title">Instant Multilateral Comparison Hub</h3>
                      <p className="item-desc">
                        เปรียบเทียบข้อมูล 2-4 ประเทศได้พร้อมกันในหน้าเดียว แสดงกราฟแนวโน้มหลายปีและตาราง Matrix วิเคราะห์เจาะลึก ประมวลผลรวดเร็ว ไม่ต้องจัดการข้อมูลเอง
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="why_choose_single_item reveal-on-scroll reveal-delay-3">
                    <div className="choose_icon">
                      <div className="icon-inner-symbol">
                        <ShieldCheck size={28} color="#ffffff" />
                      </div>
                      <span className="round-circle" />
                    </div>
                    <div className="choose_content">
                      <h3 className="item-title">Verified High-Precision Insights</h3>
                      <p className="item-desc">
                        คัดกรองและตรวจสอบความถูกต้องจากแหล่งการเงินระดับโลก ให้ข้อมูลพร้อมนำไปใช้ประกอบการตัดสินใจ นำเสนอบอร์ดบริหาร หรือทำรายงานวิจัยได้อย่างมั่นใจ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Purple Ribbon Marquee */}
        <div className="biz-bottom-teal-ribbon reveal-on-scroll reveal-delay-1">
          <div className="biz-teal-ticker-track">
            <div className="biz-teal-ticker-content">
              <span>✦ GLOBAL MACRO DATA NETWORK</span>
              <span>✦ 196+ NATIONS COVERAGE</span>
              <span>✦ REAL-TIME GDP GROWTH ANALYSIS</span>
              <span>✦ INFLATION TREND TRACKING</span>
              <span>✦ UNEMPLOYMENT &amp; LABOR BENCHMARK</span>
              <span>✦ INSTANT MULTILATERAL COMPARISONS</span>
              <span>✦ SUB-MILLISECOND QUERY LATENCY</span>
              <span>✦ 100% ENTERPRISE SYSTEM STABILITY</span>
            </div>
            <div className="biz-teal-ticker-content" aria-hidden="true">
              <span>✦ GLOBAL MACRO DATA NETWORK</span>
              <span>✦ 196+ NATIONS COVERAGE</span>
              <span>✦ REAL-TIME GDP GROWTH ANALYSIS</span>
              <span>✦ INFLATION TREND TRACKING</span>
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
                <span>MACROECONOMIC ANALYSIS PLATFORM</span>
              </div>
              <h2 className="title split-title text-white">
                <span className="title-en-gradient">Global Economic Intelligence</span>
                <span className="title-thai">ทำไมต้องเลือกใช้ ZoneZet?</span>
              </h2>
            </div>
            <div className="top-icon">
              <img src="/img/logo.png" alt="ZoneZet Logo" />
            </div>
          </div>

          <div
            ref={chooseUsRef}
            className={`row g-4 advance-wrap ${isSpread ? 'is-spread' : ''}`}
          >
            {/* 1. Data-Driven Strategy */}
            <div className="col-xl-3 col-lg-6 col-md-6 advance-col">
              <div className="choose-us-block advance-item item-0 theme-purple">
                <div className="inner-block">
                  <div className="icon-block">
                    <Target size={50} strokeWidth={1.5} />
                  </div>
                  <div className="content-block">
                    <h4 className="title">Data-Driven Strategy</h4>
                    <p className="text">
                      รวบรวมตัวชี้วัดเศรษฐกิจมหภาคที่สำคัญที่สุด เช่น GDP Growth, อัตราเงินเฟ้อ, อัตราการว่างงาน ไว้ในที่เดียว ช่วยให้องค์กร นักธุรกิจ หรือนักลงทุน สามารถประเมินความเสี่ยงและมองหาโอกาสทางการตลาดในแต่ละประเทศได้อย่างแม่นยำและมีหลักการ
                    </p>
                    <div className="button-items">
                      <div className="bottom-line"></div>
                      <button type="button" className="plus-button" aria-label="Learn more about Data-Driven Strategy">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Insightful Visualization */}
            <div className="col-xl-3 col-lg-6 col-md-6 advance-col">
              <div className="choose-us-block advance-item item-1 theme-cyan">
                <div className="inner-block">
                  <div className="icon-block">
                    <PieChart size={50} strokeWidth={1.5} />
                  </div>
                  <div className="content-block">
                    <h4 className="title">Insightful Visualization</h4>
                    <p className="text">
                      บอกลาการนั่งจ้องไฟล์สเปรดชีตหรือข้อมูลดิบที่ปวดหัว ZoneZet แปลงสถิติมหาศาลระดับโลกให้อยู่ในรูปแบบกราฟิกและแดชบอร์ดที่สวยงาม สบายตา และ User-friendly ทำให้ผู้ใช้สามารถดึง Insight ไปใช้ตัดสินใจหรือทำสไลด์นำเสนอต่อได้ทันทีโดยไม่ต้องเสียเวลาวิเคราะห์ใหม่
                    </p>
                    <div className="button-items">
                      <div className="bottom-line"></div>
                      <button type="button" className="plus-button" aria-label="Learn more about Insightful Visualization">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Real-Time Reliability */}
            <div className="col-xl-3 col-lg-6 col-md-6 advance-col">
              <div className="choose-us-block advance-item item-2 theme-pink">
                <div className="inner-block">
                  <div className="icon-block">
                    <Activity size={50} strokeWidth={1.5} />
                  </div>
                  <div className="content-block">
                    <h4 className="title">Real-Time Reliability</h4>
                    <p className="text">
                      ด้วยการดึงข้อมูลสดตรงจาก World Bank API ทำให้มั่นใจได้ว่าตัวเลขทุกตัวบนแพลตฟอร์มมาจากแหล่งอ้างอิงระดับสากลที่มีความน่าเชื่อถือสูงสุด อัปเดตทันเหตุการณ์ และปราศจากความคลาดเคลื่อนจากการป้อนข้อมูลด้วยมือ
                    </p>
                    <div className="button-items">
                      <div className="bottom-line"></div>
                      <button type="button" className="plus-button" aria-label="Learn more about Real-Time Reliability">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Seamless Global Comparison */}
            <div className="col-xl-3 col-lg-6 col-md-6 advance-col">
              <div className="choose-us-block advance-item item-3 theme-emerald">
                <div className="inner-block">
                  <div className="icon-block">
                    <Earth size={50} strokeWidth={1.5} />
                  </div>
                  <div className="content-block">
                    <h4 className="title">Seamless Global Comparison</h4>
                    <p className="text">
                      ออกแบบมาเพื่อตอบโจทย์การเปรียบเทียบโดยเฉพาะ ผู้ใช้สามารถกดเทียบกราฟแนวโน้มเศรษฐกิจของหลายประเทศพร้อมกันได้ในหน้าจอเดียว ทำให้เห็นความแตกต่าง ทิศทางของตลาดโลก และความเชื่อมโยงของเศรษฐกิจแต่ละภูมิภาคได้อย่างรวดเร็วในไม่กี่คลิก
                    </p>
                    <div className="button-items">
                      <div className="bottom-line"></div>
                      <button type="button" className="plus-button" aria-label="Learn more about Seamless Global Comparison">
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
            className="section_title text-center reveal-on-scroll"
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
});

export default LandingAboutView;
