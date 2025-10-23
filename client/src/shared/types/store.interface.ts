export interface IStore {
  id: string
  title: string
  description: string
  isDefaultStore?: boolean
  isPublished?: boolean
  isBlocked?: boolean
}

export type ICreateStore = Pick<IStore, 'title'>

export type IUpdateStore = Omit<IStore, 'id'>;
