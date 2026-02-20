import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/queryConstants';
import { IUpdateOrder } from '@/shared/types/order.interface';
import { orderService } from '@/services/order.service';

interface UpdateOrderPayload {
  id?: string;
  data: IUpdateOrder;
}

export const useUpdateOrder = () => {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const queryClient = useQueryClient();

  const { mutate: updateOrder, isPending: isLoadingUpdate } = useMutation({
    mutationKey: QUERY_KEYS.updateOrder,
    mutationFn: ({ id, data }: UpdateOrderPayload) =>
      orderService.update(id || orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getAllOrders[0]],
        exact: false,
      });
      toast.success('Order updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update order.');
    },
  });

  return useMemo(
    () => ({
      updateOrder,
      isLoadingUpdate,
    }),
    [updateOrder, isLoadingUpdate]
  );
};
