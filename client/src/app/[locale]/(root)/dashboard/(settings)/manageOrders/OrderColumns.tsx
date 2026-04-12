import { Button } from '@/components/ui/Button';
import { ColumnSortableHeader } from '@/components/ui/dataLoading/ColumnSortableHeader';
import { formatDateWithHour } from '@/utils/formateDate';
import { formatPrice } from '@/utils/formatPrice';
import { ColumnDef } from '@tanstack/react-table';

export interface IOrderColumns {
  id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  type: string;
  itemsCount: number;
  itemsNames: string;
}

type TF = (key: string) => string;

export const orderColumns = (t: TF): ColumnDef<IOrderColumns>[] => [
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
    accessorKey: 'itemsCount',
    meta: {
      textClassName:
        'w-10 truncate overflow-hidden text-ellipsis whitespace-nowrap',
    },
    header: () => (
      <Button variant='ghost' className='p-0 px-0 has-[>svg]:px-0'>
        {t('col_count')}
      </Button>
    ),
    cell: ({ row }) => row.original.itemsCount,
  },
  {
    accessorKey: 'itemsNames',
    meta: {
      textClassName: 'text-wrap text-xs',
    },
    header: () => (
      <Button variant='ghost' className='p-0 px-0 has-[>svg]:px-0'>
        {t('col_items_names')}
      </Button>
    ),
    cell: ({ row }) => row.original.itemsNames,
  },
  {
    accessorKey: 'type',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'subscriptionId',
    },
    header: ({ column }) => (
      <ColumnSortableHeader
        label={t('col_type')}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        column={column}
        showSortIcon
      />
    ),
  },
  {
    accessorKey: 'status',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'status',
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
    accessorKey: 'totalPrice',
    meta: {
      textClassName: 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
      sortField: 'totalPrice',
    },
    header: ({ column }) => (
      <ColumnSortableHeader
        label={t('col_price')}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        column={column}
        showSortIcon
      />
    ),
    cell: ({ row }) => formatPrice(row.original.totalPrice),
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
