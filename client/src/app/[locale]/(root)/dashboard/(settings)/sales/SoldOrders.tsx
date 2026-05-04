'use client';

import { useCallback, useMemo, useState } from 'react';
import { IOrderItemColumns, OrderItemColumns } from './OrderItemColumns';
import { useProfile } from '@/hooks/useProfile';
import { DataTable } from '@/components/ui/dataLoading/DataTable';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/customComponents/CustomPagination';
import { GetOrderItemsDetailsDto } from '@/generated/orval/types';
import { useGetOrderItems } from '@/hooks/queries/orders/useGetOrderItems';
import { OrderItemDetailsModal } from '@/components/modals/orderDetailsModal/OrderItemDetailsModal';
import DataTableLoading from '@/components/ui/dataLoading/DataTableLoading';
import { useTranslations } from 'next-intl';
import { ViewToggle } from '@/components/customComponents/admin/ViewToggle';
import { useViewMode } from '@/components/customComponents/admin/useViewMode';
import { AdminOrderItemCard } from '@/components/customComponents/admin/AdminOrderItemCard';

export default function SoldOrders() {
  const t = useTranslations('DashboardSettings');
  const { user } = useProfile();
  const [viewMode, setViewMode] = useViewMode('soldOrders');

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

  const formattedOrders = useMemo<IOrderItemColumns[]>(() => {
    if (!orderItemsData?.orderItems) return [];

    return orderItemsData?.orderItems.map((orderItem) => ({
      id: orderItem.id,
      createdAt: orderItem.createdAt,
      status: orderItem.order.status,
      price: orderItem.price,
      quantity: orderItem.quantity,
      itemName: orderItem.cachedProductTitle as string,
    }));
  }, [orderItemsData?.orderItems]);

  const handleRowClick = useCallback(
    (order: IOrderItemColumns) => {
      const found = orderItemsData?.orderItems?.find(
        (i) => i.id === order.id
      ) as GetOrderItemsDetailsDto;

      if (found) {
        setSelectedOrderItemId(found.id);
        setIsOpen(true);
      }
    },
    [orderItemsData?.orderItems]
  );

  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(
    null
  );

  const selectedOrderItem = useMemo(() => {
    if (!selectedOrderItemId) return null;

    return (
      orderItemsData?.orderItems?.find((i) => i.id === selectedOrderItemId) ??
      null
    );
  }, [selectedOrderItemId, orderItemsData?.orderItems]);

  // const [selectedOrderItem, setSelectedOrderItem] =
  //   useState<GetOrderItemsDetailsDto | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className=''>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>{t('sold_items_title')}</h1>
          <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>
        {isLoadingOrderItems ? (
          <DataTableLoading />
        ) : (
          <>
            {viewMode === 'table' ? (
              <DataTable
                columns={OrderItemColumns(t)}
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
            ) : (
              <div className='mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2'>
                {orderItemsData?.orderItems?.map((orderItem) => (
                  <AdminOrderItemCard
                    key={orderItem.id}
                    orderItem={orderItem}
                    user={user}
                    showConfirm
                    showRefund
                  />
                ))}
              </div>
            )}
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
                showRefund
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

