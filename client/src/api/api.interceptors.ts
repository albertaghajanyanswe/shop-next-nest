import axios, { CreateAxiosDefaults } from 'axios';
import { NEXT_PUBLIC_SERVER_URL } from '@/config/api.config';
import { errorCatch, getContentType } from './api.helper';
import {
  getAccessToken,
  removeFromStorage,
} from '@/services/auth/auth-token.service';
import { authService } from '@/services/auth/auth.service';
import { EnvVariables } from '@/shared/envVariables';

const API_BASE =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_SERVER_SERVICE // внутри Server Components
    : process.env.NEXT_PUBLIC_CLIENT_URL; // в браузере

const options: CreateAxiosDefaults = {
  baseURL: `${API_BASE}/api`,
  headers: getContentType(),
  withCredentials: true,
};

export const axiosClassic = axios.create(options);

export const axiosWithAuth = axios.create(options);

axiosWithAuth.interceptors.request.use(async (config) => {
  const accessToken = getAccessToken();
  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosWithAuth.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.response.status === 401 ||
        errorCatch(error) === 'Unauthorized' ||
        errorCatch(error) === 'jwt expired' ||
        errorCatch(error) === 'jwt must be provided') &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        console.log('interceptors - getNewTokens');
        await authService.getNewTokens();
        return axiosWithAuth.request(originalRequest);
      } catch (error) {
        if (
          errorCatch(error) === 'jwt expired' ||
          errorCatch(error) === 'Unauthorized' ||
          errorCatch(error) === 'User not found'
        ) {
          removeFromStorage();
        }
      }
    }
    throw error;
  }
);
