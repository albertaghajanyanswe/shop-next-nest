import { axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import {
  GetOrderDto,
  GetOrderItemsDetailsDto,
  GetOrderItemsDetailsDtoAndCount,
  GetOrderWithItemsDto,
  GetOrderWithItemsDtoAndCount,
} from '@/generated/orval/types';
import { iParams } from '@/shared/types/filter.interface';
import {
  EnumOrderStatus,
  IPaymentResponse,
  IUpdateOrder,
  IUpdateOrderItem,
} from '@/shared/types/order.interface';

export type TypeData = {
  status?: EnumOrderStatus;
  orderItems: {
    quantity: number;
    price: number;
    productId: string;
    storeId: string;
    name: string;
    description: string;
    image: string;
    userId: string;
  }[];
};

class OrderService {
  async getAllOrders(params?: iParams) {
    const { data } = await axiosWithAuth<GetOrderWithItemsDtoAndCount>({
      url: `${API_URL.allOrders()}?params=${encodeURIComponent(JSON.stringify(params))}`,
      method: 'GET',
    });

    return data;
  }
  async getAll(params?: iParams) {
    const { data } = await axiosWithAuth<GetOrderWithItemsDtoAndCount>({
      url: `${API_URL.orders()}?params=${encodeURIComponent(JSON.stringify(params))}`,
      method: 'GET',
    });

    return data;
  }

  async getAllSoldOrders(params?: iParams) {
    const { data } = await axiosWithAuth<GetOrderWithItemsDtoAndCount>({
      url: `${API_URL.soldOrders()}?params=${encodeURIComponent(JSON.stringify(params))}`,
      method: 'GET',
    });

    return data;
  }

  async getOrderItems(params?: iParams) {
    const { data } = await axiosWithAuth<GetOrderItemsDetailsDtoAndCount>({
      url: `${API_URL.orderItems()}?params=${encodeURIComponent(JSON.stringify(params))}`,
      method: 'GET',
    });

    return data;
  }

  async getById(id: string) {
    const { data } = await axiosWithAuth<GetOrderWithItemsDto>({
      url: API_URL.orders(`/${id}`),
      method: 'GET',
    });

    return data;
  }

  async place(data: TypeData) {
    return axiosWithAuth<IPaymentResponse>({
      url: API_URL.orders('/place'),
      method: 'POST',
      data,
    });
  }

  async update(id: string, data: IUpdateOrder) {
    const { data: updatedOrder } = await axiosWithAuth<GetOrderDto>({
      url: API_URL.orders(`/${id}`),
      method: 'PUT',
      data,
    });

    return updatedOrder;
  }

  async updateOrderItem(id: string, data: IUpdateOrderItem) {
    const { data: updatedOrderItem } =
      await axiosWithAuth<GetOrderItemsDetailsDto>({
        url: API_URL.orders(`/orderItems/${id}`),
        method: 'PUT',
        data,
      });

    return updatedOrderItem;
  }
}

export const orderService = new OrderService();
