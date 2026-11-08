import React from 'react';
import { RotateCcw, X } from 'lucide-react';

export default function UndoToast({ message, onUndo, onClose }) {
  if (!message) return null;

  return (
    <div className="undo-banner">
      <span style={{ fontSize: '0.9rem', color: '#f3f4f6' }}>{message}</span>
      <button
        onClick={onUndo}
        className="btn btn-primary btn-sm"
        style={{ padding: '0.35rem 0.75rem', gap: '4px' }}
      >
        <RotateCcw size={13} />
        <span>กู้คืน (Undo)</span>
      </button>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
