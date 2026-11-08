import React from 'react';
import { Search, Calendar, Database, GitCompare } from 'lucide-react';

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
        <Search size={15} color="#64748b" />
        <input
          type="text"
          className="header-search-input"
          placeholder="ค้นหาด้วยชื่อประเทศ, รหัส ISO หรือภูมิภาค..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-actions">
        {/* Year Selector */}
        <div className="year-picker">
          <Calendar size={14} color="#94a3b8" />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>รอบปีข้อมูล:</span>
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
          <Database size={13} />
          <span>Cache: {cacheStats.hitRate || '100%'} (&lt;2ms)</span>
        </div>

        {/* Quick Compare Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('compare')}
          title="เปิดศูนย์วิเคราะห์เปรียบเทียบ"
        >
          <GitCompare size={14} color="#60a5fa" />
          <span>เปรียบเทียบ ({compareCount})</span>
        </button>
      </div>
    </header>
  );
}
