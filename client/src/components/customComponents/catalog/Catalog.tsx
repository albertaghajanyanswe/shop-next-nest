import Link from 'next/link';
import ProductCard from '@/components/customComponents/catalog/ProductCard';
import { GetProductWithDetails } from '@/generated/orval/types';
import NoProductsFound from '@/components/customComponents/loading/NoProductsFound';
import { SearchInput } from '@/components/layouts/mainLayout/header/searchInput/SearchInput';
import { SortSelect } from '@/components/customComponents/filters/SortSelect';
import { SORT_PRODUCT_OPTIONS } from '@/utils/sortConstants';

export interface ICatalog {
  title: string;
  description?: string;
  descriptionLabel?: string;
  linkTitle?: string;
  link?: string;
  products: GetProductWithDetails[] | undefined;
  showSearch?: boolean;
  showSort?: boolean;
  searchRedirectToShop?: boolean;
}

export function Catalog({
  title,
  description,
  descriptionLabel,
  linkTitle,
  link,
  products,
  showSearch = false,
  showSort = false,
  searchRedirectToShop = true,
}: ICatalog) {
  return (
    <>
      <div className='mb-4 md:flex md:items-center md:justify-between'>
        <div className='w-full px-0'>
          <p className='text-2xl font-semibold'>{title}</p>
          {(showSearch || showSort) && (
            <div className='mt-4 flex flex-col items-center gap-2 sm:flex-row'>
              {showSearch && (
                <SearchInput
                  searchFields={['id', 'title', 'description']}
                  redirectToShop={searchRedirectToShop}
                />
              )}
              {showSort && (
                <SortSelect
                  triggerClassName='w-full sm:w-[220px]'
                  options={SORT_PRODUCT_OPTIONS}
                />
              )}
            </div>
          )}
          {description && (
            <p className='text-muted-foreground mt-2 text-sm'>
              <span className='text-xs font-medium'>{descriptionLabel}</span>{' '}
              {description}
            </p>
          )}
        </div>
        {linkTitle && link && (
          <Link
            href={link}
            className='text-primary-700 hover:text-primary-700/70 hidden text-sm font-medium whitespace-nowrap md:flex'
          >
            {linkTitle}
          </Link>
        )}
      </div>
      <div className='flex w-full items-center'>
        {products && products?.length > 0 ? (
          <div className='xs:grid-cols-2 mt-2 grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <NoProductsFound />
        )}
      </div>
    </>
  );
}
