'use client';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { STORE_URL } from '@/config/url.config';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { categoryColumns } from './CategoryColumns';
import { formateDate } from '@/utils/formateDate';
import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';
import { ICategoryColumn } from '@/shared/types/category.interface';
import { useProfile } from '@/hooks/useProfile';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/ui/CustomPagination';

export function Categories() {
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
        isCurrentUserAdmin: user?.role === 'ADMIN',
      }))
    : [];

  const categoryColumnList = categoryColumns(storeId);
  return (
    <div className='p-6'>
      {isLoadingCategoriesData ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`Categories (${categoriesData?.totalCount})`}
            description='All Categories from store'
          />
          <div className='flex items-center gap-x-4'>
            <Link href={STORE_URL.categoryCreate(storeId)}>
              <Button variant='primary'>
                <Plus className='size-4' />
                Create
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className='w-full'>
        <DataTable
          columns={categoryColumnList}
          data={formattedCategories}
          filterKey='name'
          totalCount={categoriesData?.totalCount as number}
          limit={queryParams?.params?.limit as number}
          skip={queryParams?.params?.skip as number}
          onPageChange={changePage}
          onLimitChange={changeLimit}
          queryParams={queryParams}
          onChangeSearch={changeSearch}
          onChangeSort={changeSort}
        />

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
