import {
  GetBrandWithCategoryDto,
  GetCategoryDto,
  GetColorDto,
  GetProductWithDetailsIntendedFor,
  GetProductWithDetailsState,
  GetReviewDto,
} from '@/generated/orval/types';
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
  category: GetCategoryDto;
  brand: GetBrandWithCategoryDto;
  reviews: GetReviewDto[];
  store: IStore;
  color: GetColorDto;
  storeId: string;
  state: GetProductWithDetailsState;
  userId: string;
  isOriginal: boolean;
  isPublished: boolean;
  quantity: number;
  intendedFor: GetProductWithDetailsIntendedFor;
}

export interface IProductInput extends Omit<
  IProduct,
  | 'id'
  | 'reviews'
  | 'store'
  | 'category'
  | 'color'
  | 'oldPrice'
  | 'storeId'
  | 'brand'
  | 'userId'
> {
  categoryId: string;
  colorId: string;
  brandId: string;
  productDetails: {
    key: string;
    value: string;
  }[];
}

export interface IProductColumn {
  id: string;
  title: string;
  price: number;
  category: string;
  color: string;
  storeId: string;

  // additional optional properties present on row.original used elsewhere
  categoryId?: string;
  brandId?: string;
  colorId?: string;
  images?: string[];
  description?: string;
  brand?: any;
  reviews?: any[];
  state?: string;
  userId?: string;
  originalPrice?: number;
  image?: string;
  quantity: number;
  isOriginal?: boolean;
  isPublished?: boolean;
}
