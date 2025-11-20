import { axiosWithAuth } from "@/api/api.interceptors"
import { API_URL } from "@/config/api.config"
import { IUser } from "@/shared/types/user.interface"

class UserService {
  constructor() {
    console.log('\n\n\n\n *********NODE_ENV = ', process.env.NODE_ENV)
  }
  async getProfile() {
    const { data } = await axiosWithAuth<IUser>({
      url: API_URL.users(`/profile`),
      method: 'GET',
    })

    return data
  }

  async toggleFavorite(productId: string) {
    const response = await axiosWithAuth<IUser>({
      url: API_URL.users(`/profile/favorites/${productId}`),
      method: 'PATCH',
    })

    return response
  }
}

export const userService = new UserService()