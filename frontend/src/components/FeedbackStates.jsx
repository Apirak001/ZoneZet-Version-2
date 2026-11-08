import React from 'react';
import { AlertCircle, RefreshCw, SearchX, Loader2 } from 'lucide-react';

export function LoadingSkeleton({ text = 'กำลังโหลดข้อมูลจาก World Bank API...' }) {
  return (
    <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <Loader2 size={36} className="spin-animation" color="#6366f1" />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f3f4f6', marginBottom: '0.5rem' }}>{text}</h3>
      <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>ระบบกำลังเชื่อมต่อผ่าน Express Proxy พร้อมตรวจสอบ In-Memory Cache</p>
      
      {/* Skeleton Rows */}
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              height: '48px',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeletonShimmer 1.5s infinite'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title = 'ไม่พบข้อมูลที่ค้นหา', message = 'ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองภูมิภาค', onReset }) {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }} className="glass-panel">
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#f87171',
        marginBottom: '1rem'
      }}>
        <SearchX size={32} />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f3f4f6', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{message}</p>
      {onReset && (
        <button onClick={onReset} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} />
          <span>ล้างตัวกรองและค้นหาใหม่</span>
        </button>
      )}
    </div>
  );
}

export function ErrorBanner({ message = 'เกิดข้อผิดพลาดในการโหลดข้อมูล', onRetry }) {
  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={22} color="#f87171" />
        <div>
          <div style={{ fontWeight: 600, color: '#fca5a5' }}>ระบบตรวจพบข้อผิดพลาด</div>
          <div style={{ fontSize: '0.85rem', color: '#f87171' }}>{message} (กำลังใช้งานข้อมูลสำรอง Offline Fallback เพื่อให้ระบบทำงานต่อเนื่อง)</div>
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ borderColor: 'rgba(239,68,68,0.5)' }}>
          <RefreshCw size={14} />
          <span>ลองใหม่</span>
        </button>
      )}
    </div>
  );
}
