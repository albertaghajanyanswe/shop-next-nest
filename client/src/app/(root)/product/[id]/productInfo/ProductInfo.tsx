import Link from 'next/link';
import { PUBLIC_URL } from '@/config/url.config';
import { formatPrice } from '@/utils/formatPrice';
import FavoriteButton from './FavoriteButton';
import { GetProductWithDetails } from '@/generated/orval/types';
import QueryString from 'qs';
import { ShowMoreText } from '@/components/customComponents/ShowMoreText';
import ProductInfoAction from './ProductInfoAction';
import { Badge } from '@/components/ui/Badge';
import { Crown, Sparkles } from 'lucide-react';
import { ProductRating } from './ProductRating';
import EditProductButton from './EditProductButton';
import { useMemo } from 'react';

export interface ProductInfoProps {
  product: GetProductWithDetails;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const categoryUrl = useMemo(() => {
    if (!product.category?.id) return PUBLIC_URL.shop();

    return PUBLIC_URL.shop(
      QueryString.stringify(
        { filter: { categoryId: [product.category.id] } },
        { skipNulls: true }
      )
    );
  }, [product.category?.id]);
  return (
    <div
      itemScope
      itemType='https://schema.org/Product'
      className='relative flex w-full flex-col gap-3'
    >
      <div className='relative flex w-full flex-col gap-3 md:rounded-md md:border md:border-neutral-100 md:p-6'>
        <div className='space-y-2'>
          <div className='flex flex-row gap-2'>
            {product.isOriginal && (
              <Badge className='text-primary flex w-fit flex-row items-center rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-medium shadow-none hover:bg-emerald-700/10'>
                <Crown className='mr-1 h-4 w-4' /> Original
              </Badge>
            )}
            <Badge
              className='text-shop-red flex w-fit flex-row items-center rounded-full bg-red-700/10 px-3 py-1 text-xs font-medium shadow-none hover:bg-red-700/10'
              aria-label={`In stock: ${product.quantity} items`}
            >
              <Sparkles className='mr-1 h-4 w-4' /> In Stock:
              <span className='text-shop-red ml-2'>{product.quantity}</span>
            </Badge>
          </div>
          <h1
            itemProp='name'
            className='mb-2 text-xl font-semibold sm:text-3xl'
          >
            {product.title}
          </h1>
          <div className='mb-2 text-sm sm:text-lg'>
            <span className='text-shop-red font-semibold'>
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice !== product.price && (
              <span className='ml-2 text-gray-500 line-through'>
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <hr className='my-3' />
          <ShowMoreText
            className='text-muted-foreground text-sm'
            text={product.description}
          />
          <hr className='my-3' />

          <div className='flex items-center gap-x-4'>
            <p className='font-medium text-neutral-700'>Category:</p>
            <Link
              href={categoryUrl}
              className='text-shop-light-green mt-1 text-xs font-medium hover:underline sm:text-sm'
              aria-label='Go to shop'
            >
              {product.category?.name}
            </Link>
          </div>

          {product.color?.name && (
            <div className='flex items-center gap-x-4'>
              <p className='font-medium text-neutral-700'>Color:</p>
              <div className='flex flex-row items-center justify-center gap-x-2'>
                <div
                  className='size-6 rounded-full border border-neutral-300'
                  style={{ backgroundColor: product.color?.value }}
                />
                <p className='text-muted-foreground text-sm font-medium'>
                  {product.color?.name}
                </p>
              </div>
            </div>
          )}
          <ProductRating
            productReviews={product.reviews || []}
            leftTitle='Average rating: '
          />
          <div className='mt-6 flex items-start gap-x-2'>
            <ProductInfoAction product={product} />
          </div>
          <FavoriteButton
            productId={product.id}
            className='flex w-full'
            btnVariant='outline'
            onlyIcon={false}
          />
          <EditProductButton
            product={product}
            className='flex w-full'
            onlyIcon={false}
          />
        </div>
      </div>
    </div>
  );
}
