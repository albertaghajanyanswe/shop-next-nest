export interface IStore {
  id: string
  title: string
  description: string
}

export type ICreateStore = Pick<IStore, 'title'>

export type IUpdateStore = Omit<IStore, 'id'>;
