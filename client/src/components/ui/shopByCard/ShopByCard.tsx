import Link from 'next/link';
import type { GetCategoryDto, GetBrandDto } from '@/generated/orval/types';
import { memo } from 'react';
import Image from 'next/image';
import {
  categoryImgBlurParams,
  categoryImgParams,
  generateImgPath,
} from '@/utils/imageUtils';
import { PUBLIC_URL } from '@/config/url.config';
import QueryString from 'qs';

export interface IShopByCard<TData> {
  title: string;
  description?: string;
  linkTitle?: string;
  linkClb: (id?: string) => string;
  data: GetCategoryDto[] | GetBrandDto[];
}

const ShopByCardComponent = <TData,>({
  title,
  description,
  linkTitle,
  linkClb,
  data,
}: IShopByCard<TData>) => {
  return (
    <div className='m-auto'>
      <div className='mb-4 md:flex md:items-center md:justify-between'>
        <div className='max-w-2xl px-4 lg:max-w-full lg:px-0'>
          <p className='text-2xl font-semibold'>{title}</p>
          {description && (
            <p className='text-muted-foreground mt-2 text-sm'>
              <span className='text-xs font-medium'>Category description:</span>{' '}
              {description}
            </p>
          )}
        </div>
        {linkTitle && (
          <Link
            href={PUBLIC_URL.shop()}
            className='text-primary-700 hover:text-primary-700/70 hidden text-sm font-medium whitespace-nowrap md:flex'
          >
            {linkTitle}
          </Link>
        )}
      </div>
      <div className='flex w-full items-center'>
        {data && data?.length > 0 ? (
          <div className='xs:grid-cols-5 mt-2 grid w-full grid-cols-3 gap-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12'>
            {data.map((item) => (
              <Link
                key={item.id}
                href={linkClb(
                  QueryString.stringify(
                    { filter: { categoryId: [item.id] } },
                    { skipNulls: true }
                  )
                )}
                className='group shadow-darkRed/20 hoverEffect flex h-24 flex-col items-center justify-center overflow-hidden rounded-md bg-white p-2 text-center hover:shadow-lg'
              >
                <div className='relative h-20 w-20'>
                  <Image
                    src={generateImgPath(item.images[0], categoryImgParams)}
                    alt={item.name}
                    className='hoverEffect h-18 max-h-18 min-h-18 w-18 max-w-18 min-w-18 object-contain will-change-transform group-hover:scale-110'
                    width={72}
                    height={72}
                    priority
                    placeholder='blur'
                    blurDataURL={generateImgPath(
                      item.images[0],
                      categoryImgBlurParams
                    )}
                  />
                </div>
                <p className='text-shop-dark-color text-xs font-semibold'>
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-muted-foreground text-center italic'>
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

const ShopByCard = memo(ShopByCardComponent) as typeof ShopByCardComponent;

export default ShopByCard;
