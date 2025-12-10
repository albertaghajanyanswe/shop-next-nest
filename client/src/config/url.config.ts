export const PUBLIC_URL = {
  root: (url = '') => `${url ? `${url}` : ''}`,

  home: () => PUBLIC_URL.root(`/`),
  auth: () => PUBLIC_URL.root(`/auth`),
  shop: (query = '') => PUBLIC_URL.root(`/shop${query ? `?${query}` : ''}`),
  stores: (query = '') => PUBLIC_URL.root(`/stores${query ? `?${query}` : ''}`),

  product: (id = '') => PUBLIC_URL.root(`/product/${id}`),
  category: (id = '') => PUBLIC_URL.root(`/category/${id}`),
  brand: (id = '') => PUBLIC_URL.root(`/brand/${id}`),
  aboutUs: () => PUBLIC_URL.root(`/aboutUs`),
  contactUs: () => PUBLIC_URL.root(`/contactUs`),
  termsAndCondition: () => PUBLIC_URL.root(`/termsAndCondition`),
  privacyPolicy: () => PUBLIC_URL.root(`/privacyPolicy`),
  faqs: () => PUBLIC_URL.root(`/faqs`),
};

export const DASHBOARD_URL = {
  root: (url = '') => `/dashboard${url ? `${url}` : ''}`,

  home: () => DASHBOARD_URL.root(`/`),
  favorites: () => DASHBOARD_URL.root(`/favorites`),
  manageOrders: () => DASHBOARD_URL.root(`/manageOrders`),
  orders: () => DASHBOARD_URL.root(`/orders`),
  sales: () => DASHBOARD_URL.root(`/sales`),
  subscriptions: () => DASHBOARD_URL.root(`/subscriptions`),
  profile: () => DASHBOARD_URL.root(`/profile`),
  settings: () => DASHBOARD_URL.root(`/settings`),
};

export const STORE_URL = {
  root: (url = '') => `/store${url ? `${url}` : ''}`,

  home: (storeId = '') => STORE_URL.root(`/${storeId}`),
  products: (storeId = '') => STORE_URL.root(`/${storeId}/products`),
  productCreate: (storeId = '') =>
    STORE_URL.root(`/${storeId}/products/create`),
  productEdit: (storeId = '', productId = '') =>
    STORE_URL.root(`/${storeId}/products/${productId}`),

  categories: (storeId = '') => STORE_URL.root(`/${storeId}/categories`),
  categoryCreate: (storeId = '') =>
    STORE_URL.root(`/${storeId}/categories/create`),
  categoryEdit: (storeId = '', categoryId = '') =>
    STORE_URL.root(`/${storeId}/categories/${categoryId}`),

  colors: (storeId = '') => STORE_URL.root(`/${storeId}/colors`),
  colorCreate: (storeId = '') => STORE_URL.root(`/${storeId}/colors/create`),
  colorEdit: (storeId = '', colorId = '') =>
    STORE_URL.root(`/${storeId}/colors/${colorId}`),

  brands: (storeId = '') => STORE_URL.root(`/${storeId}/brands`),
  brandCreate: (storeId = '') => STORE_URL.root(`/${storeId}/brands/create`),
  brandEdit: (storeId = '', brandId = '') =>
    STORE_URL.root(`/${storeId}/brands/${brandId}`),

  reviews: (storeId = '') => STORE_URL.root(`/${storeId}/reviews`),

  settings: (storeId = '') => STORE_URL.root(`/${storeId}/settings`),
};
