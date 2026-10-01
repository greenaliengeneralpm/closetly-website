import React from 'react';

interface ClosetlyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ClosetlyLogo: React.FC<ClosetlyLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  // Height presets for the navbar and various contexts
  const heightClasses = {
    sm: 'h-7',
    md: 'h-8.5',
    lg: 'h-10',
  };

  return (
    <div
      className={`inline-flex items-center select-none ${heightClasses[size]} ${className}`}
      title="Closetly"
    >
      <svg
        viewBox="0 0 252 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        aria-label="Closetly logo"
      >
        {/* Left Viewfinder Scanner Frame */}
        {/* Top-Left Bracket */}
        <path
          d="M 6.5 25 L 6.5 17 C 6.5 12.8 9.8 9.5 14 9.5 L 22 9.5"
          stroke="#000000"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Top-Right Bracket */}
        <path
          d="M 36 9.5 L 44 9.5 C 48.2 9.5 51.5 12.8 51.5 17 L 51.5 25"
          stroke="#000000"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom-Left Bracket */}
        <path
          d="M 6.5 39 L 6.5 47 C 6.5 51.2 9.8 54.5 14 54.5 L 22 54.5"
          stroke="#000000"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom-Right Bracket */}
        <path
          d="M 36 54.5 L 44 54.5 C 48.2 54.5 51.5 51.2 51.5 47 L 51.5 39"
          stroke="#000000"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Horizontal viewfinder tick / dash on right side */}
        <rect
          x="54.5"
          y="29.5"
          width="5.5"
          height="4.5"
          rx="2.25"
          fill="#000000"
        />

        {/* Center Black T-Shirt Icon */}
        <path
          d="M 23.5 19 C 25.2 22.8 32.8 22.8 34.5 19 L 41 23.5 L 45.8 29.5 L 41.5 33.8 L 38.5 30.8 L 38.5 43.5 C 38.5 44.8 37.5 45.5 36.2 45.5 L 21.8 45.5 C 20.5 45.5 19.5 44.8 19.5 43.5 L 19.5 30.8 L 16.5 33.8 L 12.2 29.5 L 17 23.5 Z"
          fill="#000000"
        />

        {/* 'Closetly' Wordmark - Clean bold geometric sans matching the uploaded logo */}
        <text
          x="69"
          y="50.5"
          fill="#000000"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="46.5"
          letterSpacing="-1.8px"
        >
          Closetly
        </text>
      </svg>
    </div>
  );
};

