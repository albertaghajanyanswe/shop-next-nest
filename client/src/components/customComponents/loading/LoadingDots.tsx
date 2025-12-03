'use client';
import { memo } from 'react';

interface LoadingDotsProps {
  interval?: number;
  className?: string;
  size?: number;
}

export const LoadingDots = ({
  interval = 300,
  size = 1,
  className,
}: LoadingDotsProps) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <span
        className={`animate-bounceDot1 h-${size} w-${size} rounded-full bg-neutral-700`}
      ></span>
      <span
        className={`animate-bounceDot2 h-${size} w-${size} rounded-full bg-neutral-700`}
      ></span>
      <span
        className={`animate-bounceDot3 h-${size} w-${size} rounded-full bg-neutral-700`}
      ></span>
    </div>
  );
};

export default memo(LoadingDots);
