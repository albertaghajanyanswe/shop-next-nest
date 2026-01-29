import { SITE_NAME } from '@/utils/constants';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';

function InfoBlock() {
  return (
    <>
      <div className='mt-3 rounded-md bg-gradient-to-r from-emerald-100 to-lime-200 p-4'>
        <h2 className='mb-2 text-xl leading-relaxed font-semibold'>
          Sell on {SITE_NAME} with confidence
        </h2>
        <Image
          src='images/header.webp'
          alt='Header'
          width={2500}
          height={80}
          className='hoverEffect max-h-[350px] min-h-auto w-full rounded-md object-contain group-hover:scale-110 md:max-h-[450px]'
          priority
          // loading='lazy'
        />

        <p className='mt-4 leading-relaxed text-neutral-900'>
          <strong>MyStores</strong> is your personal seller dashboard. It's
          designed for users who want to sell products, manage inventory (create
          and manage stores, products, categories, brands and colors), and track
          store sales performance — all in one place.
        </p>

        <p className='mt-6 mb-2 leading-relaxed text-neutral-900'>
          From the <strong>MyStores</strong> section in the header, you can:
        </p>

        <ul className='grid list-inside list-disc grid-cols-1 gap-2 text-neutral-700 md:grid-cols-2'>
          <li className='flex flex-row items-center justify-start gap-4'>
            <CheckCircle className='h-4 w-4 text-emerald-600' />
            Create and manage multiple stores
          </li>
          <li className='flex flex-row items-center justify-start gap-4'>
            <CheckCircle className='h-4 w-4 text-emerald-600' />
            Create, edit, and manage products
          </li>
          <li className='flex flex-row items-center justify-start gap-4'>
            <CheckCircle className='h-4 w-4 text-emerald-600' />
            Create product categories, brands and colors
          </li>
          <li className='flex flex-row items-center justify-start gap-4'>
            <CheckCircle className='h-4 w-4 text-emerald-600' />
            View analytics for each store
          </li>
          <li className='flex flex-row items-center justify-start gap-4'>
            <CheckCircle className='h-4 w-4 text-emerald-600' />
            Track revenue and sold products
          </li>
          <li className='flex flex-row items-center justify-start gap-4'>
            <CheckCircle className='h-4 w-4 text-emerald-600' />
            See how many products are available and sold
          </li>
        </ul>

        <p className='mt-6 leading-relaxed text-neutral-900'>
          Each store has its own dashboard where you can monitor sales, manage
          content, and make data-driven decisions to grow your business.
        </p>
      </div>
    </>
  );
}

export default memo(InfoBlock);
