import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedValue Component
 * Smooth count-up running number animation ("ตัวเลขวิ่ง")
 * Formats integers, decimals (e.g. 19.3%, 42.2%), +/- signs, and units cleanly.
 */
export default function AnimatedValue({
  value,
  duration = 1400,
  delay = 0,
  className = ''
}) {
  const [displayStr, setDisplayStr] = useState('');
  const prevTargetRef = useRef(null);

  useEffect(() => {
    const rawStr = String(value ?? '').trim();
    if (!rawStr) {
      setDisplayStr('0');
      return;
    }

    // Match prefix (like "+", "$"), number with optional decimals/negatives, and suffix (like "%")
    const match = rawStr.match(/^([^\d\-+]*)([-+]?\d*(?:\.\d+)?)([^\d]*)$/);
    let prefix = '';
    let suffix = '';
    let targetNum = 0;
    let decimals = 1;

    if (match && match[2]) {
      prefix = match[1] || '';
      let numStr = match[2];
      suffix = match[3] || '';

      if (numStr.startsWith('+')) {
        prefix = prefix + '+';
        numStr = numStr.slice(1);
      }

      targetNum = parseFloat(numStr) || 0;
      const dotIdx = numStr.indexOf('.');
      decimals = dotIdx !== -1 ? Math.min(numStr.length - dotIdx - 1, 2) : 0;
    } else {
      targetNum = parseFloat(rawStr) || 0;
      suffix = rawStr.replace(/[\d.\-+]/g, '');
    }

    let frameId;
    let timerId;
    let startTimestamp = null;
    const startNum = 0;

    const startAnimation = () => {
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);

        // High-end cubic ease-out curve for natural deceleration
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = startNum + (targetNum - startNum) * ease;

        const formattedNum = decimals > 0 
          ? currentVal.toFixed(decimals) 
          : Math.round(currentVal).toString();

        setDisplayStr(`${prefix}${formattedNum}${suffix}`);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          // Final snap to target string
          setDisplayStr(rawStr);
          prevTargetRef.current = targetNum;
        }
      };

      frameId = requestAnimationFrame(step);
    };

    if (delay > 0) {
      timerId = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value, duration, delay]);

  return (
    <span className={`animated-num-run ${className}`}>
      {displayStr || value}
    </span>
  );
}
