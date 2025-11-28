import { GetProductWithDetails } from "@/generated/orval/types"

export interface ICartItem {
  id: string
  product: GetProductWithDetails
  quantity: number
  price: number
}