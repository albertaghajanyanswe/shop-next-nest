'use client';

import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type ViewMode = 'table' | 'card';

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <div className='flex items-center rounded-md border'>
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size='sm'
        className='rounded-r-none px-2.5'
        onClick={() => onToggle('table')}
        title='Table view'
      >
        <List className='size-4' />
      </Button>
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size='sm'
        className='rounded-l-none px-2.5'
        onClick={() => onToggle('card')}
        title='Card view'
      >
        <LayoutGrid className='size-4' />
      </Button>
    </div>
  );
}
