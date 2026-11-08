import React from 'react';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export default function MetricCard({ title, type, items = [], onAddToCompare }) {
  const getBadgeClass = (trend, colorClass) => {
    return colorClass === 'green' ? 'value-badge green' : 'value-badge red';
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
          {title}
        </h3>
        <span style={{ fontSize: '0.68rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
          TOP 5
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
        {items.map((item, idx) => {
          const flagUrl = item.iso2 ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png` : null;

          return (
            <div
              key={item.countryCode || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.75rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                transition: 'background 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', width: '16px', fontFamily: 'var(--font-mono)' }}>
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
                <span style={{ fontWeight: 600, fontSize: '0.86rem', color: '#f8fafc' }}>{item.country}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className={getBadgeClass(item.trend, item.colorClass)}>
                  {item.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {item.displayValue || `${item.value}%`}
                </span>

                {onAddToCompare && (
                  <button
                    onClick={() => onAddToCompare(item.countryCode || item.iso2)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '3px 6px', borderRadius: '4px' }}
                    title="เพิ่มเข้าการเปรียบเทียบ"
                  >
                    <Plus size={12} />
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
