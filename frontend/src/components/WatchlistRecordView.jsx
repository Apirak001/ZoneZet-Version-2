import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Trash2,
  RotateCcw,
  GitCompare,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  X,
  Globe,
  Sparkles,
  Layers,
  Check,
  LayoutGrid,
  List,
  Filter,
  ShieldCheck,
  TrendingUp,
  Flame,
  Users,
  Compass,
  ArrowUpDown,
  Zap
} from 'lucide-react';
import { EmptyState } from './FeedbackStates';
import AnimatedValue from './AnimatedValue';

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

export default function WatchlistRecordView({
  watchlist = [],
  onRemoveFromWatchlist,
  onUndoLastRemove,
  hasUndo = false,
  onCompareAll,
  onAddToCompare,
  comparedList = [],
  onOpenCompareModal,
  onClearWatchlist,
  setActiveTab
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortKey, setSortKey] = useState('date'); // 'date' | 'value' | 'name'
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Portfolio Analytics Calculations
  const stats = useMemo(() => {
    if (!watchlist || watchlist.length === 0) {
      return { total: 0, avg: '0.0', leader: null, positiveRatio: '0%' };
    }

    const numericItems = watchlist.filter((w) => typeof w.value === 'number');
    const total = watchlist.length;

    if (numericItems.length === 0) {
      return { total, avg: '0.0', leader: watchlist[0] || null, positiveRatio: '100%' };
    }

    const sum = numericItems.reduce((acc, curr) => acc + curr.value, 0);
    const avg = (sum / numericItems.length).toFixed(1);
    const sorted = [...numericItems].sort((a, b) => b.value - a.value);
    const leader = sorted[0];
    const positiveCount = numericItems.filter((i) => i.value > 0).length;
    const positiveRatio = `${Math.round((positiveCount / numericItems.length) * 100)}%`;

    return { total, avg, leader, positiveRatio };
  }, [watchlist]);

  // Filtering & Sorting
  const filteredItems = useMemo(() => {
    return watchlist.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.country && item.country.toLowerCase().includes(q)) ||
        (item.countryCode && item.countryCode.toLowerCase().includes(q)) ||
        (item.region && item.region.toLowerCase().includes(q));

      const matchesRegion =
        selectedRegion === 'All' ||
        (item.region && item.region.toLowerCase() === selectedRegion.toLowerCase());

      return matchesSearch && matchesRegion;
    });
  }, [watchlist, searchQuery, selectedRegion]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'value') {
        const valA = typeof a.value === 'number' ? a.value : -Infinity;
        const valB = typeof b.value === 'number' ? b.value : -Infinity;
        comparison = valB - valA;
      } else if (sortKey === 'name') {
        comparison = (a.country || '').localeCompare(b.country || '');
      } else {
        // Default: order of insertion (latest first)
        comparison = 0;
      }
      return sortDirection === 'asc' ? -comparison : comparison;
    });
  }, [filteredItems, sortKey, sortDirection]);

  const handleSortToggle = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // Quick Compare Action
  const handleCompareWatchlist = () => {
    if (onCompareAll) {
      onCompareAll();
    } else if (onOpenCompareModal) {
      onOpenCompareModal();
    }
  };

  return (
    <div className="indicator-page-container">
      {/* Ambient Grid Pattern and Cosmic Glow */}
      <div className="indicator-bg-grid-pattern" />
      <div className="indicator-ambient-glow" />
      <div className="indicator-ambient-glow-secondary" />

      {/* ====================================================================
          1. LUXURY HERO HEADER & QUICK ACTION CARD
          ==================================================================== */}
      <div className="db-home-header-row" style={{ marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
        <div className="db-home-title-col">
          {/* Badge Tag */}
          <div className="hero-badge-tag" style={{ marginBottom: '0.65rem' }}>
            <span className="badge-sparkle">✦</span>
            <span>SOVEREIGN WATCHLIST · LIFO STACK ARCHITECTURE</span>
          </div>

          <h1 className="indicator-hero-big-title">
            ศูนย์รวมรายการบันทึกเฝ้าติดตาม{' '}
            <span className="title-en-gradient">Watchlist & Records</span>
          </h1>

          <p className="indicator-hero-subtext">
            พอร์ตโฟลิโอข้อมูลประเทศที่คัดสรรเพื่อเฝ้าระวังและติดตามสภาวะเศรษฐกิจ พร้อมกลไกกู้คืนประวัติการลบแบบเรียลไทม์ด้วย Data Structure Stack (LIFO)
          </p>

          {/* Meta Trust Badges */}
          <div className="indicator-meta-badges-row">
            <div className="indicator-meta-pill">
              <span className="pulse-indicator-dot green" />
              <span>World Bank Synchronized</span>
            </div>
            <div className="indicator-meta-pill">
              <Bookmark size={13} color="#fbbf24" fill="#fbbf24" />
              <span>บันทึกแล้ว {watchlist.length} ประเทศ</span>
            </div>
            <div className="indicator-meta-pill">
              <Layers size={13} color="#38bdf8" />
              <span>LIFO Stack Rollback O(1)</span>
            </div>
          </div>
        </div>

        {/* Luxury Action Card on Right */}
        <div className="db-year-selector-card" style={{ minWidth: '320px' }}>
          <div className="db-year-selector-label">
            <Bookmark size={14} color="#fbbf24" fill="#fbbf24" />
            <span>การจัดการพอร์ตโฟลิโอ (Quick Actions):</span>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', marginTop: '0.35rem' }}>
            {hasUndo && (
              <button
                type="button"
                onClick={onUndoLastRemove}
                className="watchlist-header-action-btn undo"
                style={{ flex: 1 }}
                title="กู้คืนรายการประเทศล่าสุดที่ถูกลบ (DSA Stack Undo)"
              >
                <RotateCcw size={14} />
                <span>กู้คืนล่าสุด (Undo)</span>
              </button>
            )}

            {watchlist.length > 0 && (
              <button
                type="button"
                onClick={handleCompareWatchlist}
                className="watchlist-header-action-btn compare"
                style={{ flex: 1 }}
                title="เปิดหน้าต่างเปรียบเทียบกลุ่มประเทศใน Watchlist ในหน้านี้ทันที"
              >
                <GitCompare size={14} />
                <span>เปรียบเทียบในหน้านี้</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. TOP 4 DYNAMIC KPI SUMMARY CARDS (Animated Values)
          ==================================================================== */}
      <div className="indicator-kpi-grid" style={{ marginBottom: '2rem' }}>
        {/* Card 1: Total Saved Countries */}
        <div className="indicator-kpi-card" style={{ '--kpi-accent': '#fbbf24' }}>
          <div className="indicator-kpi-top">
            <div
              className="indicator-kpi-icon"
              style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}
            >
              <Bookmark size={18} fill="#fbbf24" />
            </div>
            <span
              className="indicator-kpi-tag"
              style={{
                background: 'rgba(251, 191, 36, 0.15)',
                color: '#fbbf24',
                borderColor: 'rgba(251, 191, 36, 0.35)'
              }}
            >
              PORTFOLIO SIZE
            </span>
          </div>

          <div className="indicator-kpi-middle">
            <div className="indicator-kpi-val" style={{ color: '#fbbf24' }}>
              <AnimatedValue
                key={`cnt-${stats.total}`}
                value={`${stats.total}`}
                duration={1200}
              />
            </div>
            <div className="indicator-kpi-lbl">จำนวนประเทศที่เฝ้าติดตามใน Watchlist</div>
          </div>

          <div className="indicator-kpi-footer">
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
              จัดเก็บถาวรใน LocalStorage อัตโนมัติ
            </span>
          </div>
          <div className="indicator-kpi-gauge-track">
            <div
              className="indicator-kpi-gauge-fill"
              style={{ width: `${Math.min(stats.total * 12, 100)}%`, background: '#fbbf24' }}
            />
          </div>
        </div>

        {/* Card 2: Group Benchmark Average */}
        <div className="indicator-kpi-card" style={{ '--kpi-accent': '#c084fc' }}>
          <div className="indicator-kpi-top">
            <div
              className="indicator-kpi-icon"
              style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}
            >
              <Globe size={18} />
            </div>
            <span
              className="indicator-kpi-tag"
              style={{
                background: 'rgba(192, 132, 252, 0.15)',
                color: '#c084fc',
                borderColor: 'rgba(192, 132, 252, 0.35)'
              }}
            >
              GROUP BENCHMARK
            </span>
          </div>

          <div className="indicator-kpi-middle">
            <div className="indicator-kpi-val" style={{ color: '#c084fc' }}>
              <AnimatedValue
                key={`avg-${stats.avg}`}
                value={`${Number(stats.avg) > 0 ? '+' : ''}${stats.avg}%`}
                duration={1200}
                delay={100}
              />
            </div>
            <div className="indicator-kpi-lbl">ค่าเฉลี่ยสถิติของประเทศใน Watchlist</div>
          </div>

          <div className="indicator-kpi-footer">
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
              คำนวณถัวเฉลี่ยสถิติ {watchlist.length} ชาติ
            </span>
          </div>
          <div className="indicator-kpi-gauge-track">
            <div className="indicator-kpi-gauge-fill" style={{ width: '65%', background: '#c084fc' }} />
          </div>
        </div>

        {/* Card 3: Top Performer in Watchlist */}
        <div className="indicator-kpi-card" style={{ '--kpi-accent': '#34d399' }}>
          <div className="indicator-kpi-top">
            <div
              className="indicator-kpi-icon"
              style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}
            >
              <Sparkles size={18} />
            </div>
            <span
              className="indicator-kpi-tag"
              style={{
                background: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                borderColor: 'rgba(52, 211, 153, 0.35)'
              }}
            >
              #1 PORTFOLIO LEADER
            </span>
          </div>

          <div className="indicator-kpi-middle">
            <div className="indicator-kpi-val" style={{ color: '#34d399' }}>
              <AnimatedValue
                key={`ldr-${stats.leader?.value}`}
                value={stats.leader?.displayValue || `${stats.leader?.value ?? 0}%`}
                duration={1200}
                delay={200}
              />
            </div>
            <div className="indicator-kpi-lbl">ผู้นำค่าสถิติสูงสุดในพอร์ต</div>
          </div>

          <div className="indicator-kpi-footer">
            {stats.leader?.iso2 && (
              <img
                src={`https://flagcdn.com/w40/${stats.leader.iso2.toLowerCase()}.png`}
                alt={stats.leader.country}
                style={{ width: 18, height: 12, borderRadius: 2, objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <span style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>
              {stats.leader?.country || 'ยังไม่มีข้อมูล'}
            </span>
          </div>
          <div className="indicator-kpi-gauge-track">
            <div className="indicator-kpi-gauge-fill" style={{ width: '100%', background: '#34d399' }} />
          </div>
        </div>

        {/* Card 4: DSA Stack Engine Architecture */}
        <div className="indicator-kpi-card" style={{ '--kpi-accent': '#38bdf8' }}>
          <div className="indicator-kpi-top">
            <div
              className="indicator-kpi-icon"
              style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
            >
              <Layers size={18} />
            </div>
            <span
              className="indicator-kpi-tag"
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.35)'
              }}
            >
              DATA STRUCTURE
            </span>
          </div>

          <div className="indicator-kpi-middle">
            <div className="indicator-kpi-val" style={{ color: '#38bdf8' }}>
              Stack O(1)
            </div>
            <div className="indicator-kpi-lbl">ระบบ Undo Rollback แบบ LIFO</div>
          </div>

          <div className="indicator-kpi-footer">
            <Check size={14} color="#34d399" />
            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
              {hasUndo ? 'มีประวัติพร้อมกู้คืน' : 'ระบบกู้คืนพร้อมใช้งาน'}
            </span>
          </div>
          <div className="indicator-kpi-gauge-track">
            <div className="indicator-kpi-gauge-fill" style={{ width: '100%', background: '#38bdf8' }} />
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. REGION FILTER & SEARCH CONTROLS
          ==================================================================== */}
      {watchlist.length > 0 && (
        <div className="indicator-filter-section">
          {/* Region Horizontal Filter Pills */}
          <div className="indicator-region-pills-row">
            <div className="indicator-region-label">
              <Globe size={13} color="#c084fc" />
              <span>ภูมิภาค:</span>
            </div>
            <div className="indicator-region-pills-scroll">
              {REGIONS.map((reg) => {
                const count = reg === 'All'
                  ? watchlist.length
                  : watchlist.filter((d) => d.region?.toLowerCase() === reg.toLowerCase()).length;
                const isActive = selectedRegion === reg;

                return (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setSelectedRegion(reg)}
                    className={`indicator-region-pill ${isActive ? 'active' : ''}`}
                  >
                    <span>{reg === 'All' ? 'ทุกภูมิภาค (All)' : reg}</span>
                    {count > 0 && <span className="pill-count-tag">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search, Sort & View Mode Switcher */}
          <div className="indicator-table-controls-bar">
            {/* Search Box */}
            <div className="indicator-search-box">
              <Search size={14} className="indicator-search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อประเทศ หรือรหัส ISO ใน Watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="indicator-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="indicator-search-clear-btn"
                  title="ล้างคำค้นหา"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Right Controls: Sort Buttons & View Mode Toggle */}
            <div className="indicator-sort-controls-wrap">
              <span className="indicator-sort-label">เรียงตาม:</span>
              <button
                type="button"
                onClick={() => handleSortToggle('value')}
                className={`indicator-sort-btn ${sortKey === 'value' ? 'active' : ''}`}
                title="คลิกเพื่อสลับ ลำดับค่าสถิติ"
              >
                <span>ค่าสถิติ</span>
                <ArrowUpDown size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleSortToggle('name')}
                className={`indicator-sort-btn ${sortKey === 'name' ? 'active' : ''}`}
                title="คลิกเพื่อเรียงตามชื่อ A-Z"
              >
                <span>ชื่อประเทศ</span>
                <ArrowUpDown size={12} />
              </button>

              {/* View Mode Toggle (Table vs Cards) */}
              <div className="indicator-chart-mode-toggle" style={{ marginLeft: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`mode-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                  title="มุมมองตารางหรู"
                >
                  <List size={13} />
                  <span>ตาราง</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`mode-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  title="มุมมองการ์ด"
                >
                  <LayoutGrid size={13} />
                  <span>การ์ด</span>
                </button>
              </div>

              {/* Counter Pill */}
              <span className="indicator-total-badge">
                {sortedItems.length} จาก {watchlist.length} ชาติ
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          4. MAIN WATCHLIST DATA (TABLE OR CARD GRID VIEW)
          ==================================================================== */}
      {watchlist.length === 0 ? (
        <EmptyState
          title="ไม่มีข้อมูลใน Watchlist"
          message="ท่านสามารถคลิกไอคอน Bookmark ในหน้าสถิติเศรษฐกิจ (GDP, เงินเฟ้อ, ตลาดแรงงาน) เพื่อบันทึกประเทศที่ต้องการติดตาม"
          onReset={() => setActiveTab && setActiveTab('gdp')}
        />
      ) : sortedItems.length === 0 ? (
        <EmptyState
          title="ไม่พบประเทศที่ตรงกับเงื่อนไขการค้นหา"
          message={`ไม่มีประเทศที่ตรงกับคำค้นหา "${searchQuery}" ในภูมิภาค "${selectedRegion}"`}
          onReset={() => {
            setSearchQuery('');
            setSelectedRegion('All');
          }}
        />
      ) : viewMode === 'table' ? (
        /* Modern Glassmorphism Table View (Matching IndicatorView exactly) */
        <div className="indicator-table-card">
          <div className="indicator-table-responsive-wrapper">
            <table className="indicator-luxury-table">
              <thead>
                <tr>
                  <th style={{ width: '68px', textAlign: 'center' }}>ลำดับ</th>
                  <th>ประเทศสมาชิก (Sovereign Nation)</th>
                  <th style={{ width: '100px' }}>รหัส (ISO)</th>
                  <th>ภูมิภาค (Region)</th>
                  <th style={{ width: '170px' }}>ค่าสถิติที่บันทึก</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>รอบปี</th>
                  <th style={{ textAlign: 'center', width: '180px' }}>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item, index) => {
                  const flagUrl = item.iso2
                    ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png`
                    : null;
                  const isCompared = comparedList.includes(item.countryCode?.toUpperCase());

                  return (
                    <tr key={item.countryCode || index} className="indicator-table-row">
                      {/* Rank Index */}
                      <td style={{ textAlign: 'center' }}>
                        <span className="indicator-rank-pill top3">
                          #{index + 1}
                        </span>
                      </td>

                      {/* Country Profile with Flag */}
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
                            <span className="indicator-country-sub">
                              {item.iso2 ? item.iso2.toUpperCase() : item.countryCode} · Sovereign
                            </span>
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
                          {item.region || 'Global'}
                        </span>
                      </td>

                      {/* Stat Value Badge with Animated Number */}
                      <td>
                        <div className="indicator-val-cell-wrap">
                          <span
                            className={`indicator-val-badge ${
                              item.colorClass || (item.value >= 0 ? 'green' : 'red')
                            }`}
                          >
                            {item.trend === 'up' ? (
                              <ArrowUpRight size={13} />
                            ) : (
                              <ArrowDownRight size={13} />
                            )}
                            {item.displayValue || `${item.value}%`}
                          </span>
                        </div>
                      </td>

                      {/* Year */}
                      <td style={{ textAlign: 'center', color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                        {item.year || '2025'}
                      </td>

                      {/* Actions: Compare & Remove */}
                      <td style={{ textAlign: 'center' }}>
                        <div className="indicator-row-actions" style={{ justifyContent: 'center' }}>
                          {/* Quick Compare Button */}
                          {onAddToCompare && (
                            <button
                              type="button"
                              onClick={() => onAddToCompare(item.countryCode)}
                              className={`indicator-action-btn compare-btn ${isCompared ? 'active' : ''}`}
                              title={isCompared ? 'อยู่ในชุดเปรียบเทียบแล้ว (คลิกเพื่อนำออก)' : 'เพิ่มเข้าชุดเปรียบเทียบ'}
                            >
                              {isCompared ? <Check size={12} color="#34d399" strokeWidth={3} /> : <GitCompare size={12} />}
                              <span>{isCompared ? 'เลือกแล้ว' : '+ เทียบ'}</span>
                            </button>
                          )}

                          {/* Remove Action with Undo */}
                          <button
                            type="button"
                            onClick={() => onRemoveFromWatchlist(item.countryCode)}
                            className="indicator-action-btn"
                            style={{
                              color: '#fb7185',
                              borderColor: 'rgba(244, 63, 94, 0.35)',
                              background: 'rgba(244, 63, 94, 0.08)'
                            }}
                            title="ลบออกจาก Watchlist (สามารถ Undo กู้คืนได้)"
                          >
                            <Trash2 size={12} />
                            <span>ลบ</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Modern Cyber Card Grid View */
        <div className="watchlist-card-grid" style={{ marginTop: '1.25rem' }}>
          {sortedItems.map((item, index) => {
            const flagUrl = item.iso2
              ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png`
              : null;
            const isCompared = comparedList.includes(item.countryCode?.toUpperCase());

            return (
              <div key={item.countryCode || index} className="watchlist-item-card">
                <div className="watchlist-card-header">
                  <div className="watchlist-card-title-col">
                    {flagUrl && (
                      <img
                        src={flagUrl}
                        alt={item.country}
                        className="watchlist-card-flag"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div>
                      <h4 className="watchlist-card-country">{item.country}</h4>
                      <span className="watchlist-card-sub">
                        {item.countryCode} · {item.region || 'Global'}
                      </span>
                    </div>
                  </div>
                  <span className="watchlist-card-index">#{index + 1}</span>
                </div>

                <div className="watchlist-card-value-box">
                  <div className="watchlist-card-metric-lbl">สถิติที่บันทึก ({item.year || '2025'}):</div>
                  <div className="watchlist-card-metric-val">
                    <span className={`indicator-val-badge ${item.colorClass || (item.value >= 0 ? 'green' : 'red')}`}>
                      {item.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {item.displayValue || `${item.value}%`}
                    </span>
                  </div>
                </div>

                <div className="watchlist-card-actions">
                  {onAddToCompare && (
                    <button
                      type="button"
                      onClick={() => onAddToCompare(item.countryCode)}
                      className={`watchlist-card-btn compare ${isCompared ? 'active' : ''}`}
                    >
                      {isCompared ? <Check size={13} color="#34d399" /> : <GitCompare size={13} />}
                      <span>{isCompared ? 'เทียบอยู่' : '+ เทียบ'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveFromWatchlist(item.countryCode)}
                    className="watchlist-card-btn remove"
                    title="ลบออกจาก Watchlist (Undo ได้)"
                  >
                    <Trash2 size={13} />
                    <span>นำออก</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
