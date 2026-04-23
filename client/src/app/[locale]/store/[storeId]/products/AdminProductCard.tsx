'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { PUBLIC_URL, STORE_URL } from '@/config/url.config';
import { useDeleteProduct } from '@/hooks/queries/products/useDeleteProduct';
import { useCreateProduct } from '@/hooks/queries/products/useCreateProduct';
import type { IProductColumn } from '@/shared/types/product.interface';
import { formatPrice } from '@/utils/formatPrice';
import { generateImgPath } from '@/utils/imageUtils';
import {
  CheckCircle,
  CircleX,
  Copy,
  CopyPlus,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

type TF = (key: string) => string;

interface AdminProductCardProps {
  product: IProductColumn;
  t: TF;
}

export function AdminProductCard({ product, t }: AdminProductCardProps) {
  const { deleteProduct, isLoadingDelete } = useDeleteProduct();
  const { createProduct, isLoadingCreate } = useCreateProduct();

  return (
    <div className='bg-shop-white border-shop-primary/15 group relative flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
      {/* Image */}
      <div className='bg-shop-light-bg relative h-36 overflow-hidden xs:h-44'>
        <Image
          src={generateImgPath(product.image as string)}
          alt={product.title}
          fill
          className='object-contain p-2 transition-transform duration-500 group-hover:scale-105'
        />
        {/* Badges */}
        <div className='absolute top-1.5 left-1.5 flex flex-col gap-1'>
          {product.isPublished ? (
            <Badge className='bg-shop-primary/80 px-1.5 py-0 text-[10px] text-white hover:bg-shop-primary/80'>
              {t('published')}
            </Badge>
          ) : (
            <Badge variant='secondary' className='px-1.5 py-0 text-[10px]'>
              {t('draft')}
            </Badge>
          )}
          {product.quantity <= 0 && (
            <Badge className='bg-red-500/80 px-1.5 py-0 text-[10px] text-white hover:bg-red-500/80'>
              {t('out_of_stock')}
            </Badge>
          )}
        </div>
        {/* Actions */}
        <div className='absolute top-1.5 right-1.5'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='secondary'
                size='sm'
                className='h-7 w-7 p-0 opacity-100 transition-opacity group-hover:opacity-100'
              >
                <MoreHorizontal className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>{t('action')}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={async () => {
                  await navigator.clipboard.writeText(product.id);
                  toast.success(t('product_id_copied'));
                }}
              >
                <Copy className='mr-2 size-4' />
                {t('copy_product_id')}
              </DropdownMenuItem>
              <Link href={PUBLIC_URL.product(product.id)} target='_blank'>
                <DropdownMenuItem>
                  <ExternalLink className='mr-2 size-4' />
                  {t('product_page')}
                </DropdownMenuItem>
              </Link>
              <Link href={STORE_URL.productEdit(product.storeId, product.id)}>
                <DropdownMenuItem>
                  <Pencil className='mr-2 size-4' />
                  {t('edit_product')}
                </DropdownMenuItem>
              </Link>
              <Button
                variant='ghost'
                className='h-8 w-full p-0 text-sm font-normal'
                style={{ placeContent: 'start' }}
                disabled={isLoadingCreate}
                onClick={() =>
                  createProduct({
                    title: product.title,
                    price: Number(product.originalPrice),
                    description: product.description ?? '',
                    categoryId: product.categoryId,
                    brandId: product.brandId,
                    colorId: product.colorId ?? '',
                    storeId: product.storeId,
                    images: product.images ?? [],
                    userId: product.userId ?? '',
                  } as any)
                }
              >
                <DropdownMenuItem className='place-content-start'>
                  <CopyPlus className='mr-2 size-4' />
                  {t('duplicate')}
                </DropdownMenuItem>
              </Button>
              <Button
                variant='ghost'
                className='h-8 w-full p-0 text-sm font-normal'
                style={{ placeContent: 'start' }}
                disabled={isLoadingDelete}
                onClick={() => deleteProduct(product.id)}
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
      <div className='flex flex-1 flex-col gap-1 p-2 xs:p-3'>
        <Link href={STORE_URL.productEdit(product.storeId, product.id)}>
          <p className='text-shop-primary-text line-clamp-2 min-h-8 text-xs font-semibold leading-tight hover:text-shop-light-primary sm:text-sm'>
            {product.title}
          </p>
        </Link>
        {product.category && (
          <p className='text-muted-foreground text-[10px]'>{product.category}</p>
        )}

        <div className='mt-auto pt-1'>
          <div className='flex items-center justify-between'>
            <span className='text-shop-red text-sm font-bold'>
              {formatPrice(product.price)}
            </span>
            <div className='flex items-center gap-1.5'>
              <span
                className={`text-xs font-medium ${product.quantity <= 0 ? 'text-red-500' : 'text-shop-primary'}`}
              >
                {t('in_stock') + ' • x' + product.quantity}
              </span>
            </div>
          </div>
          <div className='mt-1.5 flex items-center gap-2 border-t border-shop-primary/10 pt-1.5 text-[10px]'>
            <span className='text-muted-foreground flex items-center gap-0.5'>
              {product.isOriginal ? (
                <CheckCircle className='text-shop-light-primary size-3.5' />
              ) : (
                <CircleX className='size-3.5 text-red-400' />
              )}
              {t('col_original')}
            </span>
            <span className='text-muted-foreground flex items-center gap-0.5'>
              {product.isPublished ? (
                <CheckCircle className='text-shop-light-primary size-3.5' />
              ) : (
                <CircleX className='size-3.5 text-red-400' />
              )}
              {t('col_published')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
