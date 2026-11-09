import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  TrendingUp,
  Percent,
  Users,
  ArrowUpDown,
    Check,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Search,
  Globe,
  Award,
  Sparkles,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Flame,
  Layers,
  ArrowRight,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { mergeSort } from '../utils/dsa/mergeSort';
import { LoadingSkeleton, EmptyState, ErrorBanner } from './FeedbackStates';
import AnimatedValue from './AnimatedValue';
import RunningBarLabel from './RunningBarLabel';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList
} from 'recharts';

const REGIONS = [
  'All',
  'East Asia',
  'Europe',
  'North America',
  'Latin America',
  'South Asia',
  'Sub-Saharan Africa',
  'Middle East',
  'Central Asia'
];

export default function IndicatorView({
  type = 'gdp',
  title = 'อัตราการเติบโตทางเศรษฐกิจ GDP Growth (%)',
  subtitle = 'วิเคราะห์การขยายตัวทางเศรษฐกิจและมูลค่าผลผลิตมวลรวมในแต่ละประเทศ',
  data = [],
  isLoading = false,
  error = null,
  onRetry,
  onAddToCompare,
  comparedList = [],  selectedYear = '2025',
  setSelectedYear
}) {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortKey, setSortKey] = useState('value');
  const [sortDirection, setSortDirection] = useState('desc');
  const [tableSearch, setTableSearch] = useState('');
  const [chartViewMode, setChartViewMode] = useState('top'); // 'top' or 'bottom'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // 20 per page or -1 for All
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef(null);
  const AVAILABLE_YEARS = ['2025', '2024', '2023', '2022', '2021', '2020'];

  // Close custom year dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Indicator-specific configuration & accents (Refined & Distinct Semantic Colors)
  const config = useMemo(() => {
    switch (type) {
      case 'inflation':
        return {
          accentColor: '#f43f5e',
          accentBg: 'rgba(244, 63, 94, 0.15)',
          accentBorder: 'rgba(244, 63, 94, 0.35)',
          barColor: '#f43f5e',
          gradStart: '#fb7185',
          gradEnd: '#e11d48',
          icon: Flame,
          badgeLabel: 'INFLATION RATE (CPI)',
          titleTh: 'อัตราเงินเฟ้อ',
          titleEn: 'Inflation Rate',
          defaultSubtitle: 'ติดตามเสถียรภาพระดับราคาสินค้า อัตราค่าครองชีพ และกำลังซื้อของผู้บริโภค',
          kpi1Label: 'อัตราเงินเฟ้อสูงสุด',
          kpi1Tag: '#1 HIGHEST INFLATION',
          kpi2Tag: 'GLOBAL AVERAGE',
          kpi2Color: '#fbbf24',
          kpi2Bg: 'rgba(245, 158, 11, 0.15)',
          kpi2Border: 'rgba(245, 158, 11, 0.35)',
          kpi3Label: 'เงินเฟ้อต่ำมีเสถียรภาพ (≤ 3%)',
          kpi3Tag: 'PRICE STABILITY',
          kpi3Color: '#10b981',
          kpi3Bg: 'rgba(16, 185, 129, 0.15)',
          kpi3Border: 'rgba(16, 185, 129, 0.35)'
        };
      case 'unemployment':
        return {
          accentColor: '#38bdf8',
          accentBg: 'rgba(56, 189, 248, 0.15)',
          accentBorder: 'rgba(56, 189, 248, 0.35)',
          barColor: '#38bdf8',
          gradStart: '#38bdf8',
          gradEnd: '#0284c7',
          icon: Users,
          badgeLabel: 'LABOR MARKET STATS',
          titleTh: 'อัตราการว่างงาน',
          titleEn: 'Unemployment Rate',
          defaultSubtitle: 'สำรวจโครงสร้างการจ้างงาน สัดส่วนประชากรในวัยทำงาน และศักยภาพตลาดแรงงาน',
          kpi1Label: 'อัตราการว่างงานสูงสุด',
          kpi1Tag: '#1 HIGHEST UNEMPLOYMENT',
          kpi2Tag: 'GLOBAL AVERAGE',
          kpi2Color: '#fbbf24',
          kpi2Bg: 'rgba(245, 158, 11, 0.15)',
          kpi2Border: 'rgba(245, 158, 11, 0.35)',
          kpi3Label: 'การจ้างงานระดับสูง (ว่างงาน ≤ 4%)',
          kpi3Tag: 'FULL EMPLOYMENT',
          kpi3Color: '#10b981',
          kpi3Bg: 'rgba(16, 185, 129, 0.15)',
          kpi3Border: 'rgba(16, 185, 129, 0.35)'
        };
      case 'gdp':
      default:
        return {
          accentColor: '#34d399',
          accentBg: 'rgba(52, 211, 153, 0.15)',
          accentBorder: 'rgba(52, 211, 153, 0.35)',
          barColor: '#10b981',
          gradStart: '#34d399',
          gradEnd: '#059669',
          icon: TrendingUp,
          badgeLabel: 'REAL GDP GROWTH',
          titleTh: 'อัตราการเติบโตทางเศรษฐกิจ',
          titleEn: 'GDP Growth Rate',
          defaultSubtitle: 'วิเคราะห์การขยายตัวทางเศรษฐกิจและมูลค่าผลผลิตมวลรวมในแต่ละประเทศ',
          kpi1Label: 'ผู้นำการเติบโตสูงสุด',
          kpi1Tag: '#1 TOP LEADER',
          kpi2Tag: 'GLOBAL AVERAGE',
          kpi2Color: '#c084fc',
          kpi2Bg: 'rgba(168, 85, 247, 0.15)',
          kpi2Border: 'rgba(168, 85, 247, 0.35)',
          kpi3Label: 'เติบโตเชิงบวก (> 0%)',
          kpi3Tag: 'EXPANSION',
          kpi3Color: '#38bdf8',
          kpi3Bg: 'rgba(56, 189, 248, 0.15)',
          kpi3Border: 'rgba(56, 189, 248, 0.35)'
        };
    }
  }, [type]);

  const IndicatorIcon = config.icon;

  // Filter by Region and Local Search
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    let list = data;
    if (selectedRegion !== 'All') {
      list = list.filter(
        item => item.region && item.region.toLowerCase() === selectedRegion.toLowerCase()
      );
    }
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase().trim();
      list = list.filter(
        item =>
          item.country.toLowerCase().includes(q) ||
          (item.countryCode && item.countryCode.toLowerCase().includes(q))
      );
    }
    return list;
  }, [data, selectedRegion, tableSearch]);

  // Apply DSA: Merge Sort O(n log n)
  const sortedData = useMemo(() => {
    return mergeSort(filteredData, sortKey, sortDirection);
  }, [filteredData, sortKey, sortDirection]);

  // Calculate dynamic KPIs from full dataset
  const kpiStats = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        topLeader: null,
        average: 0,
        positiveCount: 0,
        positivePercent: '0%',
        totalCount: 0
      };
    }

    const sortedRaw = [...data].sort((a, b) => (b.value || 0) - (a.value || 0));
    const topLeader = sortedRaw[0] || null;

    const validNums = data.filter(d => typeof d.value === 'number' && !isNaN(d.value));
    const totalCount = data.length;
    const sum = validNums.reduce((acc, curr) => acc + curr.value, 0);
    const average = validNums.length > 0 ? (sum / validNums.length).toFixed(1) : 0;

    let positiveCount = 0;
    if (type === 'gdp') {
      positiveCount = validNums.filter(d => d.value > 0).length;
    } else if (type === 'inflation') {
      positiveCount = validNums.filter(d => d.value >= 0 && d.value <= 3).length;
    } else {
      positiveCount = validNums.filter(d => d.value <= 4).length;
    }
    const positivePercent = totalCount > 0 ? `${((positiveCount / totalCount) * 100).toFixed(1)}%` : '0.0%';

    return {
      topLeader,
      average,
      positiveCount,
      positivePercent,
      totalCount
    };
  }, [data, type]);

  // Top 10 or Bottom 10 for interactive Bar Chart
  const distributionChartData = useMemo(() => {
    if (sortedData.length === 0) return [];
    const source = chartViewMode === 'top'
      ? sortedData.slice(0, 10)
      : [...sortedData].reverse().slice(0, 10);

    return source.map((item, idx) => ({
      country: item.country.length > 15 ? item.country.substring(0, 15) + '...' : item.country,
      fullName: item.country,
      value: item.value,
      iso2: item.iso2,
      rank: chartViewMode === 'top' ? idx + 1 : sortedData.length - idx
    }));
  }, [sortedData, chartViewMode]);

  // Pagination calculation
  const totalPages = pageSize === -1 ? 1 : Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    if (pageSize === -1) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSortToggle = (key) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const getRankBadgeClass = (rankIndex) => {
    if (rankIndex === 0) return 'rank-pill-gold';
    if (rankIndex === 1) return 'rank-pill-silver';
    if (rankIndex === 2) return 'rank-pill-bronze';
    return 'rank-pill-normal';
  };

  if (isLoading) {
    return <LoadingSkeleton text={`กำลังเรียกข้อมูลสถิติ ${title}...`} />;
  }

  return (
    <div className="indicator-page-container">
      {/* Ambient Grid Pattern and Cosmic Glow (Matching Landing Hero) */}
      <div className="indicator-bg-grid-pattern" />
      <div className="indicator-ambient-glow" />
      <div className="indicator-ambient-glow-secondary" />

      {/* ====================================================================
          1. LUXURY HERO HEADER & YEAR DROPDOWN (Matching DashboardHome)
          ==================================================================== */}
      <div className="db-home-header-row" style={{ marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
        <div className="db-home-title-col">
          <h1 className="indicator-hero-big-title">
            {config.titleTh}{' '}
            <span className="title-en-gradient">{config.titleEn} ประจำปี {selectedYear}</span>
          </h1>

          <p className="indicator-hero-subtext">
            {subtitle || config.defaultSubtitle}
          </p>
        </div>

        {/* Luxury Year Selector Card with Custom Dropdown (Exact match to DashboardHome) */}
        <div className="db-year-selector-card">
          <div className="db-year-selector-label">
            <Calendar size={14} color="#c084fc" />
            <span>รอบปี ค.ศ.</span>
          </div>

          {/* Custom Interactive Year Dropdown (Clean & Simple) */}
          <div className="db-custom-dropdown-wrap" ref={yearDropdownRef}>
            <button
              type="button"
              className={`db-custom-dropdown-trigger ${isYearDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsYearDropdownOpen((prev) => !prev)}
              title="คลิกเพื่อเลือกรอบปี ค.ศ."
            >
              <div className="db-custom-dropdown-trigger-left">
                <Calendar size={15} color="#c084fc" />
                <span>ปี ค.ศ. {selectedYear}</span>
              </div>
              <ChevronDown
                size={15}
                color="#94a3b8"
                className={`db-custom-dropdown-chevron ${isYearDropdownOpen ? 'rotate' : ''}`}
              />
            </button>

            {isYearDropdownOpen && (
              <div className="db-custom-dropdown-menu">
                {AVAILABLE_YEARS.map((yr) => {
                  const isSelected = selectedYear === yr;
                  return (
                    <button
                      key={yr}
                      type="button"
                      className={`db-custom-dropdown-item ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        if (setSelectedYear) setSelectedYear(yr);
                        setIsYearDropdownOpen(false);
                      }}
                    >
                      <span className="db-custom-dropdown-year-num">ปี ค.ศ. {yr}</span>
                      {isSelected && (
                        <div className="db-custom-dropdown-check">
                          <Check size={13} color="#c084fc" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={onRetry} />}

      {/* ====================================================================
          2. TOP 4 DYNAMIC KPI SUMMARY CARDS (Animated Values)
          ==================================================================== */}
      <div className="indicator-kpi-grid">
        {/* Card 1: Top Performer Leader */}
        <div className="indicator-kpi-card" style={{ '--kpi-accent': config.accentColor }}>
          <div className="indicator-kpi-top">
            <div
              className="indicator-kpi-icon"
              style={{ background: config.accentBg, color: config.accentColor }}
            >
              <IndicatorIcon size={18} />
            </div>
            <span
              className="indicator-kpi-tag"
              style={{
                background: config.accentBg,
                color: config.accentColor,
                borderColor: config.accentBorder
              }}
            >
              {config.kpi1Tag}
            </span>
          </div>

          <div className="indicator-kpi-middle">
            <div className="indicator-kpi-val" style={{ color: config.accentColor }}>
              <AnimatedValue
                key={`top-${selectedYear}-${kpiStats.topLeader?.value}`}
                value={
                  kpiStats.topLeader
                    ? `${type === 'gdp' && kpiStats.topLeader.value > 0 ? '+' : ''}${kpiStats.topLeader.value}%`
                    : '0.0%'
                }
                duration={1400}
              />
            </div>
            <div className="indicator-kpi-lbl">{config.kpi1Label}</div>
          </div>

          <div className="indicator-kpi-footer">
            {kpiStats.topLeader?.iso2 && (
              <img
                src={`https://flagcdn.com/w40/${kpiStats.topLeader.iso2.toLowerCase()}.png`}
                alt={kpiStats.topLeader?.country}
                className="indicator-kpi-flag"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <span className="indicator-kpi-country">{kpiStats.topLeader?.country || 'กำลังประมวลผล...'}</span>
          </div>
        </div>

        {/* Card 2: Global Average Benchmark */}
        <div className="indicator-kpi-card" style={{ '--kpi-accent': config.kpi2Color }}>
          <div className="indicator-kpi-top">
            <div
              className="indicator-kpi-icon"
              style={{ background: config.kpi2Bg, color: config.kpi2Color }}
            >
              <Globe size={18} />
            </div>
            <span
              className="indicator-kpi-tag"
              style={{
                background: config.kpi2Bg,
                color: config.kpi2Color,
                borderColor: config.kpi2Border
              }}
            >
              {config.kpi2Tag}
            </span>
          </div>

          <div className="indicator-kpi-middle">
            <div className="indicator-kpi-val" style={{ color: config.kpi2Color }}>
              <AnimatedValue
                key={`avg-${selectedYear}-${kpiStats.average}`}
                value={`${type === 'gdp' && kpiStats.average > 0 ? '+' : ''}${kpiStats.average}%`}
                duration={1400}
                delay={120}
              />
            </div>
            <div className="indicator-kpi-lbl">ค่าเฉลี่ยทั่วโลก ประจำปี {selectedYear}</div>
          </div>

          <div className="indicator-kpi-footer">
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
              คำนวณจาก <strong>{kpiStats.totalCount}</strong> ประเทศ
            </span>
          </div>
        </div>

        {/* Card 3: Healthy / Positive Ratio */}
        <div className="indicator-kpi-card" style={{ '--kpi-accent': config.kpi3Color }}>
          <div className="indicator-kpi-top">
            <div
              className="indicator-kpi-icon"
              style={{ background: config.kpi3Bg, color: config.kpi3Color }}
            >
              <ShieldCheck size={18} />
            </div>
            <span
              className="indicator-kpi-tag"
              style={{
                background: config.kpi3Bg,
                color: config.kpi3Color,
                borderColor: config.kpi3Border
              }}
            >
              {config.kpi3Tag}
            </span>
          </div>

          <div className="indicator-kpi-middle">
            <div className="indicator-kpi-val" style={{ color: config.kpi3Color }}>
              <AnimatedValue
                key={`pos-${selectedYear}-${kpiStats.positivePercent}`}
                value={kpiStats.positivePercent}
                duration={1400}
                delay={240}
              />
            </div>
            <div className="indicator-kpi-lbl">{config.kpi3Label}</div>
          </div>

          <div className="indicator-kpi-footer">
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
              คิดเป็น <strong style={{ color: '#ffffff' }}>{kpiStats.positiveCount}</strong> จาก {kpiStats.totalCount} ประเทศ
            </span>
          </div>
        </div>

        {/* Card 4: Verified Sovereign Coverage */}
        <div className="indicator-kpi-card" style={{ '--kpi-accent': '#818cf8' }}>
          <div className="indicator-kpi-top">
            <div
              className="indicator-kpi-icon"
              style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
            >
              <ShieldCheck size={18} />
            </div>
            <span
              className="indicator-kpi-tag"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                borderColor: 'rgba(129, 140, 248, 0.35)'
              }}
            >
              SOVEREIGN ONLY
            </span>
          </div>

          <div className="indicator-kpi-middle">
            <div className="indicator-kpi-val" style={{ color: '#ffffff' }}>
              <AnimatedValue
                key={`cnt-${selectedYear}-${kpiStats.totalCount}`}
                value={`${kpiStats.totalCount}`}
                duration={1300}
                delay={360}
              />
            </div>
            <div className="indicator-kpi-lbl">ประเทศสมาชิกสหประชาชาติที่วิเคราะห์</div>
          </div>

          <div className="indicator-kpi-footer">
            <Check size={14} color="#34d399" />
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
              คัดกรองปลอดภัย 100%
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. INTERACTIVE DISTRIBUTION BAR CHART (TOP 10 / BOTTOM 10)
          ==================================================================== */}
      {sortedData.length > 0 && (
        <div className="indicator-chart-card">
          <div className="indicator-chart-header">
            <div>
              <h3 className="indicator-chart-title">
                <div
                  className="indicator-chart-icon-box"
                  style={{ background: config.accentBg, color: config.accentColor }}
                >
                  <BarChart2 size={18} />
                </div>
                <span>การกระจายตัว {chartViewMode === 'top' ? '10 อันดับแรก' : '10 อันดับท้าย'}</span>
              </h3>
              <p className="indicator-chart-subtitle">
                กราฟฟิกเปรียบเทียบสัดส่วนและแนวโน้มค่าสถิติเศรษฐกิจประจำปี {selectedYear}
              </p>
            </div>

            <div className="indicator-chart-controls">
              {/* View Switcher: Top 10 vs Bottom 10 */}
              <div className="indicator-chart-mode-toggle">
                <button
                  type="button"
                  onClick={() => setChartViewMode('top')}
                  className={`mode-toggle-btn ${chartViewMode === 'top' ? 'active' : ''}`}
                >
                  10 อันดับสูงสุด
                </button>
                <button
                  type="button"
                  onClick={() => setChartViewMode('bottom')}
                  className={`mode-toggle-btn ${chartViewMode === 'bottom' ? 'active' : ''}`}
                >
                  10 อันดับต่ำสุด
                </button>
              </div>
            </div>
          </div>

          <div className="indicator-chart-canvas-wrap">
            <ResponsiveContainer width="100%" height={310}>
              <BarChart
                key={`${type}-${chartViewMode}`}
                data={distributionChartData}
                margin={{ top: 35, right: 25, left: -10, bottom: 28 }}
                barCategoryGap="20%"
              >
                <defs>
                  <linearGradient id={`indicatorGrad-${type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={config.gradStart} stopOpacity={1} />
                    <stop offset="100%" stopColor={config.gradEnd} stopOpacity={0.35} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
                <XAxis
                  dataKey="country"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  angle={-22}
                  textAnchor="end"
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                  unit="%"
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  domain={[
                    (dataMin) => (dataMin < 0 ? Math.floor(dataMin * 1.15) : 0),
                    (dataMax) => Math.ceil(dataMax * 1.2)
                  ]}
                />
                <Tooltip
                  formatter={(val) => [`${val}%`, title]}
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload;
                    return row ? `#${row.rank} ${row.fullName}` : '';
                  }}
                  cursor={{ fill: 'rgba(168, 85, 247, 0.06)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(18, 9, 38, 0.96)',
                    border: `1px solid ${config.accentBorder || 'rgba(192, 132, 252, 0.35)'}`,
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(168, 85, 247, 0.25)',
                    fontSize: '0.84rem',
                    fontFamily: 'var(--font-mono)',
                    backdropFilter: 'blur(16px)',
                    padding: '0.75rem 1rem'
                  }}
                />
                <Bar
                  dataKey="value"
                  fill={`url(#indicatorGrad-${type})`}
                  radius={[6, 6, 2, 2]}
                  barSize={32}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  <LabelList
                    dataKey="value"
                    content={<RunningBarLabel type={type} color={config.accentColor || '#ffffff'} />}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ====================================================================
          4. SLEEK FILTER & SEARCH SUITE
          ==================================================================== */}
      <div className="indicator-filter-section">
        {/* Region Filter Pills */}
        <div className="indicator-region-pills-row">
          <div className="indicator-region-label">
            <Globe size={13} color="#c084fc" />
            <span>ภูมิภาค</span>
          </div>
          <div className="indicator-region-pills-scroll">
            {REGIONS.map((reg) => {
              const count = reg === 'All'
                ? data.length
                : data.filter(d => d.region?.toLowerCase() === reg.toLowerCase()).length;
              const isActive = selectedRegion === reg;

              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => {
                    setSelectedRegion(reg);
                    setCurrentPage(1);
                  }}
                  className={`indicator-region-pill ${isActive ? 'active' : ''}`}
                >
                  <span>{reg === 'All' ? 'ทุกภูมิภาค' : reg}</span>
                  {count > 0 && <span className="pill-count-tag">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Sort & Counter Bar */}
        <div className="indicator-table-controls-bar">
          {/* Search Box */}
          <div className="indicator-search-box">
            <Search size={14} className="indicator-search-icon" />
            <input
              type="text"
              placeholder="ค้นหาชื่อประเทศ หรือรหัส ISO..."
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="indicator-search-input"
            />
            {tableSearch && (
              <button
                type="button"
                onClick={() => setTableSearch('')}
                className="indicator-search-clear-btn"
                title="ล้างคำค้นหา"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Right Sort Buttons & Total Counter */}
          <div className="indicator-sort-controls-wrap">
            <span className="indicator-sort-label">เรียงตาม</span>
            <button
              type="button"
              onClick={() => handleSortToggle('value')}
              className={`indicator-sort-btn ${sortKey === 'value' ? 'active' : ''}`}
            >
              <ArrowUpDown size={12} />
              <span>
                ค่าสถิติ {sortKey === 'value' ? (sortDirection === 'desc' ? 'มาก➔น้อย' : 'น้อย➔มาก') : 'ตัวเลข'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSortToggle('country')}
              className={`indicator-sort-btn ${sortKey === 'country' ? 'active' : ''}`}
            >
              <ArrowUpDown size={12} />
              <span>
                ชื่อประเทศ {sortKey === 'country' ? (sortDirection === 'desc' ? 'Z➔A' : 'A➔Z') : 'A-Z'}
              </span>
            </button>

            <div className="indicator-total-count-pill">
              พบ <strong style={{ color: '#ffffff' }}>{sortedData.length}</strong> ประเทศ
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          5. LUXURY RESPONSIVE DATA TABLE
          ==================================================================== */}
      {sortedData.length === 0 ? (
        !error && (
          <EmptyState
            title="ไม่พบข้อมูลในเงื่อนไขการค้นหา"
            message="กรุณากดเลือก 'ทุกภูมิภาค' หรือล้างคำค้นหาเพื่อดูข้อมูลทั้งหมด"
            onReset={() => {
              setSelectedRegion('All');
              setTableSearch('');
              setCurrentPage(1);
            }}
          />
        )
      ) : (
        <div className="indicator-table-card">
          <div className="indicator-table-responsive-wrapper">
            <table className="indicator-luxury-table">
              <thead>
                <tr>
                  <th style={{ width: '68px', textAlign: 'center' }}>อันดับ</th>
                  <th>ประเทศ (Country)</th>
                  <th style={{ width: '100px' }}>รหัส (ISO)</th>
                  <th>ภูมิภาค (Region)</th>
                  <th style={{ width: '170px' }}>ค่าสถิติ ({type.toUpperCase()} %)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const absoluteIndex = (currentPage - 1) * (pageSize === -1 ? 0 : pageSize) + index;
                  const flagUrl = item.iso2
                    ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png`
                    : null;

                  return (
                    <tr key={item.countryCode || index} className="indicator-table-row">
                      {/* Rank Column */}
                      <td style={{ textAlign: 'center' }}>
                        <span className={`indicator-rank-pill ${getRankBadgeClass(absoluteIndex)}`}>
                          #{absoluteIndex + 1}
                        </span>
                      </td>

                      {/* Country with Flag */}
                      <td>
                        <div className="indicator-country-cell">
                          {flagUrl && (
                            <img
                              src={flagUrl}
                              alt={item.country}
                              className="indicator-flag-img"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div className="indicator-country-info">
                            <span className="indicator-country-name">{item.country}</span>
                            <span className="indicator-country-sub">{item.countryCode} · {item.region || 'World'}</span>
                          </div>
                        </div>
                      </td>

                      {/* ISO Code */}
                      <td>
                        <span className="indicator-iso-badge">{item.countryCode}</span>
                      </td>

                      {/* Region Tag */}
                      <td>
                        <span className="indicator-region-tag">
                          {item.region || 'Other'}
                        </span>
                      </td>

                      {/* Stat Value Badge with Animated Number */}
                      <td>
                        <div className="indicator-val-cell-wrap">
                          <span
                            className={`indicator-val-badge ${
                              type === 'gdp'
                                ? item.value >= 0 ? 'green' : 'red'
                                : type === 'inflation'
                                ? 'red'
                                : 'blue'
                            }`}
                          >
                            {type === 'gdp' && item.value >= 0 ? (
                              <ArrowUpRight size={13} />
                            ) : type === 'inflation' ? (
                              <Flame size={13} />
                            ) : (
                              <ArrowDownRight size={13} />
                            )}
                            <AnimatedValue
                              key={`row-${item.countryCode}-${item.value}`}
                              value={
                                item.displayValue ||
                                (item.value !== undefined
                                  ? `${type === 'gdp' && item.value > 0 ? '+' : ''}${item.value}%`
                                  : '')
                              }
                              duration={1100}
                              delay={Math.min(index * 20, 250)}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ====================================================================
              6. LUXURY PAGINATION CONTROLS
              ==================================================================== */}
          {sortedData.length > 20 && (
            <div className="indicator-pagination-bar">
              <div className="pagination-info-text">
                แสดงผล{' '}
                <strong>
                  {pageSize === -1
                    ? `1 - ${sortedData.length}`
                    : `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, sortedData.length)}`}
                </strong>{' '}
                จากทั้งหมด <strong>{sortedData.length}</strong> รายการ
              </div>

              <div className="pagination-buttons-group">
                <button
                  type="button"
                  disabled={currentPage === 1 || pageSize === -1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="pagination-nav-btn"
                >
                  <ChevronLeft size={15} />
                  <span>ก่อนหน้า</span>
                </button>

                {pageSize !== -1 && (
                  <div className="pagination-pages-pills">
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, pIdx) => {
                      const pageNum = pIdx + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 350, behavior: 'smooth' });
                          }}
                          className={`pagination-page-pill ${currentPage === pageNum ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && <span style={{ color: '#64748b', padding: '0 4px' }}>...</span>}
                  </div>
                )}

                <button
                  type="button"
                  disabled={currentPage >= totalPages || pageSize === -1}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="pagination-nav-btn"
                >
                  <span>ถัดไป</span>
                  <ChevronRight size={15} />
                </button>

                {/* Show All Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setPageSize(prev => (prev === -1 ? 20 : -1));
                    setCurrentPage(1);
                  }}
                  className={`pagination-all-toggle ${pageSize === -1 ? 'active' : ''}`}
                >
                  {pageSize === -1 ? 'แบ่งหน้า 20 รายการ' : 'แสดงทั้งหมด 196'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
