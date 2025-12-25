'use client';

import { saveTokenStorage } from '@/services/auth/auth-token.service';
import { authService } from '@/services/auth/auth.service';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IOrderItemColumns, OrderItemColumns } from './OrderItemColumns';
import { useProfile } from '@/hooks/useProfile';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/ui/CustomPagination';
import { GetOrderItemsDetailsDto } from '@/generated/orval/types';
import { useGetOrderItems } from '@/hooks/queries/orders/useGetOrderItems';
import { OrderItemDetailsModal } from '@/components/modals/orderDetailsModal/OrderItemDetailsModal';

export default function SoldOrders() {
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

  const { orderItemsData, isLoadingOrderItems } = useGetOrderItems(queryParams);

  const { mutate: logout } = useMutation({
    mutationKey: QUERY_KEYS.logout,
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      router.push('/auth');
    },
  });

  if (!user) return null;

  const formattedOrders: IOrderItemColumns[] = orderItemsData?.orderItems
    ? orderItemsData?.orderItems?.map((orderItem) => ({
        id: orderItem.id,
        createdAt: orderItem.createdAt,
        status: orderItem.order.status,
        price: orderItem.price,
        quantity: orderItem.quantity,
      }))
    : [];

  const [selectedOrderItem, setSelectedOrderItem] =
    useState<GetOrderItemsDetailsDto | null>(null);

  const handleRowClick = (order: IOrderItemColumns) => {
    setSelectedOrderItem(
      orderItemsData?.orderItems?.find(
        (i) => i.id === order.id
      ) as GetOrderItemsDetailsDto
    );
    setIsOpen(true);
  };

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className=''>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Sold items</h1>
        </div>
        <DataTable
          columns={OrderItemColumns}
          data={formattedOrders}
          totalCount={orderItemsData?.totalCount as number}
          limit={queryParams?.params?.limit as number}
          skip={queryParams?.params?.skip as number}
          onPageChange={changePage}
          onLimitChange={changeLimit}
          queryParams={queryParams}
          onChangeSearch={changeSearch}
          onChangeSort={changeSort}
          onRowClick={handleRowClick}
        />
        {!!orderItemsData?.totalCount && (
          <CustomPagination
            limit={queryParams?.params?.limit as number}
            total={orderItemsData?.totalCount as number}
            skip={queryParams?.params?.skip as number}
            onPageChange={changePage}
            onLimitChange={changeLimit}
          />
        )}
        {isOpen && selectedOrderItem && (
          <OrderItemDetailsModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            orderItem={selectedOrderItem}
            user={user}
            showConfirm
          />
        )}
      </div>
    </>
  );
}
