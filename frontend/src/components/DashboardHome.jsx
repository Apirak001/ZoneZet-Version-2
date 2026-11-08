import React from 'react';
import MetricCard from './MetricCard';
import { Scale, ArrowRight, BarChart3, TrendingUp, ShieldAlert, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function DashboardHome({
  topSummary = {},
  selectedYear = '2025',
  setActiveTab,
  onAddToCompare
}) {
  const gdpItems = topSummary.gdp || [];
  const inflationItems = topSummary.inflation || [];
  const unemploymentItems = topSummary.unemployment || [];

  // Build combined chart data for Top countries
  const chartData = (gdpItems.slice(0, 5) || []).map((item, idx) => ({
    name: item.country,
    GDP: item.value,
    Inflation: inflationItems[idx] ? inflationItems[idx].value : 0,
    Unemployment: unemploymentItems[idx] ? unemploymentItems[idx].value : 0
  }));

  return (
    <div>
      {/* Hero / Feature Spotlight Banner */}
      <div
        className="glass-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8' }} />
            ZONEZET VERSION 2.0 · WORLD BANK ANALYTICS
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            ศูนย์วิเคราะห์และเปรียบเทียบสถิติเศรษฐกิจโลก
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.5 }}>
            ต่อยอดจาก Version 1 ด้วยสถาปัตยกรรม <strong style={{ color: '#fff' }}>React + Express</strong> พร้อมกราฟเปรียบเทียบหลายประเทศ (Compare Hub),
            ระบบแคช In-Memory Hash Table <strong style={{ color: '#34d399' }}>O(1)</strong> และอัลกอริทึมจัดเรียง MergeSort <strong style={{ color: '#60a5fa' }}>O(n log n)</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('compare')}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
          >
            <Scale size={18} />
            <span>เปิดฟีเจอร์เปรียบเทียบ (Compare Hub)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Top 5 Highlight Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <MetricCard
          title={`GDP Growth TOP 5 (${selectedYear})`}
          type="gdp"
          items={gdpItems}
          onAddToCompare={onAddToCompare}
        />
        <MetricCard
          title={`Inflation TOP 5 (${selectedYear})`}
          type="inflation"
          items={inflationItems}
          onAddToCompare={onAddToCompare}
        />
        <MetricCard
          title={`Unemployment TOP 5 (${selectedYear})`}
          type="unemployment"
          items={unemploymentItems}
          onAddToCompare={onAddToCompare}
        />
      </div>

      {/* Interactive Recharts Graph */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#6366f1" />
              <span>กราฟภาพรวมเศรษฐกิจประเทศผู้นำ (Top Performers Overview)</span>
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              เปรียบเทียบสัดส่วนตัวชี้วัด GDP Growth vs Inflation vs Unemployment ปี {selectedYear}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setActiveTab('gdp')} className="btn btn-secondary btn-sm">
              <TrendingUp size={14} color="#10b981" />
              <span>ดูตาราง GDP</span>
            </button>
            <button onClick={() => setActiveTab('inflation')} className="btn btn-secondary btn-sm">
              <ShieldAlert size={14} color="#ef4444" />
              <span>ดูตาราง เงินเฟ้อ</span>
            </button>
            <button onClick={() => setActiveTab('unemployment')} className="btn btn-secondary btn-sm">
              <Users size={14} color="#f59e0b" />
              <span>ดูตาราง การว่างงาน</span>
            </button>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="GDP" fill="#10b981" radius={[4, 4, 0, 0]} name="GDP Growth (%)" />
              <Bar dataKey="Inflation" fill="#ef4444" radius={[4, 4, 0, 0]} name="Inflation (%)" />
              <Bar dataKey="Unemployment" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Unemployment (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
