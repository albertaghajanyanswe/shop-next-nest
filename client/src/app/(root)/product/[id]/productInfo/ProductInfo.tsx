import Link from 'next/link';
import { PUBLIC_URL } from '@/config/url.config';
import { formatPrice } from '@/utils/formatPrice';
import AddToCardButton from './AddToCardButton';
import FavoriteButton from './FavoriteButton';
import { GetProductWithDetails } from '@/generated/orval/types';

export interface ProductInfoProps {
  product: GetProductWithDetails;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const rating =
    Math.round(
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
    ) || 0;
  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='mt-10 space-y-5 sm:mt-16 lg:mt-0'>
        <h1 className='text-3xl font-bold'>{product.title}</h1>
        <div className='text-2xl'>{formatPrice(product.price)}</div>
        <hr className='my-4' />
        <p className='text-muted-foreground text-sm'>{product.description}</p>
        <hr className='my-4' />

        <div className='flex items-center gap-x-4'>
          <h3 className='font-semibold'>Category:</h3>
          <Link
            href={PUBLIC_URL.category(product.category.id)}
            className='text-primary-500 text-sm font-semibold underline'
          >
            {product.category.name}
          </Link>
        </div>

        <div className='flex items-center gap-x-4'>
          <h3 className='font-semibold'>Color:</h3>
          <div className='flex flex-row items-center justify-center gap-x-2'>
            <div
              className='size-6 rounded-full'
              style={{ backgroundColor: product.color?.value }}
            />
            <p className='text-sm font-semibold text-neutral-700'>
              {product.color?.name} 111
            </p>
          </div>
        </div>

        <div className='flex items-center gap-x-4'>
          <h3 className='font-semibold'>Average rating:</h3>
          <div className='text-sm'>
            ⭐ {rating.toFixed(1) || ' '}
            <span className='text-muted-foreground'>{` | ${product.reviews.length} reviews`}</span>
          </div>
        </div>
        <div className='flex items-start gap-x-2'>
          <AddToCardButton product={product} />
          <FavoriteButton product={product} />
        </div>
      </div>
    </div>
  );
}
