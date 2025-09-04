'use client';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/data-loading/DataTable';
import DataTableLoading from '@/components/ui/data-loading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { STORE_URL } from '@/config/url.config';
import { useGetBrands } from '@/hooks/queries/brands/useGetBrands';
import { IBrand } from '@/shared/types/brand.interface';
import { formateDate } from '@/utils/date/formateDate';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { brandColumns } from './BrandColumns';

export function Brands() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { brands, isLoadingBrands } = useGetBrands();

  const formattedBrands: IBrand[] = brands
    ? brands?.map((brand) => ({
        id: brand.id,
        createdAt: formateDate(brand.createdAt),
        name: brand.name,
        storeId: brand.storeId,
        categoryId: brand.categoryId,
        category: brand.category,
        categoryTitle: brand.category.title,
      }))
    : [];

  return (
    <div className='p-6'>
      {isLoadingBrands ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`Brands (${formattedBrands.length})`}
            description='All brands from store'
          />
          <div className='flex items-center gap-x-4'>
            <Link href={STORE_URL.brandCreate(storeId)}>
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
          columns={brandColumns}
          data={formattedBrands}
          filterKey='name'
        />
      </div>
    </div>
  );
}
