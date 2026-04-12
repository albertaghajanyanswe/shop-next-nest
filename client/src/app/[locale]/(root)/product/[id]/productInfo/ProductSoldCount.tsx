import { Flame } from 'lucide-react';
import { memo } from 'react';

function ProductSoldCount({
  soldCount,
  leftTitle,
  className = '',
}: {
  soldCount: number;
  leftTitle?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-x-4 ${className}`}>
      {leftTitle && (
        <p className='text-shop-muted-text-7 text-sm font-semibold whitespace-nowrap'>
          {leftTitle}
        </p>
      )}

      <div className='flex w-full min-w-0 items-center justify-end gap-x-1'>
        <Flame className='size-5 shrink-0 fill-amber-400 text-red-500' />

        <span className='text-muted-foreground truncate text-sm'>
          {`${soldCount} sold`}
        </span>
      </div>
    </div>
  );
}

export default memo(ProductSoldCount);
