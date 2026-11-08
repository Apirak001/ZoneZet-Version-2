import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  GitCompare,
  Plus,
  X,
  TrendingUp,
  Flame,
  Users,
  Check,
  Info,
  Search,
  Calendar,
  ShieldCheck,
  Zap,
  Sparkles,
  Globe,
  Trash2,
  Award,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';
import { fetchCountryComparison, fetchCountriesDirectory } from '../services/api';
import { LoadingSkeleton, EmptyState, ErrorBanner } from './FeedbackStates';
import AnimatedValue from './AnimatedValue';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

// Distinct, high-contrast semantic colors for up to 5 compared countries
const COUNTRY_COLORS = [
  '#34d399', // Emerald
  '#38bdf8', // Sky Blue
  '#f43f5e', // Coral Flame Red
  '#fbbf24', // Amber Gold
  '#c084fc', // Royal Violet
  '#a78bfa'  // Lavender
];

export default function ComparisonHub({
  comparedList = ['THA', 'USA', 'JPN', 'VNM'],
  setComparedList,
  onRemoveFromCompare,
  selectedYear = '2025'
}) {
  const [comparisonData, setComparisonData] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('gdp');
  const [searchFilter, setSearchFilter] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto focus input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isDropdownOpen]);

  // Load available countries directory for search dropdown
  useEffect(() => {
    fetchCountriesDirectory()
      .then(res => setAllCountries(res.data || []))
      .catch(err => console.warn('Directory error:', err));
  }, []);

  // Fetch comparison data when comparedList changes
  useEffect(() => {
    if (!comparedList || comparedList.length === 0) {
      setComparisonData(null);
      setIsLoading(false);
      return;
    }

    // Check if we already have comparisonData for all currently requested countries
    // (e.g. when removing countries, the remaining countries ALREADY exist in comparisonData!)
    const hasAllData =
      comparisonData &&
      comparedList.every(code =>
        (comparisonData.countries || []).some(c => c.code && c.code.toUpperCase() === code.toUpperCase())
      );

    if (hasAllData) {
      // Data already available in memory, no need to trigger full loading screen!
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchCountryComparison({
      countries: comparedList,
      startYear: 2020,
      endYear: 2025
    })
      .then(res => {
        setComparisonData(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Comparison error:', err);
        setError(err.message || 'ไม่สามารถโหลดข้อมูลเปรียบเทียบได้');
        setIsLoading(false);
      });
  }, [comparedList]);

  const handleRemoveCountry = (code) => {
    if (!code) return;
    const clean = code.toUpperCase();
    if (setComparedList) {
      setComparedList(prev => prev.filter(c => c && c.toUpperCase() !== clean));
    }
    if (onRemoveFromCompare) {
      onRemoveFromCompare(clean);
    }
  };

  const handleAddCountry = (code) => {
    if (!code) return;
    const clean = code.toUpperCase();
    if (comparedList.some(c => c && c.toUpperCase() === clean)) return;
    if (comparedList.length >= 5) {
      alert('สามารถเปรียบเทียบพร้อมกันได้สูงสุด 5 ประเทศ เพื่อความแม่นยำในการวิเคราะห์');
      return;
    }
    if (setComparedList) {
      setComparedList(prev => [...prev, clean]);
    }
    setIsDropdownOpen(false);
    setSearchFilter('');
  };

  const handleClearAll = () => {
    if (!comparedList || comparedList.length === 0) return;
    if (setComparedList) {
      setComparedList([]);
    }
    setComparisonData(null);
  };

  const filteredSearchCountries = useMemo(() => {
    if (!searchFilter.trim()) {
      return allCountries.slice(0, 12);
    }
    const q = searchFilter.toLowerCase().trim();
    return allCountries
      .filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.region && c.region.toLowerCase().includes(q))
      )
      .slice(0, 15);
  }, [allCountries, searchFilter]);

  const getMetricInfo = () => {
    switch (selectedMetric) {
      case 'inflation':
        return {
          title: 'ดัชนีราคาผู้บริโภค / อัตราเงินเฟ้อ Inflation Rate (CPI)',
          sub: 'ติดตามการเคลื่อนไหวของระดับราคาสินค้าและค่าครองชีพย้อนหลัง 5 ปี (2020 - 2025)',
          color: '#f43f5e',
          badgeClass: 'red',
          unit: '%'
        };
      case 'unemployment':
        return {
          title: 'ดัชนีตลาดแรงงานและอัตราการว่างงาน Unemployment Rate',
          sub: 'สำรวจสัดส่วนประชากรว่างงานต่อกำลังแรงงานรวมในแต่ละประเทศ (2020 - 2025)',
          color: '#38bdf8',
          badgeClass: 'blue',
          unit: '%'
        };
      case 'gdp':
      default:
        return {
          title: 'อัตราการเติบโตทางเศรษฐกิจ GDP Growth Rate (%)',
          sub: 'วิเคราะห์พลวัตการขยายตัวของมูลค่าผลผลิตมวลรวมในประเทศแบบรายปี (2020 - 2025)',
          color: '#34d399',
          badgeClass: 'green',
          unit: '%'
        };
    }
  };

  const currentMetric = getMetricInfo();

  // Real-Time Group Analytical Insights (Leader, Average, Lowest, Spread)
  const groupInsights = useMemo(() => {
    if (!comparisonData?.latestSnapshot || comparedList.length === 0) return null;
    const items = (comparisonData.latestSnapshot[selectedMetric] || [])
      .filter(c => comparedList.includes(c.countryCode) && typeof c.value === 'number');

    if (items.length === 0) return null;

    const sorted = [...items].sort((a, b) => b.value - a.value);
    const leader = sorted[0];
    const lowest = sorted[sorted.length - 1];
    const sum = sorted.reduce((acc, curr) => acc + curr.value, 0);
    const avg = (sum / sorted.length).toFixed(1);
    const spread = (leader.value - lowest.value).toFixed(1);

    return { leader, lowest, avg, spread };
  }, [comparisonData, comparedList, selectedMetric]);

  // Custom Glassmorphism Multi-Line Chart Tooltip
  const CompareCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sortedPayload = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0));

      return (
        <div className="db-custom-chart-tooltip" style={{ minWidth: 250 }}>
          <div className="tooltip-country-header">
            <Calendar size={13} color="#c084fc" />
            <span className="tooltip-country-name">รอบปี ค.ศ. {label}</span>
            <span className="tooltip-year-badge">{payload.length} ประเทศ</span>
          </div>

          <div className="tooltip-indicators-list">
            {sortedPayload.map((entry) => {
              const countryCode = entry.dataKey.split('_')[0];
              const countryProfile = (comparisonData?.countries || []).find(c => c.code === countryCode);
              const flagUrl = countryProfile?.iso2
                ? `https://flagcdn.com/w40/${countryProfile.iso2.toLowerCase()}.png`
                : null;

              return (
                <div key={entry.dataKey} className="tooltip-indicator-row">
                  <div className="tooltip-indicator-name" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="tooltip-color-bullet" style={{ background: entry.color }} />
                    {flagUrl && (
                      <img
                        src={flagUrl}
                        alt={countryCode}
                        style={{ width: 16, height: 11, borderRadius: 2, objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span>{countryProfile?.name || countryCode}:</span>
                  </div>
                  <span className="tooltip-indicator-value" style={{ color: entry.color, fontWeight: 700 }}>
                    {typeof entry.value === 'number'
                      ? `${selectedMetric === 'gdp' && entry.value > 0 ? '+' : ''}${entry.value.toFixed(1)}%`
                      : entry.value}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="tooltip-footer">
            <span className="tooltip-live-dot" />
            <span>World Bank Multi-Year Engine</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="compare-page-container">
      {/* Ambient Grid Pattern and Cosmic Glow */}
      <div className="indicator-bg-grid-pattern" />
      <div className="indicator-ambient-glow" />
      <div className="indicator-ambient-glow-secondary" />

      {/* ====================================================================
          1. ULTRA-LUXURY HERO HEADER & FAST PRESETS
          ==================================================================== */}
      <div className="db-home-header-row" style={{ marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
        <div className="db-home-title-col">
          <div className="hero-badge-tag" style={{ marginBottom: '0.65rem' }}>
            <span className="badge-sparkle">✦</span>
            <span>MULTI-COUNTRY MACRO BENCHMARK · 2020 – 2025</span>
          </div>

          <h1 className="indicator-hero-big-title">
            ศูนย์เปรียบเทียบสถิติเศรษฐกิจพหุภาคี{' '}
            <span className="title-en-gradient">Multi-Country Comparison Hub</span>
          </h1>

          <p className="indicator-hero-subtext">
            เครื่องมือวิเคราะห์และเปรียบเทียบตัวเลขเศรษฐกิจข้ามประเทศแบบเจาะลึก 5 ปีย้อนหลัง ติดตามความสัมพันธ์ระหว่าง GDP Growth, เสถียรภาพอัตราเงินเฟ้อ CPI และตลาดแรงงาน
          </p>

          {/* Luxury Meta Trust Badges */}
          <div className="indicator-meta-badges-row">
            <div className="indicator-meta-pill">
              <span className="pulse-indicator-dot green" />
              <span>World Bank Multi-Year Stream</span>
            </div>
            <div className="indicator-meta-pill">
              <ShieldCheck size={13} color="#c084fc" />
              <span>เปรียบเทียบสูงสุด 5 ชาติพร้อมกัน</span>
            </div>
            <div className="indicator-meta-pill">
              <Zap size={13} color="#38bdf8" />
              <span>Time-Series Matrix Engine O(n)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. SELECTED COUNTRIES DECK (UP TO 5 SLOTS) & INSTANT SEARCH
          ==================================================================== */}
      <div className="compare-deck-card">
        <div className="compare-deck-header">
          <div className="compare-deck-title-wrap">
            <div className="compare-deck-title">
              <GitCompare size={17} color="#c084fc" />
              <span>ประเทศในชุดวิเคราะห์เปรียบเทียบ (Selected Nations)</span>
            </div>
            <span className="compare-deck-count-pill">
              {comparedList.length} / 5 ประเทศ
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {comparedList.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.4rem 0.75rem',
                  color: '#f87171',
                  borderColor: 'rgba(239, 68, 68, 0.25)',
                  borderRadius: '8px'
                }}
                title="ล้างรายชื่อประเทศทั้งหมดออกจากชุดเปรียบเทียบ"
              >
                <Trash2 size={13} />
                <span>ล้างทั้งหมด</span>
              </button>
            )}

            {/* Add Country Button & Dropdown Wrapper */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="compare-add-country-btn"
                disabled={comparedList.length >= 5}
                style={comparedList.length >= 5 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={comparedList.length >= 5 ? 'เปรียบเทียบได้สูงสุด 5 ประเทศแล้ว' : 'คลิกเพื่อเพิ่มประเทศ'}
              >
                <Plus size={15} />
                <span>{comparedList.length >= 5 ? 'ครบ 5 ประเทศแล้ว' : 'เพิ่มประเทศ (Add Country)'}</span>
              </button>

              {/* Floating Luxury Search Dropdown */}
              {isDropdownOpen && (
                <div className="compare-search-dropdown-menu">
                  <div className="compare-search-input-box">
                    <Search size={14} color="#94a3b8" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="ค้นหาชื่อประเทศ หรือรหัส ISO..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="compare-search-input"
                    />
                    {searchFilter && (
                      <button
                        type="button"
                        onClick={() => setSearchFilter('')}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <div className="compare-search-results-list">
                    {filteredSearchCountries.map((c) => {
                      const flagUrl = c.iso2 ? `https://flagcdn.com/w40/${c.iso2.toLowerCase()}.png` : null;
                      const isAlreadySelected = comparedList.some(code => code && code.toUpperCase() === c.code.toUpperCase());

                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            if (!isAlreadySelected) handleAddCountry(c.code);
                          }}
                          disabled={isAlreadySelected}
                          className="compare-search-item"
                          style={isAlreadySelected ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            {flagUrl && (
                              <img
                                src={flagUrl}
                                alt={c.name}
                                style={{ width: 22, height: 15, borderRadius: 3, objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff' }}>{c.name}</span>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.region}</span>
                            </div>
                          </div>
                          {isAlreadySelected ? (
                            <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Check size={11} /> เลือกอยู่
                            </span>
                          ) : (
                            <span className="compare-chip-code">{c.code}</span>
                          )}
                        </button>
                      );
                    })}

                    {filteredSearchCountries.length === 0 && (
                      <div style={{ color: '#64748b', fontSize: '0.8rem', padding: '0.85rem', textAlign: 'center' }}>
                        ไม่พบประเทศที่ค้นหา
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chips List of Selected Countries + Empty Slots Visualizer */}
        <div className="compare-chips-list">
          {comparedList.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 0' }}>
              <Info size={15} color="#c084fc" />
              <span>ยังไม่มีประเทศในรายการเปรียบเทียบ — กรุณากดปุ่ม <strong>+ เพิ่มประเทศเพื่อเปรียบเทียบ</strong> ด้านบน</span>
            </div>
          ) : (
            <>
              {comparedList.map((code, idx) => {
                const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                const countryProfile = (comparisonData?.countries || []).find(c => c.code === code) ||
                  allCountries.find(c => c.code === code) || { name: code, iso2: code.toLowerCase() };
                const flagUrl = countryProfile.iso2
                  ? `https://flagcdn.com/w40/${countryProfile.iso2.toLowerCase()}.png`
                  : null;

                return (
                  <div
                    key={code}
                    className="compare-country-chip"
                    style={{
                      borderColor: `${color}60`,
                      boxShadow: `0 4px 14px ${color}15`
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: color,
                        boxShadow: `0 0 8px ${color}`
                      }}
                    />
                    {flagUrl && (
                      <img
                        src={flagUrl}
                        alt={countryProfile.name}
                        className="compare-chip-flag"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span className="compare-chip-name">{countryProfile.name}</span>
                    <span className="compare-chip-code">{code}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCountry(code)}
                      className="compare-chip-remove"
                      title={`นำ ${countryProfile.name} ออกจากการเปรียบเทียบ`}
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })}

              {/* Empty Slots to reach 5 slots */}
              {Array.from({ length: 5 - comparedList.length }).map((_, slotIdx) => (
                <button
                  key={`empty-slot-${slotIdx}`}
                  type="button"
                  onClick={() => setIsDropdownOpen(true)}
                  className="compare-slot-empty"
                  title="คลิกเพื่อเลือกประเทศเพิ่ม"
                >
                  <Plus size={13} />
                  <span>ช่องว่าง ({comparedList.length + slotIdx + 1}/5)</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => setComparedList([...comparedList])} />}

      {/* ====================================================================
          3. MAIN CHARTS & SNAPSHOT CARDS
          ==================================================================== */}
      {isLoading ? (
        <LoadingSkeleton text="กำลังประมวลผล Time-Series Matrix เปรียบเทียบย้อนหลัง 5 ปี..." />
      ) : comparedList.length === 0 ? (
        <EmptyState
          title="ไม่มีประเทศในระบบเปรียบเทียบ"
          message="คลิกปุ่มด้านล่างเพื่อโหลดกลุ่มประเทศตัวอย่างทันที หรือกดปุ่ม '+ เพิ่มประเทศ' ด้านบน"
          onReset={() => setComparedList(['THA', 'USA', 'JPN', 'VNM'])}
        />
      ) : (
        <>
          {/* ====================================================================
              4. ULTRA-LUXURY MULTI-YEAR RECHARTS LINE CHART & INSIGHT BAR
              ==================================================================== */}
          <div className="db-chart-card" style={{ marginBottom: '2.5rem' }}>
            <div className="db-chart-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.65rem', margin: 0 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: `${currentMetric.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentMetric.color,
                      boxShadow: `0 0 15px ${currentMetric.color}35`
                    }}
                  >
                    <GitCompare size={18} />
                  </div>
                  <span>{currentMetric.title}</span>
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '6px', margin: 0 }}>
                  {currentMetric.sub}
                </p>
              </div>

              {/* 3 Metric Tabs Switcher */}
              <div className="compare-metric-tabs">
                <button
                  type="button"
                  onClick={() => setSelectedMetric('gdp')}
                  className={`compare-metric-tab-btn ${selectedMetric === 'gdp' ? 'active gdp' : ''}`}
                >
                  <TrendingUp size={14} style={{ color: selectedMetric === 'gdp' ? '#34d399' : '#94a3b8' }} />
                  <span>GDP Growth</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMetric('inflation')}
                  className={`compare-metric-tab-btn ${selectedMetric === 'inflation' ? 'active inflation' : ''}`}
                >
                  <Flame size={14} style={{ color: selectedMetric === 'inflation' ? '#fb7185' : '#94a3b8' }} />
                  <span>อัตราเงินเฟ้อ (CPI)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMetric('unemployment')}
                  className={`compare-metric-tab-btn ${selectedMetric === 'unemployment' ? 'active unemployment' : ''}`}
                >
                  <Users size={14} style={{ color: selectedMetric === 'unemployment' ? '#38bdf8' : '#94a3b8' }} />
                  <span>อัตราการว่างงาน</span>
                </button>
              </div>
            </div>

            {/* Executive Analytical Insight Bar (Quick Intelligence) */}
            {groupInsights && (
              <div className="compare-insight-grid" style={{ marginTop: '1.25rem' }}>
                <div className="compare-insight-card">
                  <div className="compare-insight-icon-box" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                    <Award size={16} />
                  </div>
                  <div className="compare-insight-text">
                    <span className="compare-insight-val" style={{ color: '#34d399' }}>
                      {groupInsights.leader ? `${groupInsights.leader.country} (${selectedMetric === 'gdp' && groupInsights.leader.value > 0 ? '+' : ''}${groupInsights.leader.value}%)` : '-'}
                    </span>
                    <span className="compare-insight-lbl">ผู้นำสูงสุดในกลุ่ม</span>
                  </div>
                </div>

                <div className="compare-insight-card">
                  <div className="compare-insight-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                    <Globe size={16} />
                  </div>
                  <div className="compare-insight-text">
                    <span className="compare-insight-val" style={{ color: '#c084fc' }}>
                      {selectedMetric === 'gdp' && Number(groupInsights.avg) > 0 ? '+' : ''}{groupInsights.avg}%
                    </span>
                    <span className="compare-insight-lbl">ค่าเฉลี่ยของ {comparedList.length} ประเทศ</span>
                  </div>
                </div>

                <div className="compare-insight-card">
                  <div className="compare-insight-icon-box" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                    <ArrowDownRight size={16} />
                  </div>
                  <div className="compare-insight-text">
                    <span className="compare-insight-val" style={{ color: '#38bdf8' }}>
                      {groupInsights.lowest ? `${groupInsights.lowest.country} (${groupInsights.lowest.value}%)` : '-'}
                    </span>
                    <span className="compare-insight-lbl">สถิติต่ำสุดในกลุ่ม</span>
                  </div>
                </div>

                <div className="compare-insight-card">
                  <div className="compare-insight-icon-box" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                    <Zap size={16} />
                  </div>
                  <div className="compare-insight-text">
                    <span className="compare-insight-val" style={{ color: '#fbbf24' }}>
                      Δ {groupInsights.spread}%
                    </span>
                    <span className="compare-insight-lbl">ช่วงส่วนต่างสูงสุด-ต่ำสุด</span>
                  </div>
                </div>
              </div>
            )}

            {/* Line Chart Canvas */}
            <div style={{ width: '100%', height: 350, marginTop: '0.75rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={comparisonData?.timeline || []}
                  margin={{ top: 20, right: 30, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
                  <XAxis
                    dataKey="year"
                    stroke="#64748b"
                    tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }}
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
                  <Tooltip content={<CompareCustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px', fontSize: '0.84rem' }}
                    iconType="circle"
                  />
                  {comparedList.map((code, idx) => {
                    const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                    const countryProfile = (comparisonData?.countries || []).find(c => c.code === code);
                    const label = countryProfile ? `${countryProfile.name} (${code})` : code;
                    return (
                      <Line
                        key={code}
                        type="monotone"
                        dataKey={`${code}_${selectedMetric}`}
                        name={label}
                        stroke={color}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: color, stroke: '#110822' }}
                        activeDot={{ r: 7, strokeWidth: 2, stroke: '#ffffff' }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ====================================================================
              5. CROSS-COUNTRY SNAPSHOT BENCHMARK MATRIX CARDS ({selectedYear})
              ==================================================================== */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.65rem', margin: 0 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(168, 85, 247, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c084fc'
                  }}
                >
                  <Sparkles size={16} />
                </div>
                <span>ตารางวิเคราะห์สถิติเศรษฐกิจเปรียบเทียบรอบปีล่าสุด ({selectedYear})</span>
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: '6px', margin: 0 }}>
                เปรียบเทียบ 3 เสาหลักเศรษฐกิจมหภาคแบบรายประเทศ (Cross-Country Macro Matrix)
              </p>
            </div>

            <div className="compare-matrix-grid">
              {comparedList.map((code, idx) => {
                const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                const countryProfile = (comparisonData?.countries || []).find(c => c.code === code) ||
                  allCountries.find(c => c.code === code) || { name: code, iso2: code.toLowerCase(), region: 'Global' };

                const gdpVal = (comparisonData?.latestSnapshot?.gdp || []).find(c => c.countryCode === code);
                const infVal = (comparisonData?.latestSnapshot?.inflation || []).find(c => c.countryCode === code);
                const uneVal = (comparisonData?.latestSnapshot?.unemployment || []).find(c => c.countryCode === code);

                const flagUrl = countryProfile.iso2
                  ? `https://flagcdn.com/w40/${countryProfile.iso2.toLowerCase()}.png`
                  : null;

                const gdpNum = gdpVal?.value ?? 0;
                const infNum = infVal?.value ?? 0;
                const uneNum = uneVal?.value ?? 0;

                return (
                  <div
                    key={code}
                    className="compare-matrix-card"
                    style={{ borderColor: `${color}35` }}
                  >
                    {/* Top Color Strip */}
                    <div
                      className="compare-matrix-top-strip"
                      style={{ background: `linear-gradient(90deg, ${color} 0%, ${color}40 100%)` }}
                    />

                    {/* Country Header */}
                    <div className="compare-matrix-country-header">
                      {flagUrl && (
                        <img
                          src={flagUrl}
                          alt={countryProfile.name}
                          className="compare-matrix-flag"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <div className="compare-matrix-country-name">{countryProfile.name}</div>
                        <div className="compare-matrix-country-sub">
                          <span>{code}</span> · <span>{countryProfile.region || 'World'}</span>
                        </div>
                      </div>
                    </div>

                    {/* 3 Indicators Breakdown Box */}
                    <div className="compare-matrix-metrics-box">
                      {/* 1. GDP Growth */}
                      <div className="compare-matrix-metric-row">
                        <div className="compare-matrix-metric-top">
                          <span className="compare-matrix-metric-label">
                            <TrendingUp size={13} color="#34d399" />
                            <span>GDP Growth</span>
                          </span>
                          <span className="db-value-badge green">
                            <AnimatedValue
                              key={`gdp-${code}-${gdpNum}`}
                              value={gdpVal?.displayValue || `${gdpNum > 0 ? '+' : ''}${gdpNum}%`}
                              duration={1200}
                              delay={idx * 50}
                            />
                          </span>
                        </div>
                        <div className="indicator-mini-bar-track">
                          <div
                            className="indicator-mini-bar-fill green"
                            style={{ width: `${Math.min(Math.max((Math.abs(gdpNum) / 12) * 100, 10), 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* 2. Inflation Rate (Coral Flame Red) */}
                      <div className="compare-matrix-metric-row">
                        <div className="compare-matrix-metric-top">
                          <span className="compare-matrix-metric-label">
                            <Flame size={13} color="#fb7185" />
                            <span>เงินเฟ้อ CPI</span>
                          </span>
                          <span className="db-value-badge red">
                            <AnimatedValue
                              key={`inf-${code}-${infNum}`}
                              value={infVal?.displayValue || `${infNum}%`}
                              duration={1200}
                              delay={idx * 50 + 100}
                            />
                          </span>
                        </div>
                        <div className="indicator-mini-bar-track">
                          <div
                            className="indicator-mini-bar-fill red"
                            style={{ width: `${Math.min(Math.max((Math.abs(infNum) / 25) * 100, 10), 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* 3. Unemployment Rate (Sky Blue) */}
                      <div className="compare-matrix-metric-row">
                        <div className="compare-matrix-metric-top">
                          <span className="compare-matrix-metric-label">
                            <Users size={13} color="#38bdf8" />
                            <span>การว่างงาน</span>
                          </span>
                          <span className="db-value-badge blue">
                            <AnimatedValue
                              key={`une-${code}-${uneNum}`}
                              value={uneVal?.displayValue || `${uneNum}%`}
                              duration={1200}
                              delay={idx * 50 + 200}
                            />
                          </span>
                        </div>
                        <div className="indicator-mini-bar-track">
                          <div
                            className="indicator-mini-bar-fill blue"
                            style={{ width: `${Math.min(Math.max((Math.abs(uneNum) / 15) * 100, 10), 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Remove Action Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveCountry(code)}
                      className="compare-remove-country-btn"
                      title="นำออกจากการเปรียบเทียบ (มีระบบ Undo ย้อนกลับได้)"
                    >
                      <Trash2 size={13} />
                      <span>นำออกจากการเปรียบเทียบ</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
