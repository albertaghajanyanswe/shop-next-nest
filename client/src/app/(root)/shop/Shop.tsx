'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Catalog } from '@/components/ui/catalog/Catalog';
import { productService } from '@/services/product.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { GetProductWithDetails } from '@/generated/orval/types';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/ui/CustomPagination';
import { SearchInput } from '@/components/layouts/mainLayout/header/searchInput/SearchInput';
import { useEffect } from 'react';

interface ShopProps {
  products: GetProductWithDetails[] | undefined;
  totalCount?: number;
}

export default function Shop({ products, totalCount = 0 }: ShopProps) {
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
  const initialProducts = products?.slice(0, queryParams.params.limit ?? 10);

  console.log('EXPLORER queryParams = ', queryParams);
  const { data: productData } = useQuery({
    queryKey: [
      QUERY_KEYS.productExplorer[0],
      JSON.stringify(queryParams.params),
    ],
    queryFn: () => productService.getAll(queryParams.params),
    initialData: { products: initialProducts, totalCount },
    // keepPreviousData: true,
  });

  return (
    <div className='my-6'>
      <Catalog
        title={
          queryParams?.params?.search?.value
            ? `Search by query ${queryParams?.params?.search?.value}`
            : 'Product catalog'
        }
        products={productData?.products}
      />
      <CustomPagination
        limit={queryParams.params.limit as number}
        total={productData?.totalCount ?? totalCount}
        skip={queryParams.params.skip as number}
        onPageChange={changePage}
        onLimitChange={changeLimit}
      />
    </div>
  );
}
