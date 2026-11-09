import React, { useEffect, useRef, useState, memo } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, .dice-card, .tm-tile, .choose-us-block, .single-team_item, .plus-button, .floating-back-to-top, .official-brand, .hero-central-card, .floating-badge-box, .btn';

/**
 * CustomCursor — Ultra-Smooth Luxury Trailing Cursor (Luxdrive Style)
 * Optimized with transient refs to avoid unnecessary React re-renders and listener re-subscriptions.
 */
const CustomCursor = memo(function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isFirstMove = useRef(true);
  const isVisibleRef = useRef(false);
  const isHoveredRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device early
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const onTouchStart = () => setIsTouch(true);
    window.addEventListener('touchstart', onTouchStart, { once: true, passive: true });

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (isFirstMove.current) {
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        isFirstMove.current = false;
      }

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
      }
    };
    const onMouseEnter = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    // Interactive target detection via delegation (only setState when boolean changes)
    const onMouseOver = (e) => {
      const target = e.target;
      const nextHovered = Boolean(target?.closest?.(INTERACTIVE_SELECTOR));
      if (nextHovered !== isHoveredRef.current) {
        isHoveredRef.current = nextHovered;
        setIsHovered(nextHovered);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    // Ultra-smooth delta-time normalized physics loop
    let lastTime = performance.now();
    let animationFrameId;

    const render = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      const smoothFactor = 1 - Math.exp(-5.2 * dt);
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * smoothFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * smoothFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      className={`luxury-cursor-container ${isVisible ? 'is-visible' : ''} ${
        isHovered ? 'is-hovered' : ''
      } ${isClicking ? 'is-clicking' : ''}`}
      aria-hidden="true"
    >
      {/* Smooth Trailing Outer Aura Disc */}
      <div ref={ringRef} className="luxury-cursor-ring">
        <div className="luxury-cursor-ring-inner" />
      </div>

      {/* Instant Center Dot */}
      <div ref={dotRef} className="luxury-cursor-dot">
        <div className="luxury-cursor-dot-inner" />
      </div>
    </div>
  );
});

export default CustomCursor;
