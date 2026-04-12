import { Button } from '@/components/ui/Button';
import { ColumnSortableHeader } from '@/components/ui/dataLoading/ColumnSortableHeader';
import { formatDateWithHour } from '@/utils/formateDate';
import { formatPrice } from '@/utils/formatPrice';
import { ColumnDef } from '@tanstack/react-table';

export interface IOrderItemColumns {
  id: string;
  createdAt: string;
  status: string;
  price: number;
  quantity: number;
  itemName: string;
}

type TF = (key: string) => string;

export const OrderItemColumns = (t: TF): ColumnDef<IOrderItemColumns>[] => [
  {
    accessorKey: 'id',
    meta: {
      className: '',
      textClassName: 'max-w-[100px]',
      sortField: 'id',
    },
    header: ({ column }) => (
      <ColumnSortableHeader
        label={t('col_order_number')}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        column={column}
        showSortIcon
      />
    ),
    cell: ({ row }) => (
      <p className='truncate overflow-hidden text-ellipsis whitespace-nowrap'>
        {row.original.id}
      </p>
    ),
  },
  {
    accessorKey: 'itemName',
    meta: {
      textClassName: 'text-wrap text-xs',
    },
    header: () => (
      <Button variant='ghost' className='p-0 px-0 has-[>svg]:px-0'>
        {t('col_name')}
      </Button>
    ),
    cell: ({ row }) => row.original.itemName,
  },
  {
    accessorKey: 'status',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'order_status',
    },
    header: ({ column }) => (
      <ColumnSortableHeader
        label={t('col_status')}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        column={column}
        showSortIcon
      />
    ),
  },
  {
    accessorKey: 'price',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'price',
    },
    header: ({ column }) => (
      <ColumnSortableHeader
        label={t('col_price')}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        column={column}
        showSortIcon
      />
    ),
    cell: ({ row }) => formatPrice(row.original.price),
  },
  {
    accessorKey: 'quantity',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'quantity',
    },
    header: () => (
      <Button variant='ghost' className='p-0 px-0 has-[>svg]:px-0'>
        {t('col_quantity')}
      </Button>
    ),
    cell: ({ row }) => row.original.quantity,
  },
  {
    accessorKey: 'createdAt',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'createdAt',
    },
    header: ({ column }) => (
      <ColumnSortableHeader
        label={t('col_created_date')}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        column={column}
        showSortIcon
      />
    ),
    cell: ({ row }) => (
      <p>{formatDateWithHour(new Date(row.original.createdAt))}</p>
    ),
  },
];
