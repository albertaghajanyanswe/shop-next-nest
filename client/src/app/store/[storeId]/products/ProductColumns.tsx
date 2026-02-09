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
import type { IProductColumn } from '@/shared/types/product.interface';
import { formatPrice } from '@/utils/formatPrice';
import { generateImgPath } from '@/utils/imageUtils';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  CheckCircle,
  CircleX,
  Copy,
  CopyPlus,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ProductActionsCell = ({ row }: { row: IProductColumn }) => {
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
        <DropdownMenuItem
          onClick={async () => {
            await navigator.clipboard.writeText(row.id);
            toast.success('Product ID copied to clipboard');
          }}
        >
          <Copy className='mr-2 size-4' />
          Copy product ID
        </DropdownMenuItem>
        <Link href={PUBLIC_URL.product(row.id)} target='_blank'>
          <DropdownMenuItem>
            <ExternalLink className='mr-2 size-4' />
            Product page
          </DropdownMenuItem>
        </Link>
        <Link href={STORE_URL.productEdit(row.storeId, row.id)}>
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
              title: row.title,
              price: Number(row.originalPrice),
              description: row.description ?? '',
              categoryId: row.categoryId,
              brandId: row.brandId,
              colorId: row.colorId ?? '',
              storeId: row.storeId,
              images: row.images ?? [],
              userId: row.userId ?? '',
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
          onClick={() => deleteProduct(row.id)}
        >
          <DropdownMenuItem className='place-content-start'>
            <Trash2 className='mr-2 size-4' />
            Delete
          </DropdownMenuItem>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const productColumns: ColumnDef<IProductColumn>[] = [
  {
    accessorKey: 'image',
    meta: {
      textClassName:
        'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]',
    },
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='p-0 pl-3'>
          Image
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Image
          src={generateImgPath(row.original.image as string)}
          alt={row.original.title}
          width={44}
          height={44}
          className='hoverEffect h-11 max-h-11 min-h-10 w-11 max-w-11 min-w-10 rounded-md object-contain group-hover:scale-110'
          priority
        />
      );
    },
  },
  {
    accessorKey: 'id',
    meta: {
      className: 'w-[15%]',
      textClassName:
        'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]',
      sortField: 'id',
    },

    header: ({ column }) => {
      return (
        <Button
          className='p-0 has-[>svg]:px-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{row.original.id.slice(-5)}</p>;
    },
  },
  {
    accessorKey: 'title',
    meta: {
      className: 'w-[30%]',
      textClassName:
        'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] sm:max-w-[150px] xl:max-w-[200px]',
      sortField: 'title',
    },

    header: ({ column }) => {
      return (
        <Button
          className='p-0 has-[>svg]:px-0'
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
    meta: {
      className: 'w-[10%]',
      textClassName:
        'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]  place-items-center',
      sortField: 'price',
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='p-0 has-[>svg]:px-0'
        >
          Price
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p className='text-shop-light-green font-semibold'>
          {formatPrice(row.original.price)}
        </p>
      );
    },
  },

  {
    accessorKey: 'quantity',
    meta: {
      className: 'w-[10%]',
      textClassName:
        'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]  place-items-center',
      sortField: 'quantity',
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='p-0 has-[>svg]:px-0'
        >
          In stock
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p
          className={`${row?.original?.quantity <= 0 ? 'font-semibold text-red-500' : ''}`}
        >
          {row.original.quantity}
        </p>
      );
    },
  },

  {
    accessorKey: 'isOriginal',
    meta: {
      className: 'w-[10%]',
      textClassName:
        'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]  place-items-center',
      sortField: 'isOriginal',
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='p-0 has-[>svg]:px-0'
        >
          Original
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.isOriginal ? (
        <CheckCircle className='text-shop-light-green size-5' />
      ) : (
        <CircleX className='text-red-500' />
      );
    },
  },

  {
    accessorKey: 'isPublished',
    meta: {
      className: 'w-[10%]',
      textClassName:
        'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]  place-items-center',
      sortField: 'isPublished',
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='p-0 has-[>svg]:px-0'
        >
          Published
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.isPublished ? (
        <CheckCircle className='text-shop-light-green size-5' />
      ) : (
        <CircleX className='text-red-500' />
      );
    },
  },

  {
    accessorKey: 'category',
    meta: {
      sortField: 'category_name',
      className: 'w-[15%]',
      textClassName:
        'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]',
    },
    header: ({ column }) => {
      return (
        <Button
          className='p-0 has-[>svg]:px-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      );
    },
  },

  // {
  //   accessorKey: 'color',
  //   meta: {
  //     className: 'w-[10%]',
  //     textClassName:
  //       'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]',
  //   },
  //   header: ({ column }) => {
  //     return (
  //       <Button className='p-0' variant='ghost'>
  //         Color
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return row.original.color ? (
  //       <div
  //         className='size-5 rounded-full border'
  //         style={{ backgroundColor: row.original.color }}
  //       />
  //     ) : (
  //       '-'
  //     );
  //   },
  // },
  {
    accessorKey: 'actions',
    meta: { className: 'w-[5%]' },
    header: 'Actions',
    cell: ({ row }) => <ProductActionsCell row={row.original} />,
  },
];
