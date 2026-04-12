import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Filters');
  return (
    <Button
      className='group flex w-full items-center justify-start p-0 text-red-500 hover:text-red-600 hover:no-underline'
      variant='link'
      onClick={() => selectedCount > 0 && resetFilter(filterKey)}
    >
      {t('reset_filter')}
      <Badge
        variant='outline'
        className='bg-shop-white text-shop-muted-text-6 border-red-200 font-medium group-hover:border-red-400'
      >
        {t('selected', { count: selectedCount })}
      </Badge>
    </Button>
  );
};
