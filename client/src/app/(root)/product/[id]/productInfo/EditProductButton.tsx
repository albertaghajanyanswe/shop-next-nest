import { Button } from '@/components/ui/Button';
import { CustomTooltip } from '@/components/ui/CustomTooltip';
import { STORE_URL } from '@/config/url.config';
import { GetProductWithDetails } from '@/generated/orval/types';
import { useProfile } from '@/hooks/useProfile';
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
  const { user } = useProfile();
  const handleEdit = () => {
    // Handle edit product action
  };
  const button = (
    <Link
      className={className}
      href={STORE_URL.productEdit(product.storeId, product.id)}
    >
      <Button
        variant='outline'
        size={onlyIcon ? 'icon' : 'default'}
        // onClick={handleEdit}
        aria-label='Edit product'
        className='w-full'
      >
        <Pencil className='size-4' />
        {!onlyIcon && <span className='text-neutral-900'>Edit product</span>}
      </Button>
    </Link>
  );
  return onlyIcon ? (
    <CustomTooltip text='Edit product'>{button}</CustomTooltip>
  ) : (
    button
  );
}
export default memo(EditProductButton);
