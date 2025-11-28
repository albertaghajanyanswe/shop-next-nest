export interface IBrandColumn {
  id: string;
  createdAt: string;
  name: string;
  description?: string;
  images: string[];
  image: string;
  storeId: string | undefined;
}

export type IBrandInput = Pick<IBrandColumn, 'name' | 'description' | 'images'>;
