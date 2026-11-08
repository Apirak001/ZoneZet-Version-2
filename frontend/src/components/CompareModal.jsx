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
  Info
} from 'lucide-react';
import { fetchCountryComparison } from '../services/api';
import { LoadingSkeleton, EmptyState } from './FeedbackStates';
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

  if (!isOpen) return null;

  // Custom Glassmorphism Tooltip for Multi-Line Chart
  const CustomModalTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sorted = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0));

      return (
        <div className="db-custom-chart-tooltip" style={{ minWidth: 230, zIndex: 1200 }}>
          <div className="tooltip-country-header">
            <Calendar size={13} color="#c084fc" />
            <span className="tooltip-country-name">ปี ค.ศ. {label}</span>
            <span className="tooltip-year-badge">{payload.length} ประเทศ</span>
          </div>

          <div className="tooltip-indicators-list">
            {sorted.map((entry) => {
              const countryCode = entry.dataKey.split('_')[0];
              const profile = (comparisonData?.countries || []).find((c) => c.code === countryCode);
              const flagUrl = profile?.iso2
                ? `https://flagcdn.com/w40/${profile.iso2.toLowerCase()}.png`
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
                    <span>{profile?.name || countryCode}:</span>
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
            <span>อัตราเงินเฟ้อ CPI (%)</span>
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

              {/* Time-Series Recharts Line Chart */}
              <div className="compare-modal-chart-card">
                <div className="compare-modal-chart-header">
                  <span className="compare-modal-chart-title">
                    แนวโน้มย้อนหลัง 5 ปี (World Bank Time-Series 2020 – 2025)
                  </span>
                  <span className="compare-modal-chart-meta">
                    อัปเดตแบบเรียลไทม์ · O(1) Memory Cache
                  </span>
                </div>

                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={comparisonData?.timeline || []}
                      margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" vertical={false} />
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
                            dot={{ r: 4, strokeWidth: 2, fill: color, stroke: '#110822' }}
                            activeDot={{ r: 7, strokeWidth: 2, stroke: '#ffffff' }}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
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
                                <span>เงินเฟ้อ CPI</span>
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
