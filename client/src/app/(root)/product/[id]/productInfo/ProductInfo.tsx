import { PUBLIC_URL } from '@/config/url.config';
import { IProduct } from '@/shared/types/product.interface';
import { formatPrice } from '@/utils/string/formatPrice';
import Link from 'next/link';
import AddToCardButton from './AddToCardButton';
import FavoriteButton from './FavoriteButton';

export interface ProductInfoProps {
  product: IProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const rating =
    Math.round(
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
    ) || 0;
  return (
    <div>
      <div className='mt-10 space-y-5 sm:mt-16 lg:mt-0'>
        <h1 className='text-3xl font-bold'>{product.title}</h1>
        <div className='text-2xl'>{formatPrice(product.price)}</div>
        <hr className='my-4' />
        <p className='text-muted-foreground text-sm'>{product.description}</p>
        <hr className='my-4' />
        <div className='flex items-center gap-x-4'>
          <h3 className='font-semibold'>Color:</h3>
          <div
            className='size-6 rounded-full'
            style={{ backgroundColor: product.color.value }}
          />
        </div>

        <div className='flex items-center gap-x-4'>
          <h3 className='font-semibold'>Color:</h3>
          <Link
            href={PUBLIC_URL.category(product.category.id)}
            className='text-sm'
          >
            {product.category.title}
          </Link>
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
