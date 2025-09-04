import { PUBLIC_URL } from '@/config/url.config';
import { SITE_NAME } from '@/meta/constants';
import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href={PUBLIC_URL.home()}
      className='flex items-center gap-x-3 transition-opacity hover:opacity-75'
    >
      <Image
        src='/images/myStore_logo.svg'
        alt={SITE_NAME}
        width={64}
        height={48}
        className='h-[48px] w-[64px]'
      />
      <div className='text-primary-700 text-2xl font-bold'>{SITE_NAME}</div>
    </Link>
  );
}
