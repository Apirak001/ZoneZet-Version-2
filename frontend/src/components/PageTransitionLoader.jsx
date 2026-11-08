import React from 'react';

export default function PageTransitionLoader({
  text = 'กำลังโหลดข้อมูล'
}) {
  return (
    <div className="mario-page-loader-overlay">
      <div className="mario-minimal-loader">
        {/* Real Animated GIF (No card border, clean transparent floating Mario) */}
        <img
          src="/img/mario-loading.gif"
          alt="Loading..."
          className="mario-gif-sprite"
        />

        {/* Minimal Animated Text with bouncing dots . . . */}
        <div className="mario-loading-text">
          <span>{text}</span>
          <span className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
