import { GetProductDto } from "@/generated/orval/types"
import { IOrder } from "./order.interface"
import { IStore } from "./store.interface"

export interface IUser {
  id: string
  name: string
  email: string
  picture: string
  favorites: GetProductDto[]
  orders: IOrder[]
  stores: IStore[]
}