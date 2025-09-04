import { Button } from '@/components/ui/Button';
import { PUBLIC_URL } from '@/config/url.config';
import { NO_INDEX_PAGE } from '@/meta/constants';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thanks for your order',
  ...NO_INDEX_PAGE,
};

export default function Thanks() {
  return (
    <div className='ax-auto my-24 flex max-w-4xl flex-col items-center space-y-6 py-20 text-center'>
      <h1 className='mb-0 text-4xl font-bold tracking-tight md:text-5xl'>
        Thanks for your order
      </h1>
      <p className='text-muted-foreground mt-3 mb-6 text-lg'>
        Thank you for your trust. Your order has been placed successfully.
      </p>
      <Link href={PUBLIC_URL.home()}>
        <Button variant='primary' className='group'>
          Home{' '}
          <ArrowRight className='ml-2 size-4 transition-all group-hover:ml-3' />
        </Button>
      </Link>
    </div>
  );
}
