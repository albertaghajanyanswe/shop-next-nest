export const NEXT_PUBLIC_SERVER_URL = process.env
  .NEXT_PUBLIC_SERVER_URL as string;

export const API_URL = {
  root: (url = '') => `${url ? `${url}` : ''}`,
  auth: (url = '') => API_URL.root(`/auth${url}`),
  users: (url = '') => API_URL.root(`/users${url}`),
  stores: (url = '') => API_URL.root(`/stores${url}`),
  products: (url = '') => API_URL.root(`/products${url}`),
  categories: (url = '') => API_URL.root(`/categories${url}`),
  colors: (url = '') => API_URL.root(`/colors${url}`),
  brands: (url = '') => API_URL.root(`/brands${url}`),
  reviews: (url = '') => API_URL.root(`/reviews${url}`),
  orders: (url = '') => API_URL.root(`/orders${url}`),
  soldOrders: (url = '') => API_URL.root(`/orders/sold${url}`),
  orderItems: (url = '') => API_URL.root(`/orders/orderItems${url}`),
  statistics: (url = '') => API_URL.root(`/statistics${url}`),
  files: (url = '') => API_URL.root(`/files${url}`),
  cloudinaryFiles: (url = '') => API_URL.root(`/cloudinary/files${url}`),
  stripe: (url = '') => API_URL.root(`/stripe${url}`),
  payment: (url = '') => API_URL.root(`/payment${url}`),
};
