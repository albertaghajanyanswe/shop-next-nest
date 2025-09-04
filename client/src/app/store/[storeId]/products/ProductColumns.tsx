import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { PUBLIC_URL, STORE_URL } from '@/config/url.config';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
  Pencil,
} from 'lucide-react';
import Link from 'next/link';

export interface IProductColumn {
  id: string;
  title: string;
  price: number;
  category: string;
  color: string;
  storeId: string;
}

export const productColumns: ColumnDef<IProductColumn>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
  },

  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
  },

  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
  },

  {
    accessorKey: 'color',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Color
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-x-3'>
          <div
            className='size-5 rounded-full border'
            style={{ backgroundColor: row.original.color }}
          />
          {row.original.color}
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <Link href={PUBLIC_URL.product(row.original.id)} target='_blank'>
              <DropdownMenuItem>
                <ExternalLink className='mr-2 size-4' />
                Product page
              </DropdownMenuItem>
            </Link>
            <Link
              href={STORE_URL.productEdit(
                row.original.storeId,
                row.original.id
              )}
            >
              <DropdownMenuItem>
                <Pencil className='mr-2 size-4' />
                Edit product
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
