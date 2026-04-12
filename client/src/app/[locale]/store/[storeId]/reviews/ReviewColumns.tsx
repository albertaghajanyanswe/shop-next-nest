import { Button } from '@/components/ui/Button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export interface IReviewColumn {
  id: string;
  createdAt: string;
  rating: string;
  username: string;
}

type TF = (key: string) => string;

export const reviewColumns = (t: TF): ColumnDef<IReviewColumn>[] => [
  {
    accessorKey: 'createdAt',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'createdAt',
    },
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {t('col_created_date')}
        <ArrowUpDown className='ml-2 size-4' />
      </Button>
    ),
  },
  {
    accessorKey: 'rating',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'rating',
    },
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {t('col_rating')}
        <ArrowUpDown className='ml-2 size-4' />
      </Button>
    ),
  },
  {
    accessorKey: 'text',
    meta: {
      className: 'w-[25%]',
      textClassName: 'whitespace-pre-wrap max-w-[350px]',
      sortField: 'text',
    },
    header: () => (
      <Button variant='ghost'>
        {t('col_text')}
        <ArrowUpDown className='ml-2 size-4' />
      </Button>
    ),
  },
  {
    accessorKey: 'username',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'user_name',
    },
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {t('col_username')}
        <ArrowUpDown className='ml-2 size-4' />
      </Button>
    ),
  },
];
