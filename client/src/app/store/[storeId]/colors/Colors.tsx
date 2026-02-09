'use client';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { STORE_URL } from '@/config/url.config';
import { useGetColors } from '@/hooks/queries/colors/useGetColors';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { colorColumns } from './ColorColumns';
import { formateDate } from '@/utils/formateDate';
import { IColorColumn } from '@/shared/types/color.interface';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/customComponents/CustomPagination';

export function Colors() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

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

  const { colorsData, isLoadingColorsData } = useGetColors(queryParams);

  const formattedColors: IColorColumn[] = colorsData?.colors
    ? colorsData?.colors?.map((color) => ({
        id: color.id,
        createdAt: formateDate(color.createdAt),
        name: color.name,
        value: color.value,
        storeId: color.storeId as string,
      }))
    : [];
  return (
    <div className='p-6'>
      {isLoadingColorsData ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`Colors (${colorsData?.totalCount})`}
            description='All colors from store'
          />
          <div className='flex items-center gap-x-4'>
            <Link href={STORE_URL.colorCreate(storeId)}>
              <Button variant='default'>
                <CirclePlus className='size-5' />
                Create
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className='mt-3'>
        <DataTable
          columns={colorColumns}
          data={formattedColors}
          filterKey='name'
          totalCount={colorsData?.totalCount as number}
          queryParams={queryParams}
          onChangeSearch={changeSearch}
          onChangeSort={changeSort}
        />

        {!!colorsData?.totalCount && (
          <CustomPagination
            limit={queryParams?.params?.limit as number}
            total={colorsData?.totalCount as number}
            skip={queryParams?.params?.skip as number}
            onPageChange={changePage}
            onLimitChange={changeLimit}
          />
        )}
      </div>
    </div>
  );
}
