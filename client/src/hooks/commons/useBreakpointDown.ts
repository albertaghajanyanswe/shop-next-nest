import { Breakpoint, BREAKPOINTS } from './useBreakpoint';
import { useBreakpoint } from './useBreakpoint';

export function useBreakpointDown(bp: Breakpoint): boolean {
  const { width } = useBreakpoint();
  if (width === null) return false;

  return width < BREAKPOINTS[bp];
}
