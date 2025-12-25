'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Catalog } from '@/components/ui/catalog/Catalog';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import {
  GetBrandDto,
  GetCategoryDto,
  GetProductWithDetails,
  GetStoreDto,
} from '@/generated/orval/types';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/ui/CustomPagination';
import Filters from '@/components/customComponents/filters/Filters';
import LoadingProducts from '@/components/customComponents/loading/LoadingProducts';
import { StoreCard } from '@/components/customComponents/StoreCard';

interface ShopProps {
  initialProducts?: GetProductWithDetails[];
  stores?: GetStoreDto[];
  categories?: GetCategoryDto[];
  brands?: GetBrandDto[];
  totalCount?: number;
  store?: GetStoreDto;
}

export default function Shop({
  initialProducts,
  totalCount = 0,
  stores,
  categories,
  brands,
  store,
}: ShopProps) {
  const { queryParams, changePage, changeLimit } = useQueryParams({
    pageDefaultParams: {
      params: {
        sort: { field: 'createdAt', order: 'desc' },
        filter: {},
        limit: 10,
        skip: 0,
        search: {
          value: '',
          fields: ['id', 'title', 'description'],
        },
      },
    },
  });

  console.log('queryParams = ', queryParams);

  const {
    data: productData,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: [QUERY_KEYS.productShop[0], JSON.stringify(queryParams.params)],
    queryFn: () =>
      store
        ? productService.getByStoreIdPublic(store.id, queryParams.params)
        : productService.getAll(queryParams.params),
    initialData: { products: initialProducts, totalCount },
    // keepPreviousData: true,
  });

  const loading = isLoading || isPending;

  return (
    <>
      {store && (
        <div className='mt-4 mb-10 grid grid-cols-12 gap-6 rounded-lg md:items-center md:justify-between'>
          <div className='col-span-12 lg:col-span-12'>
            <StoreCard
              store={store}
              heightClass='h-80'
              imgClass='object-contain'
              showInfo
              expandDesc
            />
          </div>
        </div>
      )}
      <div className='grid grid-cols-1 gap-6 py-6 md:grid-cols-[250px_1fr]'>
        <Filters categories={categories} brands={brands} stores={stores} />
        <div className='relative w-full'>
          {loading ? (
            <LoadingProducts entityName='Products' />
          ) : (
            <>
              <Catalog
                title={
                  queryParams?.params?.search?.value
                    ? `Search by query ${queryParams?.params?.search?.value}`
                    : 'Product catalog'
                }
                products={productData?.products ?? []}
                showSearch
                searchRedirectToShop={false}
              />

              {!!productData?.totalCount && (
                <CustomPagination
                  limit={queryParams.params.limit as number}
                  total={productData?.totalCount ?? totalCount}
                  skip={queryParams.params.skip as number}
                  onPageChange={changePage}
                  onLimitChange={changeLimit}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
