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

export default function SoldOrders() {
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
        setSelectedOrderItem(found);
        setIsOpen(true);
      }
    },
    [orderItemsData?.orderItems]
  );

  const [selectedOrderItem, setSelectedOrderItem] =
    useState<GetOrderItemsDetailsDto | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className=''>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Sold items</h1>
        </div>
        {isLoadingOrderItems ? (
          <DataTableLoading />
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
}
