import React from 'react';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export default function MetricCard({ title, type, items = [], onAddToCompare }) {
  const getBadgeStyle = (trend, colorClass) => {
    if (colorClass === 'green') {
      return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' };
    }
    return { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' };
  };

  const getEmoji = () => {
    if (type === 'gdp') return '🌱';
    if (type === 'inflation') return '🍓';
    return '💼';
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span>{getEmoji()}</span>
          <span>{title}</span>
        </h3>
        <span style={{ fontSize: '0.72rem', color: '#6366f1', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '3px 9px', borderRadius: '9999px', fontWeight: 700 }}>
          5 อันดับแรก
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
        {items.map((item, idx) => {
          const style = getBadgeStyle(item.trend, item.colorClass);
          const flagUrl = item.iso2 ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png` : null;

          return (
            <div
              key={item.countryCode || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '14px',
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', width: '18px' }}>
                  #{idx + 1}
                </span>
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={item.country}
                    className="flag-img"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{item.country}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    background: style.bg,
                    color: style.text,
                    border: `1px solid ${style.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  {item.trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {item.displayValue || `${item.value}%`}
                </span>

                {onAddToCompare && (
                  <button
                    onClick={() => onAddToCompare(item.countryCode || item.iso2)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '5px', borderRadius: '8px' }}
                    title="เพิ่มเข้าหน้าต่างเปรียบเทียบ"
                  >
                    <Plus size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
