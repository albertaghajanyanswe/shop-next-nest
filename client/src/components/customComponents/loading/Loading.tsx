import { LoaderCircle } from 'lucide-react';
import { memo } from 'react';

function Loading({ text }: { text?: string }) {
  return (
    <div className='bg-shop-light-bg my-6 flex min-h-50 w-full flex-col items-center justify-center space-y-3 rounded-md py-8 text-center'>
      <p className='text-2xl font-semibold text-gray-800'>Please Wait</p>
      <div className='text-darkRed animate-scale-pulse-slow flex items-center space-x-2'>
        <LoaderCircle className='text-shop-orange animate-spin' />
        <span className='text-shop-orange'>{text}</span>
      </div>
    </div>
  );
}

export default memo(Loading);
