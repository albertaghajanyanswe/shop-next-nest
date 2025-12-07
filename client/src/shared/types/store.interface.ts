export interface IStore {
  id: string;
  title: string;
  description: string;
  isDefaultStore?: boolean;
  isPublished?: boolean;
  isBlocked?: boolean;
  images?: string[];
  country?: string;
  city?: string;
  address?: string;
  phone?: string;
}

export type ICreateStore = Pick<IStore, 'title'>;

export type IUpdateStore = Omit<IStore, 'id'>;
