import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  GitCompare,
  Plus,
  X,
  TrendingUp,
  Flame,
  Users,
  Check,
  Search,
  Calendar,
  Sparkles,
  Trash2,
  Crown,
  BarChart3,
  Activity,
  Compass,
  Layers,
  Hash,
  ListOrdered,
  Table2,
  Info
} from 'lucide-react';
import { fetchCountryComparison, fetchCountriesDirectory } from '../services/api';
import { LoadingSkeleton, EmptyState, ErrorBanner } from './FeedbackStates';
import RunningBarLabel from './RunningBarLabel';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  LabelList
} from 'recharts';

// Distinct, high-contrast colors for up to 4 compared countries
const COUNTRY_COLORS = ['#34d399', '#38bdf8', '#f43f5e', '#fbbf24'];

const MAX_COUNTRIES = 4;

// Indicator definitions — includes "what is good" so users can read results easily
const METRICS = {
  gdp: {
    key: 'gdp',
    label: 'GDP Growth',
    th: 'การเติบโตทางเศรษฐกิจ',
    icon: TrendingUp,
    color: '#34d399',
    better: 'high',
    hint: 'ยิ่งสูงยิ่งดี'
  },
  inflation: {
    key: 'inflation',
    label: 'เงินเฟ้อ (CPI)',
    th: 'อัตราเงินเฟ้อ',
    icon: Flame,
    color: '#f43f5e',
    better: 'target',
    target: 2,
    hint: 'ใกล้ 2% ดีที่สุด'
  },
  unemployment: {
    key: 'unemployment',
    label: 'อัตราการว่างงาน',
    th: 'อัตราการว่างงาน',
    icon: Users,
    color: '#38bdf8',
    better: 'low',
    hint: 'ยิ่งต่ำยิ่งดี'
  }
};

const METRIC_KEYS = ['gdp', 'inflation', 'unemployment'];

const CHART_TYPES = [
  { id: 'bar', label: 'แท่ง', icon: BarChart3, tip: 'กราฟแท่ง — เทียบความต่างแต่ละปีได้ชัดที่สุด' },
  { id: 'line', label: 'เส้น', icon: TrendingUp, tip: 'กราฟเส้น — ดูแนวโน้มขึ้น/ลงตลอด 5 ปี' },
  { id: 'area', label: 'พื้นที่', icon: Activity, tip: 'กราฟพื้นที่ — ดูภาพรวมการเคลื่อนไหว' },
  { id: 'radar', label: 'เรดาร์', icon: Compass, tip: 'กราฟเรดาร์ — ดูความสมดุลรอบด้าน 5 มิติ' }
];

const flagOf = (iso2) => (iso2 ? `https://flagcdn.com/w80/${iso2.toLowerCase()}.png` : null);

// Higher score = better, regardless of indicator direction
const scoreOf = (metricKey, v) => {
  if (v === null || v === undefined || isNaN(v)) return -Infinity;
  const m = METRICS[metricKey];
  if (m.better === 'high') return v;
  if (m.better === 'low') return -v;
  return -Math.abs(v - m.target);
};

const fmt = (metricKey, v) => {
  if (v === null || v === undefined || isNaN(v)) return '–';
  const sign = metricKey === 'gdp' && v > 0 ? '+' : '';
  return `${sign}${Number(v).toFixed(1)}%`;
};

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
  const [chartType, setChartType] = useState('bar');
  const [searchFilter, setSearchFilter] = useState('');
  const [highlightedCountry, setHighlightedCountry] = useState(null);
  const [showDataLabels, setShowDataLabels] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const resultsListRef = useRef(null);

  const metric = METRICS[selectedMetric];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
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

    // Skip refetch when all requested countries are already in memory (e.g. after removing one)
    const hasAllData =
      comparisonData &&
      comparedList.every(code =>
        (comparisonData.countries || []).some(c => c.code && c.code.toUpperCase() === code.toUpperCase())
      );
    if (hasAllData) return;

    setIsLoading(true);
    setError(null);

    fetchCountryComparison({ countries: comparedList, startYear: 2020, endYear: 2025 })
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

  // Clear focus if the focused country was removed
  useEffect(() => {
    if (highlightedCountry && !comparedList.includes(highlightedCountry)) {
      setHighlightedCountry(null);
    }
  }, [comparedList, highlightedCountry]);

  const handleRemoveCountry = (code) => {
    if (!code) return;
    const clean = code.toUpperCase();
    if (setComparedList) {
      setComparedList(prev => prev.filter(c => c && c.toUpperCase() !== clean));
    }
    if (onRemoveFromCompare) onRemoveFromCompare(clean);
  };

  const handleAddCountry = (code) => {
    if (!code) return;
    const clean = code.toUpperCase();
    if (comparedList.some(c => c && c.toUpperCase() === clean)) return;
    if (comparedList.length >= MAX_COUNTRIES) return;
    if (setComparedList) setComparedList(prev => [...prev, clean]);
    setIsDropdownOpen(false);
    setSearchFilter('');
  };

  const handleClearAll = () => {
    if (!comparedList || comparedList.length === 0) return;
    if (setComparedList) setComparedList([]);
    setComparisonData(null);
  };

  const filteredSearchCountries = useMemo(() => {
    if (!searchFilter.trim()) return allCountries.slice(0, 12);
    const q = searchFilter.toLowerCase().trim();
    return allCountries
      .filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.region && c.region.toLowerCase().includes(q))
      )
      .slice(0, 15);
  }, [allCountries, searchFilter]);

  // Profile lookup (name / flag / region) for any code
  const profileOf = (code) =>
    (comparisonData?.countries || []).find(c => c.code === code) ||
    allCountries.find(c => c.code === code) ||
    { code, name: code, iso2: code.toLowerCase(), region: '' };

  const colorOf = (code) => {
    const idx = comparedList.indexOf(code);
    return COUNTRY_COLORS[(idx >= 0 ? idx : 0) % COUNTRY_COLORS.length];
  };

  const timeline = comparisonData?.timeline || [];
  const latestEntry = timeline[timeline.length - 1] || {};
  const latestYear = latestEntry.year || selectedYear;
  const prevEntry = timeline.length > 1 ? timeline[timeline.length - 2] : null;

  // Latest value for a country + metric (timeline first, snapshot fallback)
  const valueOf = (code, metricKey, entry = latestEntry) => {
    const raw = entry ? entry[`${code}_${metricKey}`] : undefined;
    if (raw !== undefined && raw !== null && !isNaN(Number(raw))) return Number(raw);
    if (entry !== latestEntry) return null;
    const snap = (comparisonData?.latestSnapshot?.[metricKey] || []).find(c => c.countryCode === code);
    return typeof snap?.value === 'number' ? snap.value : null;
  };

  // Ranking for selected metric (best first, direction-aware)
  const ranking = useMemo(() => {
    if (!comparisonData || comparedList.length === 0) return [];
    const list = comparedList.map((code) => {
      const value = valueOf(code, selectedMetric);
      const prev = prevEntry ? valueOf(code, selectedMetric, prevEntry) : null;
      // gdp/inflation values are already YoY change; unemployment is a level, so compare against prev year
      const grew = value === null ? null
        : selectedMetric === 'unemployment' ? (prev === null ? null : value > prev)
          : value > 0;
      const p = profileOf(code);
      return { code, name: p.name || code, iso2: p.iso2, value, grew, color: colorOf(code) };
    });
    return list.sort((a, b) => scoreOf(selectedMetric, b.value) - scoreOf(selectedMetric, a.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparisonData, comparedList, selectedMetric, allCountries]);

  const maxAbs = useMemo(
    () => Math.max(1, ...ranking.map(r => Math.abs(r.value ?? 0))),
    [ranking]
  );

  // Best country per metric, for table highlighting
  const bestPerMetric = useMemo(() => {
    const out = {};
    METRIC_KEYS.forEach((mk) => {
      let bestCode = null;
      let bestScore = -Infinity;
      comparedList.forEach((code) => {
        const s = scoreOf(mk, valueOf(code, mk));
        if (s > bestScore) { bestScore = s; bestCode = code; }
      });
      out[mk] = bestScore === -Infinity ? null : bestCode;
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparisonData, comparedList]);

  // 5-axis radar (0-10 scale) for holistic balance
  const radarData = useMemo(() => {
    if (!comparisonData || comparedList.length === 0) return [];
    const build = (pillar, fullName, fn) => ({
      pillar,
      fullName,
      ...comparedList.reduce((acc, code) => ({ ...acc, [code]: Number(Math.min(10, Math.max(0, fn(code))).toFixed(1)) }), {})
    });
    return [
      build('การเติบโต', 'การเติบโตทางเศรษฐกิจ (GDP)', code => (valueOf(code, 'gdp') ?? 0) * 1.25),
      build('ราคาคงที่', 'เสถียรภาพราคา (เงินเฟ้อใกล้ 2%)', code => 10 - Math.abs((valueOf(code, 'inflation') ?? 2) - 2) * 1.5),
      build('ตลาดแรงงาน', 'ความแข็งแรงของตลาดแรงงาน', code => 12 - (valueOf(code, 'unemployment') ?? 4)),
      build('โมเมนตัม 3 ปี', 'การเติบโตเฉลี่ย 3 ปีล่าสุด', code => {
        const recent = timeline.slice(-3);
        if (!recent.length) return 0;
        return (recent.reduce((s, yr) => s + (Number(yr[`${code}_gdp`]) || 0), 0) / recent.length) * 1.25;
      }),
      build('ความยืดหยุ่น', 'ความยืดหยุ่นทางเศรษฐกิจโดยรวม', code => {
        const g = Math.max(0, valueOf(code, 'gdp') ?? 0);
        const u = valueOf(code, 'unemployment') ?? 4;
        return ((g * 1.2) + (10 - Math.min(u, 9))) / 1.5;
      })
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparisonData, comparedList]);

  // ---------- Tooltips ----------
  const CompareTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const rows = [...payload]
      .map(e => ({ code: e.dataKey.split('_')[0], value: Number(e.value) }))
      .filter(r => !isNaN(r.value))
      .sort((a, b) => scoreOf(selectedMetric, b.value) - scoreOf(selectedMetric, a.value));
    return (
      <div className="cx-tooltip">
        <div className="cx-tooltip-head">
          <Calendar size={13} color="#c084fc" />
          <span>ปี {label}</span>
          <span className="cx-tooltip-metric" style={{ color: metric.color }}>{metric.label}</span>
        </div>
        {rows.map((r, i) => {
          const p = profileOf(r.code);
          return (
            <div key={r.code} className="cx-tooltip-row">
              <span className="cx-tooltip-rank">{i === 0 ? <Crown size={11} /> : i + 1}</span>
              <span className="cx-dot" style={{ background: colorOf(r.code) }} />
              <span className="cx-tooltip-name">{p.name}</span>
              <span className="cx-tooltip-val" style={{ color: colorOf(r.code) }}>{fmt(selectedMetric, r.value)}</span>
            </div>
          );
        })}
        <div className="cx-tooltip-foot">{metric.hint}</div>
      </div>
    );
  };

  const RadarTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const dp = payload[0]?.payload;
    return (
      <div className="cx-tooltip">
        <div className="cx-tooltip-head">
          <Sparkles size={13} color="#c084fc" />
          <span>{dp?.fullName || dp?.pillar}</span>
        </div>
        {payload.map(e => (
          <div key={e.dataKey} className="cx-tooltip-row">
            <span className="cx-dot" style={{ background: colorOf(e.dataKey) }} />
            <span className="cx-tooltip-name">{profileOf(e.dataKey).name}</span>
            <span className="cx-tooltip-val" style={{ color: colorOf(e.dataKey) }}>{e.value} / 10</span>
          </div>
        ))}
        <div className="cx-tooltip-foot">คะแนน 0–10 · ยิ่งสูงยิ่งดี</div>
      </div>
    );
  };

  // Shared chart pieces
  const axisPieces = () => [
    <CartesianGrid key="grid" strokeDasharray="4 6" stroke={showGrid ? 'rgba(168, 85, 247, 0.12)' : 'transparent'} vertical={false} />,
    <ReferenceLine key="zero" y={0} stroke="rgba(255, 255, 255, 0.3)" />,
    selectedMetric === 'inflation' ? (
      <ReferenceLine
        key="target"
        y={2}
        stroke="#fbbf24"
        strokeDasharray="5 5"
        strokeOpacity={0.7}
        label={{ value: 'เป้าหมาย 2%', position: 'insideTopRight', fill: '#fbbf24', fontSize: 11 }}
      />
    ) : null,
    <XAxis
      key="x"
      dataKey="year"
      tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 700 }}
      axisLine={{ stroke: 'rgba(168, 85, 247, 0.3)' }}
      tickLine={false}
    />,
    <YAxis
      key="y"
      tick={{ fill: '#94a3b8', fontSize: 11 }}
      unit="%"
      axisLine={false}
      tickLine={false}
      width={52}
    />,
    <Tooltip key="tt" content={<CompareTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.06)' }} />
  ];

  // Direct, instant label rendering with zero animation lag or duplicate flashing
  const labelFor = (code) =>
    showDataLabels && (!highlightedCountry || highlightedCountry === code) ? (
      <LabelList
        dataKey={`${code}_${selectedMetric}`}
        content={<RunningBarLabel type={selectedMetric} color={colorOf(code)} offset={8} />}
      />
    ) : null;

  const renderChart = () => {
    const chartMargin = { top: 32, right: 24, left: 0, bottom: 4 };

    if (chartType === 'radar') {
      return (
        <RadarChart
          key={`radar-${selectedMetric}`}
          data={radarData}
          margin={{ top: 16, right: 40, left: 40, bottom: 16 }}
          outerRadius="72%"
        >
          <PolarGrid stroke="rgba(168, 85, 247, 0.22)" />
          <PolarAngleAxis dataKey="pillar" tick={{ fill: '#e2e8f0', fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
          <Tooltip content={<RadarTooltip />} />
          {comparedList.map(code => {
            const on = !highlightedCountry || highlightedCountry === code;
            return (
              <Radar
                key={code}
                dataKey={code}
                name={profileOf(code).name}
                stroke={colorOf(code)}
                fill={colorOf(code)}
                fillOpacity={on ? 0.22 : 0.03}
                strokeWidth={on ? 2.5 : 1}
                strokeOpacity={on ? 1 : 0.2}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              />
            );
          })}
        </RadarChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart
          key={`line-${selectedMetric}`}
          data={timeline}
          margin={chartMargin}
        >
          {axisPieces()}
          {comparedList.map(code => {
            const on = !highlightedCountry || highlightedCountry === code;
            const c = colorOf(code);
            return (
              <Line
                key={code}
                type="monotone"
                dataKey={`${code}_${selectedMetric}`}
                name={profileOf(code).name}
                stroke={c}
                strokeWidth={on ? 3 : 1.5}
                strokeOpacity={on ? 1 : 0.15}
                dot={on ? { r: 4, strokeWidth: 2, fill: '#0c051a', stroke: c } : false}
                activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff', fill: c }}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {labelFor(code)}
              </Line>
            );
          })}
        </LineChart>
      );
    }

    if (chartType === 'area') {
      return (
        <AreaChart
          key={`area-${selectedMetric}`}
          data={timeline}
          margin={chartMargin}
        >
          <defs>
            {comparedList.map(code => (
              <linearGradient key={code} id={`cxArea-${code}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorOf(code)} stopOpacity={0.45} />
                <stop offset="100%" stopColor={colorOf(code)} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {axisPieces()}
          {comparedList.map(code => {
            const on = !highlightedCountry || highlightedCountry === code;
            return (
              <Area
                key={code}
                type="monotone"
                dataKey={`${code}_${selectedMetric}`}
                name={profileOf(code).name}
                stroke={colorOf(code)}
                strokeWidth={on ? 2.5 : 1}
                strokeOpacity={on ? 1 : 0.15}
                fill={`url(#cxArea-${code})`}
                fillOpacity={on ? 1 : 0.1}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              />
            );
          })}
        </AreaChart>
      );
    }

    return (
      <BarChart
        key={`bar-${selectedMetric}-${comparedList.join('-')}`}
        data={timeline}
        margin={chartMargin}
        barGap={4}
        barCategoryGap="24%"
      >
        <defs>
          {comparedList.map(code => (
            <linearGradient key={code} id={`cxBar-${code}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorOf(code)} stopOpacity={1} />
              <stop offset="100%" stopColor={colorOf(code)} stopOpacity={0.35} />
            </linearGradient>
          ))}
        </defs>
        {axisPieces()}
        {comparedList.map(code => {
          const on = !highlightedCountry || highlightedCountry === code;
          return (
            <Bar
              key={code}
              dataKey={`${code}_${selectedMetric}`}
              name={profileOf(code).name}
              fill={`url(#cxBar-${code})`}
              opacity={on ? 1 : 0.15}
              radius={[6, 6, 2, 2]}
              maxBarSize={30}
              isAnimationActive={true}
              animationDuration={900}
              animationEasing="ease-out"
            >
              {labelFor(code)}
            </Bar>
          );
        })}
      </BarChart>
    );
  };

  const hasData = !isLoading && comparedList.length > 0 && comparisonData;

  return (
    <div className="compare-page-container cx-page">
      <div className="indicator-bg-grid-pattern" />
      <div className="indicator-ambient-glow" />
      <div className="indicator-ambient-glow-secondary" />

      {/* ================= 1. HERO ================= */}
      <header className="cx-hero">
        <h1 className="indicator-hero-big-title">ศูนย์เปรียบเทียบเศรษฐกิจโลก</h1>
        <p className="indicator-hero-subtext">
          เลือกได้สูงสุด 4 ประเทศ แล้วดูว่าใครเศรษฐกิจโตเร็วกว่า ค่าครองชีพมั่นคงกว่า หรือมีคนว่างงานน้อยกว่า — สรุปให้อ่านง่ายในหน้าเดียว
        </p>

        <ol className="cx-steps">
          <li><span className="cx-step-num">1</span><span>เลือกประเทศที่ต้องการเปรียบเทียบ (สูงสุด 4 ประเทศ)</span></li>
          <li><span className="cx-step-num">2</span><span>เลือกตัวชี้วัดที่อยากเทียบ</span></li>
          <li><span className="cx-step-num">3</span><span>ดูอันดับและกราฟแนวโน้มด้านล่าง</span></li>
        </ol>
      </header>

      {/* ================= 2. COUNTRY PICKER ================= */}
      <section className={`cx-card cx-picker ${isDropdownOpen ? 'has-dropdown-open' : ''}`}>
        <div className="cx-section-head">
          <div className="cx-section-title">
            <span className="cx-step-num sm">1</span>
            <h2>ประเทศที่เปรียบเทียบ</h2>
            <span className="cx-count-pill">{comparedList.length} / {MAX_COUNTRIES}</span>
          </div>

          <div className="cx-head-actions">
            {comparedList.length > 0 && (
              <button type="button" onClick={handleClearAll} className="cx-btn-ghost danger" title="ล้างรายชื่อทั้งหมด">
                <Trash2 size={14} />
                <span>ล้างทั้งหมด</span>
              </button>
            )}

            <div className="cx-add-wrap" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="compare-add-country-btn"
                disabled={comparedList.length >= MAX_COUNTRIES}
                style={comparedList.length >= MAX_COUNTRIES ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                <Plus size={15} />
                <span>{comparedList.length >= MAX_COUNTRIES ? 'ครบ 4 ประเทศแล้ว' : 'เพิ่มประเทศ'}</span>
              </button>

              {isDropdownOpen && (
                <div
                  className="compare-search-dropdown-menu"
                  data-lenis-prevent="true"
                  onWheel={(e) => {
                    e.stopPropagation();
                    if (resultsListRef.current && !resultsListRef.current.contains(e.target)) {
                      resultsListRef.current.scrollTop += e.deltaY;
                    }
                  }}
                >
                  <div className="compare-search-input-box">
                    <Search size={14} color="#94a3b8" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="พิมพ์ชื่อประเทศ หรือรหัส เช่น THA..."
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
                  <div
                    ref={resultsListRef}
                    className="compare-search-results-list"
                    data-lenis-prevent="true"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {filteredSearchCountries.map((c) => {
                      const picked = comparedList.some(code => code && code.toUpperCase() === c.code.toUpperCase());
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => { if (!picked) handleAddCountry(c.code); }}
                          disabled={picked}
                          className="compare-search-item"
                          style={picked ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            {c.iso2 && (
                              <img
                                src={flagOf(c.iso2)}
                                alt={c.name}
                                style={{ width: 22, height: 15, borderRadius: 3, objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff' }}>{c.name}</span>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.region}</span>
                            </div>
                          </div>
                          {picked ? (
                            <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Check size={11} /> เลือกแล้ว
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

        {/* 4 slots */}
        <div className="cx-slots">
          {comparedList.map((code) => {
            const p = profileOf(code);
            const c = colorOf(code);
            return (
              <div key={code} className="cx-slot filled" style={{ '--cx-c': c }}>
                <span className="cx-slot-strip" />
                {p.iso2 && (
                  <img src={flagOf(p.iso2)} alt={p.name} className="cx-slot-flag" onError={(e) => { e.target.style.display = 'none'; }} />
                )}
                <div className="cx-slot-text">
                  <span className="cx-slot-name">{p.name}</span>
                  <span className="cx-slot-sub">{code}{p.region ? ` · ${p.region}` : ''}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCountry(code)}
                  className="cx-slot-remove"
                  title={`นำ ${p.name} ออก`}
                  aria-label={`นำ ${p.name} ออก`}
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
          {Array.from({ length: MAX_COUNTRIES - comparedList.length }).map((_, i) => (
            <button
              key={`empty-${i}`}
              type="button"
              className="cx-slot empty"
              onClick={() => setIsDropdownOpen(true)}
              title="คลิกเพื่อเพิ่มประเทศ"
            >
              <span className="cx-slot-plus"><Plus size={16} /></span>
              <span>เพิ่มประเทศที่ {comparedList.length + i + 1}</span>
            </button>
          ))}
        </div>
      </section>

      {error && <ErrorBanner message={error} onRetry={() => setComparedList([...comparedList])} />}

      {isLoading ? (
        <LoadingSkeleton text="กำลังโหลดข้อมูลเปรียบเทียบย้อนหลัง 5 ปี..." />
      ) : comparedList.length === 0 ? (
        <EmptyState
          title="ยังไม่ได้เลือกประเทศ"
          message="กรุณากดปุ่ม “+ เพิ่มประเทศ” ด้านบน เพื่อเริ่มต้นการเปรียบเทียบ"
        />
      ) : hasData ? (
        <>
          {/* ================= 2. METRIC SELECTOR ================= */}
          <section className="cx-metric-section">
            <div className="cx-section-title" style={{ marginBottom: '0.9rem' }}>
              <span className="cx-step-num sm">2</span>
              <h2>เลือกตัวชี้วัด</h2>
            </div>
            <div className="cx-metric-grid">
              {METRIC_KEYS.map(mk => {
                const m = METRICS[mk];
                const Icon = m.icon;
                const active = selectedMetric === mk;
                return (
                  <button
                    key={mk}
                    type="button"
                    className={`cx-metric-card ${active ? 'active' : ''}`}
                    style={{ '--cx-c': m.color }}
                    onClick={() => setSelectedMetric(mk)}
                    aria-pressed={active}
                  >
                    <span className="cx-metric-icon"><Icon size={18} /></span>
                    <span className="cx-metric-text">
                      <span className="cx-metric-name">{m.label}</span>
                    </span>
                    <span className="cx-metric-hint">{m.hint}</span>
                    {active && <span className="cx-metric-check"><Check size={12} strokeWidth={3} /></span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ================= 3. RANKING & GROUP STATS ================= */}
          <section className="cx-card cx-ranking">
            <div className="cx-card-label-row">
              <div className="cx-section-title">
                <span className="cx-step-num sm">3</span>
                <h2>อันดับและสถิติเปรียบเทียบ · {metric.label} ปี {latestYear}</h2>
              </div>
            </div>

            <div className="cx-rank-list">
              {ranking.map((r, i) => {
                const pct = r.value === null ? 0 : Math.max(6, (Math.abs(r.value) / maxAbs) * 100);
                const focused = highlightedCountry === r.code;
                return (
                  <button
                    key={r.code}
                    type="button"
                    className={`cx-rank-row ${focused ? 'focused' : ''} ${highlightedCountry && !focused ? 'muted' : ''}`}
                    style={{ '--cx-c': r.color }}
                    onClick={() => setHighlightedCountry(focused ? null : r.code)}
                    title="คลิกเพื่อไฮไลต์ประเทศนี้ในกราฟ"
                  >
                    <span className={`cx-rank-num r${i + 1}`}>{i === 0 ? <Crown size={13} /> : i + 1}</span>
                    {r.iso2 && <img src={flagOf(r.iso2)} alt="" className="cx-rank-flag" />}
                    <span className="cx-rank-body">
                      <span className="cx-rank-top">
                        <span className="cx-rank-name">{r.name}</span>
                        <span className="cx-rank-val">{fmt(selectedMetric, r.value)}</span>
                      </span>
                      <span className="cx-rank-track">
                        <span className={`cx-rank-fill ${r.grew === null ? '' : r.grew ? 'up' : 'down'}`} style={{ width: `${pct}%` }} />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="cx-footnote">
              <Info size={12} />
              <span>
                <span className="up">เส้นสีเขียว</span> = เติบโตขึ้นจากปีก่อน · <span className="down">เส้นสีแดง</span> = ไม่เติบโตขึ้นจากปีก่อน · คลิกที่แถวเพื่อไฮไลต์ประเทศนั้นในกราฟ
              </span>
            </p>
          </section>

          {/* ================= 4. TREND CHART ================= */}
          <section className="cx-card cx-chart-card">
            <div className="cx-chart-head">
              <div>
                <h3 className="cx-chart-title">
                  <span className="cx-chart-icon" style={{ color: metric.color, background: `${metric.color}1f` }}>
                    <metric.icon size={17} />
                  </span>
                  แนวโน้ม {metric.label} ย้อนหลัง 5 ปี
                </h3>
                <p className="cx-chart-sub">
                  {chartType === 'radar'
                    ? 'คะแนน 0–10 จาก 5 มิติ — พื้นที่ยิ่งกว้างและสมดุล ยิ่งแข็งแรงรอบด้าน'
                    : metric.hint}
                </p>
              </div>

              <div className="cx-chart-controls">
                <div className="cx-segment" role="tablist">
                  {CHART_TYPES.map(ct => {
                    const Icon = ct.icon;
                    return (
                      <button
                        key={ct.id}
                        type="button"
                        role="tab"
                        aria-selected={chartType === ct.id}
                        className={chartType === ct.id ? 'active' : ''}
                        onClick={() => setChartType(ct.id)}
                        title={ct.tip}
                      >
                        <Icon size={14} />
                        <span>{ct.label}</span>
                      </button>
                    );
                  })}
                </div>
                {chartType !== 'radar' && (
                  <div className="cx-toggles">
                    <button
                      type="button"
                      className={`cx-toggle ${showDataLabels ? 'on' : ''}`}
                      onClick={() => setShowDataLabels(v => !v)}
                      title="แสดง/ซ่อนตัวเลขบนกราฟ"
                    >
                      <Hash size={13} /> ตัวเลข
                    </button>
                    <button
                      type="button"
                      className={`cx-toggle ${showGrid ? 'on' : ''}`}
                      onClick={() => setShowGrid(v => !v)}
                      title="แสดง/ซ่อนเส้นตาราง"
                    >
                      <Layers size={13} /> เส้นตาราง
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Clickable legend = focus control */}
            <div className="cx-legend">
              {comparedList.map(code => {
                const p = profileOf(code);
                const focused = highlightedCountry === code;
                return (
                  <button
                    key={code}
                    type="button"
                    className={`cx-legend-item ${focused ? 'focused' : ''} ${highlightedCountry && !focused ? 'muted' : ''}`}
                    style={{ '--cx-c': colorOf(code) }}
                    onClick={() => setHighlightedCountry(focused ? null : code)}
                  >
                    <span className="cx-dot" />
                    {p.name}
                  </button>
                );
              })}
              <span className="cx-legend-hint">
                {highlightedCountry ? (
                  <button type="button" className="cx-link" onClick={() => setHighlightedCountry(null)}>แสดงทุกประเทศ</button>
                ) : 'คลิกชื่อประเทศเพื่อไฮไลต์'}
              </span>
            </div>

            <div className="cx-chart-canvas">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </section>

          {/* ================= 5. SIDE-BY-SIDE TABLE ================= */}
          <section className="cx-card cx-table-card">
            <div className="cx-card-label-row" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 className="cx-chart-title">
                  <span className="cx-chart-icon" style={{ color: '#c084fc', background: 'rgba(168, 85, 247, 0.14)' }}>
                    <Table2 size={17} />
                  </span>
                  ตารางเทียบทุกตัวชี้วัด ปี {latestYear}
                </h3>
                <p className="cx-chart-sub">ช่องที่มี <Crown size={11} color="#fbbf24" style={{ verticalAlign: '-1px' }} /> คือประเทศที่ดีที่สุดในตัวชี้วัดนั้น</p>
              </div>
            </div>

            <div className="cx-table-scroll">
              <table className="cx-table">
                <thead>
                  <tr>
                    <th className="cx-th-metric">ตัวชี้วัด</th>
                    {comparedList.map(code => {
                      const p = profileOf(code);
                      return (
                        <th key={code} style={{ '--cx-c': colorOf(code) }}>
                          <div className="cx-th-country">
                            {p.iso2 && <img src={flagOf(p.iso2)} alt="" />}
                            <span>{p.name}</span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {METRIC_KEYS.map(mk => {
                    const m = METRICS[mk];
                    const Icon = m.icon;
                    return (
                      <tr key={mk} className={selectedMetric === mk ? 'current' : ''}>
                        <td className="cx-td-metric">
                          <span className="cx-td-metric-name"><Icon size={14} color={m.color} /> {m.label}</span>
                          <span className="cx-td-metric-hint">{m.hint}</span>
                        </td>
                        {comparedList.map(code => {
                          const v = valueOf(code, mk);
                          const isBest = bestPerMetric[mk] === code && comparedList.length > 1;
                          return (
                            <td key={code} className={isBest ? 'best' : ''}>
                              <span className="cx-td-val">
                                {isBest && <Crown size={12} />}
                                {fmt(mk, v)}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
