import { DASHBOARD_URL } from '@/config/url.config';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export function StoreNoteBlock() {

  return (
    <div className='mt-16 flex items-start gap-2 rounded-md border-l-4 border-yellow-500 bg-yellow-100 p-4 text-sm text-yellow-900'>
      <AlertTriangle className='h-5 w-5 flex-shrink-0 mt-1' />
      <div>
        <strong className='text-lg'>IMPORTANT NOTE !</strong>
        <p className='text-md spacing mt-2 font-medium tracking-wide'>
          We have created a default store for you to create your first products.
          Please note that this store cannot be{' '}
          <span className='text-error font-bold'>Deleted</span> and is the only
          store whose products will be visible in the free plan. To create more
          stores, please upgrade your{' '}
          <Link
            href={DASHBOARD_URL.root()}
            className='text-primary-700 hover:text-primary-700/80 font-bold underline text-md'
          >
            Subscription
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
