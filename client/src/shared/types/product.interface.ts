import { IBrand } from './brand.interface';
import { ICategory } from './category.interface';
import { IColor } from './color.interface';
import { IReview } from './review.interface';
import { IStore } from './store.interface';

export enum EnumProductState {
  NEW,
  USED,
}

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  images: string[];
  category: ICategory;
  brand: IBrand;
  reviews: IReview[];
  store: IStore;
  color: IColor;
  storeId: string;
  state: EnumProductState;
}

export interface IProductInput
  extends Omit<
    IProduct,
    'id' | 'review' | 'store' | 'category' | 'color' | 'oldPrice'
  > {
  categoryId: string;
  colorId: string;
  brandId: string;
}
