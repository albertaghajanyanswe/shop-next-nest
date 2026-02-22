import { axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { GetUserDto, UpdateUserDto } from '@/generated/orval/types';
import { IUser } from '@/shared/types/user.interface';

class UserService {
  constructor() {}
  async getProfile() {
    const { data } = await axiosWithAuth<GetUserDto>({
      url: API_URL.users(`/profile`),
      method: 'GET',
    });

    return data;
  }

  async toggleFavorite(productId: string) {
    const response = await axiosWithAuth<GetUserDto>({
      url: API_URL.users(`/profile/favorites/${productId}`),
      method: 'PATCH',
    });

    return response;
  }

  async update(data: UpdateUserDto) {
    const { data: updatedUser } = await axiosWithAuth<GetUserDto>({
      url: API_URL.users(),
      method: 'PUT',
      data,
    });

    return updatedUser;
  }
}

export const userService = new UserService();
