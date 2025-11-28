import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { PUBLIC_URL, STORE_URL } from '@/config/url.config';
import { ICategoryColumn } from '@/shared/types/category.interface';
import { generateImgPath } from '@/utils/imageUtils';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
  Pencil,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const categoryColumns = (
  storeId: string
): ColumnDef<ICategoryColumn & { isCurrentUserAdmin: boolean }>[] => {
  return [
    {
      accessorKey: 'image',
      meta: {
        // className: 'w-[15%]',
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
            alt={row.original.name}
            width={44}
            height={44}
            className='hoverEffect h-11 max-h-11 min-h-10 w-11 max-w-11 min-w-10 rounded-md object-contain group-hover:scale-110'
            priority
          />
        );
      },
    },
    {
      accessorKey: 'name',
      meta: {
        textClassName:
          'truncate overflow-hidden text-ellipsis whitespace-nowrap',
        sortField: 'name',
      },
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
      accessorKey: 'createdAt',
      meta: {
        textClassName:
          'truncate overflow-hidden text-ellipsis whitespace-nowrap',
        sortField: 'createdAt',
      },
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created date
            <ArrowUpDown className='ml-2 size-4' />
          </Button>
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
              <Link href={PUBLIC_URL.category(row.original.id)} target='_blank'>
                <DropdownMenuItem>
                  <ExternalLink className='mr-2 size-4' />
                  Category page
                </DropdownMenuItem>
              </Link>
              {(storeId === row.original.storeId ||
                row.original.isCurrentUserAdmin) && (
                <Link
                  href={STORE_URL.categoryEdit(
                    row.original.storeId,
                    row.original.id
                  )}
                >
                  <DropdownMenuItem>
                    <Pencil className='mr-2 size-4' />
                    Edit category
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
