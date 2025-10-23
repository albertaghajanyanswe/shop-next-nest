import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { PUBLIC_URL, STORE_URL } from '@/config/url.config';
import { useCreateProduct } from '@/hooks/queries/products/useCreateProduct';
import { useDeleteProduct } from '@/hooks/queries/products/useDeleteProduct';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  CopyPlus,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

export interface IProductColumn {
  id: string;
  title: string;
  price: number;
  category: string;
  color: string;
  storeId: string;

  // additional optional properties present on row.original used elsewhere
  categoryId?: string;
  brandId?: string;
  colorId?: string;
  images?: string[];
  description?: string;
  brand?: any;
  reviews?: any[];
  state?: string;
  userId?: string;
  originalPrice?: number;
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
      console.log('ROW = ', row);
      const { createProduct, isLoadingCreate } = useCreateProduct();
      const { deleteProduct, isLoadingDelete } = useDeleteProduct();

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
            <Button
              variant='ghost'
              className='h-8 w-full p-0 text-sm font-normal'
              style={{ placeContent: 'start' }}
              disabled={isLoadingCreate}
              onClick={() =>
                createProduct({
                  title: row.original.title,
                  price: Number(row.original.originalPrice),
                  // ensure required fields exist by using existing values or safe defaults
                  description: row.original.description ?? '',
                  categoryId: row.original.categoryId,
                  brandId: row.original.brandId,
                  colorId: row.original.colorId ?? '',
                  storeId: row.original.storeId,
                  images: row.original.images ?? [],
                  userId: row.original.userId ?? '',
                } as any)
              }
            >
              <DropdownMenuItem className='place-content-start'>
                <CopyPlus className='mr-2 size-4' />
                Duplicate
              </DropdownMenuItem>
            </Button>

            <Button
              variant='ghost'
              className='h-8 w-full p-0 text-sm font-normal'
              style={{ placeContent: 'start' }}
              disabled={isLoadingDelete}
              onClick={() => deleteProduct(row.original.id)}
            >
              <DropdownMenuItem className='place-content-start'>
                <Trash2 className='mr-2 size-4' />
                Delete
              </DropdownMenuItem>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
