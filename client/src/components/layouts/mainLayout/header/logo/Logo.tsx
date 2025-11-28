import { PUBLIC_URL } from '@/config/url.config';
import { SITE_NAME } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href={PUBLIC_URL.home()}
      className='flex items-center gap-x-1 transition-opacity hover:opacity-75'
    >
      {/* <Image
        src='/images/myStore_logo.svg'
        alt={SITE_NAME}
        width={64}
        height={48}
        className='h-[48px] w-[64px]'
      /> */}
      <h2 className='group text-shop-dark-green hover:text-shop-light-green hoverEffect font-sans text-xl sm:text-2xl font-black tracking-wider uppercase'>
        {SITE_NAME.slice(0, -1)}
        <span className='text-shop-light-green group-hover:text-shop-dark-green hoverEffect'>
          {SITE_NAME.slice(-1)}
        </span>
      </h2>
    </Link>
  );
}
