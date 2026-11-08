import React from 'react';
import { RotateCcw, X } from 'lucide-react';

export default function UndoToast({ message, onUndo, onClose }) {
  if (!message) return null;

  return (
    <div className="undo-banner">
      <span style={{ fontSize: '0.84rem', color: '#f8fafc', fontWeight: 500 }}>{message}</span>
      <button
        onClick={onUndo}
        className="btn btn-primary btn-sm"
        style={{ padding: '0.3rem 0.75rem', gap: '4px', borderRadius: '4px' }}
      >
        <RotateCcw size={12} />
        <span>กู้คืน (Rollback)</span>
      </button>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', padding: '2px' }}
        title="ปิดการแจ้งเตือน"
      >
        <X size={15} />
      </button>
    </div>
  );
}
