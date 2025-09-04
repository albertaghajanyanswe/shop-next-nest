'use client';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/data-loading/DataTable';
import DataTableLoading from '@/components/ui/data-loading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { STORE_URL } from '@/config/url.config';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { categoryColumns, ICategoryColumn } from './CategoryColumns';
import { formateDate } from '@/utils/date/formateDate';
import { useGetCategories } from '@/hooks/queries/categories/useGetCategories';

export function Categories() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { categories, isLoadingCategories } = useGetCategories();

  const formattedCategories: ICategoryColumn[] = categories
    ? categories?.map((category) => ({
        id: category.id,
        createdAt: formateDate(category.createdAt),
        title: category.title,
        storeId: category.storeId,
      }))
    : [];
  return (
    <div className='p-6'>
      {isLoadingCategories ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`Categories (${formattedCategories.length})`}
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
      <div className='mt-3'>
        <DataTable
          columns={categoryColumns}
          data={formattedCategories}
          filterKey='title'
        />
      </div>
    </div>
  );
}
