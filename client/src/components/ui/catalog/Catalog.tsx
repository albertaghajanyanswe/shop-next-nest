import Link from 'next/link';
import { ICatalog } from './catalog.interface';
import { Button } from '../Button';
import { ProductCard } from './ProductCard';

export function Catalog({
  title,
  description,
  linkTitle,
  link,
  products,
}: ICatalog) {
  return (
    <div className='m-auto'>
      <div className='mb-4 md:flex md:items-center md:justify-between'>
        <div className='max-w-2xl px-4 lg:max-w-full lg:px-0'>
          <h1 className='text-2xl font-bold'>{title}</h1>
          {description && (
            <p className='text-muted-foreground mt-2 text-sm'>
              <span className='font-medium text-xs'>Category description:</span> {description}
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
        {products.length > 0 ? (
          <div className='mt-2 grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
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
