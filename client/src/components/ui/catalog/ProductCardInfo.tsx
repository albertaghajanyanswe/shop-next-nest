import Link from 'next/link';
import { CarouselApi } from '@/components/ui/Carousel';
import { PUBLIC_URL } from '@/config/url.config';
import { formatPrice } from '@/utils/formatPrice';
import { memo } from 'react';
import { GetProductWithDetails } from '@/generated/orval/types';
import QueryString from 'qs';

interface ProductCardInfoProps {
  product: GetProductWithDetails;
  carouselApi: CarouselApi | null | undefined;
  activeIndex: number;
}

function ProductCardInfoUnMemo({
  product,
  carouselApi,
  activeIndex,
}: ProductCardInfoProps) {
  return (
    <>
      <div className='mt-0 flex justify-center gap-2'>
        {product.images.map((_, index) => (
          <button
            onClick={() => carouselApi?.scrollTo(index)}
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 w-2 cursor-pointer rounded-full p-[2px] transition ${
              activeIndex === index ? 'bg-gray-800' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <p className='mt-1 line-clamp-1 text-xs font-semibold text-gray-700 sm:text-sm'>
        {product.title}
      </p>
      <p className='text-muted-foreground line-clamp-2 h-10 text-xs'>
        {product.description}
      </p>
      <Link
        href={PUBLIC_URL.shop(
          QueryString.stringify(
            { filter: { categoryId: [product?.category?.id] } },
            { skipNulls: true }
          )
        )}
        className='text-shop-light-green mt-1 text-xs hover:underline sm:text-sm'
        aria-label='Go to shop'
      >
        {product.category?.name}
      </Link>

      <div className='sm:text-md mb-2 text-sm'>
        <span className='text-shop-red font-semibold'>
          {formatPrice(product.price)}
        </span>
        {product.oldPrice && product.oldPrice !== product.price && (
          <span className='ml-2 text-gray-500 line-through'>
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>
    </>
  );
}

export const ProductCardInfo = memo(ProductCardInfoUnMemo);
