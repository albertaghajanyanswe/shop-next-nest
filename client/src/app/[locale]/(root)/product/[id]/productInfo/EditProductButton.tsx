'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { CustomTooltip } from '@/components/customComponents/CustomTooltip';
import { STORE_URL } from '@/config/url.config';
import { GetProductWithDetails } from '@/generated/orval/types';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

export interface EditProductButtonProps {
  product: GetProductWithDetails;
  className?: string;
  onlyIcon?: boolean;
}
function EditProductButton({
  product,
  className = '',
  onlyIcon = true,
}: EditProductButtonProps) {
  const t = useTranslations('EditProductButton');
  const button = (
    <Link
      className={className}
      href={STORE_URL.productEdit(product.storeId, product.id)}
    >
      <Button
        variant='outline'
        size={onlyIcon ? 'icon' : 'default'}
        aria-label={t('edit_product')}
        className='w-full'
      >
        <Pencil className='size-4' />
        {!onlyIcon && (
          <span className='text-shop-primary-text'>{t('edit_product')}</span>
        )}
      </Button>
    </Link>
  );
  return onlyIcon ? (
    <CustomTooltip text={t('edit_product')}>{button}</CustomTooltip>
  ) : (
    button
  );
}
export default memo(EditProductButton);
