import React from 'react';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export default function MetricCard({ title, type, items = [], onSelectCountry, onAddToCompare }) {
  const getBadgeStyle = (trend, colorClass) => {
    if (colorClass === 'green') {
      return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
    }
    return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h3>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
          TOP 5
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
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
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                transition: 'background 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', width: '18px' }}>
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
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.country}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: style.bg,
                    color: style.text,
                    border: `1px solid ${style.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  {item.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {item.displayValue || `${item.value}%`}
                </span>

                {onAddToCompare && (
                  <button
                    onClick={() => onAddToCompare(item.countryCode || item.iso2)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px', borderRadius: '4px' }}
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
