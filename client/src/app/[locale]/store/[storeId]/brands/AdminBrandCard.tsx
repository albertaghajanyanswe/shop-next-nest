'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { STORE_URL } from '@/config/url.config';
import { useDeleteBrand } from '@/hooks/queries/brands/useDeleteBrand';
import { IBrandColumn } from '@/shared/types/brand.interface';
import { generateImgPath } from '@/utils/imageUtils';
import { CalendarDays, ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

type TF = (key: string) => string;

interface AdminBrandCardProps {
  brand: IBrandColumn & { isCurrentUserAdmin: boolean };
  storeId: string;
  t: TF;
}

export function AdminBrandCard({ brand, storeId, t }: AdminBrandCardProps) {
  const { deleteBrand, isLoadingDelete } = useDeleteBrand();

  return (
    <div className='bg-shop-white border-shop-primary/15 group relative flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
      {/* Image */}
      <div className='bg-shop-light-bg relative h-32 overflow-hidden xs:h-40'>
        <Image
          src={generateImgPath(brand.image as string)}
          alt={brand.name}
          fill
          className='object-contain p-3 transition-transform duration-500 group-hover:scale-105'
        />
        {/* Actions */}
        <div className='absolute top-1.5 right-1.5'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='secondary'
                size='sm'
                className='h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <MoreHorizontal className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>{t('action')}</DropdownMenuLabel>
              <Link href={STORE_URL.brandEdit(brand.storeId, brand.id)}>
                <DropdownMenuItem>
                  <ExternalLink className='mr-2 size-4' />
                  {t('brand_page')}
                </DropdownMenuItem>
              </Link>
              {(storeId === brand.storeId || brand.isCurrentUserAdmin) && (
                <Link href={STORE_URL.brandEdit(brand.storeId, brand.id)}>
                  <DropdownMenuItem>
                    <Pencil className='mr-2 size-4' />
                    {t('edit_brand')}
                  </DropdownMenuItem>
                </Link>
              )}
              <Button
                variant='ghost'
                className='h-8 w-full p-0 text-sm font-normal'
                style={{ placeContent: 'start' }}
                disabled={isLoadingDelete}
                onClick={() => deleteBrand(brand.id)}
              >
                <DropdownMenuItem className='place-content-start text-red-600'>
                  <Trash2 className='mr-2 size-4' />
                  {t('delete')}
                </DropdownMenuItem>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Info */}
      <div className='flex flex-col gap-1 p-2 xs:p-3'>
        <p className='text-shop-primary-text line-clamp-1 text-xs font-semibold sm:text-sm'>
          {brand.name}
        </p>
        <p className='text-muted-foreground flex items-center gap-1 text-[10px]'>
          <CalendarDays className='size-3' />
          {brand.createdAt}
        </p>
      </div>
    </div>
  );
}
