import React, { useState, useEffect } from 'react';
import { GitCompare, Plus, X, TrendingUp, DollarSign, Users, Check, Info } from 'lucide-react';
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
  { name: 'กลุ่มผู้นำเศรษฐกิจโลก (G4)', codes: ['USA', 'CHN', 'JPN', 'DEU'] },
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
    if (selectedMetric === 'gdp') return 'อัตราการเติบโตทางเศรษฐกิจ GDP Growth (%)';
    if (selectedMetric === 'inflation') return 'ดัชนีราคาผู้บริโภค / อัตราเงินเฟ้อ Inflation Rate (%)';
    return 'อัตราการว่างงาน Unemployment (% of Labor Force)';
  };

  return (
    <div>
      {/* Title & Description */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitCompare size={22} color="#3b82f6" />
            <span>ศูนย์เปรียบเทียบสถิติเศรษฐกิจพหุภาคี (Multi-Country Comparison Hub)</span>
          </h1>
          <p className="page-subtitle">
            เครื่องมือวิเคราะห์และเปรียบเทียบตัวเลขเศรษฐกิจข้ามประเทศแบบเจาะลึก 2020–2025
          </p>
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>กลุ่มศึกษา:</span>
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p.codes)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', borderRadius: '4px' }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Country Chips & Add Search Dropdown */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>ประเทศที่เลือกเปรียบเทียบ:</span>

            {comparedList.length === 0 && (
              <span style={{ fontSize: '0.8rem', color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                ยังไม่ได้เลือกประเทศ
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
                    gap: '0.4rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${color}80`,
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                  <span>{code}</span>
                  <button
                    onClick={() => onRemoveFromCompare(code)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1px' }}
                    title="ลบออกจากรายการเปรียบเทียบ (มีระบบ Undo)"
                  >
                    <X size={13} />
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
              style={{ padding: '0.4rem 0.85rem' }}
            >
              <Plus size={14} />
              <span>เพิ่มประเทศ (สูงสุด 5)</span>
            </button>

            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.4rem',
                  width: '280px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  boxShadow: 'var(--shadow-dropdown)',
                  zIndex: 50,
                  padding: '0.65rem'
                }}
              >
                <input
                  type="text"
                  placeholder="ค้นหาชื่อหรือรหัสประเทศ..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '4px',
                    background: '#090d16',
                    border: '1px solid #1e293b',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    marginBottom: '0.45rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />

                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {filteredSearchCountries.map(c => (
                    <button
                      key={c.code}
                      onClick={() => handleAddCountry(c.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.45rem 0.65rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#f8fafc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontFamily: 'inherit'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      <span>{c.name} ({c.code})</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.region}</span>
                    </button>
                  ))}
                  {filteredSearchCountries.length === 0 && (
                    <div style={{ color: '#64748b', fontSize: '0.78rem', padding: '0.45rem', textAlign: 'center' }}>
                      ไม่พบผลการค้นหา
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
          title="ไม่มีประเทศในระบบเปรียบเทียบ"
          message="กรุณากดปุ่ม 'เพิ่มประเทศ' ด้านบน หรือเลือกประเทศจากหน้าสถิติเพื่อเริ่มการเปรียบเทียบ"
          onReset={() => setComparedList(['THA', 'USA', 'JPN'])}
        />
      ) : (
        <>
          {/* Metric Selector Pills for Chart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => setSelectedMetric('gdp')}
                className={`filter-pill ${selectedMetric === 'gdp' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <TrendingUp size={13} />
                <span>GDP Growth</span>
              </button>
              <button
                onClick={() => setSelectedMetric('inflation')}
                className={`filter-pill ${selectedMetric === 'inflation' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <DollarSign size={13} />
                <span>Inflation Rate</span>
              </button>
              <button
                onClick={() => setSelectedMetric('unemployment')}
                className={`filter-pill ${selectedMetric === 'unemployment' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Users size={13} />
                <span>Unemployment Rate</span>
              </button>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
              <Info size={13} /> อนุกรมเวลา 2020–2025
            </div>
          </div>

          {/* Formal Recharts Line Chart */}
          <div className="glass-panel" style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
              {getMetricLabel()}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              การเคลื่อนไหวเชิงเปรียบเทียบของตัวชี้วัดรายปีจากฐานข้อมูล World Bank Open Data
            </p>

            <div className="chart-container" style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={comparisonData?.timeline || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={{ stroke: '#1e293b' }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }} unit="%" axisLine={{ stroke: '#1e293b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      boxShadow: 'var(--shadow-dropdown)',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '0.82rem' }} />
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
                        strokeWidth={2}
                        dot={{ r: 3, strokeWidth: 1.5, fill: color }}
                        activeDot={{ r: 6 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Comparison Cards Matrix */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
              ตารางเปรียบเทียบสถิติรอบปีล่าสุด ({selectedYear})
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem' }}>
              เปรียบเทียบ 3 ตัวชี้วัดสำคัญแบบรายประเทศ (Cross-Country Metric Matrix)
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.max(comparedList.length, 1)}, minmax(220px, 1fr))`,
                gap: '1rem',
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
                      borderTop: `3px solid ${color}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      padding: '1.15rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {flagUrl && <img src={flagUrl} alt={countryProfile.name} className="flag-img" onError={(e) => { e.target.style.display = 'none'; }} />}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>{countryProfile.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{countryProfile.region} · {code}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', background: 'rgba(255,255,255,0.02)', padding: '0.65rem 0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      {/* GDP */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>GDP Growth</span>
                        <span className={`value-badge ${gdpVal?.colorClass || 'green'}`}>
                          {gdpVal?.displayValue || 'N/A'}
                        </span>
                      </div>

                      {/* Inflation */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Inflation</span>
                        <span className={`value-badge ${infVal?.colorClass || 'red'}`}>
                          {infVal?.displayValue || 'N/A'}
                        </span>
                      </div>

                      {/* Unemployment */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Unemployment</span>
                        <span className={`value-badge ${uneVal?.colorClass || 'red'}`}>
                          {uneVal?.displayValue || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFromCompare(code)}
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: 'auto', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)' }}
                    >
                      <X size={12} />
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
