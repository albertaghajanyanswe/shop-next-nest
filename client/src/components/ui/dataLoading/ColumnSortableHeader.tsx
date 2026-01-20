import { Button } from '@/components/ui/Button';
import { ArrowUpDown } from 'lucide-react';
import { Column } from '@tanstack/react-table';

interface ColumnSortableHeaderProps<T> {
  label: string;
  column: Column<T, unknown>;
  onClick?: () => void;
  showSortIcon?: boolean;
}

export function ColumnSortableHeader<T>({
  label,
  column,
  onClick,
  showSortIcon = true,
}: ColumnSortableHeaderProps<T>) {
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    column.toggleSorting(column.getIsSorted() === 'asc');
  };

  return (
    <Button
      variant='ghost'
      className='p-0 px-0 has-[>svg]:px-0'
      onClick={handleClick}
    >
      {label}
      {showSortIcon && <ArrowUpDown className='ml-2 size-4' />}
    </Button>
  );
}
