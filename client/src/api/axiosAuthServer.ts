import axios from 'axios';
import { cookies } from 'next/headers';
import { API_BASE } from './api.interceptors';

export async function AxiosAuthServer() {
  const cookiesStore = await cookies();

  const token = cookiesStore.get('accessToken')?.value;
  console.log('Server Token:', token);
  return axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
}

export async function fetchAxiosAuthServer<T>(url: string): Promise<T> {
  const api = await AxiosAuthServer();
  const { data } = await api<T>({ url, method: 'GET' });
  return data;
}
