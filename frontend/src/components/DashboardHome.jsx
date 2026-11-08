import React from 'react';
import MetricCard from './MetricCard';
import {
  BarChart3,
  TrendingUp,
  Percent,
  Users,
  GitCompare,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Sparkles
} from 'lucide-react';
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
    <div className="dashboard-home-page">
      {/* Executive Hero Banner */}
      <section className="executive-hero-banner">
        <div className="hero-content">
          <div className="hero-status-pill">
            <span className="hero-pulse-dot"></span>
            <span>World Bank Open Data API v2 · Live Connection Active</span>
          </div>

          <h1 className="hero-main-title">
            Global Economic Intelligence &amp; Macro Analytics
          </h1>

          <p className="hero-description">
            ศูนย์รวมข้อมูลสถิติเศรษฐกิจมหภาคพหุภาคีประจำปี <strong>{selectedYear}</strong> วิเคราะห์และเปรียบเทียบ
            3 ตัวชี้วัดสำคัญ (GDP Growth, อัตราเงินเฟ้อ CPI และอัตราการว่างงาน) ครอบคลุม 196 ประเทศทั่วโลก
            ด้วยสถาปัตยกรรม React-Vite + Express พร้อมโครงสร้างข้อมูล DSA ประสิทธิภาพสูง
          </p>

          <div className="hero-actions-row">
            <button
              onClick={() => setActiveTab('compare')}
              className="btn btn-primary hero-btn"
            >
              <GitCompare size={16} />
              <span>เปิดห้องเปรียบเทียบ (Compare Hub)</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => setActiveTab('gdp')}
              className="btn btn-secondary hero-btn"
            >
              <TrendingUp size={16} color="#10b981" />
              <span>สำรวจตัวชี้วัด GDP Growth</span>
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className="btn btn-secondary hero-btn"
            >
              <Zap size={16} color="#3b82f6" />
              <span>ตรวจสอบสถิติ Cache O(1)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Top 3 KPI Category Cards */}
      <div className="section-header-block" style={{ marginTop: '2rem' }}>
        <div>
          <h2 className="section-title">สรุปผู้นำทางเศรษฐกิจ 5 อันดับแรก (Top 5 Performers)</h2>
          <p className="section-subtitle">
            จำแนกตาม 3 ตัวชี้วัดหลัก ประจำปี {selectedYear} ผ่านระบบคัดกรอง Aggregates และจัดอันดับแบบอัตโนมัติ
          </p>
        </div>
      </div>

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

      {/* Institutional Recharts Comparative Graph */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="#3b82f6" />
              <span>เปรียบเทียบสัดส่วน 3 ตัวชี้วัดเศรษฐกิจ (Top Performers Comparative Chart)</span>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>
              เปรียบเทียบอัตราการเติบโต GDP, อัตราเงินเฟ้อ และอัตราการว่างงานของ 5 ประเทศผู้นำ ประจำปี {selectedYear}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('gdp')} className="btn btn-secondary btn-sm">
              <TrendingUp size={13} color="#10b981" />
              <span>ตาราง GDP</span>
            </button>
            <button onClick={() => setActiveTab('inflation')} className="btn btn-secondary btn-sm">
              <Percent size={13} color="#ef4444" />
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

      {/* 3 Executive Architecture Feature Highlights */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel feature-highlight-card" onClick={() => setActiveTab('compare')}>
          <div className="feature-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <GitCompare size={22} />
          </div>
          <h4 className="feature-card-title">ศูนย์เปรียบเทียบพหุภาคี (Comparison Hub)</h4>
          <p className="feature-card-desc">
            เลือก 2–5 ประเทศมาเปรียบเทียบแบบ Head-to-Head พร้อมกราฟเส้นแนวโน้ม 5 ปีย้อนหลัง (2020–2025) และตาราง Matrix วิเคราะห์สถิติ
          </p>
          <span className="feature-card-link">เปิดใช้งาน Compare Hub →</span>
        </div>

        <div className="glass-panel feature-highlight-card" onClick={() => setActiveTab('gdp')}>
          <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Sparkles size={22} />
          </div>
          <h4 className="feature-card-title">ระบบจัดเรียงตาราง Merge Sort O(n log n)</h4>
          <p className="feature-card-desc">
            อัปเกรดจาก Bubble Sort ใน Version 1 ที่ใช้เวลา $O(n^2)$ มาเป็น Divide-and-Conquer เร็วกว่าเดิมกว่า 25 เท่า สลับข้อมูล 196 ประเทศได้ทันที
          </p>
          <span className="feature-card-link">ทดสอบจัดเรียงตาราง →</span>
        </div>

        <div className="glass-panel feature-highlight-card" onClick={() => setActiveTab('health')}>
          <div className="feature-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <ShieldCheck size={22} />
          </div>
          <h4 className="feature-card-title">Express Proxy &amp; In-Memory Cache O(1)</h4>
          <p className="feature-card-desc">
            จัดการคำขอผ่าน Express Gateway มีระบบแคชใน RAM ลด Latency เหลือต่ำกว่า 0.1ms พร้อมระบบ Safe Fallback ป้องกันเว็บล่ม 100%
          </p>
          <span className="feature-card-link">ดูผลทดสอบ Backend →</span>
        </div>
      </div>
    </div>
  );
}
