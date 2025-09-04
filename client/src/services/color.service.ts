import { axiosClassic, axiosWithAuth } from "@/api/api.interceptors"
import { API_URL } from "@/config/api.config"
import { IColor, IColorInput } from "@/shared/types/color.interface"

class ColorService {

  async getAll() {
    const { data } = await axiosClassic<IColor[]>({
      url: API_URL.colors(),
      method: 'GET',
    })

    return data || []
  }

  async getByStoreId(storeId: string) {
    const { data } = await axiosWithAuth<IColor[]>({
      url: API_URL.colors(`/by-storeId/${storeId}`),
      method: 'GET',
    });

    return data || []
  }

  async getById(id: string) {
    const { data } = await axiosWithAuth<IColor>({
      url: API_URL.colors(`/by-id/${id}`),
      method: 'GET',
    });

    return data
  }

  async create(data: IColorInput, storeId: string) {
    const { data: createdCategory } = await axiosWithAuth<IColor>({
      url: API_URL.colors(`/${storeId}`),
      method: 'POST',
      data,
    })

    return createdCategory
  }

  async update(id: string, data: IColorInput) {
    const { data: updatedCategory } = await axiosWithAuth<IColor>({
      url: API_URL.colors(`/${id}`),
      method: 'PUT',
      data,
    })

    return updatedCategory
  }

  async delete(id: string) {
    const { data: deletedCategory } = await axiosWithAuth<IColor>({
      url: API_URL.colors(`/${id}`),
      method: 'DELETE',
    })

    return deletedCategory
  }

}

export const colorService = new ColorService()