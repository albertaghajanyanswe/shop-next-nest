'use client';

import { useEffect, useState } from 'react';

export type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const BREAKPOINTS: Record<Breakpoint, number> = {
  xxs: 0,
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

function getBreakpoint(width: number): Breakpoint {
  return (Object.entries(BREAKPOINTS)
    .reverse()
    .find(([, value]) => width >= value)?.[0] ?? 'xs') as Breakpoint;
}

/**
 * Основной хук
 */
export function useBreakpoint() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryLists = Object.entries(BREAKPOINTS).map(([, minWidth]) =>
      window.matchMedia(`(min-width: ${minWidth}px)`)
    );

    const update = () => setWidth(window.innerWidth);

    update();

    mediaQueryLists.forEach((mq) => mq.addEventListener('change', update));

    return () =>
      mediaQueryLists.forEach((mq) => mq.removeEventListener('change', update));
  }, []);

  const breakpoint = width !== null ? getBreakpoint(width) : null;

  return {
    width,
    breakpoint,

    isXxs: breakpoint === 'xxs',
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2xl: breakpoint === '2xl',

    isMobile:
      breakpoint === 'xxs' || breakpoint === 'xs' || breakpoint === 'sm',
  };
}
