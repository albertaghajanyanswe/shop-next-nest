'use client';

import { useViewMode } from '@/components/customComponents/admin/useViewMode';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { STORE_URL } from '@/config/url.config';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { categoryColumns } from './CategoryColumns';
import { formateDate } from '@/utils/formateDate';
import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';
import { ICategoryColumn } from '@/shared/types/category.interface';
import { useProfile } from '@/hooks/useProfile';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/customComponents/CustomPagination';
import { useTranslations } from 'next-intl';
import { ViewToggle } from '@/components/customComponents/admin/ViewToggle';
import { AdminCategoryCard } from './AdminCategoryCard';

export function Categories() {
  const t = useTranslations('StorePages');
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;
  const { user } = useProfile();
  const [viewMode, setViewMode] = useViewMode('categories');

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

  const { categoriesData, isLoadingCategoriesData } =
    useGetCategories(queryParams);

  const formattedCategories: Array<
    ICategoryColumn & { isCurrentUserAdmin: boolean }
  > = categoriesData?.categories
    ? categoriesData?.categories?.map((category) => ({
        id: category.id,
        createdAt: formateDate(category.createdAt),
        name: category.name,
        description: category.description || '',
        images: category.images || [],
        image: category?.images?.[0] || '',
        storeId: category.storeId as string,
        isCurrentUserAdmin:
          user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
      }))
    : [];

  const categoryColumnList = categoryColumns(storeId, t);

  return (
    <div className='p-6'>
      {isLoadingCategoriesData ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`${t('categories_title')} (${categoriesData?.totalCount})`}
            description={t('categories_description')}
          />
          <div className='flex items-center gap-x-3'>
            <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
            <Link href={STORE_URL.categoryCreate(storeId)}>
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
            {formattedCategories.map((category) => (
              <AdminCategoryCard
                key={category.id}
                category={category}
                storeId={storeId}
                t={t}
              />
            ))}
          </div>
        ) : (
          <DataTable
            columns={categoryColumnList}
            data={formattedCategories}
            filterKey='name'
            totalCount={categoriesData?.totalCount as number}
            queryParams={queryParams}
            onChangeSearch={changeSearch}
            onChangeSort={changeSort}
          />
        )}
        {!!categoriesData?.totalCount && (
          <CustomPagination
            limit={queryParams?.params?.limit as number}
            total={categoriesData?.totalCount as number}
            skip={queryParams?.params?.skip as number}
            onPageChange={changePage}
            onLimitChange={changeLimit}
          />
        )}
      </div>
    </div>
  );
}
