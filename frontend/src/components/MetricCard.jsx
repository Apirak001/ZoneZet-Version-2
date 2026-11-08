import React, { useMemo } from 'react';
import {
  TrendingUp,
  Percent,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight
} from 'lucide-react';
import AnimatedValue from './AnimatedValue';

export default function MetricCard({
  title,
  type = 'gdp',
  items = [],
  onExplore
}) {
  const getIcon = () => {
    switch (type) {
      case 'inflation':
        return <Percent size={16} />;
      case 'unemployment':
        return <Users size={16} />;
      case 'gdp':
      default:
        return <TrendingUp size={16} />;
    }
  };

  const getValueBadgeClass = (trend, colorClass) => {
    if (type === 'gdp') return 'db-value-badge green';
    if (type === 'inflation') return 'db-value-badge red';
    if (type === 'unemployment') return 'db-value-badge blue';
    return colorClass === 'green' ? 'db-value-badge green' : 'db-value-badge red';
  };

  const getRankClass = (idx) => {
    if (idx === 0) return 'db-rank-pill gold';
    if (idx === 1) return 'db-rank-pill silver';
    if (idx === 2) return 'db-rank-pill bronze';
    return 'db-rank-pill';
  };

  const maxVal = useMemo(() => {
    if (!items || items.length === 0) return 10;
    const peak = Math.max(...items.slice(0, 5).map(i => Math.abs(i.value) || 0));
    return peak > 0 ? peak : 10;
  }, [items]);

  return (
    <div className={`db-metric-card theme-${type}`}>
      {/* Header */}
      <div className="db-card-header">
        <div className="db-card-title-wrap">
          <div className={`db-card-icon-badge ${type}`}>
            {getIcon()}
          </div>
          <h3 className="db-card-heading">{title}</h3>
        </div>
        <span className="db-card-top-tag">TOP 5</span>
      </div>

      {/* List of Countries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
        {items.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
            กำลังเชื่อมต่อข้อมูล World Bank...
          </div>
        ) : (
          items.slice(0, 5).map((item, idx) => {
            const flagUrl = item.iso2
              ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png`
              : null;

            return (
              <div key={item.countryCode || idx} className="db-country-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={getRankClass(idx)}>
                    #{idx + 1}
                  </span>
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={item.country}
                      className="db-country-flag"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="db-country-name">{item.country}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div className="db-country-bar-track">
                    <div
                      className={`db-country-bar-fill ${type}`}
                      style={{
                        width: `${Math.min(Math.max((Math.abs(item.value) / maxVal) * 100, 10), 100)}%`
                      }}
                    />
                  </div>
                  <span className={getValueBadgeClass(item.trend, item.colorClass)}>
                    {item.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <AnimatedValue
                      key={`${item.countryCode || idx}-${item.value}`}
                      value={item.displayValue || (item.value !== undefined ? `${item.value}%` : '')}
                      duration={1300}
                      delay={idx * 65}
                    />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Explore full indicator link button */}
      <div className="db-card-footer-explore">
        <button
          type="button"
          onClick={() => onExplore && onExplore(type)}
          className="db-card-explore-btn"
          title={`คลิกเพื่อดูตารางสถิติและกราฟิกฉบับเต็มของ ${title}`}
        >
          <span>เปิดตารางวิเคราะห์ฉบับเต็ม ({type.toUpperCase()})</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
