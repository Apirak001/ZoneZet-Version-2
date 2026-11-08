import React from 'react';
import { Bookmark, Trash2, RotateCcw, Scale, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { EmptyState } from './FeedbackStates';

export default function WatchlistRecordView({
  watchlist = [],
  onRemoveFromWatchlist,
  onUndoLastRemove,
  hasUndo,
  onCompareAll,
  setActiveTab
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Bookmark size={28} color="#f59e0b" />
            <span>รายการที่บันทึกไว้ (Watchlist & Records) ⭐</span>
          </h1>
          <p className="page-subtitle">
            รวมรายการประเทศที่ปักหมุดไว้สำหรับติดตาม พร้อมระบบกู้คืนประวัติด้วยโครงสร้างข้อมูล Stack (LIFO)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {hasUndo && (
            <button
              onClick={onUndoLastRemove}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: '#818cf8', color: '#4338ca', background: '#eef2ff', borderRadius: '9999px' }}
            >
              <RotateCcw size={14} />
              <span>กู้คืนรายการล่าสุด (Undo Stack)</span>
            </button>
          )}

          {watchlist.length > 0 && (
            <button
              onClick={onCompareAll}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '9999px' }}
            >
              <Scale size={14} />
              <span>ส่งไปเปรียบเทียบใน Compare Hub</span>
            </button>
          )}
        </div>
      </div>

      {watchlist.length === 0 ? (
        <EmptyState
          title="ยังไม่มีประเทศที่บันทึกไว้ใน Watchlist"
          message="ท่านสามารถกดไอคอน Bookmark ในหน้ารายการ GDP, Inflation หรือ Unemployment เพื่อบันทึกประเทศที่ต้องการติดตาม"
          onReset={() => setActiveTab('home')}
        />
      ) : (
        <div className="glass-panel" style={{ padding: '0.5rem' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              มีทั้งหมด <strong style={{ color: '#0f172a' }}>{watchlist.length}</strong> ประเทศที่บันทึกไว้
            </span>
            <span style={{ fontSize: '0.75rem', color: '#4338ca', background: '#eef2ff', padding: '3px 10px', borderRadius: '9999px', fontWeight: 700, border: '1px solid #c7d2fe' }}>
              จัดการด้วย DSA Stack LIFO
            </span>
          </div>

          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <modern-table className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ลำดับ</th>
                  <th>ประเทศ (Country)</th>
                  <th>รหัส (ISO)</th>
                  <th>ภูมิภาค (Region)</th>
                  <th>ค่าสถิติที่บันทึก</th>
                  <th>ปีข้อมูล</th>
                  <th style={{ textAlign: 'center', width: '120px' }}>นำออก</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((item, index) => {
                  const flagUrl = item.iso2 ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png` : null;
                  return (
                    <tr key={item.countryCode || index}>
                      <td style={{ color: '#94a3b8', fontWeight: 700 }}>#{index + 1}</td>
                      <td>
                        <div className="country-cell">
                          {flagUrl && (
                            <img
                              src={flagUrl}
                              alt={item.country}
                              className="flag-img"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <span>{item.country}</span>
                        </div>
                      </td>
                      <td style={{ color: '#64748b', fontFamily: 'monospace', fontWeight: 600 }}>{item.countryCode}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '3px 9px', borderRadius: '9999px', color: '#475569', fontWeight: 600 }}>
                          {item.region || 'Other'}
                        </span>
                      </td>
                      <td>
                        <span className={`value-badge ${item.colorClass || 'green'}`}>
                          {item.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {item.displayValue || `${item.value}%`}
                        </span>
                      </td>
                      <td style={{ color: '#64748b', fontWeight: 600 }}>{item.year || '2025'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => onRemoveFromWatchlist(item.countryCode)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#be123c', background: '#fff1f2', borderColor: '#fecdd3', borderRadius: '8px' }}
                          title="ลบออกจาก Watchlist (สามารถ Undo ได้)"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </modern-table>
          </div>
        </div>
      )}
    </div>
  );
}
