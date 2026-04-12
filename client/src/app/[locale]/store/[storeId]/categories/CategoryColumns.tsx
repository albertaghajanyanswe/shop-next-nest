import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { PUBLIC_URL, STORE_URL } from '@/config/url.config';
import { useDeleteCategory } from '@/hooks/queries/categories/useDeleteCategory';
import { ICategoryColumn } from '@/shared/types/category.interface';
import { generateImgPath } from '@/utils/imageUtils';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type TF = (key: string) => string;

const CategoryActionsCell = ({
  row,
  storeId,
  t,
}: {
  row: ICategoryColumn & { isCurrentUserAdmin: boolean };
  storeId: string;
  t: TF;
}) => {
  const { deleteCategory, isLoadingDelete } = useDeleteCategory();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{t('action')}</DropdownMenuLabel>
        <Link href={PUBLIC_URL.category(row.id)} target='_blank'>
          <DropdownMenuItem>
            <ExternalLink className='mr-2 size-4' />
            {t('category_page')}
          </DropdownMenuItem>
        </Link>

        {(storeId === row.storeId || row.isCurrentUserAdmin) && (
          <Link href={STORE_URL.categoryEdit(row.storeId, row.id)}>
            <DropdownMenuItem>
              <Pencil className='mr-2 size-4' />
              {t('edit_category')}
            </DropdownMenuItem>
          </Link>
        )}

        <Button
          variant='ghost'
          className='h-8 w-full p-0 text-sm font-normal'
          style={{ placeContent: 'start' }}
          disabled={isLoadingDelete}
          onClick={() => deleteCategory(row.id)}
        >
          <DropdownMenuItem className='place-content-start'>
            <Trash2 className='mr-2 size-4' />
            {t('delete')}
          </DropdownMenuItem>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const categoryColumns = (
  storeId: string,
  t: TF
): ColumnDef<ICategoryColumn & { isCurrentUserAdmin: boolean }>[] => {
  return [
    {
      accessorKey: 'image',
      meta: {
        textClassName:
          'truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]',
      },
      header: () => (
        <Button variant='ghost' className='p-0 pl-3'>
          {t('col_image')}
        </Button>
      ),
      cell: ({ row }) => (
        <Image
          src={generateImgPath(row.original.image as string)}
          alt={row.original.name}
          width={44}
          height={44}
          className='hoverEffect h-11 max-h-11 min-h-10 w-11 max-w-11 min-w-10 rounded-md object-contain group-hover:scale-110'
          priority
        />
      ),
    },
    {
      accessorKey: 'name',
      meta: {
        textClassName:
          'truncate overflow-hidden text-ellipsis whitespace-nowrap',
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
      accessorKey: 'createdAt',
      meta: {
        textClassName:
          'truncate overflow-hidden text-ellipsis whitespace-nowrap',
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
        <CategoryActionsCell row={row.original} storeId={storeId} t={t} />
      ),
    },
  ];
};
