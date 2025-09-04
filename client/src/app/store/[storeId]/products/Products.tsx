'use client';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/data-loading/DataTable';
import DataTableLoading from '@/components/ui/data-loading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { STORE_URL } from '@/config/url.config';
import { useGetProducts } from '@/hooks/queries/products/useGetProducts';
import { formatPrice } from '@/utils/string/formatPrice';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productColumns } from './ProductColumns';

export function Products() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { products, isLoadingProducts } = useGetProducts();
  const formattedProducts = products
    ? products?.map((product) => ({
        id: product.id,
        title: product.title,
        price: formatPrice(product.price),
        category: product.category.title,
        color: product.color.value,
        storeId: product.store.id,
      }))
    : [];
  return (
    <div className='p-6'>
      {isLoadingProducts ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`Products (${formattedProducts.length})`}
            description='All products from store'
          />
          <div className='flex items-center gap-x-4'>
            <Link href={STORE_URL.productCreate(storeId)}>
              <Button variant='primary'>
                <Plus className='size-4' />
                Create
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className='mt-3'>
        <DataTable
          columns={productColumns}
          data={formattedProducts}
          filterKey='title'
        />
      </div>
    </div>
  );
}
