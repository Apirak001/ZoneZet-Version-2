import React, { useState, useEffect, useRef } from 'react';
import MetricCard from './MetricCard';
import AnimatedValue from './AnimatedValue';
import { fetchRegionalBenchmark } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Percent,
  Users,
  Layers,
  Sparkles,
  Globe,
  Globe2,
  Compass,
  Landmark,
  MapPin,
  Sun,
  Mountain,
  Building2,
  Calendar,
  History,
  ChevronDown,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LabelList
} from 'recharts';

/**
 * Returns professional SVG icon and luminous color config for each continent
 */
function getRegionIconConfig(regionId, size = 18) {
  switch (regionId) {
    case 'World':
      return {
        icon: <Globe size={size} />,
        bg: 'rgba(234, 179, 8, 0.16)',
        border: 'rgba(234, 179, 8, 0.4)',
        color: '#fbbf24'
      };
    case 'East Asia & Pacific':
    case 'East Asia':
      return {
        icon: <Compass size={size} />,
        bg: 'rgba(52, 211, 153, 0.16)',
        border: 'rgba(52, 211, 153, 0.35)',
        color: '#34d399'
      };
    case 'Europe & Central Asia':
    case 'Europe':
      return {
        icon: <Landmark size={size} />,
        bg: 'rgba(129, 140, 248, 0.16)',
        border: 'rgba(129, 140, 248, 0.35)',
        color: '#818cf8'
      };
    case 'Latin America & Caribbean':
    case 'Latin America':
      return {
        icon: <MapPin size={size} />,
        bg: 'rgba(244, 114, 182, 0.16)',
        border: 'rgba(244, 114, 182, 0.35)',
        color: '#f472b6'
      };
    case 'Middle East & North Africa':
    case 'Middle East':
      return {
        icon: <Sun size={size} />,
        bg: 'rgba(245, 158, 11, 0.16)',
        border: 'rgba(245, 158, 11, 0.35)',
        color: '#f59e0b'
      };
    case 'Sub-Saharan Africa':
      return {
        icon: <Globe2 size={size} />,
        bg: 'rgba(16, 185, 129, 0.16)',
        border: 'rgba(16, 185, 129, 0.35)',
        color: '#10b981'
      };
    case 'South Asia':
      return {
        icon: <Mountain size={size} />,
        bg: 'rgba(56, 189, 248, 0.16)',
        border: 'rgba(56, 189, 248, 0.35)',
        color: '#38bdf8'
      };
    case 'North America':
      return {
        icon: <Building2 size={size} />,
        bg: 'rgba(96, 165, 250, 0.16)',
        border: 'rgba(96, 165, 250, 0.35)',
        color: '#60a5fa'
      };
    default:
      return {
        icon: <Globe size={size} />,
        bg: 'rgba(168, 85, 247, 0.16)',
        border: 'rgba(168, 85, 247, 0.35)',
        color: '#c084fc'
      };
  }
}

const AVAILABLE_YEARS = ['2025', '2024', '2023', '2022', '2021', '2020'];

export default function DashboardHome({
  topSummary = {},
  selectedYear = '2025',
  setSelectedYear,
  setActiveTab
}) {
  const [activeChartMode, setActiveChartMode] = useState('all');
  const [regionalChartMode, setRegionalChartMode] = useState('all');
  const [regionalData, setRegionalData] = useState([]);
  const [isRegionalLoading, setIsRegionalLoading] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef(null);

  // Close custom dropdown on click outside
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

  useEffect(() => {
    let isMounted = true;
    setIsRegionalLoading(true);
    fetchRegionalBenchmark(selectedYear)
      .then((res) => {
        if (isMounted && res.data) {
          setRegionalData(res.data);
        }
      })
      .catch((err) => console.error('[DashboardHome] Failed to load regional benchmark:', err))
      .finally(() => {
        if (isMounted) setIsRegionalLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  const gdpItems = topSummary.gdp || [];
  const inflationItems = topSummary.inflation || [];
  const unemploymentItems = topSummary.unemployment || [];

  // Build combined chart data for Top rankings (#1 to #5)
  const comparativeChartData = [0, 1, 2, 3, 4].map((idx) => {
    const gdp = gdpItems[idx] || {};
    const inf = inflationItems[idx] || {};
    const unemp = unemploymentItems[idx] || {};

    return {
      rankName: `อันดับ #${idx + 1}`,
      rankTag: `#${idx + 1}`,
      GDP: gdp.value || 0,
      gdpCountry: gdp.country || '-',
      gdpIso2: gdp.iso2 || '',
      Inflation: inf.value || 0,
      infCountry: inf.country || '-',
      infIso2: inf.iso2 || '',
      Unemployment: unemp.value || 0,
      unempCountry: unemp.country || '-',
      unempIso2: unemp.iso2 || ''
    };
  });

  // Specific single indicator chart data (top 5 each)
  const gdpOnlyData = gdpItems.slice(0, 5).map((item, idx) => ({
    name: item.country,
    rank: `#${idx + 1}`,
    value: item.value,
    iso2: item.iso2,
    displayValue: item.displayValue
  }));

  const inflationOnlyData = inflationItems.slice(0, 5).map((item, idx) => ({
    name: item.country,
    rank: `#${idx + 1}`,
    value: item.value,
    iso2: item.iso2,
    displayValue: item.displayValue
  }));

  const unemploymentOnlyData = unemploymentItems.slice(0, 5).map((item, idx) => ({
    name: item.country,
    rank: `#${idx + 1}`,
    value: item.value,
    iso2: item.iso2,
    displayValue: item.displayValue
  }));

  // Custom Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;

      if (activeChartMode === 'all') {
        const hasGdp = dataPoint?.GDP !== undefined && dataPoint?.GDP !== null;
        const hasInf = dataPoint?.Inflation !== undefined && dataPoint?.Inflation !== null;
        const hasUnemp = dataPoint?.Unemployment !== undefined && dataPoint?.Unemployment !== null;

        return (
          <div className="db-custom-chart-tooltip">
            <div className="tooltip-country-header">
              <span className="tooltip-country-dot" />
              <span className="tooltip-country-name">เปรียบเทียบ {label} ของโลก</span>
              <span className="tooltip-year-badge">{selectedYear}</span>
            </div>
            <div className="tooltip-indicators-list">
              <div className="tooltip-indicator-row">
                <div className="tooltip-indicator-name">
                  <span className="tooltip-color-bullet" style={{ background: '#34d399' }} />
                  <span>GDP Growth:</span>
                </div>
                <span className="tooltip-indicator-value" style={{ color: '#34d399' }}>
                  {dataPoint?.gdpCountry ? `${dataPoint.gdpCountry} ` : ''}
                  {hasGdp ? `(+${dataPoint.GDP}%)` : '-'}
                </span>
              </div>

              <div className="tooltip-indicator-row">
                <div className="tooltip-indicator-name">
                  <span className="tooltip-color-bullet" style={{ background: '#f43f5e' }} />
                  <span>อัตราเงินเฟ้อ:</span>
                </div>
                <span className="tooltip-indicator-value" style={{ color: '#fb7185' }}>
                  {dataPoint?.infCountry ? `${dataPoint.infCountry} ` : ''}
                  {hasInf ? `(${dataPoint.Inflation}%)` : '-'}
                </span>
              </div>

              <div className="tooltip-indicator-row">
                <div className="tooltip-indicator-name">
                  <span className="tooltip-color-bullet" style={{ background: '#38bdf8' }} />
                  <span>อัตราการว่างงาน:</span>
                </div>
                <span className="tooltip-indicator-value" style={{ color: '#38bdf8' }}>
                  {dataPoint?.unempCountry ? `${dataPoint.unempCountry} ` : ''}
                  {hasUnemp ? `(${dataPoint.Unemployment}%)` : '-'}
                </span>
              </div>
            </div>
            <div className="tooltip-footer">
              <span className="tooltip-live-dot" />
              <span>World Bank Verified Statistics v2</span>
            </div>
          </div>
        );
      }

      // Single indicator mode tooltip
      const entry = payload[0];
      return (
        <div className="db-custom-chart-tooltip">
          <div className="tooltip-country-header">
            <span className="tooltip-country-dot" />
            <span className="tooltip-country-name">{label}</span>
            <span className="tooltip-year-badge">{selectedYear}</span>
          </div>
          <div className="tooltip-indicators-list">
            <div className="tooltip-indicator-row">
              <div className="tooltip-indicator-name">
                <span
                  className="tooltip-color-bullet"
                  style={{ background: entry.color || entry.fill }}
                />
                <span>
                  {activeChartMode === 'gdp'
                    ? 'GDP Growth'
                    : activeChartMode === 'inflation'
                    ? 'อัตราเงินเฟ้อ'
                    : 'อัตราการว่างงาน'}
                  :
                </span>
              </div>
              <span
                className="tooltip-indicator-value"
                style={{ color: entry.color || entry.fill || '#ffffff', fontSize: '1rem', fontWeight: 800 }}
              >
                {typeof entry.value === 'number' ? `${entry.value.toFixed(1)}%` : entry.value}
              </span>
            </div>
          </div>
          <div className="tooltip-footer">
            <span className="tooltip-live-dot" />
            <span>World Bank Official Statistics v2</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Glassmorphism Tooltip specifically for Regional Benchmark Chart
  const RegionalTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0]?.payload;
      if (!item) return null;

      const iconCfg = getRegionIconConfig(item.id, 16);
      const hasGdp = item.avgGdp !== undefined && item.avgGdp !== null;
      const hasInf = item.avgInflation !== undefined && item.avgInflation !== null;
      const hasUnemp = item.avgUnemployment !== undefined && item.avgUnemployment !== null;

      return (
        <div className="db-custom-chart-tooltip">
          <div className="tooltip-country-header">
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: iconCfg.bg,
                border: `1px solid ${iconCfg.border}`,
                color: iconCfg.color,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6
              }}
            >
              {iconCfg.icon}
            </span>
            <span className="tooltip-country-name">
              {item.name} ({item.thai})
            </span>
            <span className="tooltip-year-badge">{selectedYear}</span>
          </div>

          <div className="tooltip-indicators-list">
            <div className="tooltip-indicator-row">
              <div className="tooltip-indicator-name">
                <span className="tooltip-color-bullet" style={{ background: '#34d399' }} />
                <span>GDP Growth เฉลี่ย:</span>
              </div>
              <span className="tooltip-indicator-value" style={{ color: '#34d399' }}>
                {hasGdp ? `+${item.avgGdp}%` : '-'}
              </span>
            </div>

            <div className="tooltip-indicator-row">
              <div className="tooltip-indicator-name">
                <span className="tooltip-color-bullet" style={{ background: '#f43f5e' }} />
                <span>อัตราเงินเฟ้อเฉลี่ย:</span>
              </div>
              <span className="tooltip-indicator-value" style={{ color: '#fb7185' }}>
                {hasInf ? `${item.avgInflation}%` : '-'}
              </span>
            </div>

            <div className="tooltip-indicator-row">
              <div className="tooltip-indicator-name">
                <span className="tooltip-color-bullet" style={{ background: '#38bdf8' }} />
                <span>อัตราว่างงานเฉลี่ย:</span>
              </div>
              <span className="tooltip-indicator-value" style={{ color: '#38bdf8' }}>
                {hasUnemp ? `${item.avgUnemployment}%` : '-'}
              </span>
            </div>
          </div>

          {item.topCountry && (
            <div
              style={{
                marginTop: '0.65rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.78rem',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <span style={{ color: '#94a3b8' }}>{item.isGlobal ? 'สถิติสูงสุด:' : 'ผู้นำ GDP:'}</span>
              <strong style={{ color: '#ffffff' }}>{item.topCountry.name}</strong>
              <span style={{ color: '#34d399', fontWeight: 700 }}>
                (+{item.topCountry.val}%)
              </span>
            </div>
          )}

          <div className="tooltip-footer">
            <span className="tooltip-live-dot" />
            <span>คำนวณจาก {item.countryCount || (item.isGlobal ? 182 : '')} ประเทศจริงใน World Bank</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-home-page">
      <div className="dashboard-home-container">
        {/* Ambient Grid Pattern and Cosmic Glow (Matching Landing Hero) */}
        <div className="indicator-bg-grid-pattern" />
        <div className="indicator-ambient-glow" />
        <div className="indicator-ambient-glow-secondary" />

        {/* ====================================================================
            1. TOP 5 PERFORMERS BENCHMARK CARDS & YEAR SELECTOR
            ==================================================================== */}
        <div className="db-home-header-row" style={{ position: 'relative', zIndex: 10 }}>
          <div className="db-home-title-col">
            <div className="hero-badge-tag" style={{ marginBottom: '0.65rem' }}>
              <span className="badge-sparkle">✦</span>
              <span>GLOBAL MACRO BENCHMARK · {selectedYear}</span>
            </div>
            <h1 className="indicator-hero-big-title">
              ภาพรวมแดชบอร์ดเศรษฐกิจมหภาค
            </h1>
            <p className="indicator-hero-subtext">
              ติดตามและวิเคราะห์ 5 อันดับแรกของดัชนีชี้วัดหลัก GDP Growth, อัตราเงินเฟ้อ, การว่างงาน พร้อมสถิติเฉลี่ย 7 ทวีปทั่วโลก ย้อนหลัง 5 ปี (2020 - 2025)
            </p>
          </div>

          {/* Luxury Year Selector Card with Custom Dropdown & Fast Pills */}
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

        {/* 3 Metric Cards Grid */}
        <div className="db-metrics-grid">
          <MetricCard
            title={`GDP Growth TOP 5 (${selectedYear})`}
            type="gdp"
            items={gdpItems}
            onExplore={setActiveTab}
          />
          <MetricCard
            title={`Inflation Rate TOP 5 (${selectedYear})`}
            type="inflation"
            items={inflationItems}
            onExplore={setActiveTab}
          />
          <MetricCard
            title={`Unemployment TOP 5 (${selectedYear})`}
            type="unemployment"
            items={unemploymentItems}
            onExplore={setActiveTab}
          />
        </div>

        {/* ====================================================================
            2. ULTRA-LUXURY COMPARATIVE RECHARTS GRAPH
            ==================================================================== */}
        <div className="db-chart-card">
          {/* Header Controls */}
          <div className="db-chart-header">
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.65rem', margin: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)' }}>
                  <BarChart3 size={18} />
                </div>
                <span>ภาพรวมสัดส่วน 3 ดัชนีหลัก</span>
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '6px', margin: 0 }}>
                เปรียบเทียบความสัมพันธ์ระหว่างอัตราการเติบโต GDP, อัตราเงินเฟ้อ และอัตราการว่างงานของกลุ่มประเทศผู้นำ
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="db-chart-tabs-wrap">
              <button
                onClick={() => setActiveChartMode('all')}
                className={`db-chart-tab-btn ${activeChartMode === 'all' ? 'active' : ''}`}
              >
                <Layers size={13} />
                <span>เปรียบเทียบ 3 ดัชนี</span>
              </button>
              <button
                onClick={() => setActiveChartMode('gdp')}
                className={`db-chart-tab-btn ${activeChartMode === 'gdp' ? 'active' : ''}`}
              >
                <TrendingUp size={13} style={{ color: activeChartMode === 'gdp' ? '#ffffff' : '#34d399' }} />
                <span>GDP Growth</span>
              </button>
              <button
                onClick={() => setActiveChartMode('inflation')}
                className={`db-chart-tab-btn ${activeChartMode === 'inflation' ? 'active' : ''}`}
              >
                <Percent size={13} style={{ color: activeChartMode === 'inflation' ? '#ffffff' : '#f43f5e' }} />
                <span>เงินเฟ้อ</span>
              </button>
              <button
                onClick={() => setActiveChartMode('unemployment')}
                className={`db-chart-tab-btn ${activeChartMode === 'unemployment' ? 'active' : ''}`}
              >
                <Users size={13} style={{ color: activeChartMode === 'unemployment' ? '#ffffff' : '#38bdf8' }} />
                <span>อัตราว่างงาน</span>
              </button>
            </div>
          </div>

          {/* Recharts Canvas */}
          <div style={{ width: '100%', height: 380, marginTop: '0.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              {activeChartMode === 'all' ? (
                /* Mode 1: Comparative Matrix across 3 indicators */
                <BarChart
                  data={comparativeChartData}
                  margin={{ top: 25, right: 25, left: -10, bottom: 5 }}
                  barGap={8}
                >
                  <defs>
                    <linearGradient id="dbGdpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="dbInflationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                    <linearGradient id="dbUnemploymentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
                  <XAxis
                    dataKey="rankName"
                    stroke="#64748b"
                    tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 700 }}
                    axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    unit="%"
                    axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.08)' }} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px', fontSize: '0.84rem' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="GDP"
                    fill="url(#dbGdpGrad)"
                    radius={[8, 8, 2, 2]}
                    barSize={24}
                    name="GDP Growth (%)"
                  />
                  <Bar
                    dataKey="Inflation"
                    fill="url(#dbInflationGrad)"
                    radius={[8, 8, 2, 2]}
                    barSize={24}
                    name="อัตราเงินเฟ้อ (%)"
                  />
                  <Bar
                    dataKey="Unemployment"
                    fill="url(#dbUnemploymentGrad)"
                    radius={[8, 8, 2, 2]}
                    barSize={24}
                    name="อัตราการว่างงาน (%)"
                  />
                </BarChart>
              ) : activeChartMode === 'gdp' ? (
                /* Mode 2: GDP Leaders Breakdown */
                <BarChart
                  data={gdpOnlyData}
                  margin={{ top: 30, right: 25, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="gdpSoloGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 700 }}
                    axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    unit="%"
                    axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }} />
                  <Bar
                    dataKey="value"
                    fill="url(#gdpSoloGrad)"
                    radius={[10, 10, 2, 2]}
                    barSize={48}
                    name="GDP Growth (%)"
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      fill="#34d399"
                      fontSize={13}
                      fontWeight={700}
                      formatter={(v) => `+${v}%`}
                      offset={10}
                    />
                  </Bar>
                </BarChart>
              ) : activeChartMode === 'inflation' ? (
                /* Mode 3: Inflation Leaders Breakdown */
                <BarChart
                  data={inflationOnlyData}
                  margin={{ top: 30, right: 25, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="inflationSoloGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb7185" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 700 }}
                    axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    unit="%"
                    axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244, 63, 94, 0.08)' }} />
                  <Bar
                    dataKey="value"
                    fill="url(#inflationSoloGrad)"
                    radius={[10, 10, 2, 2]}
                    barSize={48}
                    name="อัตราเงินเฟ้อ (%)"
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      fill="#fb7185"
                      fontSize={13}
                      fontWeight={700}
                      formatter={(v) => `${v}%`}
                      offset={10}
                    />
                  </Bar>
                </BarChart>
              ) : (
                /* Mode 4: Unemployment Leaders Breakdown */
                <BarChart
                  data={unemploymentOnlyData}
                  margin={{ top: 30, right: 25, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="unemploymentSoloGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 700 }}
                    axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    unit="%"
                    axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.08)' }} />
                  <Bar
                    dataKey="value"
                    fill="url(#unemploymentSoloGrad)"
                    radius={[10, 10, 2, 2]}
                    barSize={48}
                    name="อัตราการว่างงาน (%)"
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      fill="#38bdf8"
                      fontSize={13}
                      fontWeight={700}
                      formatter={(v) => `${v}%`}
                      offset={10}
                    />
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* ====================================================================
            3. REGIONAL MACRO BENCHMARK (สถิติเฉลี่ยรายภูมิภาคโลก)
            ==================================================================== */}
        <div className="db-regional-card">
          {/* Section Header */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.65rem', margin: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)' }}>
                <Globe size={18} />
              </div>
              <span>สถิติเศรษฐกิจเฉลี่ยรายภูมิภาคโลก</span>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', marginTop: '6px', margin: 0 }}>
              สรุปภาพรวมอัตราการเติบโตเฉลี่ย GDP, อัตราเงินเฟ้อ และอัตราการว่างงาน จำแนกตาม 7 ทวีปหลักทั่วโลก
            </p>
          </div>

          {/* 1. TOP: 8 Symmetrical Regional Overview Cards (2 rows of 4) */}
          <div className="db-regional-grid">
            {regionalData.map((reg) => {
              const iconCfg = getRegionIconConfig(reg.id, 18);
              return (
                <div
                  key={reg.id}
                  className={`db-region-box ${reg.isGlobal ? 'is-global' : ''}`}
                  style={{ '--region-accent': iconCfg.color }}
                >
                  <div className="db-region-box-header">
                    <div className="db-region-title-wrap">
                      <div
                        className="db-region-icon-circle"
                        style={{
                          background: iconCfg.bg,
                          borderColor: iconCfg.border,
                          color: iconCfg.color,
                          boxShadow: `0 0 14px ${iconCfg.bg}`
                        }}
                      >
                        {iconCfg.icon}
                      </div>
                      <div className="db-region-name-block">
                        <h4 className="db-region-name-en">{reg.name}</h4>
                        <div className="db-region-name-th">{reg.thai}</div>
                      </div>
                    </div>
                    <span className="db-region-nations-pill">
                      {reg.isGlobal ? '182 ชาติ' : `${reg.countryCount} ประเทศ`}
                    </span>
                  </div>

                <div className="db-region-stats-row">
                  <div className="db-region-stat-col">
                    <span className="db-region-stat-val" style={{ color: '#34d399' }}>
                      <AnimatedValue
                        key={`reg-gdp-${reg.id}-${selectedYear}`}
                        value={`+${reg.avgGdp}%`}
                        duration={1200}
                        delay={120}
                      />
                    </span>
                    <span className="db-region-stat-lbl">GDP เฉลี่ย</span>
                  </div>
                  <div className="db-region-stat-col">
                    <span className="db-region-stat-val" style={{ color: '#fb7185' }}>
                      <AnimatedValue
                        key={`reg-inf-${reg.id}-${selectedYear}`}
                        value={`${reg.avgInflation}%`}
                        duration={1200}
                        delay={200}
                      />
                    </span>
                    <span className="db-region-stat-lbl">เงินเฟ้อเฉลี่ย</span>
                  </div>
                  <div className="db-region-stat-col">
                    <span className="db-region-stat-val" style={{ color: '#38bdf8' }}>
                      <AnimatedValue
                        key={`reg-unemp-${reg.id}-${selectedYear}`}
                        value={`${reg.avgUnemployment}%`}
                        duration={1200}
                        delay={280}
                      />
                    </span>
                    <span className="db-region-stat-lbl">ว่างงานเฉลี่ย</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

          {/* 2. BOTTOM: Deep-Dive Regional Comparative Graph */}
          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(168, 85, 247, 0.18)' }}>
            <div className="db-chart-header" style={{ marginBottom: '0.5rem', borderBottom: 'none', paddingBottom: 0 }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <BarChart3 size={16} color="#c084fc" />
                  <span>กราฟวิเคราะห์เปรียบเทียบรายภูมิภาค</span>
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px', margin: 0 }}>
                  เปรียบเทียบดัชนีชี้วัดของแต่ละทวีปทั่วโลกแบบ Multi-Bar Dynamic View
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="db-chart-tabs-wrap">
                <button
                  onClick={() => setRegionalChartMode('all')}
                  className={`db-chart-tab-btn ${regionalChartMode === 'all' ? 'active' : ''}`}
                >
                  <Layers size={13} />
                  <span>เปรียบเทียบ 3 ดัชนี</span>
                </button>
                <button
                  onClick={() => setRegionalChartMode('gdp')}
                  className={`db-chart-tab-btn ${regionalChartMode === 'gdp' ? 'active' : ''}`}
                >
                  <TrendingUp size={13} style={{ color: regionalChartMode === 'gdp' ? '#ffffff' : '#34d399' }} />
                  <span>GDP Growth เฉลี่ย</span>
                </button>
                <button
                  onClick={() => setRegionalChartMode('inflation')}
                  className={`db-chart-tab-btn ${regionalChartMode === 'inflation' ? 'active' : ''}`}
                >
                  <Percent size={13} style={{ color: regionalChartMode === 'inflation' ? '#ffffff' : '#f43f5e' }} />
                  <span>เงินเฟ้อเฉลี่ย</span>
                </button>
                <button
                  onClick={() => setRegionalChartMode('unemployment')}
                  className={`db-chart-tab-btn ${regionalChartMode === 'unemployment' ? 'active' : ''}`}
                >
                  <Users size={13} style={{ color: regionalChartMode === 'unemployment' ? '#ffffff' : '#38bdf8' }} />
                  <span>อัตราว่างงานเฉลี่ย</span>
                </button>
              </div>
            </div>

            {/* Regional Recharts Canvas (Comparing the 7 Continents) */}
            <div style={{ width: '100%', height: 380, marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                {regionalChartMode === 'all' ? (
                  <BarChart
                    data={regionalData.filter(r => !r.isGlobal)}
                    margin={{ top: 25, right: 25, left: -10, bottom: 5 }}
                    barGap={6}
                  >
                    <defs>
                      <linearGradient id="regGdpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="regInfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                      <linearGradient id="regUnempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 700 }}
                      axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                      unit="%"
                      axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                      tickLine={false}
                    />
                    <Tooltip content={<RegionalTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.08)' }} />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px', fontSize: '0.84rem' }}
                      iconType="circle"
                    />
                    <Bar
                      dataKey="avgGdp"
                      fill="url(#regGdpGrad)"
                      radius={[8, 8, 2, 2]}
                      barSize={20}
                      name="GDP Growth เฉลี่ย (%)"
                    />
                    <Bar
                      dataKey="avgInflation"
                      fill="url(#regInfGrad)"
                      radius={[8, 8, 2, 2]}
                      barSize={20}
                      name="อัตราเงินเฟ้อเฉลี่ย (%)"
                    />
                    <Bar
                      dataKey="avgUnemployment"
                      fill="url(#regUnempGrad)"
                      radius={[8, 8, 2, 2]}
                      barSize={20}
                      name="อัตราการว่างงานเฉลี่ย (%)"
                    />
                  </BarChart>
                ) : regionalChartMode === 'gdp' ? (
                  <BarChart
                    data={regionalData.filter(r => !r.isGlobal)}
                    margin={{ top: 30, right: 25, left: -10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="regSoloGdp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 700 }}
                      axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                      unit="%"
                      axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                      tickLine={false}
                    />
                    <Tooltip content={<RegionalTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }} />
                    <Bar
                      dataKey="avgGdp"
                      fill="url(#regSoloGdp)"
                      radius={[10, 10, 2, 2]}
                      barSize={44}
                      name="GDP Growth เฉลี่ย (%)"
                    >
                      <LabelList
                        dataKey="avgGdp"
                        position="top"
                        fill="#34d399"
                        fontSize={13}
                        fontWeight={700}
                        formatter={(v) => `+${v}%`}
                        offset={10}
                      />
                    </Bar>
                  </BarChart>
                ) : regionalChartMode === 'inflation' ? (
                  <BarChart
                    data={regionalData.filter(r => !r.isGlobal)}
                    margin={{ top: 30, right: 25, left: -10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="regSoloInf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 700 }}
                      axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                      unit="%"
                      axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                      tickLine={false}
                    />
                    <Tooltip content={<RegionalTooltip />} cursor={{ fill: 'rgba(244, 63, 94, 0.08)' }} />
                    <Bar
                      dataKey="avgInflation"
                      fill="url(#regSoloInf)"
                      radius={[10, 10, 2, 2]}
                      barSize={44}
                      name="อัตราเงินเฟ้อเฉลี่ย (%)"
                    >
                      <LabelList
                        dataKey="avgInflation"
                        position="top"
                        fill="#fb7185"
                        fontSize={13}
                        fontWeight={700}
                        formatter={(v) => `${v}%`}
                        offset={10}
                      />
                    </Bar>
                  </BarChart>
                ) : (
                  <BarChart
                    data={regionalData.filter(r => !r.isGlobal)}
                    margin={{ top: 30, right: 25, left: -10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="regSoloUnemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 700 }}
                      axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                      unit="%"
                      axisLine={{ stroke: 'rgba(168, 85, 247, 0.25)' }}
                      tickLine={false}
                    />
                    <Tooltip content={<RegionalTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.08)' }} />
                    <Bar
                      dataKey="avgUnemployment"
                      fill="url(#regSoloUnemp)"
                      radius={[10, 10, 2, 2]}
                      barSize={44}
                      name="อัตราการว่างงานเฉลี่ย (%)"
                    >
                      <LabelList
                        dataKey="avgUnemployment"
                        position="top"
                        fill="#38bdf8"
                        fontSize={13}
                        fontWeight={700}
                        formatter={(v) => `${v}%`}
                        offset={10}
                      />
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
