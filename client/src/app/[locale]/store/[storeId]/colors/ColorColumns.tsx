import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { STORE_URL } from '@/config/url.config';
import { IColorColumn } from '@/shared/types/color.interface';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
  Pencil,
} from 'lucide-react';
import Link from 'next/link';

type TF = (key: string) => string;

export const colorColumns = (t: TF): ColumnDef<IColorColumn>[] => [
  {
    accessorKey: 'name',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'name',
    },
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {t('col_name')}
        <ArrowUpDown className='ml-2 size-4' />
      </Button>
    ),
  },
  {
    accessorKey: 'value',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
    },
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {t('col_value')}
        <ArrowUpDown className='ml-2 size-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-x-3'>
        <div
          className='size-5 rounded-full border'
          style={{ backgroundColor: row.original.value }}
        />
        {row.original.value}
      </div>
    ),
  },
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
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <MoreHorizontal className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>{t('action')}</DropdownMenuLabel>
          <Link
            href={STORE_URL.colorEdit(row.original.storeId, row.original.id)}
          >
            <DropdownMenuItem>
              <ExternalLink className='mr-2 size-4' />
              {t('color_page')}
            </DropdownMenuItem>
          </Link>
          <Link
            href={STORE_URL.colorEdit(row.original.storeId, row.original.id)}
          >
            <DropdownMenuItem>
              <Pencil className='mr-2 size-4' />
              {t('edit_color')}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
