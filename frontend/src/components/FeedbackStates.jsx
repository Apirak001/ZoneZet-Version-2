import React from 'react';
import { AlertCircle, RefreshCw, SearchX } from 'lucide-react';

export function LoadingSkeleton({ text = 'กำลังโหลดข้อมูล' }) {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <img
          src="/img/mario-loading.gif"
          alt="Loading..."
          className="mario-gif-sprite"
          style={{ width: '180px' }}
        />
        <div className="mario-loading-text">
          <span>{text}</span>
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
      
      {/* Skeleton Rows */}
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              height: '46px',
              borderRadius: '6px',
              background: 'linear-gradient(90deg, #0d1527 25%, #16223b 50%, #0d1527 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeletonShimmer 1.5s infinite',
              border: '1px solid #1e293b'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  title = 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข',
  message = 'กรุณาปรับคำค้นหา หรือรีเซ็ตตัวกรองภูมิภาค',
  onReset,
  buttonText = 'รีเซ็ตตัวกรองการค้นหา'
}) {
  return (
    <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }} className="glass-panel">
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        borderRadius: '8px',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        color: '#f87171',
        marginBottom: '1rem'
      }}>
        <SearchX size={28} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>{message}</p>
      {onReset && (
        <button onClick={onReset} className="btn btn-secondary btn-sm" style={{ borderRadius: '6px', padding: '0.45rem 1.15rem' }}>
          <RefreshCw size={13} />
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
}

export function ErrorBanner({ message = 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก API', onRetry }) {
  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '6px',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} color="#f87171" style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f87171' }}>การเชื่อมต่อขัดข้อง</div>
          <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>{message}</div>
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-danger btn-sm">
          <RefreshCw size={12} />
          <span>ลองใหม่อีกครั้ง</span>
        </button>
      )}
    </div>
  );
}
