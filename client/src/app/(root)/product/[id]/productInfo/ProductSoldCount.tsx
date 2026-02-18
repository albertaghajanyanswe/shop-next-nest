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
        <p className='text-sm font-semibold whitespace-nowrap text-neutral-700'>
          {leftTitle}
        </p>
      )}
      <div className='flex w-full items-center gap-x-1 text-end text-sm'>
        <Flame className='inline-block size-5 fill-amber-400 text-red-500' />
        <span className='text-muted-foreground'>{`${soldCount} sold`}</span>
      </div>
    </div>
  );
}

export default memo(ProductSoldCount);
