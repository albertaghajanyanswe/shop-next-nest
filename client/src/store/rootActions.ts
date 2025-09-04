import { cartSlice } from './cart/cartSlice';

export const rootActions = {
  ...cartSlice.actions,
};