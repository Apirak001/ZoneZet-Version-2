import React, { useState, useEffect } from 'react';
import { Scale, Plus, X, RotateCcw, TrendingUp, DollarSign, Users, Sparkles, Check, Info } from 'lucide-react';
import { fetchCountryComparison, fetchCountriesDirectory } from '../services/api';
import { LoadingSkeleton, EmptyState, ErrorBanner } from './FeedbackStates';
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

const COUNTRY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const PRESETS = [
  { name: 'กลุ่มเศรษฐกิจอาเซียน (ASEAN)', codes: ['THA', 'VNM', 'SGP', 'MYS'] },
  { name: 'มหาอำนาจเศรษฐกิจโลก (Global G4)', codes: ['USA', 'CHN', 'JPN', 'DEU'] },
  { name: 'เอเชียตะวันออก (East Asia)', codes: ['JPN', 'KOR', 'CHN'] }
];

export default function ComparisonHub({
  comparedList = ['THA', 'USA', 'JPN'],
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

  // Load available countries directory for search dropdown
  useEffect(() => {
    fetchCountriesDirectory()
      .then(res => setAllCountries(res.data || []))
      .catch(err => console.warn('Directory error:', err));
  }, []);

  // Fetch comparison data when comparedList changes
  useEffect(() => {
    if (comparedList.length === 0) {
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

  const handleAddCountry = (code) => {
    if (comparedList.includes(code)) return;
    if (comparedList.length >= 5) {
      alert('สามารถเปรียบเทียบพร้อมกันได้สูงสุด 5 ประเทศ');
      return;
    }
    setComparedList([...comparedList, code]);
    setIsDropdownOpen(false);
    setSearchFilter('');
  };

  const handleApplyPreset = (presetCodes) => {
    setComparedList(presetCodes);
  };

  const filteredSearchCountries = allCountries.filter(c =>
    (c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
     c.code.toLowerCase().includes(searchFilter.toLowerCase())) &&
    !comparedList.includes(c.code)
  ).slice(0, 8);

  const getMetricLabel = () => {
    if (selectedMetric === 'gdp') return 'อัตราเติบโต GDP Growth (%)';
    if (selectedMetric === 'inflation') return 'อัตราเงินเฟ้อ Inflation (%)';
    return 'อัตราการว่างงาน Unemployment (%)';
  };

  return (
    <div>
      {/* Title & Description */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Scale size={28} color="#6366f1" />
            <span>ศูนย์เปรียบเทียบเศรษฐกิจพหุภาคี (Comparison Hub) 📊</span>
          </h1>
          <p className="page-subtitle">
            เครื่องมือวิเคราะห์และเปรียบเทียบตัวเลขเศรษฐกิจข้ามประเทศแบบเจาะลึก 2020–2025 ในรูปแบบกราฟเส้นคลีนๆ
          </p>
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="#f59e0b" /> พรีเซ็ตแนะนำ:
          </span>
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p.codes)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', borderRadius: '9999px' }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Country Chips & Add Search Dropdown */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>ประเทศที่เลือกเปรียบเทียบ:</span>

            {comparedList.length === 0 && (
              <span style={{ fontSize: '0.85rem', color: '#be123c', background: '#ffe4e6', padding: '3px 10px', borderRadius: '9999px', fontWeight: 600 }}>
                ยังไม่ได้เลือกประเทศ กรุณากดปุ่มเพิ่มประเทศ
              </span>
            )}

            {comparedList.map((code, idx) => {
              const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
              return (
                <div
                  key={code}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: `${color}15`,
                    border: `1px solid ${color}40`,
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                  <span>{code}</span>
                  <button
                    onClick={() => onRemoveFromCompare(code)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    title="ลบออกจากรายการเปรียบเทียบ (มีระบบ Undo)"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Country Dropdown Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.5rem 1.1rem', borderRadius: '9999px' }}
            >
              <Plus size={15} />
              <span>เพิ่มประเทศ (สูงสุด 5)</span>
            </button>

            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '280px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 15px 35px rgba(148, 163, 184, 0.2)',
                  zIndex: 50,
                  padding: '0.85rem'
                }}
              >
                <input
                  type="text"
                  placeholder="พิมพ์ชื่อหรือรหัสประเทศ..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />

                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {filteredSearchCountries.map(c => (
                    <button
                      key={c.code}
                      onClick={() => handleAddCountry(c.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#0f172a',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <span style={{ fontWeight: 600 }}>{c.name} ({c.code})</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.region}</span>
                    </button>
                  ))}
                  {filteredSearchCountries.length === 0 && (
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem', padding: '0.5rem', textAlign: 'center' }}>
                      ไม่พบประเทศที่ค้นหา
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => setComparedList([...comparedList])} />}

      {isLoading ? (
        <LoadingSkeleton text="กำลังประมวลผลข้อมูลเปรียบเทียบย้อนหลัง 5 ปี..." />
      ) : comparedList.length === 0 ? (
        <EmptyState
          title="ยังไม่มีประเทศในรายการเปรียบเทียบ"
          message="คลิกปุ่ม 'เพิ่มประเทศ' ด้านบน หรือเลือกประเทศจากหน้าสถิติ GDP / Inflation / Unemployment"
          onReset={() => setComparedList(['THA', 'USA', 'JPN'])}
        />
      ) : (
        <>
          {/* Metric Selector Pills for Chart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setSelectedMetric('gdp')}
                className={`filter-pill ${selectedMetric === 'gdp' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <TrendingUp size={14} />
                <span>GDP Growth</span>
              </button>
              <button
                onClick={() => setSelectedMetric('inflation')}
                className={`filter-pill ${selectedMetric === 'inflation' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <DollarSign size={14} />
                <span>เงินเฟ้อ (Inflation)</span>
              </button>
              <button
                onClick={() => setSelectedMetric('unemployment')}
                className={`filter-pill ${selectedMetric === 'unemployment' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Users size={14} />
                <span>อัตราว่างงาน (Unemployment)</span>
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={14} /> กราฟเปรียบเทียบความต่อเนื่องเชิงเส้น (2020–2025)
            </div>
          </div>

          {/* Interactive Cute Pastel Recharts Line Chart */}
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
              {getMetricLabel()}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              วิเคราะห์แนวโน้มและเสถียรภาพทางเศรษฐกิจของประเทศที่เลือกเปรียบเทียบ
            </p>

            <div className="chart-container" style={{ height: '340px' }}>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={comparisonData?.timeline || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} unit="%" axisLine={{ stroke: '#e2e8f0' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      color: '#0f172a',
                      boxShadow: '0 10px 25px rgba(148, 163, 184, 0.15)',
                      fontWeight: 600
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
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
                        dot={{ r: 4, strokeWidth: 2, fill: color }}
                        activeDot={{ r: 7 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Comparison Cards Matrix */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
              ตารางเปรียบเทียบสถิติล่าสุด (ปี {selectedYear})
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              เปรียบเทียบครบทั้ง 3 มิติ: การเติบโต, ภาวะเงินเฟ้อ และอัตราแรงงาน
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.max(comparedList.length, 1)}, minmax(220px, 1fr))`,
                gap: '1.25rem',
                overflowX: 'auto'
              }}
            >
              {comparedList.map((code, idx) => {
                const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
                const countryProfile = (comparisonData?.countries || []).find(c => c.code === code) || { name: code, iso2: code.toLowerCase(), region: 'Global' };

                const gdpVal = (comparisonData?.latestSnapshot?.gdp || []).find(c => c.countryCode === code);
                const infVal = (comparisonData?.latestSnapshot?.inflation || []).find(c => c.countryCode === code);
                const uneVal = (comparisonData?.latestSnapshot?.unemployment || []).find(c => c.countryCode === code);

                const flagUrl = countryProfile.iso2 ? `https://flagcdn.com/w40/${countryProfile.iso2.toLowerCase()}.png` : null;

                return (
                  <div
                    key={code}
                    className="glass-panel"
                    style={{
                      borderTop: `4px solid ${color}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      padding: '1.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {flagUrl && <img src={flagUrl} alt={countryProfile.name} className="flag-img" onError={(e) => { e.target.style.display = 'none'; }} />}
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{countryProfile.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{countryProfile.region} · {code}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      {/* GDP */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>GDP Growth</span>
                        <span className={`value-badge ${gdpVal?.colorClass || 'green'}`}>
                          {gdpVal?.displayValue || 'N/A'}
                        </span>
                      </div>

                      {/* Inflation */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Inflation</span>
                        <span className={`value-badge ${infVal?.colorClass || 'red'}`}>
                          {infVal?.displayValue || 'N/A'}
                        </span>
                      </div>

                      {/* Unemployment */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Unemployment</span>
                        <span className={`value-badge ${uneVal?.colorClass || 'red'}`}>
                          {uneVal?.displayValue || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFromCompare(code)}
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: 'auto', color: '#be123c', background: '#fff1f2', borderColor: '#fecdd3', borderRadius: '8px' }}
                    >
                      <X size={13} />
                      <span>ลบออกจากการเปรียบเทียบ</span>
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
