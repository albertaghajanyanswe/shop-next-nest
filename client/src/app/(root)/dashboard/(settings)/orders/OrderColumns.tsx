import { Button } from '@/components/ui/Button';
import { formatDateWithHour } from '@/utils/formateDate';
import { formatPrice } from '@/utils/formatPrice';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export interface IOrderColumns {
  id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  type: string;
  itemsCount: number;
  itemsNames: string;
}

export const orderColumns: ColumnDef<IOrderColumns>[] = [
  {
    accessorKey: 'id',
    meta: {
      className: '',
      textClassName: 'max-w-[100px]',
      sortField: 'id',
    },

    header: ({ column }) => {
      return (
        <Button
          className='p-0 px-0 has-[>svg]:px-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Order number
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className='truncate overflow-hidden text-ellipsis whitespace-nowrap'>
          {row.original.id}
        </p>
      );
    },
  },
  {
    accessorKey: 'itemsCount',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
    },
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='p-0 px-0 has-[>svg]:px-0'>
          Count
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.itemsCount;
    },
  },
  {
    accessorKey: 'itemsNames',
    meta: {
      textClassName: 'text-wrap text-xs',
    },
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='p-0 px-0 has-[>svg]:px-0'>
          Items Names
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.itemsNames;
    },
  },
  {
    accessorKey: 'type',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
    },
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='p-0 px-0 has-[>svg]:px-0'>
          Type
        </Button>
      );
    },
  },

  {
    accessorKey: 'status',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'status',
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0 px-0 has-[>svg]:px-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
  },

  {
    accessorKey: 'totalPrice',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'totalPrice',
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0 px-0 has-[>svg]:px-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return formatPrice(row.original.totalPrice);
    },
  },
  {
    accessorKey: 'createdAt',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'createdAt',
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0 px-0 has-[>svg]:px-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created date
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{formatDateWithHour(new Date(row.original.createdAt))}</p>;
    },
  },
];
