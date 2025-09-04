import { ICategory } from "./category.interface"

export interface IBrand {
  id: string
  createdAt: string
  name: string
  storeId: string
  categoryId: string
  category: ICategory
  categoryTitle: string
}

export type IBrandInput = Pick<IBrand, 'name' | 'categoryId'>;