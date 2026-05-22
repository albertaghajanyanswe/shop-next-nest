'use client';

import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export type ViewMode = 'table' | 'card';

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  const t = useTranslations('ViewToggle');
  return (
    <div className='flex items-center rounded-md border'>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size='sm'
        className='rounded-r-none px-2.5'
        onClick={() => onToggle('table')}
        title={t('table_view')}
      >
        <List className='size-4' />
      </Button>
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size='sm'
        className='rounded-l-none px-2.5'
        onClick={() => onToggle('card')}
        title={t('card_view')}
      >
        <LayoutGrid className='size-4' />
      </Button>
    </div>
  );
}
