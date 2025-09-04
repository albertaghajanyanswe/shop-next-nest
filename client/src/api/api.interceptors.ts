import axios, { CreateAxiosDefaults } from 'axios';
import { SERVER_URL } from '@/config/api.config';
import { errorCatch, getContentType } from './api.helper';
import {
  getAccessToken,
  removeFromStorage,
} from '@/services/auth/auth-token.service';
import { authService } from '@/services/auth/auth.service';

const options: CreateAxiosDefaults = {
  baseURL: `${SERVER_URL}/api`,
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
    console.log('\n\n 111 error', error);
    const originalRequest = error.config;
    if (
      (error.response.status === 401 ||
        errorCatch(error) === 'jwt expired' ||
        errorCatch(error) === 'jwt must be provided') &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await authService.getNewTokens();
        return axiosWithAuth.request(originalRequest);
      } catch (error) {
        console.log('\n\n 222 error', error);
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
