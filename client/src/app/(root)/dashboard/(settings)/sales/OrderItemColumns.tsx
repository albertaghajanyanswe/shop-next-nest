import { Button } from '@/components/ui/Button';
import { formatDateWithHour } from '@/utils/formateDate';
import { formatPrice } from '@/utils/formatPrice';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export interface IOrderItemColumns {
  id: string;
  createdAt: string;
  status: string;
  price: number;
  quantity: number;
}

export const OrderItemColumns: ColumnDef<IOrderItemColumns>[] = [
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
    accessorKey: 'status',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'order_status',
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
    accessorKey: 'price',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'price',
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0 px-0 has-[>svg]:px-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total price
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return formatPrice(row.original.price);
    },
  },
  {
    accessorKey: 'quantity',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'quantity',
    },
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='p-0 px-0 has-[>svg]:px-0'>
          Quantity
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.quantity;
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
