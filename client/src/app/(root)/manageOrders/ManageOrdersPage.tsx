'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { GetOrderWithItemsDto, GetStoreDto } from '@/generated/orval/types';
import { useQueryParams } from '@/hooks/commons/useQueryParams';
import { CustomPagination } from '@/components/ui/CustomPagination';
import LoadingProducts from '@/components/customComponents/loading/LoadingProducts';
import { storeService } from '@/services/store.service';
import { StoreCard } from '@/components/customComponents/StoreCard';
import NoDataFound from '@/components/customComponents/loading/NoDataFound';
import { SearchInput } from '@/components/layouts/mainLayout/header/searchInput/SearchInput';
import { useGetAllOrders } from '@/hooks/queries/orders/useGetAllOrder';
import OrderCard from '@/components/ui/order/OrderCard';

interface ManageOrdersPageProps {
  orders?: GetOrderWithItemsDto[];
  totalCount?: number;
}

export default function ManageOrdersPage({
  totalCount = 0,
  orders,
}: ManageOrdersPageProps) {
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

  console.log('queryParams = ', queryParams);

  return (
    <div className='relative w-full'>
      <div className='py-4'>
        <SearchInput
          placeholder='Search order...'
          redirectToShop={false}
          searchFields={['id']}
        />
      </div>

      {isLoadingOrdersData ? (
        <LoadingProducts entityName='Products' />
      ) : (
        <>
          <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
            {ordersData?.orders?.map((order) => {
              return <OrderCard order={order} key={order.id} />;
            })}
          </div>
          {!!ordersData?.totalCount && (
            <CustomPagination
              limit={queryParams.params.limit as number}
              total={ordersData?.totalCount ?? totalCount}
              skip={queryParams.params.skip as number}
              onPageChange={changePage}
              onLimitChange={changeLimit}
            />
          )}
        </>
      )}
    </div>
  );
}
