import Link from 'next/link';
import { ProductCard } from '@/components/ui/catalog/ProductCard';
import { GetProductWithDetails } from '@/generated/orval/types';

export interface ICatalog {
  title: string;
  description?: string;
  descriptionLabel?: string;
  linkTitle?: string;
  link?: string;
  products: GetProductWithDetails[] | undefined;
}

export function Catalog({
  title,
  description,
  descriptionLabel,
  linkTitle,
  link,
  products,
}: ICatalog) {

  return (
    <div className='m-auto'>
      <div className='mb-4 md:flex md:items-center md:justify-between'>
        <div className='max-w-2xl px-4 lg:max-w-full lg:px-0'>
          <p className='text-2xl font-bold'>{title}</p>
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
            className='text-primary-500 hover:text-primary-500/90 hidden text-sm font-medium md:flex'
          >
            {linkTitle}
          </Link>
        )}
      </div>
      <div className='flex w-full items-center'>
        {products && products?.length > 0 ? (
          <div className='mt-2 grid w-full gap-6 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
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
}
