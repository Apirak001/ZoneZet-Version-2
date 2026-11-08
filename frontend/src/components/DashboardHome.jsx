import React from 'react';
import MetricCard from './MetricCard';
import { BarChart3, TrendingUp, ShieldAlert, Users } from 'lucide-react';
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
      {/* Top 5 Highlight Cards */}
      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
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

      {/* Institutional Recharts Graph */}
      <div className="glass-panel" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="#3b82f6" />
              <span>ภาพรวมเปรียบเทียบสัดส่วนตัวชี้วัดเศรษฐกิจ (Top Performers Comparative Overview)</span>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>
              เปรียบเทียบอัตราการเติบโต GDP, อัตราเงินเฟ้อ และอัตราการว่างงานของ 5 ประเทศผู้นำ ประจำปี {selectedYear}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => setActiveTab('gdp')} className="btn btn-secondary btn-sm">
              <TrendingUp size={13} color="#10b981" />
              <span>ตาราง GDP</span>
            </button>
            <button onClick={() => setActiveTab('inflation')} className="btn btn-secondary btn-sm">
              <ShieldAlert size={13} color="#ef4444" />
              <span>ตาราง เงินเฟ้อ</span>
            </button>
            <button onClick={() => setActiveTab('unemployment')} className="btn btn-secondary btn-sm">
              <Users size={13} color="#f59e0b" />
              <span>ตาราง ว่างงาน</span>
            </button>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} axisLine={{ stroke: '#1e293b' }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }} unit="%" axisLine={{ stroke: '#1e293b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '0.82rem' }} />
              <Bar dataKey="GDP" fill="#10b981" radius={[3, 3, 0, 0]} name="GDP Growth (%)" />
              <Bar dataKey="Inflation" fill="#ef4444" radius={[3, 3, 0, 0]} name="Inflation Rate (%)" />
              <Bar dataKey="Unemployment" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Unemployment (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
