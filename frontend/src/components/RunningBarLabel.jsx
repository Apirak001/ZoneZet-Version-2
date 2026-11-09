import React, { useState, useEffect, memo } from 'react';

/**
 * RunningBarLabel
 * Smooth count-up running number animation displayed on top of Recharts bars.
 * Animates in sync with bar rise animation using requestAnimationFrame with cubic ease-out curve.
 */
const RunningBarLabel = memo(function RunningBarLabel(props) {
  const {
    x = 0,
    y = 0,
    width = 0,
    value,
    type = '',
    color = '#ffffff',
    decimals = 1,
    offset = 8
  } = props;

  const targetNum = typeof value === 'number' ? value : parseFloat(value) || 0;
  const [currentVal, setCurrentVal] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 850;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // High-end cubic ease-out curve for natural, buttery deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      setProgressRatio(ease);
      setCurrentVal(targetNum * ease);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setProgressRatio(1);
        setCurrentVal(targetNum);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetNum]);

  if (value === undefined || value === null || isNaN(targetNum)) return null;

  // Format label string with signs
  let labelText = '';
  if (type === 'gdp') {
    labelText = currentVal > 0 
      ? `+${currentVal.toFixed(decimals)}%` 
      : `${currentVal.toFixed(decimals)}%`;
  } else {
    labelText = `${currentVal.toFixed(decimals)}%`;
  }

  // Calculate centered X position
  const posX = (x || 0) + (width || 0) / 2;

  // Gentle float-up micro-movement (6px) matching bar growth
  const posY = (y || 0) - offset + (1 - progressRatio) * 6;
  const opacity = Math.min(1, progressRatio * 1.8);

  return (
    <text
      x={posX}
      y={posY}
      fill={color}
      textAnchor="middle"
      fontSize={11}
      fontWeight={700}
      fontFamily="var(--font-mono)"
      opacity={opacity}
      style={{
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.85)',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      {labelText}
    </text>
  );
});

export default RunningBarLabel;
