import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Percent,
  Users,
  ShieldCheck,
  Calendar,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function DashboardToolbar({
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  cacheStats = {}
}) {
  const years = ['2025', '2024', '2023', '2022', '2021', '2020'];

  const tabs = [
    { id: 'home', label: 'ภาพรวมระบบ', icon: LayoutDashboard },
    { id: 'gdp', label: 'GDP Growth', icon: TrendingUp, color: '#34d399' },
    { id: 'inflation', label: 'อัตราเงินเฟ้อ (CPI)', icon: Percent, color: '#c084fc' },
    { id: 'unemployment', label: 'อัตราการว่างงาน', icon: Users, color: '#60a5fa' },
    { id: 'health', label: 'สถานะระบบ & Cache', icon: ShieldCheck, color: '#f59e0b' }
  ];

  return (
    <div className="dashboard-control-toolbar">
      <div className="toolbar-inner-container">
        {/* Left: Quick Indicator Switcher */}
        <div className="toolbar-tabs-group">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`toolbar-tab-pill ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} style={{ color: isActive ? '#ffffff' : (tab.color || '#94a3b8') }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Year Picker & Live Cache Monitor */}
        <div className="toolbar-controls-group">
          {/* Year Dropdown Selector */}
          <div className="toolbar-year-picker">
            <Calendar size={14} className="toolbar-icon-muted" />
            <span className="toolbar-year-label">รอบปีข้อมูล:</span>
            <select
              className="toolbar-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              title="เลือกรอบปีสถิติ World Bank"
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  ปี ค.ศ. {yr}
                </option>
              ))}
            </select>
          </div>

          {/* DSA Cache Hit Rate Status Pill */}
          <button
            onClick={() => {
              setActiveTab('health');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="toolbar-cache-pill"
            title="คลิกเพื่อตรวจสอบสถิติ In-Memory Cache Hash Map O(1) ของคุณอนุพงษ์"
          >
            <span className="cache-pulse-dot" />
            <Zap size={12} color="#c084fc" />
            <span>Cache O(1) &lt; 0.1ms</span>
            {cacheStats.hitRate && (
              <span className="cache-hit-tag">{cacheStats.hitRate}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
