import { Button } from '@/components/ui/Button';
import { ColumnSortableHeader } from '@/components/ui/dataLoading/ColumnSortableHeader';
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
  itemName: string;
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
        <ColumnSortableHeader
          label='Order number'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          column={column}
          showSortIcon
        />
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
    accessorKey: 'itemName',
    meta: {
      textClassName: 'text-wrap text-xs',
    },
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='p-0 px-0 has-[>svg]:px-0'>
          Name
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.itemName;
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
        <ColumnSortableHeader
          label='Status'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          column={column}
          showSortIcon
        />
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
        <ColumnSortableHeader
          label='Price'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          column={column}
          showSortIcon
        />
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
        <ColumnSortableHeader
          label='Created date'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          column={column}
          showSortIcon
        />
      );
    },
    cell: ({ row }) => {
      return <p>{formatDateWithHour(new Date(row.original.createdAt))}</p>;
    },
  },
];
