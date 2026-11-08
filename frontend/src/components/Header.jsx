import React from 'react';
import { Search, Calendar, Zap, Scale } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  selectedYear,
  setSelectedYear,
  cacheStats,
  compareCount,
  setActiveTab
}) {
  const years = ['2025', '2024', '2023', '2022', '2021', '2020'];

  return (
    <header className="top-header">
      <div className="header-search-bar">
        <Search size={16} color="#9ca3af" />
        <input
          type="text"
          className="header-search-input"
          placeholder="ค้นหาชื่อประเทศ หรือภูมิภาค..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-actions">
        {/* Year Selector */}
        <div className="year-picker">
          <Calendar size={15} color="#9ca3af" />
          <span style={{ color: '#9ca3af' }}>ข้อมูลปี:</span>
          <select
            className="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* DSA Cache Hit Stats Pill */}
        <div className="cache-indicator" title="Express In-Memory Hash Table Cache O(1)">
          <Zap size={14} />
          <span>Cache: {cacheStats.hitRate || '100%'} (&lt;2ms)</span>
        </div>

        {/* Quick Compare Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('compare')}
          title="เปิดหน้าต่างเปรียบเทียบประเทศ"
        >
          <Scale size={15} />
          <span>เปรียบเทียบ ({compareCount})</span>
        </button>
      </div>
    </header>
  );
}
