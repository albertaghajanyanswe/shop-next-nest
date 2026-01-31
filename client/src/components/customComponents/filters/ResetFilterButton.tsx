import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ResetFilterButtonProps {
  filterKey: string;
  resetFilter: (field: string) => void;
  selectedCount: number;
}
export const ResetFilterButton = ({
  resetFilter,
  filterKey,
  selectedCount = 0,
}: ResetFilterButtonProps) => {
  return (
    <Button
      className='group flex w-full items-center justify-start p-0 text-red-500 hover:text-red-600 hover:no-underline'
      variant='link'
      onClick={() => selectedCount > 0 && resetFilter(filterKey)}
    >
      {/* Reset Filter <span className='text-[12px]'>({selectedCount} selected)</span> */}
      Reset Filter
      <Badge
        variant='outline'
        className='border-red-200 bg-white font-medium text-neutral-600 group-hover:border-red-400'
      >
        {selectedCount} selected
      </Badge>
    </Button>
  );
};
