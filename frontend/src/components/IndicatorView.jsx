import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Scale, Bookmark, Plus, Check, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';
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
      country: item.country.length > 12 ? item.country.substring(0, 12) + '...' : item.country,
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
    return <LoadingSkeleton text={`กำลังโหลดข้อมูล ${title}...`} />;
  }

  return (
    <div>
      {/* Title & Stats */}
      <div style={{ marginBottom: '1.5rem' }}>
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
        <div className="glass-panel" style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={18} color="#6366f1" />
              <span>10 อันดับแรกในมุมมองนี้ (Top 10 Chart)</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              จัดเรียงด้วย DSA Merge Sort O(n log n)
            </span>
          </div>

          <div className="chart-container" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={top10ChartData} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="country" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-25} textAnchor="end" />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" />
                <Tooltip
                  formatter={(val) => [`${val}%`, title]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="value" fill={getBarColor()} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table & Sort Controls */}
      {sortedData.length === 0 ? (
        <EmptyState
          title="ไม่พบประเทศในภูมิภาคหรือคำค้นหานี้"
          message="กรุณากดเลือก 'ทุกภูมิภาค' หรือล้างคำค้นหาที่แถบด้านบน"
          onReset={() => setSelectedRegion('All')}
        />
      ) : (
        <div className="glass-panel" style={{ padding: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
              พบทั้งหมด <strong style={{ color: '#fff' }}>{sortedData.length}</strong> ประเทศ
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>จัดเรียง:</span>
              <button
                onClick={() => handleSortToggle('value')}
                className={`btn btn-secondary btn-sm ${sortKey === 'value' ? 'active-sort' : ''}`}
                style={{ background: sortKey === 'value' ? 'rgba(99,102,241,0.2)' : undefined }}
              >
                <ArrowUpDown size={13} />
                <span>ค่าสถิติ ({sortKey === 'value' ? (sortDirection === 'desc' ? 'มาก➔น้อย' : 'น้อย➔มาก') : 'ตัวเลข'})</span>
              </button>
              <button
                onClick={() => handleSortToggle('country')}
                className={`btn btn-secondary btn-sm`}
                style={{ background: sortKey === 'country' ? 'rgba(99,102,241,0.2)' : undefined }}
              >
                <ArrowUpDown size={13} />
                <span>ชื่อประเทศ (A-Z)</span>
              </button>
            </div>
          </div>

          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <modern-table className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>อันดับ</th>
                  <th>ประเทศ (Country)</th>
                  <th>รหัส (ISO)</th>
                  <th>ภูมิภาค (Region)</th>
                  <th>ค่าสถิติ (Value)</th>
                  <th style={{ textAlign: 'center', width: '160px' }}>จัดการ (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => {
                  const isCompared = comparedList.includes(item.countryCode);
                  const isWatchlisted = watchlist.some(w => w.countryCode === item.countryCode);
                  const flagUrl = item.iso2 ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png` : null;

                  return (
                    <tr key={item.countryCode || index}>
                      <td style={{ color: '#9ca3af', fontWeight: 600 }}>#{index + 1}</td>
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
                      <td style={{ color: '#9ca3af', fontFamily: 'monospace' }}>{item.countryCode}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px', color: '#cbd5e1' }}>
                          {item.region || 'Other'}
                        </span>
                      </td>
                      <td>
                        <span className={`value-badge ${item.colorClass}`}>
                          {item.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {item.displayValue || `${item.value}%`}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => onAddToCompare(item.countryCode)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: isCompared ? 'rgba(99,102,241,0.25)' : undefined,
                              borderColor: isCompared ? '#6366f1' : undefined
                            }}
                            title={isCompared ? 'อยู่ในรายการเปรียบเทียบแล้ว' : 'เพิ่มเพื่อเปรียบเทียบ'}
                          >
                            {isCompared ? <Check size={13} color="#a5b4fc" /> : <Scale size={13} />}
                            <span>{isCompared ? 'เปรียบเทียบ' : '+ เทียบ'}</span>
                          </button>
                          <button
                            onClick={() => onAddToWatchlist(item)}
                            className="btn btn-secondary btn-sm"
                            style={{
                              background: isWatchlisted ? 'rgba(245,158,11,0.2)' : undefined,
                              borderColor: isWatchlisted ? '#f59e0b' : undefined
                            }}
                            title={isWatchlisted ? 'บันทึกแล้ว' : 'บันทึกลง Watchlist'}
                          >
                            <Bookmark size={13} color={isWatchlisted ? '#fbbf24' : undefined} />
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
