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
          id: action.payload.product.id,
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

      const item = state.orderItems.find((i) => i.id === id);
      if (!item) return;

      const max = item.product.quantity;

      if (type === 'minus') {
        item.quantity = Math.max(1, item.quantity - 1);
        return;
      }

      item.quantity = Math.min(max, item.quantity + 1);
    },

    reset: (state) => {
      state.orderItems = [];
    },
  },
});
export const cartReducer = cartSlice.reducer;
