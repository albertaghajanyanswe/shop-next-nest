'use client';

import { useCallback, useMemo, useState } from 'react';
import { IOrderColumns, orderColumns } from './OrderColumns';
import { useProfile } from '@/hooks/useProfile';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { useGetOrders } from '@/hooks/queries/orders/useGetOrder';
import { CustomPagination } from '@/components/customComponents/CustomPagination';
import {
  GetOrderDtoStatus,
  GetOrderWithItemsDto,
} from '@/generated/orval/types';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { OrderDetailsModal } from '@/components/modals/orderDetailsModal/OrderDetailsModal';
import { useTranslations } from 'next-intl';

export default function PurchasedOrders() {
  const t = useTranslations('DashboardSettings');
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

  const formattedOrders = useMemo<IOrderColumns[]>(() => {
    if (!ordersData?.orders) return [];

    return ordersData.orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      totalPrice: order.totalPrice,
      type: order.subscriptionId ? t('type_subscription') : t('type_product'),
      itemsCount: order?.orderItems?.length || 0,
      itemsNames: order.orderItems
        .map((item) => item.cachedProductTitle + ' (x' + item.quantity + ')')
        .join(', '),
    }));
  }, [ordersData?.orders]);

  const handleRowClick = useCallback(
    (order: IOrderColumns) => {
      const found = ordersData?.orders?.find(
        (i) => i.id === order.id
      ) as GetOrderWithItemsDto;

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
          <h1 className='text-2xl font-semibold'>
            {t('purchased_items_title')}
          </h1>
        </div>
        {isLoadingOrdersData ? (
          <DataTableLoading />
        ) : (
          <>
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
