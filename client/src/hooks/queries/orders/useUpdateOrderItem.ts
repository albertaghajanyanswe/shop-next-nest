import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { IUpdateOrderItem } from '@/shared/types/order.interface';
import { orderService } from '@/services/order.service';

interface UpdateOrderItemPayload {
  id?: string;
  data: IUpdateOrderItem;
}

export const useUpdateOrderItem = () => {
  const params = useParams<{ orderItemId: string }>();
  const orderItemId = params.orderItemId;

  const queryClient = useQueryClient();

  const { mutate: updateOrderItem, isPending: isLoadingUpdate } = useMutation({
    mutationKey: QUERY_KEYS.updateOrder,
    mutationFn: ({ id, data }: UpdateOrderItemPayload) =>
      orderService.updateOrderItem(id || orderItemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getOrderItems[0]],
        exact: false,
      });
      toast.success('Order item updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update order item.');
    },
  });

  return useMemo(
    () => ({
      updateOrderItem,
      isLoadingUpdate,
    }),
    [updateOrderItem, isLoadingUpdate]
  );
};
