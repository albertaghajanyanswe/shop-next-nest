import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { cartSlice } from './cart/cartSlice';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

const persistConfig = {
  key: 'shop-web',
  storage,
  whitelist: ['cart'],
  serialize: true,
  deserialize: true,
};

const isClient = typeof window !== 'undefined';

const combinedReducers = combineReducers({
  cart: cartSlice.reducer,
});

let mainReducer = combinedReducers;

if (isClient) {
  const { persistReducer } = require('redux-persist');
  const storage = require('redux-persist/lib/storage');
  mainReducer = persistReducer(persistConfig, combinedReducers);
  // import('redux-persist').then(({ persistReducer }) => {
  //   import('redux-persist/lib/storage').then((storage) => {
  //     mainReducer = persistReducer(persistConfig, combinedReducers);
  //   });
  // });
}

export const store = configureStore({
  reducer: mainReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export type TypeRootState = ReturnType<typeof mainReducer>;
