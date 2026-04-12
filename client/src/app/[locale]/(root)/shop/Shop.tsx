'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Catalog } from '@/components/customComponents/catalog/Catalog';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import {
  GetBrandDto,
  GetCategoryDto,
  GetProductWithDetails,
  GetStoreDto,
} from '@/generated/orval/types';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/customComponents/CustomPagination';
import Filters from '@/components/customComponents/filters/Filters';
import LoadingProducts from '@/components/customComponents/loading/LoadingProducts';
import { StoreCard } from '@/components/customComponents/StoreCard';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('ShopPage');
  const { queryParams, changePage, changeLimit } = useQueryParams({
    pageDefaultParams: {
      params: {
        sort: { field: 'createdAt', order: 'desc' },
        filter: {},
        limit: 40,
        skip: 0,
        search: {
          value: '',
          fields: ['id', 'title', 'description'],
        },
      },
    },
  });

  const {
    data: productData,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: [QUERY_KEYS.productShop[0], queryParams.params],
    queryFn: () =>
      store
        ? productService.getByStoreIdPublic(store.id, queryParams.params)
        : productService.getAll(queryParams.params),
    initialData: initialProducts
      ? { products: initialProducts, totalCount }
      : undefined,
    placeholderData: keepPreviousData,
  });

  const loading = isLoading || isPending;

  const catalogTitle = useMemo(() => {
    const q = queryParams.params.search?.value;
    return q ? `${t('search_by_query')} : ${q}` : t('products_catalog');
  }, [queryParams.params.search?.value]);

  return (
    <>
      {store && (
        <div className='mt-4 mb-10 grid grid-cols-12 gap-6 rounded-lg md:items-center md:justify-between'>
          <div className='col-span-12 lg:col-span-12'>
            <StoreCard store={store} showInfo expandDesc />
          </div>
        </div>
      )}
      <div className='grid grid-cols-1 gap-6 py-6 md:grid-cols-[250px_1fr]'>
        <Filters categories={categories} brands={brands} stores={stores} />
        <div className='relative w-full'>
          {loading ? (
            <LoadingProducts entityName={t('products')} />
          ) : (
            <>
              <Catalog
                title={`${catalogTitle} (${productData?.totalCount ?? totalCount})`}
                products={productData?.products ?? []}
                showSearch
                showSort
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
