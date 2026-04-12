'use client';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { STORE_URL } from '@/config/url.config';
import { useGetBrands } from '@/hooks/queries/brands/useGetBrands';
import { IBrandColumn } from '@/shared/types/brand.interface';
import { formateDate } from '@/utils/formateDate';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { brandColumns } from './BrandColumns';
import { useProfile } from '@/hooks/useProfile';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/customComponents/CustomPagination';
import { useTranslations } from 'next-intl';

export function Brands() {
  const t = useTranslations('StorePages');
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;
  const { user } = useProfile();

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
            fields: ['name', 'description'],
          },
        },
      },
    });

  const { brandsData, isLoadingBrandsData } = useGetBrands(queryParams);

  const formattedBrands: Array<IBrandColumn & { isCurrentUserAdmin: boolean }> =
    brandsData?.brands
      ? brandsData?.brands?.map((brand) => ({
          id: brand.id,
          name: brand.name,
          createdAt: formateDate(brand.createdAt),
          storeId: brand.storeId,
          images: brand.images,
          image: brand?.images?.[0],
          isCurrentUserAdmin:
            user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
        }))
      : [];

  const brandColumnsList = brandColumns(storeId, t);
  return (
    <div className='p-6'>
      {isLoadingBrandsData ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`${t('brands_title')} (${brandsData?.totalCount})`}
            description={t('brands_description')}
          />
          <div className='flex items-center gap-x-4'>
            <Link href={STORE_URL.brandCreate(storeId)}>
              <Button variant='default'>
                <CirclePlus className='size-5' />
                {t('create')}
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className='mt-3'>
        <DataTable
          columns={brandColumnsList}
          data={formattedBrands}
          filterKey='name'
          totalCount={brandsData?.totalCount as number}
          queryParams={queryParams}
          onChangeSearch={changeSearch}
          onChangeSort={changeSort}
        />
        {!!brandsData?.totalCount && (
          <CustomPagination
            limit={queryParams?.params?.limit as number}
            total={brandsData?.totalCount as number}
            skip={queryParams?.params?.skip as number}
            onPageChange={changePage}
            onLimitChange={changeLimit}
          />
        )}
      </div>
    </div>
  );
}
