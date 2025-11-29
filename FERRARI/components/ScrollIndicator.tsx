import React from 'react';

interface ScrollIndicatorProps {
  onScroll: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ onScroll }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <button
        onClick={onScroll}
        className="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg p-2 transition-all min-h-[44px] min-w-[44px] justify-center"
        aria-label="Scroll to properties"
      >
        {/* Animated floating line */}
        <div className="relative w-px bg-gradient-to-b from-primary via-accent to-transparent animate-pulse" style={{ height: 'clamp(2rem, 6vw, 3.5rem)' }}></div>
        <span className="text-charcoal-light font-medium group-hover:text-primary transition-colors whitespace-nowrap animate-pulse" style={{ fontSize: 'clamp(0.625rem, 1.8vw, 0.875rem)' }}>
          Explore Properties
        </span>
      </button>
    </div>
  );
};

