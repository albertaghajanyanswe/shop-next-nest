import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  IAddToCardPayload,
  ICardInitialState,
  IChangeQuantityPayload,
} from './cartTypes';

const initialState: ICardInitialState = {
  orderItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCard: (state, action: PayloadAction<IAddToCardPayload>) => {
      const isExist = state.orderItems.some(
        (item) => item.product.id === action.payload.product.id
      );

      if (!isExist) {
        state.orderItems.push({
          ...action.payload,
          id: state.orderItems.length.toString(),
        });
      }
    },

    removeFromCard: (state, action: PayloadAction<{ id: string }>) => {
      state.orderItems = state.orderItems.filter(
        (item) => item.id !== action.payload.id
      );
    },

    changeQuantity: (state, action: PayloadAction<IChangeQuantityPayload>) => {
      const { id, type } = action.payload;
      const item = state.orderItems.find((item) => item.id === id);
      if (item) {
        if (type === 'minus') {
          item.quantity--;
        } else {
          item.quantity++;
        }
      }
    },

    reset: (state) => {
      state.orderItems = [];
    },
  },
});
