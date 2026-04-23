'use client';

import { useViewMode } from '@/components/customComponents/admin/useViewMode';
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
import { useTranslations } from 'next-intl';
import { ViewToggle } from '@/components/customComponents/admin/ViewToggle';
import { AdminProductCard } from './AdminProductCard';

export function Products() {
  const t = useTranslations('StorePages');
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;
  const [viewMode, setViewMode] = useViewMode('products');

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
        price: product.price,
        category: product.category?.name as string,
        color: product.color?.value as string,
        storeId: product.store?.id as string,
        categoryId: product.category?.id,
        brandId: product.brand?.id,
        colorId: product.color?.id,
        images: product.images,
        image: product.images[0],
        originalPrice: product.price,
        description: product.description || '',
        quantity: product.quantity,
        isOriginal: product.isOriginal,
        isPublished: product.isPublished,
      }))
    : [];

  const productColumnList = productColumns(t);

  return (
    <div className='p-6'>
      {isLoadingProductsData ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`${t('products_title')} (${productsData?.totalCount})`}
            description={t('products_description')}
          />
          <div className='flex items-center gap-x-3'>
            <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
            <Link href={STORE_URL.productCreate(storeId)}>
              <Button variant='default'>
                <CirclePlus className='size-5' />
                {t('create')}
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className='w-full'>
        {viewMode === 'card' ? (
          <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {formattedProducts.map((product) => (
              <AdminProductCard key={product.id} product={product} t={t} />
            ))}
          </div>
        ) : (
          <DataTable
            columns={productColumnList}
            data={formattedProducts}
            filterKey='title'
            totalCount={productsData?.totalCount as number}
            queryParams={queryParams}
            onChangeSearch={changeSearch}
            onChangeSort={changeSort}
          />
        )}
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
