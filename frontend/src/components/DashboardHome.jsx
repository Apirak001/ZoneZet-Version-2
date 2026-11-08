import React from 'react';
import MetricCard from './MetricCard';
import { Scale, ArrowRight, BarChart3, TrendingUp, ShieldAlert, Users, Sparkles } from 'lucide-react';
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
      {/* Cute Minimal Hero Banner */}
      <div
        className="glass-panel"
        style={{
          background: 'linear-gradient(135deg, #eef2ff 0%, #fdf2f8 50%, #f0fdf4 100%)',
          border: '1px solid #e0e7ff',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#ffffff',
            color: '#4f46e5',
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: '9999px',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
            marginBottom: '0.75rem',
            border: '1px solid #e0e7ff'
          }}>
            <Sparkles size={14} color="#ec4899" />
            ZONEZET 2.0 · CUTE & MINIMAL ECONOMIC HUB
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#1e1b4b', marginBottom: '0.65rem' }}>
            วิเคราะห์และเปรียบเทียบสถิติเศรษฐกิจโลก ✨
          </h1>
          <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: 1.6 }}>
            ต่อยอดจาก Version 1 ด้วยสถาปัตยกรรม <strong style={{ color: '#4338ca' }}>React + Express</strong> พร้อมกราฟเปรียบเทียบหลายประเทศ 
            ระบบแคช In-Memory Hash Table <strong style={{ color: '#047857' }}>O(1)</strong> และอัลกอริทึม MergeSort <strong style={{ color: '#2563eb' }}>O(n log n)</strong> 
            ในสไตล์คลีน มินิมอล สบายตา 🌸
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('compare')}
            className="btn btn-primary"
            style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem', borderRadius: '14px' }}
          >
            <Scale size={18} />
            <span>เริ่มเปรียบเทียบประเทศ (Compare Hub)</span>
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

      {/* Interactive Cute Pastel Recharts Graph */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="#6366f1" />
              <span>ภาพรวมสถิติประเทศผู้นำ (Top Performers Overview)</span>
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              เปรียบเทียบสัดส่วนตัวชี้วัด GDP Growth vs Inflation vs Unemployment ปี {selectedYear}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setActiveTab('gdp')} className="btn btn-secondary btn-sm">
              <TrendingUp size={14} color="#10b981" />
              <span>ดูตาราง GDP</span>
            </button>
            <button onClick={() => setActiveTab('inflation')} className="btn btn-secondary btn-sm">
              <ShieldAlert size={14} color="#f43f5e" />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} unit="%" axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  color: '#0f172a',
                  boxShadow: '0 10px 25px rgba(148, 163, 184, 0.15)',
                  fontWeight: 600
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="GDP" fill="#34d399" radius={[6, 6, 0, 0]} name="GDP Growth (%)" />
              <Bar dataKey="Inflation" fill="#fb7185" radius={[6, 6, 0, 0]} name="Inflation (%)" />
              <Bar dataKey="Unemployment" fill="#fbbf24" radius={[6, 6, 0, 0]} name="Unemployment (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
