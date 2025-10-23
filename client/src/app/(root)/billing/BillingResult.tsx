'use client';

import { Catalog } from '@/components/ui/catalog/Catalog';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/constants';
import { IProduct } from '@/shared/types/product.interface';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export default function BillingResult() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('searchTerm');

  console.log('\n\n\n success = ', searchParams.get('success'));
  console.log('planId = ', searchParams.get('planId'));
  console.log('downgrade = ', searchParams.get('downgrade'));
  console.log('cancel = ', searchParams.get('cancel'));
  const isSuccess = searchParams.get('success') === 'true';
  const isDowngrade = searchParams.get('downgrade') === 'true';
  const isCancel = searchParams.get('cancel') === 'true';
  const planId = searchParams.get('planId');
  return (
    <div className='mt-[64px] flex h-full w-full items-center justify-center'>
      <div className='max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        {isSuccess && !isDowngrade && !isCancel && <h5 className='text-green-700 mb-4 text-2xl font-bold'>Operation Succeeded</h5>}
        {isSuccess && isDowngrade && <h5 className='text-green-700 mb-4 text-2xl font-bold'>'Downgrade Succeeded</h5>}
        {isSuccess && isCancel && <h5 className='text-green-700 mb-4 text-2xl font-bold'>Cancel Succeeded</h5>}
        {!isSuccess && <h5 className='text-error mb-4 text-2xl font-bold'>Something went wrong</h5>}
        {isSuccess && !isDowngrade && !isCancel && (
          <span className='text-muted-foreground mb-3 font-normal'>
            You have successfully subscribed to the plan <b>{planId}</b>. You
            can close this window now.
          </span>
        )}
        {isSuccess && isDowngrade && (
          <span className='text-muted-foreground mb-3 font-normal'>
            You have successfully downgraded to the plan <b>{planId}</b>. You
            can close this window now.
          </span>
        )}
        {isSuccess && isCancel && (
          <span className='text-muted-foreground mb-3 font-normal'>
            You have successfully canceled your subscription. You can close
            this window now.
          </span>
        )}
        {!isSuccess && 'Please try again later or contact support.'}
      </div>
    </div>
  );
}
