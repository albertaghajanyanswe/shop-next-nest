import { LoaderCircle } from 'lucide-react';
import { memo } from 'react';

export const NoProductsFound = () => {
  return (
    <div className='bg-shop-light-bg mt-0 flex min-h-50 w-full flex-col items-center justify-center space-y-3 rounded-md py-8 text-center'>
      <p className='text-2xl font-semibold text-shop-primary-text'>No products found</p>
      <p className='text-shop-muted-text-6'>
        We are sorry, but there are no products matching on
      </p>
      <div className='text-darkRed animate-scale-pulse-slow flex items-center space-x-2'>
        <LoaderCircle className='text-shop-orange animate-spin' />
        <span className='text-shop-orange'>We are restocking shortly</span>
      </div>
      <p className='text-sm text-shop-muted-text-5'>
        Please check back later or explore our other product categories.
      </p>
    </div>
  );
};

export default memo(NoProductsFound);
