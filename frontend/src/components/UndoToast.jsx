import React from 'react';
import { RotateCcw, X, Sparkles } from 'lucide-react';

export default function UndoToast({ message, onUndo, onClose }) {
  if (!message) return null;

  return (
    <div className="undo-banner">
      <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>{message}</span>
      <button
        onClick={onUndo}
        className="btn btn-primary btn-sm"
        style={{ padding: '0.38rem 0.85rem', gap: '5px', borderRadius: '9999px' }}
      >
        <RotateCcw size={13} />
        <span>กู้คืน (Undo)</span>
      </button>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', padding: '4px' }}
        title="ปิดแจ้งเตือน"
      >
        <X size={16} />
      </button>
    </div>
  );
}
