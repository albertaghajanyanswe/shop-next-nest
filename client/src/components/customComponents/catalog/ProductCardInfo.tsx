import Link from 'next/link';
import { CarouselApi } from '@/components/ui/Carousel';
import { PUBLIC_URL } from '@/config/url.config';
import { formatPrice } from '@/utils/formatPrice';
import { memo } from 'react';
import { GetProductWithDetails } from '@/generated/orval/types';
import QueryString from 'qs';
import { usePathname } from 'next/navigation';
import { ProductRating } from '@/app/(root)/product/[id]/productInfo/ProductRating';

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
  const pathname = usePathname();
  const isShopPage = pathname === PUBLIC_URL.shop();

  return (
    <>
      <div className='mt-0 flex justify-center gap-2'>
        {product.images.map((_, index) => (
          <button
            onClick={() => carouselApi?.scrollTo(index)}
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 w-2 cursor-pointer rounded-full p-[2px] transition ${
              activeIndex === index ? 'bg-black' : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>
      <p className='mt-1 line-clamp-1 text-xs font-semibold text-gray-700 sm:text-sm'>
        {product.title}
      </p>
      <p className='text-muted-foreground line-clamp-1 h-4 text-xs'>
        {product.description}
      </p>
      <div className='flex flex-col'>
        {isShopPage ? (
          <p className='text-shop-light-green xs:block hidden text-xs sm:text-sm'>
            {product.store?.title}
          </p>
        ) : (
          <Link
            href={PUBLIC_URL.shop(
              QueryString.stringify(
                { filter: { storeId: [product?.storeId] } },
                { skipNulls: true }
              )
            )}
            className='text-shop-light-green xs:block hidden text-xs hover:underline sm:text-sm'
            aria-label='Go to shop'
          >
            {product.store?.title}
          </Link>
        )}
        {isShopPage ? (
          <p className='text-shop-light-green xs:block hidden text-xs sm:text-sm'>
            {product.category?.name}
          </p>
        ) : (
          <Link
            href={PUBLIC_URL.shop(
              QueryString.stringify(
                { filter: { categoryId: [product?.category?.id] } },
                { skipNulls: true }
              )
            )}
            className='text-shop-light-green xs:block hidden text-xs hover:underline sm:text-sm'
            aria-label='Go to shop'
          >
            {product.category?.name}
          </Link>
        )}
      </div>

      <div className='sm:text-md mt-2'>
        <span className='text-shop-red font-semibold'>
          {formatPrice(product.price)}
        </span>
        {product.oldPrice && product.oldPrice !== product.price && (
          <span className='ml-2 font-semibold text-neutral-700 line-through'>
            {formatPrice(product.oldPrice)}
          </span>
        )}
      </div>
      <ProductRating className='mb-2' productReviews={product.reviews || []} />
    </>
  );
}

export const ProductCardInfo = memo(ProductCardInfoUnMemo);
