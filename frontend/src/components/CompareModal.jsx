import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  GitCompare,
  TrendingUp,
  Flame,
  Users,
  Calendar,
  Globe,
  Zap,
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Trash2,
  Sparkles,
  Info,
  BarChart3,
  Activity,
  Compass,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { fetchCountryComparison } from '../services/api';
import { LoadingSkeleton, EmptyState } from './FeedbackStates';
import AnimatedValue from './AnimatedValue';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  LabelList,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

const COUNTRY_COLORS = [
  '#34d399', // Emerald
  '#38bdf8', // Sky Blue
  '#f43f5e', // Coral Flame Red
  '#fbbf24', // Amber Gold
  '#c084fc', // Royal Violet
  '#a78bfa'  // Lavender
];

export default function CompareModal({
  isOpen = false,
  onClose,
  comparedList = [],
  setComparedList,
  onRemoveFromCompare,
  currentTab = 'gdp',
  selectedYear = '2025',
  onOpenFullHub
}) {
  // Metric tab inside the modal - defaults to current indicator page if applicable
  const initialMetric = ['gdp', 'inflation', 'unemployment'].includes(currentTab)
    ? currentTab
    : 'gdp';

  const [selectedMetric, setSelectedMetric] = useState(initialMetric);
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'line' | 'area' | 'radar'
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync metric with currentTab when modal opens
  useEffect(() => {
    if (isOpen && ['gdp', 'inflation', 'unemployment'].includes(currentTab)) {
      setSelectedMetric(currentTab);
    }
  }, [isOpen, currentTab]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch comparison data when modal is open and comparedList changes
  useEffect(() => {
    if (!isOpen || !comparedList || comparedList.length === 0) {
      setComparisonData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchCountryComparison({
      countries: comparedList,
      startYear: 2020,
      endYear: 2025
    })
      .then((res) => {
        setComparisonData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Modal comparison error:', err);
        setError(err.message || 'ไม่สามารถโหลดข้อมูลเปรียบเทียบได้');
        setIsLoading(false);
      });
  }, [isOpen, comparedList]);

  // Analytical Insights (Leader, Average, Lowest, Spread)
  const groupInsights = useMemo(() => {
    if (!comparisonData?.latestSnapshot || comparedList.length === 0) return null;
    const items = (comparisonData.latestSnapshot[selectedMetric] || [])
      .filter((c) => comparedList.includes(c.countryCode) && typeof c.value === 'number');

    if (items.length === 0) return null;

    const sorted = [...items].sort((a, b) => b.value - a.value);
    const leader = sorted[0];
    const lowest = sorted[sorted.length - 1];
    const sum = sorted.reduce((acc, curr) => acc + curr.value, 0);
    const avg = (sum / sorted.length).toFixed(1);
    const spread = (leader.value - lowest.value).toFixed(1);

    return { leader, lowest, avg, spread };
  }, [comparisonData, comparedList, selectedMetric]);

  // 5-Axis Macro Dimensions for Radar Mode
  const radarData = useMemo(() => {
    if (!comparisonData?.latestSnapshot || comparedList.length === 0) return [];

    const gdpMap = {};
    (comparisonData.latestSnapshot.gdp || []).forEach(i => {
      gdpMap[i.countryCode] = i.value;
    });

    const infMap = {};
    (comparisonData.latestSnapshot.inflation || []).forEach(i => {
      infMap[i.countryCode] = i.value;
    });

    const uneMap = {};
    (comparisonData.latestSnapshot.unemployment || []).forEach(i => {
      uneMap[i.countryCode] = i.value;
    });

    return [
      {
        pillar: 'GDP Growth',
        fullName: 'อัตราการเติบโตทางเศรษฐกิจ GDP (%)',
        ...comparedList.reduce((acc, code) => ({
          ...acc,
          [code]: Math.max(0, Number(gdpMap[code] ?? 0))
        }), {})
      },
      {
        pillar: 'Price Stability',
        fullName: 'เสถียรภาพราคา (เงินเฟ้อใกล้ 2%)',
        ...comparedList.reduce((acc, code) => {
          const inf = Number(infMap[code] ?? 2);
          const score = Math.max(1, 10 - Math.min(Math.abs(inf - 2) * 1.5, 9));
          return { ...acc, [code]: Number(score.toFixed(1)) };
        }, {})
      },
      {
        pillar: 'Labor Market',
        fullName: 'ความแข็งแกร่งตลาดแรงงาน',
        ...comparedList.reduce((acc, code) => {
          const une = Number(uneMap[code] ?? 4);
          const score = Math.max(1, 12 - une);
          return { ...acc, [code]: Number(score.toFixed(1)) };
        }, {})
      },
      {
        pillar: '3-Yr Momentum',
        fullName: 'โมเมนตัม 3 ปีย้อนหลัง',
        ...comparedList.reduce((acc, code) => {
          const timeline = comparisonData.timeline || [];
          const recent = timeline.slice(-3);
          const avg = recent.length
            ? recent.reduce((sum, yr) => sum + (Number(yr[`${code}_${selectedMetric}`]) || 0), 0) / recent.length
            : 0;
          return { ...acc, [code]: Number(Math.max(0, avg).toFixed(1)) };
        }, {})
      },
      {
        pillar: 'Macro Resilience',
        fullName: 'ดัชนีความยืดหยุ่นทางเศรษฐกิจ',
        ...comparedList.reduce((acc, code) => {
          const g = Math.max(0, Number(gdpMap[code] ?? 0));
          const u = Number(uneMap[code] ?? 4);
          const score = Math.max(1, (g * 1.2) + (10 - Math.min(u, 9)));
          return { ...acc, [code]: Number((score / 1.5).toFixed(1)) };
        }, {})
      }
    ];
  }, [comparisonData, comparedList, selectedMetric]);

  if (!isOpen) return null;

  // Custom Glassmorphism Tooltip for Modal Charts
  const CustomModalTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sorted = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0));
      const sum = sorted.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
      const avg = (sum / sorted.length).toFixed(1);

      return (
        <div
          className="db-custom-chart-tooltip"
          style={{
            minWidth: 260,
            zIndex: 1200,
            background: 'rgba(12, 6, 26, 0.95)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(168, 85, 247, 0.25)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            padding: '0.8rem'
          }}
        >
          <div
            className="tooltip-country-header"
            style={{
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Calendar size={13} color="#c084fc" />
              <span className="tooltip-country-name" style={{ fontWeight: 700 }}>ปี ค.ศ. {label}</span>
            </div>
            <span
              className="tooltip-year-badge"
              style={{
                background: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                fontSize: '0.72rem',
                padding: '2px 7px',
                borderRadius: '5px'
              }}
            >
              เฉลี่ย {selectedMetric === 'gdp' && Number(avg) > 0 ? '+' : ''}{avg}%
            </span>
          </div>

          <div className="tooltip-indicators-list" style={{ marginTop: '0.55rem' }}>
            {sorted.map((entry, idx) => {
              const countryCode = entry.dataKey ? entry.dataKey.split('_')[0] : '';
              const profile = (comparisonData?.countries || []).find((c) => c.code === countryCode);
              const flagUrl = profile?.iso2
                ? `https://flagcdn.com/w40/${profile.iso2.toLowerCase()}.png`
                : null;
              const countryIdx = comparedList.indexOf(countryCode);
              const bulletColor = countryIdx >= 0 ? COUNTRY_COLORS[countryIdx % COUNTRY_COLORS.length] : (entry.color || '#c084fc');
              const val = typeof entry.value === 'number' ? entry.value : Number(entry.value) || 0;
              const isLead = idx === 0;

              return (
                <div
                  key={entry.dataKey}
                  className="tooltip-indicator-row"
                  style={{
                    padding: '0.3rem 0.45rem',
                    borderRadius: '6px',
                    background: isLead ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: isLead ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255, 255, 255, 0.04)',
                    marginBottom: '0.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div className="tooltip-indicator-name" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        padding: '1px 4px',
                        borderRadius: '3px',
                        background: isLead ? '#fbbf24' : 'rgba(255, 255, 255, 0.12)',
                        color: isLead ? '#110822' : '#94a3b8',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {isLead ? '👑 #1' : `#${idx + 1}`}
                    </span>
                    {flagUrl && (
                      <img
                        src={flagUrl}
                        alt={countryCode}
                        style={{ width: 16, height: 11, borderRadius: 2, objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.8rem' }}>
                      {profile?.name || countryCode}
                    </span>
                  </div>

                  <span className="tooltip-indicator-value" style={{ color: bulletColor, fontWeight: 800, fontSize: '0.86rem', fontFamily: 'var(--font-mono)' }}>
                    {selectedMetric === 'gdp' && val > 0 ? '+' : ''}{val.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="compare-modal-backdrop" onClick={onClose}>
      <div
        className="compare-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="compare-modal-header">
          <div className="compare-modal-header-left">
            <div className="compare-modal-badge">
              <Sparkles size={12} color="#c084fc" />
              <span>IN-PAGE COMPARISON OVERLAY</span>
            </div>
            <h2 className="compare-modal-title">
              เปรียบเทียบสถิติเศรษฐกิจพหุภาคี{' '}
              <span className="title-en-gradient">({comparedList.length} ประเทศ)</span>
            </h2>
            <p className="compare-modal-sub">
              วิเคราะห์ตัวเลขเปรียบเทียบในหน้านี้ทันทีโดยไม่ต้องสลับหน้า พร้อมกราฟ Time-Series 5 ปี (2020 - 2025)
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="compare-modal-close-btn"
            title="ปิดหน้าต่างเปรียบเทียบ (ESC)"
            aria-label="ปิดหน้าต่าง"
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Countries Quick Chips Row */}
        <div className="compare-modal-chips-row">
          <span className="compare-modal-chips-label">ประเทศที่กำลังเทียบ:</span>
          <div className="compare-modal-chips-list">
            {comparedList.map((code, idx) => {
              const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
              const profile = (comparisonData?.countries || []).find((c) => c.code === code) || {
                name: code,
                iso2: code.toLowerCase()
              };
              const flagUrl = profile.iso2
                ? `https://flagcdn.com/w40/${profile.iso2.toLowerCase()}.png`
                : null;

              return (
                <div
                  key={code}
                  className="compare-modal-chip"
                  style={{ borderColor: `${color}60`, boxShadow: `0 2px 8px ${color}15` }}
                >
                  <span
                    className="compare-modal-chip-dot"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={profile.name}
                      className="compare-modal-chip-flag"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="compare-modal-chip-name">{profile.name}</span>
                  <span className="compare-modal-chip-code">({code})</span>
                  <button
                    type="button"
                    onClick={() => onRemoveFromCompare && onRemoveFromCompare(code)}
                    className="compare-modal-chip-remove"
                    title={`นำ ${code} ออก`}
                  >
                    <X size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="compare-modal-metric-tabs">
          <button
            type="button"
            onClick={() => setSelectedMetric('gdp')}
            className={`compare-modal-tab-btn gdp ${selectedMetric === 'gdp' ? 'active' : ''}`}
          >
            <TrendingUp size={15} />
            <span>GDP Growth Rate (%)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMetric('inflation')}
            className={`compare-modal-tab-btn inflation ${selectedMetric === 'inflation' ? 'active' : ''}`}
          >
            <Flame size={15} />
            <span>อัตราเงินเฟ้อ (%)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMetric('unemployment')}
            className={`compare-modal-tab-btn unemployment ${selectedMetric === 'unemployment' ? 'active' : ''}`}
          >
            <Users size={15} />
            <span>อัตราการว่างงาน (%)</span>
          </button>
        </div>

        {/* Modal Main Body Content */}
        <div className="compare-modal-body">
          {isLoading ? (
            <div style={{ padding: '3rem 1rem' }}>
              <LoadingSkeleton text="กำลังประมวลผล Time-Series Matrix เปรียบเทียบ 5 ปี..." />
            </div>
          ) : comparedList.length === 0 ? (
            <div style={{ padding: '3rem 1rem' }}>
              <EmptyState
                title="ไม่มีประเทศในชุดเปรียบเทียบ"
                message="กรุณากดปุ่ม '+ เทียบ' ในตารางข้อมูลของหน้า GDP, เงินเฟ้อ หรือตลาดแรงงาน เพื่อเลือกประเทศ"
              />
            </div>
          ) : (
            <>
              {/* Executive Analytic Insight Highlights Bar */}
              {groupInsights && (
                <div className="compare-insight-grid" style={{ marginBottom: '1.25rem' }}>
                  <div className="compare-insight-card">
                    <div className="compare-insight-icon-box" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                      <ArrowUpRight size={16} />
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

              {/* Dynamic Multi-Mode Chart Card */}
              <div className="compare-modal-chart-card">
                <div className="compare-modal-chart-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <span className="compare-modal-chart-title">
                      แนวโน้มสถิติย้อนหลัง 5 ปี (2020 – 2025)
                    </span>
                    <div className="indicator-chart-mode-toggle">
                      <button
                        type="button"
                        onClick={() => setChartType('bar')}
                        className={`mode-toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
                        title="กราฟแท่งจัดกลุ่มเคียงข้างกัน"
                      >
                        <BarChart3 size={12} />
                        <span>แท่งเคียงข้าง (Bar)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartType('line')}
                        className={`mode-toggle-btn ${chartType === 'line' ? 'active' : ''}`}
                        title="กราฟเส้นแนวโน้ม"
                      >
                        <TrendingUp size={12} />
                        <span>เส้นแนวโน้ม (Line)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartType('area')}
                        className={`mode-toggle-btn ${chartType === 'area' ? 'active' : ''}`}
                        title="กราฟพื้นที่ไล่เฉด"
                      >
                        <Activity size={12} />
                        <span>พื้นที่ (Area)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartType('radar')}
                        className={`mode-toggle-btn ${chartType === 'radar' ? 'active' : ''}`}
                        title="กราฟเรดาร์สมรรถนะ 5 เสาหลัก"
                      >
                        <Compass size={12} />
                        <span>เรดาร์ (Radar)</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setShowDataLabels(v => !v)}
                      className={`compare-view-opt-btn ${showDataLabels ? 'active' : ''}`}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                      title="เปิด/ปิดตัวเลขบนกราฟ"
                    >
                      <SlidersHorizontal size={11} />
                      <span>ตัวเลข {showDataLabels ? '✓' : ''}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGrid(v => !v)}
                      className={`compare-view-opt-btn ${showGrid ? 'active' : ''}`}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                      title="เปิด/ปิดเส้นสเกล"
                    >
                      <Layers size={11} />
                      <span>สเกล</span>
                    </button>
                  </div>
                </div>

                <div style={{ width: '100%', height: 360, marginTop: '0.5rem' }}>
                  {chartType === 'bar' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData?.timeline || []}
                        margin={{ top: 20, right: 25, left: -10, bottom: 5 }}
                        barGap={3}
                        barCategoryGap="22%"
                      >
                        <defs>
                          {comparedList.map((code, idx) => {
                            const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                            return (
                              <linearGradient key={code} id={`modalBarGrad-${code}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={1} />
                                <stop offset="45%" stopColor={color} stopOpacity={0.85} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.25} />
                              </linearGradient>
                            );
                          })}
                        </defs>
                        <CartesianGrid strokeDasharray="4 6" stroke={showGrid ? "rgba(168, 85, 247, 0.12)" : "transparent"} vertical={false} />
                        <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.35)" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="year"
                          stroke="#64748b"
                          tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)' }}
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
                        <Tooltip content={<CustomModalTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '0.82rem' }} iconType="circle" />
                        {comparedList.map((code, idx) => {
                          const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                          const profile = (comparisonData?.countries || []).find((c) => c.code === code);
                          const label = profile ? `${profile.name} (${code})` : code;
                          return (
                            <Bar
                              key={code}
                              dataKey={`${code}_${selectedMetric}`}
                              name={label}
                              fill={`url(#modalBarGrad-${code})`}
                              stroke={color}
                              strokeWidth={1}
                              radius={[7, 7, 1, 1]}
                              maxBarSize={28}
                            >
                              {showDataLabels && (
                                <LabelList
                                  dataKey={`${code}_${selectedMetric}`}
                                  position="top"
                                  fill={color}
                                  fontSize={9}
                                  fontFamily="var(--font-mono)"
                                  fontWeight={700}
                                  formatter={(val) => val !== undefined && val !== null ? `${Number(val) > 0 ? '+' : ''}${Number(val).toFixed(1)}%` : ''}
                                />
                              )}
                            </Bar>
                          );
                        })}
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {chartType === 'line' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={comparisonData?.timeline || []}
                        margin={{ top: 20, right: 25, left: -10, bottom: 5 }}
                      >
                        <defs>
                          <filter id="modalLineGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="4 6" stroke={showGrid ? "rgba(168, 85, 247, 0.12)" : "transparent"} vertical={false} />
                        <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.35)" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="year"
                          stroke="#64748b"
                          tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)' }}
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
                        <Tooltip content={<CustomModalTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '0.82rem' }} iconType="circle" />
                        {comparedList.map((code, idx) => {
                          const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                          const profile = (comparisonData?.countries || []).find((c) => c.code === code);
                          const label = profile ? `${profile.name} (${code})` : code;
                          return (
                            <Line
                              key={code}
                              type="monotone"
                              dataKey={`${code}_${selectedMetric}`}
                              name={label}
                              stroke={color}
                              strokeWidth={3}
                              filter="url(#modalLineGlow)"
                              dot={{ r: 4, strokeWidth: 2, fill: '#0c051a', stroke: color }}
                              activeDot={{ r: 7, strokeWidth: 2.5, stroke: '#ffffff', fill: color }}
                            >
                              {showDataLabels && (
                                <LabelList
                                  dataKey={`${code}_${selectedMetric}`}
                                  position="top"
                                  offset={10}
                                  fill={color}
                                  fontSize={9}
                                  fontFamily="var(--font-mono)"
                                  fontWeight={700}
                                  formatter={(val) => val !== undefined && val !== null ? `${Number(val) > 0 ? '+' : ''}${Number(val).toFixed(1)}%` : ''}
                                />
                              )}
                            </Line>
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  )}

                  {chartType === 'area' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={comparisonData?.timeline || []}
                        margin={{ top: 20, right: 25, left: -10, bottom: 5 }}
                      >
                        <defs>
                          {comparedList.map((code, idx) => {
                            const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                            return (
                              <linearGradient key={code} id={`modalAreaGrad-${code}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                                <stop offset="50%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.0} />
                              </linearGradient>
                            );
                          })}
                        </defs>
                        <CartesianGrid strokeDasharray="4 6" stroke={showGrid ? "rgba(168, 85, 247, 0.12)" : "transparent"} vertical={false} />
                        <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.35)" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="year"
                          stroke="#64748b"
                          tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)' }}
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
                        <Tooltip content={<CustomModalTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '0.82rem' }} iconType="circle" />
                        {comparedList.map((code, idx) => {
                          const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                          const profile = (comparisonData?.countries || []).find((c) => c.code === code);
                          const label = profile ? `${profile.name} (${code})` : code;
                          return (
                            <Area
                              key={code}
                              type="monotone"
                              dataKey={`${code}_${selectedMetric}`}
                              name={label}
                              stroke={color}
                              strokeWidth={2.8}
                              fill={`url(#modalAreaGrad-${code})`}
                            />
                          );
                        })}
                      </AreaChart>
                    </ResponsiveContainer>
                  )}

                  {chartType === 'radar' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={radarData}
                        margin={{ top: 15, right: 35, left: 35, bottom: 15 }}
                      >
                        <PolarGrid stroke="rgba(168, 85, 247, 0.22)" strokeDasharray="3 3" />
                        <PolarAngleAxis
                          dataKey="pillar"
                          tick={{ fill: '#e2e8f0', fontSize: 10, fontWeight: 700 }}
                        />
                        <PolarRadiusAxis
                          stroke="rgba(148, 163, 184, 0.35)"
                          tick={{ fill: '#94a3b8', fontSize: 9 }}
                        />
                        <Tooltip content={<CustomModalTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '0.8rem' }} iconType="circle" />
                        {comparedList.map((code, idx) => {
                          const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                          const profile = (comparisonData?.countries || []).find((c) => c.code === code);
                          const label = profile ? `${profile.name} (${code})` : code;
                          return (
                            <Radar
                              key={code}
                              name={label}
                              dataKey={code}
                              stroke={color}
                              fill={color}
                              fillOpacity={0.22}
                              strokeWidth={2.5}
                            />
                          );
                        })}
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Side-by-Side Snapshot Cards Matrix ({selectedYear}) */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GitCompare size={15} color="#c084fc" />
                  <span>ตารางสรุปเปรียบเทียบสถิติรายประเทศ ({selectedYear})</span>
                </h4>

                <div className="compare-matrix-grid">
                  {comparedList.map((code, idx) => {
                    const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                    const profile = (comparisonData?.countries || []).find((c) => c.code === code) || {
                      name: code,
                      iso2: code.toLowerCase(),
                      region: 'Global'
                    };
                    const flagUrl = profile.iso2
                      ? `https://flagcdn.com/w40/${profile.iso2.toLowerCase()}.png`
                      : null;

                    const gdpVal = (comparisonData?.latestSnapshot?.gdp || []).find((c) => c.countryCode === code);
                    const infVal = (comparisonData?.latestSnapshot?.inflation || []).find((c) => c.countryCode === code);
                    const uneVal = (comparisonData?.latestSnapshot?.unemployment || []).find((c) => c.countryCode === code);

                    return (
                      <div
                        key={code}
                        className="compare-matrix-country-card"
                        style={{ borderTop: `3px solid ${color}` }}
                      >
                        <div className="compare-matrix-country-header">
                          {flagUrl && (
                            <img
                              src={flagUrl}
                              alt={profile.name}
                              className="compare-matrix-flag"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div className="compare-matrix-names">
                            <h4 className="compare-matrix-country-name">{profile.name}</h4>
                            <span className="compare-matrix-country-meta">{profile.region || code}</span>
                          </div>
                        </div>

                        <div className="compare-matrix-metrics-stack">
                          {/* GDP */}
                          <div className="compare-matrix-metric-row">
                            <div className="compare-matrix-metric-top">
                              <span className="compare-matrix-metric-label">
                                <TrendingUp size={12} color="#34d399" />
                                <span>GDP Growth</span>
                              </span>
                              <span className="db-value-badge green">
                                {gdpVal?.displayValue || `${gdpVal?.value ?? 0}%`}
                              </span>
                            </div>
                          </div>

                          {/* Inflation */}
                          <div className="compare-matrix-metric-row">
                            <div className="compare-matrix-metric-top">
                              <span className="compare-matrix-metric-label">
                                <Flame size={12} color="#fb7185" />
                                <span>เงินเฟ้อ</span>
                              </span>
                              <span className="db-value-badge red">
                                {infVal?.displayValue || `${infVal?.value ?? 0}%`}
                              </span>
                            </div>
                          </div>

                          {/* Unemployment */}
                          <div className="compare-matrix-metric-row">
                            <div className="compare-matrix-metric-top">
                              <span className="compare-matrix-metric-label">
                                <Users size={12} color="#38bdf8" />
                                <span>การว่างงาน</span>
                              </span>
                              <span className="db-value-badge blue">
                                {uneVal?.displayValue || `${uneVal?.value ?? 0}%`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="compare-modal-footer">
          <div className="compare-modal-footer-hint">
            <Info size={14} color="#94a3b8" />
            <span>กดปุ่มปิด หรือกด [ESC] เพื่อกลับไปอ่านตารางข้อมูลหน้าเดิม</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onOpenFullHub && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullHub();
                }}
                className="compare-modal-fullhub-btn"
                title="เปิดหน้าศูนย์เปรียบเทียบเต็มหน้าจอ"
              >
                <span>เปิดแบบเต็มหน้าจอ (Full Page)</span>
                <ExternalLink size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="compare-modal-close-action-btn"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
