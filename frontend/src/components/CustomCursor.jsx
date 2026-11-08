import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor — Ultra-Smooth Luxury Trailing Cursor (Luxdrive Style)
 * Features:
 * - Instant responsive inner dot (0 input lag for precise clicking)
 * - Buttery-smooth delta-time normalized trailing aura disc (identical physics at 60Hz, 120Hz, 144Hz+)
 * - Organic fluid momentum that glides effortlessly on glass
 * - Soft translucent aura disc matching the website theme
 * - Automatic hover expansion over interactive elements
 * - Clean teardown & auto-hidden on touch/mobile
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isFirstMove = useRef(true);

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
    window.addEventListener('touchstart', onTouchStart, { once: true });

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (isFirstMove.current) {
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        isFirstMove.current = false;
      }

      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Interactive target detection via delegation
    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest(
        'a, button, [role="button"], input, select, textarea, .dice-card, .tm-tile, .choose-us-block, .single-team_item, .plus-button, .floating-back-to-top, .official-brand, .hero-central-card, .floating-badge-box, .btn'
      );
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    // Ultra-smooth delta-time normalized physics loop
    let lastTime = performance.now();
    let animationFrameId;

    const render = (currentTime) => {
      // Calculate delta time in seconds, clamped to avoid jumps during tab switches
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      // 1. Instant dot tracking for zero input lag when clicking/aiming
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      // 2. Buttery-smooth exponential decay easing for trailing follower disc
      // Continuous decay rate k = 5.2 gives a velvety, liquid luxury glide
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
  }, [isVisible]);

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
}
