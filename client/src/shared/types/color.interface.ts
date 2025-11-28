export interface IColorColumn {
  id: string
  createdAt: string
  name: string
  value: string
  storeId: string
}

export type IColorInput = Pick<IColorColumn, 'name' | 'value'>