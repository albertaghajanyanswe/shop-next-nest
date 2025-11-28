export interface ICategoryColumn {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  storeId: string;
  images: string[];
  image: string;
}

export type ICategoryInput = Pick<
  ICategoryColumn,
  'name' | 'description' | 'images'
>;
