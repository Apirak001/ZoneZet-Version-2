import React, { useState, useMemo } from 'react';
import { ArrowUpDown, GitCompare, Bookmark, Plus, Check, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';
import { mergeSort } from '../utils/dsa/mergeSort';
import { LoadingSkeleton, EmptyState, ErrorBanner } from './FeedbackStates';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
  title = 'GDP Growth (อัตราการเติบโตทางเศรษฐกิจ)',
  subtitle = 'สถิติประจำปีจากฐานข้อมูล World Bank Open Data API',
  data = [],
  isLoading = false,
  error = null,
  onRetry,
  onAddToCompare,
  comparedList = [],
  onAddToWatchlist,
  watchlist = []
}) {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortKey, setSortKey] = useState('value');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter by Region
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (selectedRegion === 'All') return data;
    return data.filter(item => item.region && item.region.toLowerCase() === selectedRegion.toLowerCase());
  }, [data, selectedRegion]);

  // Apply DSA: Merge Sort O(n log n)
  const sortedData = useMemo(() => {
    return mergeSort(filteredData, sortKey, sortDirection);
  }, [filteredData, sortKey, sortDirection]);

  // Top 10 for interactive Bar Chart
  const top10ChartData = useMemo(() => {
    return sortedData.slice(0, 10).map(item => ({
      country: item.country.length > 14 ? item.country.substring(0, 14) + '...' : item.country,
      fullName: item.country,
      value: item.value
    }));
  }, [sortedData]);

  const handleSortToggle = (key) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const getBarColor = () => {
    if (type === 'gdp') return '#10b981';
    if (type === 'inflation') return '#ef4444';
    return '#f59e0b';
  };

  if (isLoading) {
    return <LoadingSkeleton text={`กำลังเรียกข้อมูลสถิติ ${title}...`} />;
  }

  return (
    <div>
      {/* Title & Stats */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      {error && <ErrorBanner message={error} onRetry={onRetry} />}

      {/* Region Filter Pills */}
      <div className="pill-group">
        {REGIONS.map(reg => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`filter-pill ${selectedRegion === reg ? 'active' : ''}`}
          >
            {reg === 'All' ? 'ทุกภูมิภาค (All Regions)' : reg}
          </button>
        ))}
      </div>

      {/* Interactive Distribution Chart */}
      {sortedData.length > 0 && (
        <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <BarChart2 size={16} color="#3b82f6" />
              <span>การกระจายตัว 10 อันดับแรก (Top 10 Distribution)</span>
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#60a5fa', background: 'rgba(37,99,235,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, border: '1px solid rgba(37,99,235,0.25)', fontFamily: 'var(--font-mono)' }}>
              อัลกอริทึม: MergeSort O(n log n)
            </span>
          </div>

          <div className="chart-container" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={top10ChartData} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="country" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-25} textAnchor="end" axisLine={{ stroke: '#1e293b' }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }} unit="%" axisLine={{ stroke: '#1e293b' }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, title]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
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
                <Bar dataKey="value" fill={getBarColor()} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table & Sort Controls */}
      {sortedData.length === 0 ? (
        <EmptyState
          title="ไม่พบข้อมูลในเงื่อนไขการค้นหา"
          message="กรุณากดเลือก 'ทุกภูมิภาค' หรือปรับคำค้นหาที่แถบด้านบน"
          onReset={() => setSelectedRegion('All')}
        />
      ) : (
        <div className="glass-panel" style={{ padding: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
              จำนวนข้อมูลทั้งหมด <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{sortedData.length}</strong> รายการ
            </div>
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>จัดเรียง:</span>
              <button
                onClick={() => handleSortToggle('value')}
                className="btn btn-secondary btn-sm"
                style={{
                  background: sortKey === 'value' ? 'rgba(37,99,235,0.15)' : undefined,
                  borderColor: sortKey === 'value' ? '#3b82f6' : undefined,
                  color: sortKey === 'value' ? '#ffffff' : undefined
                }}
              >
                <ArrowUpDown size={12} />
                <span>ค่าสถิติ ({sortKey === 'value' ? (sortDirection === 'desc' ? 'มาก➔น้อย' : 'น้อย➔มาก') : 'ตัวเลข'})</span>
              </button>
              <button
                onClick={() => handleSortToggle('country')}
                className="btn btn-secondary btn-sm"
                style={{
                  background: sortKey === 'country' ? 'rgba(37,99,235,0.15)' : undefined,
                  borderColor: sortKey === 'country' ? '#3b82f6' : undefined,
                  color: sortKey === 'country' ? '#ffffff' : undefined
                }}
              >
                <ArrowUpDown size={12} />
                <span>ชื่อประเทศ (A-Z)</span>
              </button>
            </div>
          </div>

          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <modern-table className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>ประเทศ (Country)</th>
                  <th>รหัส (ISO)</th>
                  <th>ภูมิภาค (Region)</th>
                  <th>ค่าสถิติ (Value)</th>
                  <th style={{ textAlign: 'center', width: '150px' }}>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => {
                  const isCompared = comparedList.includes(item.countryCode);
                  const isWatchlisted = watchlist.some(w => w.countryCode === item.countryCode);
                  const flagUrl = item.iso2 ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png` : null;

                  return (
                    <tr key={item.countryCode || index}>
                      <td style={{ color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{index + 1}</td>
                      <td>
                        <div className="country-cell">
                          {flagUrl && (
                            <img
                              src={flagUrl}
                              alt={item.country}
                              className="flag-img"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <span>{item.country}</span>
                        </div>
                      </td>
                      <td style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.countryCode}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '3px', color: '#cbd5e1' }}>
                          {item.region || 'Other'}
                        </span>
                      </td>
                      <td>
                        <span className={`value-badge ${item.colorClass}`}>
                          {item.trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {item.displayValue || `${item.value}%`}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => onAddToCompare(item.countryCode)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: isCompared ? 'rgba(37,99,235,0.2)' : undefined,
                              borderColor: isCompared ? '#3b82f6' : undefined
                            }}
                            title={isCompared ? 'อยู่ในรายการเปรียบเทียบแล้ว' : 'เพิ่มเพื่อเปรียบเทียบ'}
                          >
                            {isCompared ? <Check size={12} color="#60a5fa" /> : <GitCompare size={12} />}
                            <span>{isCompared ? 'เปรียบเทียบ' : '+ เทียบ'}</span>
                          </button>
                          <button
                            onClick={() => onAddToWatchlist(item)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: isWatchlisted ? 'rgba(245,158,11,0.15)' : undefined,
                              borderColor: isWatchlisted ? '#f59e0b' : undefined
                            }}
                            title={isWatchlisted ? 'บันทึกแล้ว' : 'บันทึกลง Watchlist'}
                          >
                            <Bookmark size={12} color={isWatchlisted ? '#fbbf24' : undefined} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </modern-table>
          </div>
        </div>
      )}
    </div>
  );
}
