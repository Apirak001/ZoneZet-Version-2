import React from 'react';
import { Bookmark, Trash2, RotateCcw, GitCompare, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bookmark size={22} color="#f59e0b" />
            <span>รายการสถิติที่บันทึกไว้ (Watchlist & Records)</span>
          </h1>
          <p className="page-subtitle">
            บันทึกชุดข้อมูลประเทศสำหรับติดตามสภาวะเศรษฐกิจ พร้อมกลไกกู้คืนประวัติด้วยโครงสร้างข้อมูล Stack (LIFO)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {hasUndo && (
            <button
              onClick={onUndoLastRemove}
              className="btn btn-secondary btn-sm"
              style={{ borderColor: '#3b82f6', color: '#60a5fa' }}
            >
              <RotateCcw size={13} />
              <span>กู้คืนรายการล่าสุด (Undo Stack)</span>
            </button>
          )}

          {watchlist.length > 0 && (
            <button
              onClick={onCompareAll}
              className="btn btn-primary btn-sm"
            >
              <GitCompare size={14} />
              <span>ส่งไปวิเคราะห์ใน Compare Hub</span>
            </button>
          )}
        </div>
      </div>

      {watchlist.length === 0 ? (
        <EmptyState
          title="ไม่มีข้อมูลใน Watchlist"
          message="ท่านสามารถคลิกไอคอน Bookmark ในหน้ารายการสถิติเพื่อบันทึกประเทศที่ต้องการติดตาม"
          onReset={() => setActiveTab('home')}
        />
      ) : (
        <div className="glass-panel" style={{ padding: '0.25rem' }}>
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
              รายการที่บันทึกทั้งหมด <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{watchlist.length}</strong> ประเทศ
            </span>
            <span style={{ fontSize: '0.72rem', color: '#60a5fa', background: 'rgba(37,99,235,0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, border: '1px solid rgba(37,99,235,0.25)', fontFamily: 'var(--font-mono)' }}>
              โครงสร้างข้อมูล: Stack LIFO
            </span>
          </div>

          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <modern-table className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>ประเทศ (Country)</th>
                  <th>รหัส (ISO)</th>
                  <th>ภูมิภาค (Region)</th>
                  <th>ค่าสถิติที่บันทึก</th>
                  <th>รอบปีข้อมูล</th>
                  <th style={{ textAlign: 'center', width: '100px' }}>นำออก</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((item, index) => {
                  const flagUrl = item.iso2 ? `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png` : null;
                  return (
                    <tr key={item.countryCode || index}>
                      <td style={{ color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{index + 1}</td>
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
                      <td style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.countryCode}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '3px', color: '#cbd5e1' }}>
                          {item.region || 'Other'}
                        </span>
                      </td>
                      <td>
                        <span className={`value-badge ${item.colorClass || 'green'}`}>
                          {item.trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {item.displayValue || `${item.value}%`}
                        </span>
                      </td>
                      <td style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{item.year || '2025'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => onRemoveFromWatchlist(item.countryCode)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)' }}
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
