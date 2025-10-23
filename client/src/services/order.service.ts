import { axiosWithAuth } from "@/api/api.interceptors"
import { API_URL } from "@/config/api.config"
import { EnumOrderStatus, IPaymentResponse } from "@/shared/types/order.interface"

export type TypeData = {
  status?: EnumOrderStatus
  orderItems: {
    quantity: number
    price: number
    productId: string
    storeId: string
    name: string
    description: string
    image: string
    userId: string
  }[]
}

class OrderService {
  async place(data: TypeData) {
    return axiosWithAuth<IPaymentResponse>({
      url: API_URL.orders('/place'),
      method: 'POST',
      data,
    })
  }
}

export const orderService = new OrderService()

