import React from 'react';
import MetricCard from './MetricCard';
import { GitCompare, ArrowRight, BarChart3, TrendingUp, ShieldAlert, Users } from 'lucide-react';
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
      {/* Executive Summary Banner */}
      <div
        className="glass-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid var(--border-card)',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#60a5fa',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
            ZoneZet Macroeconomic Analytics · World Bank Data System
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '0.45rem' }}>
            ระบบวิเคราะห์และเปรียบเทียบสถิติเศรษฐกิจมหภาคระดับสถาบัน
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>
            โครงสร้างสถาปัตยกรรมระดับองค์กรด้วย <strong style={{ color: '#f8fafc' }}>React-Vite & Express Gateway</strong> บูรณาการระบบแคชความเร็วสูง In-Memory Hash Table <strong style={{ color: '#34d399' }}>O(1)</strong>,
            อัลกอริทึมจัดเรียงข้อมูลแบบเสถียร MergeSort <strong style={{ color: '#60a5fa' }}>O(n log n)</strong> และศูนย์เปรียบเทียบความสัมพันธ์เชิงสถิติ (Comparison Hub)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('compare')}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.86rem' }}
          >
            <GitCompare size={16} />
            <span>เปิดศูนย์เปรียบเทียบ (Compare Hub)</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

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
