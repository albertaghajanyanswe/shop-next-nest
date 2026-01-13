'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { usePathname } from 'next/navigation';

type SortValue = 'price_desc' | 'price_asc' | 'rating_desc';

export const SORT_OPTIONS = [
  {
    label: 'Newest',
    value: 'createdAt_desc',
    field: 'createdAt',
    order: 'desc',
  },
  {
    label: 'Price: High → Low',
    value: 'price_desc',
    field: 'price',
    order: 'desc',
  },
  {
    label: 'Price: Low → High',
    value: 'price_asc',
    field: 'price',
    order: 'asc',
  },
  {
    label: 'Rating',
    value: 'totalViews_desc',
    field: 'totalViews',
    order: 'desc',
  },
] as const;

export function SortSelect({ triggerClassName = 'w-[220px]' }: { triggerClassName?: string }) {
  const pathname = usePathname();
  const { queryParams, changeSort } = useQueryParams({});

  const handleSort = ({
    field,
    order,
  }: {
    field: string;
    order: 'asc' | 'desc';
  }) => {
    changeSort({ field, order });
  };
  const sort = queryParams?.params?.sort || {
    field: 'createdAt',
    order: 'desc',
  };

  const value: SortValue =
    sort?.field === 'rating'
      ? 'rating_desc'
      : (`${sort.field}_${sort.order}` as SortValue);

  console.log('\n\n sort ', sort);
  console.log('value ', value);
  return (
    <Select
      value={value}
      onValueChange={(value: SortValue) => {
        const [field, order] = value.split('_') as [string, 'asc' | 'desc'];
        handleSort({ field, order });
      }}
    >
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder='Sort by' />
      </SelectTrigger>

      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
