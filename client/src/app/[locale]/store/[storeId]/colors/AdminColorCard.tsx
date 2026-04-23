'use client';

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
import { IColorColumn } from '@/shared/types/color.interface';
import { CalendarDays, ExternalLink, MoreHorizontal, Pencil } from 'lucide-react';

type TF = (key: string) => string;

interface AdminColorCardProps {
  color: IColorColumn;
  t: TF;
}

export function AdminColorCard({ color, t }: AdminColorCardProps) {
  return (
    <div className='bg-shop-white border-shop-primary/15 group relative flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
      {/* Color swatch */}
      <div
        className='relative h-24 w-full xs:h-32'
        style={{ backgroundColor: color.value }}
      >
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
              <Link href={STORE_URL.colorEdit(color.storeId, color.id)}>
                <DropdownMenuItem>
                  <ExternalLink className='mr-2 size-4' />
                  {t('color_page')}
                </DropdownMenuItem>
              </Link>
              <Link href={STORE_URL.colorEdit(color.storeId, color.id)}>
                <DropdownMenuItem>
                  <Pencil className='mr-2 size-4' />
                  {t('edit_color')}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Info */}
      <div className='flex flex-col gap-1 p-2 xs:p-3'>
        <div className='flex items-center gap-2'>
          <div
            className='size-4 shrink-0 rounded-full border'
            style={{ backgroundColor: color.value }}
          />
          <p className='text-shop-primary-text line-clamp-1 text-xs font-semibold sm:text-sm'>
            {color.name}
          </p>
        </div>
        <p className='text-muted-foreground font-mono text-[10px]'>{color.value}</p>
        <p className='text-muted-foreground flex items-center gap-1 text-[10px]'>
          <CalendarDays className='size-3' />
          {color.createdAt}
        </p>
      </div>
    </div>
  );
}
