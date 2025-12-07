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

interface ShopProps {
  initialProducts?: GetProductWithDetails[];
  stores?: GetStoreDto[];
  categories?: GetCategoryDto[];
  brands?: GetBrandDto[];
  totalCount?: number;
}

export default function Shop({
  initialProducts,
  totalCount = 0,
  stores,
  categories,
  brands,
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
          fields: ['title', 'description'],
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
    queryKey: [
      QUERY_KEYS.productExplorer[0],
      JSON.stringify(queryParams.params),
    ],
    queryFn: () => productService.getAll(queryParams.params),
    initialData: { products: initialProducts, totalCount },
    // keepPreviousData: true,
  });

  const loading = isLoading || isPending;

  return (
    <>
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
