import { Button } from '@/components/ui/Button';
import { PUBLIC_URL } from '@/config/url.config';
import { SITE_NAME } from '@/utils/constants';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ThanksPage');
  return {
    title: `${SITE_NAME} | ${t('title')}`,
  };
}

export default async function Thanks() {
  const t = await getTranslations('ThanksPage');
  const headerT = await getTranslations('HeaderMenu');

  return (
    <div className='ax-auto my-24 flex max-w-4xl flex-col items-center space-y-6 py-20 text-center'>
      <h1 className='mb-0 text-4xl font-semibold tracking-tight md:text-5xl'>
        {t('title')}
      </h1>
      <p className='text-muted-foreground mt-3 mb-6 text-lg'>
        {t('description')}
      </p>
      <Link href={PUBLIC_URL.home()}>
        <Button variant='default' className='group'>
          {headerT('Home')}{' '}
          <ArrowRight className='ml-2 size-4 transition-all group-hover:ml-3' />
        </Button>
      </Link>
    </div>
  );
}
