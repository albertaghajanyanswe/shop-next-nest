import { LoaderCircle } from 'lucide-react';
import { memo } from 'react';
import LoadingDots from './LoadingDots';

interface LoadingProductsProps {
  entityName: string;
}
export const LoadingProducts = ({ entityName }: LoadingProductsProps) => {
  return (
    <div className='bg-shop-light-bg mt-0 flex min-h-50 w-full flex-col items-center justify-center space-y-4 rounded-md py-10 text-center'>
      <h2 className='flex flex-row items-center justify-center gap-x-3 text-2xl font-semibold text-shop-muted-text-7'>
        Please wait
        <LoadingDots size={2} />
      </h2>
      <div className='text-darkRed animate-scale-pulse-slow flex items-center gap-1 space-x-2'>
        <LoaderCircle className='text-shop-orange animate-spin' />
        <span className='text-shop-orange flex flex-row items-center justify-center gap-x-1'>
          {entityName} is loading
        </span>
      </div>
    </div>
  );
};

export default memo(LoadingProducts);
