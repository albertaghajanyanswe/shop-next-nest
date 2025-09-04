'use client';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/data-loading/DataTable';
import DataTableLoading from '@/components/ui/data-loading/DataTableLoading';
import { Heading } from '@/components/ui/Heading';
import { STORE_URL } from '@/config/url.config';
import { useGetColors } from '@/hooks/queries/colors/useGetColors';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { colorColumns } from './ColorColumns';
import { IColor } from '@/shared/types/color.interface';
import { formateDate } from '@/utils/date/formateDate';

export function Colors() {
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;

  const { colors, isLoadingColors } = useGetColors();
  const formattedColors: IColor[] = colors
    ? colors?.map((color) => ({
        id: color.id,
        createdAt: formateDate(color.createdAt),
        name: color.name,
        value: color.value,
        storeId: color.storeId,
      }))
    : [];
  return (
    <div className='p-6'>
      {isLoadingColors ? (
        <DataTableLoading />
      ) : (
        <div className='flex items-center justify-between'>
          <Heading
            title={`Colors (${formattedColors.length})`}
            description='All colors from store'
          />
          <div className='flex items-center gap-x-4'>
            <Link href={STORE_URL.colorCreate(storeId)}>
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
          columns={colorColumns}
          data={formattedColors}
          filterKey='name'
        />
      </div>
    </div>
  );
}
