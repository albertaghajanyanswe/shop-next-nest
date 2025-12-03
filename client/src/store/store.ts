import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { cartSlice } from './cart/cartSlice';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
  PersistConfig,
} from 'redux-persist';

const isClient = typeof window !== 'undefined';

const combinedReducers = combineReducers({
  cart: cartSlice.reducer,
});

// Функция для создания уникального ключа для каждого пользователя
const getUserPersistKey = () => {
  if (!isClient) return 'shop-web-default';

  // Получи userId из localStorage, cookies или auth state
  const userId = localStorage.getItem('userId') || 'anonymous';
  return `shop-web-${userId}`;
};

// Создаём persist config с динамическим ключом
const getPersistConfig = (): PersistConfig<any> => ({
  key: getUserPersistKey(),
  storage,
  whitelist: ['cart'],
  // serialize: true,
});

let mainReducer = combinedReducers;

if (isClient) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { persistReducer } = require('redux-persist');
  mainReducer = persistReducer(getPersistConfig(), combinedReducers);
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

export const resetStoreForNewUser = async () => {
  await persistor.purge();
  await persistor.flush();
  window.location.reload();
};
