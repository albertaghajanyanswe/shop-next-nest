'use client';

import { useTranslations } from 'next-intl';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { GetStoreDto } from '@/generated/orval/types';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/customComponents/CustomPagination';
import LoadingProducts from '@/components/customComponents/loading/LoadingProducts';
import { storeService } from '@/services/store.service';
import { StoreCard } from '@/components/customComponents/StoreCard';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { SearchInput } from '@/components/layouts/mainLayout/header/searchInput/SearchInput';

interface StoresPageProps {
  stores?: GetStoreDto[];
  totalCount?: number;
}

export default function StoresPage({
  totalCount = 0,
  stores,
}: StoresPageProps) {
  const t = useTranslations('StoresPage');
  const { queryParams, changePage, changeLimit } = useQueryParams({
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

  const {
    data: storesData,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: [QUERY_KEYS.getAllStores[0], JSON.stringify(queryParams.params)],
    queryFn: () => storeService.getAll(queryParams.params),
    initialData: { stores, totalCount },
    placeholderData: keepPreviousData,
  });

  const loading = isLoading || isPending;

  return (
    <>
      <div className='mt-4 mb-4 md:flex md:items-center md:justify-between'>
        <div className='w-full px-0'>
          <p className='text-2xl font-semibold'>{t('title')}</p>
          <p className='mt-2 mb-6 line-clamp-2 text-sm font-medium text-neutral-500'>
            {t('description')}
          </p>
          <SearchInput
            placeholder={t('search_placeholder')}
            redirectToShop={false}
          />
        </div>
      </div>
      <div className='relative mt-4'>
        {loading ? (
          <LoadingProducts entityName={t('title')} />
        ) : (
          <>
            <div className='flex w-full items-center'>
              {storesData?.stores && storesData?.stores?.length > 0 ? (
                <div className='mt-2 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
                  {storesData?.stores.map((store) => (
                    <StoreCard key={store.id} store={store} showInfo makeDark />
                  ))}
                </div>
              ) : (
                <NoDataFound entityName={t('title')} />
              )}
            </div>

            {!!storesData?.totalCount && (
              <CustomPagination
                limit={queryParams.params.limit as number}
                total={storesData?.totalCount ?? totalCount}
                skip={queryParams.params.skip as number}
                onPageChange={changePage}
                onLimitChange={changeLimit}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
