import { Button } from '@/components/ui/Button';
import { PUBLIC_URL } from '@/config/url.config';
import { SITE_DESCRIPTION } from '@/meta/constants';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <div className='mx-auto my-24 flex max-w-4xl flex-col items-center space-y-6 py-8 text-center'>
      <h1 className='text-4xl font-bold tracking-tight md:text-5xl mb-0'>
        Your shopping, your pleasure -{' '}
        <span className='text-primary-500'>all in one place</span>
      </h1>
      <p className='text-muted-foreground mt-3 mb-6 text-lg'>{SITE_DESCRIPTION}</p>
      <Link href={PUBLIC_URL.explorer()}>
        <Button variant='primary' className='group'>
          Shopping <ArrowRight className='size-4 ml-2 transition-all group-hover:ml-3' />
        </Button>
      </Link>
    </div>
  );
}
