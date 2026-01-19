import { SortOrder } from '@/utils/sortConstants';

export interface iSort {
  field: string;
  order: SortOrder | '';
}

export interface iFilter {
  [key: string]: any;
}

export interface iSearch {
  value: string;
  fields: string[];
}

export interface iParams {
  sort?: iSort;
  filter?: iFilter;
  limit?: number;
  skip?: number;
  search?: iSearch;
}
export interface iFilterParams {
  params: iParams;
}
