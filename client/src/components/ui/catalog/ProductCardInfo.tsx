import Link from 'next/link';
import { CarouselApi } from '@/components/ui/Carousel';
import { PUBLIC_URL } from '@/config/url.config';
import { formatPrice } from '@/utils/formatPrice';
import { memo } from 'react';
import { GetProductWithDetails } from '@/generated/orval/types';

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
      <div className='mt-0 sm:mt-1 md:mt-2 flex justify-center gap-2'>
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
      <h3 className='mt-2 line-clamp-1 text-xs font-semibold text-gray-700 sm:mt-4 sm:text-sm'>
        {product.title}
      </h3>
      <p className='text-muted-foreground line-clamp-2 text-xs'>
        {product.description}
      </p>
      <Link
        href={PUBLIC_URL.category(product.category?.id)}
        className='mt-1 text-xs text-gray-500 sm:text-sm'
      >
        {product.category?.name}
      </Link>
      <div className='mt-1 text-sm text-gray-900'>
        {product.oldPrice && product.oldPrice !== product.price && (
          <span className='mr-2 text-gray-500 line-through'>
            {formatPrice(product.oldPrice)}
          </span>
        )}
        <span className='font-bold'>{formatPrice(product.price)}</span>
      </div>
    </>
  );
}

export const ProductCardInfo = memo(ProductCardInfoUnMemo);
