import { TooltipProvider } from '@/components/ui/Tooltip';

export function CustomTooltipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TooltipProvider delayDuration={50}>{children}</TooltipProvider>;
}
