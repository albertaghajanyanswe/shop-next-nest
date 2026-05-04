'use client';

import { useCallback, useMemo, useState } from 'react';
import { IOrderColumns, orderColumns } from './OrderColumns';
import { useProfile } from '@/hooks/useProfile';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/customComponents/CustomPagination';
import {
  GetOrderDtoStatus,
  GetOrderWithItemsDto,
} from '@/generated/orval/types';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { OrderDetailsModal } from '@/components/modals/orderDetailsModal/OrderDetailsModal';
import { useGetAllOrders } from '@/hooks/queries/orders/useGetAllOrder';
import { useTranslations } from 'next-intl';
import { ViewToggle } from '@/components/customComponents/admin/ViewToggle';
import { useViewMode } from '@/components/customComponents/admin/useViewMode';
import { AdminOrderCard } from '@/components/customComponents/admin/AdminOrderCard';

export default function ManageOrders() {
  const t = useTranslations('DashboardSettings');
  const { user } = useProfile();
  const [viewMode, setViewMode] = useViewMode('manageOrders');

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

  const formattedOrders = useMemo<IOrderColumns[]>(() => {
    if (!ordersData?.orders) return [];

    return ordersData.orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      totalPrice: order.totalPrice,
      type: order.subscriptionId ? t('type_subscription') : t('type_product'),
      itemsCount: order.orderItems?.length ?? 0,
      itemsNames: order.orderItems
        .map((item) => `${item.cachedProductTitle} (x${item.quantity})`)
        .join(', '),
    }));
  }, [ordersData?.orders]);

  const handleRowClick = useCallback(
    (order: IOrderColumns) => {
      const found = ordersData?.orders?.find((i) => i.id === order.id);

      if (found) {
        setSelectedOrderId(found.id);
        setIsOpen(true);
      }
    },
    [ordersData?.orders]
  );

  // const [selectedOrder, setSelectedOrder] =
  //   useState<GetOrderWithItemsDto | null>(null);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;

    return ordersData?.orders?.find((i) => i.id === selectedOrderId) ?? null;
  }, [selectedOrderId, ordersData?.orders]);

  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className=''>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>{t('manage_orders_title')}</h1>
          <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>
        {isLoadingOrdersData ? (
          <DataTableLoading />
        ) : (
          <>
            {viewMode === 'table' ? (
              <DataTable
                data={formattedOrders}
                columns={orderColumns(t)}
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
            ) : (
              <div className='mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2'>
                {ordersData?.orders?.map((order) => (
                  <AdminOrderCard
                    key={order.id}
                    order={order}
                    showConfirm={order.status === GetOrderDtoStatus.SUCCEEDED}
                    showRefund={order.status === GetOrderDtoStatus.SUCCEEDED}
                  />
                ))}
              </div>
            )}
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
                showConfirm={
                  selectedOrder.status === GetOrderDtoStatus.SUCCEEDED
                }
                showRefund={
                  selectedOrder.status === GetOrderDtoStatus.SUCCEEDED
                }
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

