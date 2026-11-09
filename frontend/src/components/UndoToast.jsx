import React, { useEffect, useState, useRef } from 'react';
import { RotateCcw, X, CheckCircle2 } from 'lucide-react';

export default function UndoToast({ message, onUndo, onClose, duration = 5000 }) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const elapsedRef = useRef(0);
  const animFrameRef = useRef(null);
  const isPausedRef = useRef(isPaused);

  // Keep isPausedRef in sync with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Handle message changes & progress animation
  useEffect(() => {
    if (!message) {
      setProgress(0);
      elapsedRef.current = 0;
      setIsExiting(false);
      return;
    }

    elapsedRef.current = 0;
    setProgress(0);
    setIsExiting(false);

    let lastTime = performance.now();

    const loop = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (!isPausedRef.current) {
        elapsedRef.current += delta;
        const currentProgress = Math.min(100, (elapsedRef.current / duration) * 100);
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          setIsExiting(true);
          setTimeout(() => {
            if (onClose) onClose();
          }, 240);
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [message, duration, onClose]);

  if (!message) return null;

  const isUndoable = message.includes('ลบ') || message.includes('นำออก') || message.includes('ล้าง');
  const isSuccess = message.includes('กู้คืน') || message.includes('เพิ่ม');

  const handleManualClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 200);
  };

  const handleRollback = (e) => {
    e.stopPropagation();
    if (onUndo) onUndo();
  };

  return (
    <div
      className={`undo-banner ${isExiting ? 'exiting' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="status"
      aria-live="polite"
    >
      <div className="undo-content">
        <div className={`undo-icon-wrap ${isSuccess ? 'success' : ''}`}>
          {isSuccess ? (
            <CheckCircle2 size={16} color="#34d399" />
          ) : (
            <RotateCcw size={15} className="undo-icon-rotate" />
          )}
        </div>

        <div className="undo-text-wrap">
          <span className="undo-message" title={message}>{message}</span>
          <span className="undo-hint">
            {isPaused
              ? 'หยุดเวลาชั่วคราวขณะเลื่อนเมาส์ผ่าน'
              : isUndoable
              ? 'คลิกกู้คืนก่อนแถบเวลาจะเต็ม'
              : 'อัปเดตสถานะสำเร็จ'}
          </span>
        </div>

        {isUndoable && (
          <button
            type="button"
            onClick={handleRollback}
            className="undo-btn-rollback"
            title="คลิกเพื่อยกเลิกและกู้คืนประเทศเดิมกลับมา"
          >
            <RotateCcw size={13} />
            <span>กู้คืน (Rollback)</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleManualClose}
          className="undo-btn-close"
          title="ปิดการแจ้งเตือน"
          aria-label="ปิดการแจ้งเตือน"
        >
          <X size={15} />
        </button>
      </div>

      {/* Progress track filling to 100% */}
      <div className="undo-progress-track">
        <div
          className={`undo-progress-bar ${isSuccess ? 'success' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
