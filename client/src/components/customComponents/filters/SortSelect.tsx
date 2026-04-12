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
import { useTranslations } from 'next-intl';

export function SortSelect({
  triggerClassName = 'w-[220px]',
  options,
}: {
  triggerClassName?: string;
  options: readonly SortOption<string, string>[];
}) {
  const t = useTranslations('Sorting');
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
      <SelectTrigger
        className={triggerClassName}
        aria-label={t('trigger_label')}
      >
        <SelectValue placeholder={t('placeholder')} />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {t(opt.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
