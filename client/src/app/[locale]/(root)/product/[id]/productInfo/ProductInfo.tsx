import { useTranslations } from 'next-intl';
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
import { capitalizeFirstLetter } from '@/utils/common';
import ProductInfoItem from './ProductInfoItem';
import { useAbility } from '@/lib/permissions';

export interface ProductInfoProps {
  product: GetProductWithDetails;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations('ProductInfo');
  const { can, user } = useAbility();
  const categoryUrl = useMemo(() => {
    if (!product.category?.id) return PUBLIC_URL.shop();

    return PUBLIC_URL.shop(
      QueryString.stringify(
        { filter: { categoryId: [product.category.id] } },
        { skipNulls: true }
      )
    );
  }, [product.category?.id]);

  const storeUrl = useMemo(() => {
    if (!product.store?.id) return PUBLIC_URL.shop();

    return PUBLIC_URL.shop(
      QueryString.stringify(
        { filter: { storeId: [product.store.id] } },
        { skipNulls: true }
      )
    );
  }, [product.store?.id]);

  const targetUrl = useMemo(() => {
    if (!product.intendedFor) return PUBLIC_URL.shop();

    return PUBLIC_URL.shop(
      QueryString.stringify(
        { filter: { intendedFor: [product.intendedFor] } },
        { skipNulls: true }
      )
    );
  }, [product.intendedFor]);

  console.log('prod ', product);
  return (
    <div
      itemScope
      itemType='https://schema.org/Product'
      className='relative flex w-full flex-col gap-3'
    >
      <div className='dark:md:border-shop-light-bg dark:border-dark-3 bg-shop-bg-default relative flex w-full flex-col gap-3 rounded-md border border-neutral-200 p-6 md:rounded-md'>
        <div className='space-y-2'>
          <div className='flex flex-row gap-2'>
            {product.isOriginal && (
              <Badge className='text-primary flex w-fit flex-row items-center rounded-full bg-emerald-700/10 px-3 py-1 text-xs font-medium shadow-none hover:bg-emerald-700/10'>
                <Crown className='mr-1 h-4 w-4' /> {t('original')}
              </Badge>
            )}
            <Badge
              className='text-shop-red flex w-fit flex-row items-center rounded-full bg-red-700/10 px-3 py-1 text-xs font-medium shadow-none hover:bg-red-700/10'
              aria-label={`In stock: ${product.quantity} items`}
            >
              <Sparkles className='mr-1 h-4 w-4' /> {t('in_stock')}
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
            {typeof product.oldPrice === 'number' &&
              product.oldPrice !== product.price && (
                <span className='text-shop-primary-text ml-2 line-through'>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
          </div>
          {/* <hr className='my-3' /> */}
          <ShowMoreText
            className='text-muted-foreground text-sm'
            text={product.description as unknown as string}
          />
          <hr className='my-3 bg-neutral-300' />

          <ProductInfoItem
            leftText={t('store')}
            rightText={product.store?.title || t('na')}
            link={storeUrl}
          />
          <ProductInfoItem
            leftText={t('category')}
            rightText={product.category?.name || t('na')}
            link={categoryUrl}
          />
          <ProductInfoItem
            leftText={t('intended_for')}
            rightText={capitalizeFirstLetter(product.intendedFor) || t('na')}
            link={targetUrl}
          />

          {product.color?.name && (
            <div className='flex items-center gap-x-4'>
              <p className='text-shop-muted-text-7 font-medium'>{t('color')}</p>
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
          <hr className='my-3 bg-neutral-300' />

          <ProductRating
            productReviews={product.reviews || []}
            leftTitle={t('average_rating')}
          />
          <div className='mt-6 mb-4 flex items-start gap-x-2'>
            <ProductInfoAction product={product} />
          </div>
          <FavoriteButton
            productId={product.id}
            className='flex w-full'
            btnVariant='outline'
            onlyIcon={false}
          />
          {can('update', 'product', { ownerId: product.userId }) && (
            <EditProductButton
              product={product}
              className='flex w-full'
              onlyIcon={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
