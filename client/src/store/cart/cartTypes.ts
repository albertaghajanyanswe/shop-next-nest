import type { ICartItem } from '@/shared/types/cart.interface';

export interface ICardInitialState {
  orderItems: ICartItem[];
}

export interface IAddToCardPayload extends Omit<ICartItem, 'id'> {}

export interface IChangeQuantityPayload extends Pick<ICartItem, 'id'> {
  type: 'minus' | 'plus';
}
