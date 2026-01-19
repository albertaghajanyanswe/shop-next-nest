import { useBreakpointDown } from './useBreakpointDown';

export function useIsMobile() {
  return useBreakpointDown('md');
}
