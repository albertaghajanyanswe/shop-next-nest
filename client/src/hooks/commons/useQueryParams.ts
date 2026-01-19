'use client';

import { useCallback, useMemo } from 'react';
import qs from 'qs';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  iFilter,
  iFilterParams,
  iSearch,
  iSort,
} from '@/shared/types/filter.interface';

export const useQueryParams = ({
  pageDefaultParams,
}: {
  pageDefaultParams?: iFilterParams;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryParams: iFilterParams = useMemo(() => {
    const parsed = qs.parse(searchParams.toString(), {
      ignoreQueryPrefix: true,
      allowDots: true,
      arrayLimit: Infinity,
    });

    const res = {
      params: {
        sort: (parsed.sort as unknown as iSort) ??
          pageDefaultParams?.params.sort ?? { field: 'createdAt', order: 'desc' },
        filter:
          (parsed.filter as iFilter) ?? pageDefaultParams?.params.filter ?? {},
        limit: parsed.limit
          ? Number(parsed.limit)
          : (pageDefaultParams?.params.limit ?? 10),
        skip: parsed.skip
          ? Number(parsed.skip)
          : (pageDefaultParams?.params.skip ?? 0),
        search: (parsed.search as unknown as iSearch) ??
          pageDefaultParams?.params.search ?? {
            value: '',
            fields: ['title', 'description'],
          },
      },
    };
    return res;
  }, [searchParams, pageDefaultParams]);

  const replaceRoutePath = useCallback(
    (newQuery: any) => {
      const query = qs.stringify(newQuery, { skipNulls: true });
      router.replace(`${pathname}?${query}`);
    },
    [router, pathname]
  );

  const pushRoutePath = useCallback(
    (newQuery: any, newRoute: string) => {
      const query = qs.stringify(newQuery, { skipNulls: true });
      router.push(`${newRoute}?${query}`);
    },
    [router]
  );

  const setFilteredParams = useCallback(
    (newParams: iFilterParams) => {
      replaceRoutePath(newParams.params);
    },
    [replaceRoutePath]
  );

  const setFilteredParamsWithPush = useCallback(
    (newParams: iFilterParams, newRoute: string) => {
      pushRoutePath(newParams.params, newRoute);
    },
    [pushRoutePath]
  );

  const changeFilterObject = useCallback(
    (newFilter: iFilter) => {
      replaceRoutePath({
        ...queryParams.params,
        filter: newFilter,
        skip: 0,
      });
    },
    [replaceRoutePath, queryParams]
  );

  const changePage = (page: number) => {
    setFilteredParams({
      params: {
        ...queryParams.params,
        skip: (page - 1) * (queryParams?.params?.limit || 20),
      },
    });
  };
  const changeLimit = useCallback(
    (limit: number) => {
      setFilteredParams({
        params: {
          ...queryParams.params,
          limit,
          skip: 0,
        },
      });
    },
    [queryParams, setFilteredParams]
  );

  const changeSort = useCallback(
    (sort: iSort) => {
      setFilteredParams({
        params: {
          ...queryParams.params,
          sort,
          skip: 0,
        },
      });
    },
    [queryParams, setFilteredParams]
  );

  const changeSearch = useCallback(
    (value: string) => {
      setFilteredParams({
        params: {
          ...queryParams.params,
          search: {
            ...(queryParams?.params?.search as iSearch),
            value,
          },
          skip: 0,
        },
      });
    },
    [queryParams, setFilteredParams]
  );

  return {
    queryParams,
    setFilteredParams,
    setFilteredParamsWithPush,
    changeFilterObject,
    replaceRoutePath,
    pushRoutePath,
    changePage,
    changeLimit,
    changeSort,
    changeSearch,
  };
};
