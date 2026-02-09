'use client';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { STORE_URL } from '@/config/url.config';
import { useGetStoreProducts } from '@/hooks/queries/products/useGetStoreProducts';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productColumns } from './ProductColumns';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/customComponents/CustomPagination';

export function Products() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { queryParams, changePage, changeLimit, changeSearch, changeSort } =
    useQueryParams({
      pageDefaultParams: {
        params: {
          sort: { field: 'createdAt', order: 'desc' },
          filter: {},
          limit: 10,
          skip: 0,
          search: {
            value: '',
            fields: ['title', 'description'],
          },
        },
      },
    });

  const { productsData, isLoadingProductsData } =
    useGetStoreProducts(queryParams);

  const formattedProducts = productsData?.products
    ? productsData?.products?.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price, //formatPrice(product.price) as unknown as number,
        category: product.category?.name as string,
        color: product.color?.value as string,
        storeId: product.store?.id as string,
        categoryId: product.category?.id,
        brandId: product.brand?.id,
        colorId: product.color?.id,
        images: product.images,
        image: product.images[0],
        originalPrice: product.price,
        description: product.description,
        quantity: product.quantity,
        isOriginal: product.isOriginal,
        isPublished: product.isPublished,
      }))
    : [];
  return (
    <div className='p-6'>
      {isLoadingProductsData ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`Products (${productsData?.totalCount})`}
            description='All products from store'
          />
          <div className='flex items-center gap-x-4'>
            <Link href={STORE_URL.productCreate(storeId)}>
              <Button variant='default'>
                <CirclePlus className='size-5' />
                Create
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className='w-full'>
        <DataTable
          columns={productColumns}
          data={formattedProducts}
          filterKey='title'
          totalCount={productsData?.totalCount as number}
          queryParams={queryParams}
          onChangeSearch={changeSearch}
          onChangeSort={changeSort}
        />
        {!!productsData?.totalCount && (
          <CustomPagination
            limit={queryParams?.params?.limit as number}
            total={productsData?.totalCount as number}
            skip={queryParams?.params?.skip as number}
            onPageChange={changePage}
            onLimitChange={changeLimit}
          />
        )}
      </div>
    </div>
  );
}
