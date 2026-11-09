import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Percent,
  Users,
  Flame
} from 'lucide-react';

export default function DashboardToolbar({
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  cacheStats = {}
}) {
  const tabs = [
    {
      id: 'home',
      label: 'ภาพรวมแดชบอร์ด',
      icon: LayoutDashboard,
      color: '#c084fc',
      activeGradient: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
      glow: 'rgba(124, 58, 237, 0.45)'
    },
    {
      id: 'gdp',
      label: 'GDP Growth',
      icon: TrendingUp,
      color: '#34d399',
      activeGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      glow: 'rgba(16, 185, 129, 0.45)'
    },
    {
      id: 'inflation',
      label: 'อัตราเงินเฟ้อ',
      icon: Percent,
      color: '#f43f5e',
      activeGradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
      glow: 'rgba(244, 63, 94, 0.45)'
    },
    {
      id: 'unemployment',
      label: 'อัตราการว่างงาน',
      icon: Users,
      color: '#38bdf8',
      activeGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
      glow: 'rgba(56, 189, 248, 0.45)'
    }
  ];

  return (
    <div className="dashboard-control-toolbar">
      <div className="toolbar-inner-container">
        {/* Quick Indicator & Overview Switcher Tabs */}
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
                style={
                  isActive
                    ? {
                        background: tab.activeGradient,
                        borderColor: tab.color,
                        boxShadow: `0 0 16px ${tab.glow}`
                      }
                    : {}
                }
              >
                <Icon size={15} style={{ color: isActive ? '#ffffff' : (tab.color || '#94a3b8') }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
