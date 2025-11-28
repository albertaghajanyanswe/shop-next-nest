import { axiosClassic } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { removeFromStorage, saveTokenStorage } from './auth-token.service';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from '@/generated/orval/types';
import { resetStoreForNewUser } from '@/store/store';

class AuthService {
  async main(
    type: 'login' | 'register',
    data: RegisterDto | LoginDto
  ): Promise<AuthResponseDto> {
    const response = await axiosClassic<AuthResponseDto>({
      url: API_URL.auth(`/${type}`),
      method: 'POST',
      data,
    });

    if (response.data.accessToken) {
      saveTokenStorage(response.data.accessToken);
    }
    localStorage.setItem('userId', response.data.user.id);
    await resetStoreForNewUser();
    return response.data;
  }

  async getNewTokens() {
    const response = await axiosClassic<AuthResponseDto>({
      url: API_URL.auth('/login/access-token'),
      method: 'POST',
    });

    if (response.data.accessToken) {
      saveTokenStorage(response.data.accessToken);
    }

    return response;
  }

  async logout() {
    const response = await axiosClassic({
      url: API_URL.auth('/logout'),
      method: 'POST',
    });
    if (response.data) {
      removeFromStorage();
    }
    localStorage.removeItem('userId');
    await resetStoreForNewUser();
    return response;
  }
}

export const authService = new AuthService();
