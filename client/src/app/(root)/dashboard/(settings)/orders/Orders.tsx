'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { saveTokenStorage } from '@/services/auth/auth-token.service';
import { authService } from '@/services/auth/auth.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { IOrderColumns, orderColumns } from './OrderColumns';
import { useProfile } from '@/hooks/useProfile';
import { EnumOrderStatus } from '@/shared/types/order.interface';
import { formatPrice } from '@/utils/formatPrice';
import { formateDate } from '@/utils/formateDate';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { useGetOrders } from '@/hooks/queries/orders/useGetOrder';
import { CustomPagination } from '@/components/ui/CustomPagination';

export default function Orders() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    if (accessToken) {
      saveTokenStorage(accessToken);
    }
  }, [searchParams]);

  const { user } = useProfile();

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
            fields: ['id', 'status'],
          },
        },
      },
    });

  const { ordersData, isLoadingOrdersData } = useGetOrders(queryParams);

  const { mutate: logout } = useMutation({
    mutationKey: QUERY_KEYS.logout,
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.push('/auth');
    },
  });

  if (!user) return null;

  const formattedOrders: IOrderColumns[] = ordersData?.orders
    ? ordersData?.orders?.map((order) => ({
        createdAt: formateDate(order.createdAt as unknown as string),
        status: order.status === EnumOrderStatus.PENDING ? 'Pending' : 'Paid',
        totalPrice: order.totalPrice,
      }))
    : [];

  return (
    <div className='my-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>My orders</h1>
      </div>
      <DataTable
        columns={orderColumns}
        data={formattedOrders}
        totalCount={ordersData?.totalCount as number}
        limit={queryParams?.params?.limit as number}
        skip={queryParams?.params?.skip as number}
        onPageChange={changePage}
        onLimitChange={changeLimit}
        queryParams={queryParams}
        onChangeSearch={changeSearch}
        onChangeSort={changeSort}
      />
      {!!ordersData?.totalCount && (
        <CustomPagination
          limit={queryParams?.params?.limit as number}
          total={ordersData?.totalCount as number}
          skip={queryParams?.params?.skip as number}
          onPageChange={changePage}
          onLimitChange={changeLimit}
        />
      )}
    </div>
  );
}
