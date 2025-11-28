'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

import { Input } from '../formElements/Input';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/commons/useDebounce';
import { iFilterParams, iSort } from '@/shared/types/filter.interface';

export interface MyColumnMeta {
  sortField?: string;
  className?: string;
  textClassName?: string;
}

export type MyColumnDef<TData, TValue = any> = ColumnDef<TData, TValue> & {
  accessorKey?: string;
  meta?: MyColumnMeta;
};

interface DataTableProps<TData, TValue> {
  columns: MyColumnDef<TData, TValue>[];
  data: TData[];
  filterKey?: string;
  totalCount: number;
  limit: number;
  skip: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
  onChangeSearch: (value: string, fields?: string[]) => void;
  onChangeSort: (sortObj: iSort) => void;
  queryParams: iFilterParams;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  queryParams,
  onChangeSearch,
  onChangeSort,
}: DataTableProps<TData, TValue>) {
  const [searchValue, setSearchValue] = useState(
    queryParams.params.search?.value ?? ''
  );
  const debouncedSearch = useDebounce(searchValue, 400);

  useEffect(() => {
    onChangeSearch(debouncedSearch);
  }, [debouncedSearch]);
  // ---------- STABLE SORTING ----------
  // const sorting = useMemo<SortingState>(() => {
  //   if (!queryParams.params.sort) return [];
  //   return [
  //     {
  //       id: queryParams.params.sort.field,
  //       desc: queryParams.params.sort.order === 'desc',
  //     },
  //   ];
  // }, [queryParams.params.sort]);
  const sorting = useMemo<SortingState>(() => {
    if (!queryParams.params.sort) return [];

    const sortField = queryParams.params.sort.field;

    const col = columns.find(
      (c) => c.meta?.sortField === sortField || c.accessorKey === sortField
    );

    if (!col) return [];

    return [
      {
        id: col.id ?? (col.accessorKey as string),
        desc: queryParams.params.sort.order === 'desc',
      },
    ];
  }, [queryParams.params.sort, columns]);

  // ---------- STABLE FILTERS ----------
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    if (!filterKey || !queryParams.params.search?.value) return [];
    return [
      {
        id: filterKey,
        value: queryParams.params.search.value,
      },
    ];
  }, [filterKey, queryParams.params.search]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    // ---------- SORT ----------
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater;

      if (newSorting.length === 0) return;

      const s = newSorting[0];

      // Ищем колонку по id
      const col = table.getAllColumns().find((c) => c.id === s.id);

      // Если у колонки нет sortField, значит она несортируемая — игнорируем
      const meta = col?.columnDef?.meta as MyColumnMeta | undefined;
      if (!meta?.sortField) return;

      const realField = meta.sortField;
      const newOrder = s.desc ? 'desc' : 'asc';
      const current = queryParams.params.sort;

      // Предотвращаем бесконечный цикл
      if (
        current &&
        current.field === realField &&
        current.order === newOrder
      ) {
        return;
      }

      // Вызываем backend
      onChangeSort({
        field: realField,
        order: newOrder,
      });
    },

    // ---------- FILTER ----------
    onColumnFiltersChange: (filters) => {
      const filter = (filters as { id: string; value: string }[])[0];

      if (!filter) {
        if (queryParams.params.search?.value) onChangeSearch('');
        return;
      }

      if (filter.value === queryParams.params.search?.value) return;

      onChangeSearch(filter.value);
    },
  });

  return (
    <div className=''>
      {filterKey && (
        <div className='flex items-center py-4'>
          <Input
            placeholder='Search...'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='max-w-sm'
          />
        </div>
      )}

      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`cursor-pointer select-none ${(header.column.columnDef.meta as MyColumnMeta)?.className ?? ''}`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className='group'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (cell.column.columnDef.meta as MyColumnMeta)?.className
                      }
                    >
                      <div
                        className={`text-sm ${(cell.column.columnDef.meta as MyColumnMeta)?.textClassName}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Not Found any data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
