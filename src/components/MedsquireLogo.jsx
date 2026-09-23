import React from 'react';

export default function MedsquireLogo({ size = 36, showText = true, fontSize = '1.3rem' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Official Medsquire Tech Logo Symbol */}
      <div 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          position: 'relative',
          filter: 'drop-shadow(0 0 10px rgba(10, 132, 255, 0.4))',
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* Main Ribbon Stroke */}
          <path 
            d="M 42 36 L 80 36 L 36 60 L 76 60 L 32 84" 
            stroke="#0A84FF" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Top Cyan Accent Dot */}
          <circle cx="75" cy="18" r="9.5" fill="#00C7B5" />
        </svg>
      </div>

      {showText && (
        <span 
          style={{ 
            fontFamily: 'Outfit, sans-serif', 
            fontWeight: 900, 
            fontSize: fontSize, 
            letterSpacing: '1px',
            color: '#FFFFFF',
            lineHeight: 1.1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          Medsquire{' '}
          <span 
            style={{ 
              background: 'linear-gradient(135deg, #00C7B5, #0A84FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 15px rgba(0, 199, 181, 0.3)'
            }}
          >
            Technologies
          </span>
        </span>
      )}
    </div>
  );
}
