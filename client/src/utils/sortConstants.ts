export type SortOrder = 'asc' | 'desc';

export interface SortOption<
  TValue extends string = string,
  TField extends string = string,
> {
  label: string;
  value: TValue;
  field: TField;
  order: SortOrder;
}

export const SORT_PRODUCT_OPTIONS: readonly SortOption<string, string>[] = [
  {
    label: 'newest',
    value: 'createdAt_desc',
    field: 'createdAt',
    order: 'desc',
  },
  {
    label: 'price_high_low',
    value: 'price_desc',
    field: 'price',
    order: 'desc',
  },
  {
    label: 'price_low_high',
    value: 'price_asc',
    field: 'price',
    order: 'asc',
  },
  {
    label: 'rating',
    value: 'totalViews_desc',
    field: 'totalViews',
    order: 'desc',
  },
] as const;
