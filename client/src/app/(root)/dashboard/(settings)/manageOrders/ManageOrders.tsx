'use client';

import { saveTokenStorage } from '@/services/auth/auth-token.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IOrderColumns, orderColumns } from './OrderColumns';
import { useProfile } from '@/hooks/useProfile';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { useGetOrders } from '@/hooks/queries/orders/useGetOrder';
import { CustomPagination } from '@/components/ui/CustomPagination';
import { GetOrderWithItemsDto } from '@/generated/orval/types';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { OrderDetailsModal } from '@/components/modals/orderDetailsModal/OrderDetailsModal';
import { useGetAllOrders } from '@/hooks/queries/orders/useGetAllOrder';

export default function ManageOrders() {
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

  const { ordersData, isLoadingOrdersData } = useGetAllOrders(queryParams);

  if (!user) return null;

  const formattedOrders: IOrderColumns[] = ordersData?.orders
    ? ordersData?.orders?.map((order) => ({
        id: order.id,
        createdAt: order.createdAt,
        status: order.status,
        totalPrice: order.totalPrice,
        type: order.subscriptionId ? 'Subscription' : 'Product',
        itemsCount: order?.orderItems?.length || 0,
      }))
    : [];

  const handleRowClick = (order: IOrderColumns) => {
    setSelectedOrder(
      ordersData?.orders?.find((i) => i.id === order.id) as GetOrderWithItemsDto
    );
    setIsOpen(true);
  };
  const [selectedOrder, setSelectedOrder] =
    useState<GetOrderWithItemsDto | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className=''>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Manage all orders</h1>
        </div>
        {isLoadingOrdersData ? (
          <DataTableLoading />
        ) : (
          <>
            <DataTable
              data={formattedOrders}
              columns={orderColumns}
              totalCount={ordersData?.totalCount as number}
              limit={queryParams?.params?.limit as number}
              skip={queryParams?.params?.skip as number}
              onPageChange={changePage}
              onLimitChange={changeLimit}
              queryParams={queryParams}
              onChangeSearch={changeSearch}
              onChangeSort={changeSort}
              onRowClick={handleRowClick}
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

            {isOpen && selectedOrder && (
              <OrderDetailsModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                order={selectedOrder}
                user={user}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
