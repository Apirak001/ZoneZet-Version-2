import React from 'react';
import { AlertCircle, RefreshCw, SearchX, Loader2, Sparkles } from 'lucide-react';

export function LoadingSkeleton({ text = 'กำลังโหลดข้อมูลจาก World Bank API...' }) {
  return (
    <div style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: '#eef2ff',
        marginBottom: '1.25rem',
        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.15)'
      }}>
        <Loader2 size={32} className="spin-animation" color="#4f46e5" />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.45rem' }}>{text}</h3>
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>ระบบกำลังเชื่อมต่อผ่าน Express Proxy พร้อมตรวจสอบ In-Memory Cache O(1) ✨</p>
      
      {/* Cute Skeleton Shimmer Rows */}
      <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
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
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: '#fff1f2',
        color: '#f43f5e',
        marginBottom: '1.25rem',
        boxShadow: '0 8px 20px rgba(244, 63, 94, 0.1)'
      }}>
        <SearchX size={34} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{title} 🌱</h3>
      <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>{message}</p>
      {onReset && (
        <button onClick={onReset} className="btn btn-secondary btn-sm" style={{ borderRadius: '9999px', padding: '0.5rem 1.25rem' }}>
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
      background: '#fff1f2',
      border: '1px solid #fecdd3',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 12px rgba(244, 63, 94, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={24} color="#f43f5e" />
        <div>
          <div style={{ fontWeight: 800, color: '#be123c', fontSize: '0.95rem' }}>ระบบตรวจพบข้อผิดพลาด</div>
          <div style={{ fontSize: '0.86rem', color: '#e11d48' }}>{message} (กำลังใช้งานข้อมูลสำรอง Offline Fallback เพื่อให้ระบบทำงานต่อเนื่อง)</div>
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ borderColor: '#fca5a5', color: '#be123c', background: '#ffffff', borderRadius: '9999px' }}>
          <RefreshCw size={14} />
          <span>ลองใหม่</span>
        </button>
      )}
    </div>
  );
}
