import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  ArrowRight,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { fetchCountriesDirectory } from '../services/api';

const COUNTRY_COLORS = [
  '#34d399', // Emerald
  '#38bdf8', // Sky Blue
  '#f43f5e', // Coral Flame Red
  '#fbbf24', // Amber Gold
  '#c084fc'  // Royal Violet
];

export default function CompareFloatingDock({
  comparedList = [],
  onRemoveFromCompare,
  onClearAll,
  onOpenCompareModal,
  onNavigateToCompare
}) {
  const [countriesMap, setCountriesMap] = useState({});
  const [isMinimized, setIsMinimized] = useState(false);

  // Load directory once to resolve full country names and flag iso2 codes
  useEffect(() => {
    let isMounted = true;
    fetchCountriesDirectory()
      .then((res) => {
        if (isMounted && res.data) {
          const map = {};
          res.data.forEach((c) => {
            if (c.code) {
              map[c.code.toUpperCase()] = c;
            }
          });
          setCountriesMap(map);
        }
      })
      .catch((err) => console.warn('Directory cache error in floating dock:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  if (!comparedList || comparedList.length === 0) return null;

  const count = comparedList.length;
  const remainingSlots = Math.max(0, 5 - count);

  // If user minimized the bar to a compact pill
  if (isMinimized) {
    return (
      <aside
        className="compare-dock-minimized-pill"
        aria-label="แถบเปรียบเทียบข้อมูลย่อส่วน"
      >
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="compare-dock-mini-expand-btn"
          title="คลิกเพื่อขยายแถบเปรียบเทียบ"
        >
          <GitCompare size={15} color="#c084fc" />
          <span>ชุดเปรียบเทียบ ({count}/5)</span>
          <ChevronUp size={14} color="#a855f7" />
        </button>

        <button
          type="button"
          onClick={onOpenCompareModal}
          className="compare-dock-mini-go-btn"
          title="เปิดกราฟเปรียบเทียบในหน้านี้ทันที"
        >
          <span>ดูผลเปรียบเทียบ</span>
          <ArrowRight size={13} />
        </button>
      </aside>
    );
  }

  return (
    <aside
      className="compare-floating-dock-container"
      aria-label="แถบเครื่องมือเปรียบเทียบข้อมูลพหุภาคี"
    >
      <div className="compare-floating-dock-inner">
        {/* Left: Indicator Title & Clear Destination Hint */}
        <div className="compare-dock-left">
          <div className="compare-dock-icon-circle">
            <GitCompare size={18} color="#c084fc" />
          </div>
          <div className="compare-dock-text-col">
            <div className="compare-dock-title-wrap">
              <span className="compare-dock-title">ชุดเปรียบเทียบพหุภาคี</span>
              <span className="compare-dock-count-badge">
                {count} / 5 ประเทศ
              </span>
            </div>
            <p className="compare-dock-subtitle">
              เลือกสะสมได้จากทุกหน้า ข้อมูลจะถูกส่งไปยัง <strong>[ศูนย์เปรียบเทียบ]</strong>
            </p>
          </div>
        </div>

        {/* Center: Selected Countries Chips Deck */}
        <div className="compare-dock-center">
          <div className="compare-dock-chips-wrap">
            {comparedList.map((code, idx) => {
              const cleanCode = code ? code.toUpperCase() : '';
              const profile = countriesMap[cleanCode] || { name: cleanCode, iso2: cleanCode.toLowerCase() };
              const color = COUNTRY_COLORS[idx % COUNTRY_COLORS.length];
              const flagUrl = profile.iso2
                ? `https://flagcdn.com/w40/${profile.iso2.toLowerCase()}.png`
                : null;

              return (
                <div
                  key={cleanCode}
                  className="compare-dock-chip"
                  style={{
                    borderColor: `${color}60`,
                    boxShadow: `0 2px 10px ${color}20`
                  }}
                  title={`${profile.name || cleanCode} (${cleanCode})`}
                >
                  <span
                    className="compare-dock-chip-dot"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt={profile.name || cleanCode}
                      className="compare-dock-chip-flag"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="compare-dock-chip-code">{cleanCode}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveFromCompare && onRemoveFromCompare(cleanCode)}
                    className="compare-dock-chip-remove"
                    title={`นำ ${cleanCode} ออกจากชุดเปรียบเทียบ`}
                    aria-label={`นำ ${cleanCode} ออก`}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}

            {/* Remaining Slot Hint */}
            {remainingSlots > 0 && (
              <div className="compare-dock-empty-slot" title={`สามารถเลือกเพิ่มได้อีก ${remainingSlots} ประเทศ`}>
                <span>+ ว่าง {remainingSlots} ช่อง</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions & Primary Navigation CTA */}
        <div className="compare-dock-right">
          {/* Clear All Button */}
          <button
            type="button"
            onClick={onClearAll}
            className="compare-dock-clear-btn"
            title="ล้างรายชื่อประเทศทั้งหมดที่เลือกไว้"
          >
            <Trash2 size={13} />
            <span className="hide-on-mobile">ล้างทั้งหมด</span>
          </button>

          {/* Primary In-Page Comparison CTA (Never Jumps Page!) */}
          <button
            type="button"
            onClick={onOpenCompareModal}
            className="compare-dock-cta-btn"
            title="คลิกเพื่อเปิดหน้าต่างเปรียบเทียบในหน้านี้ทันที ไม่เปลี่ยนหน้า"
          >
            <div className="compare-dock-cta-content">
              <span className="compare-dock-cta-label">
                📊 ดูผลเปรียบเทียบทันที ({count} ชาติ)
              </span>
              <span className="compare-dock-cta-dest">
                วิเคราะห์กราฟในหน้านี้ (ไม่เปลี่ยนหน้า)
              </span>
            </div>
            <div className="compare-dock-cta-arrow-circle">
              <ArrowRight size={15} />
            </div>
          </button>

          {/* Minimize toggle */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="compare-dock-toggle-btn"
            title="ย่อแถบเปรียบเทียบลงชั่วคราว"
            aria-label="ย่อแถบเปรียบเทียบ"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
