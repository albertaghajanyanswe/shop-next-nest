'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { SortOption, SortOrder } from '@/utils/sortConstants';

export function SortSelect({
  triggerClassName = 'w-[220px]',
  options,
}: {
  triggerClassName?: string;
  options: readonly SortOption<string, string>[];
}) {
  const { queryParams, changeSort } = useQueryParams({});

  const handleSort = ({
    field,
    order,
  }: {
    field: string;
    order: SortOrder;
  }) => {
    changeSort({ field, order });
  };
  const sort = queryParams?.params?.sort || {
    field: 'createdAt',
    order: 'desc',
  };

  const value = `${sort.field}_${sort.order}`;

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        const [field, order] = value.split('_') as [string, 'asc' | 'desc'];
        handleSort({ field, order });
      }}
    >
      <SelectTrigger className={triggerClassName} aria-label='Sort by'>
        <SelectValue placeholder='Sort by' />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
