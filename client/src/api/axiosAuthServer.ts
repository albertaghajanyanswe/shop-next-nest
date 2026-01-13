import axios from 'axios';
import { cookies } from 'next/headers';
import { API_BASE } from './api.interceptors';

export async function AxiosAuthServer() {
  const cookiesStore = await cookies();

  const token = cookiesStore.get('accessToken')?.value;
  console.log('++++++Token:', token);
  return axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
}
