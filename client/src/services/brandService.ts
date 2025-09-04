import { axiosClassic, axiosWithAuth } from "@/api/api.interceptors"
import { API_URL } from "@/config/api.config"
import { IBrand, IBrandInput } from "@/shared/types/brand.interface"

class BrandService {

  async getAll() {
    const { data } = await axiosClassic<IBrand[]>({
      url: API_URL.brands(),
      method: 'GET',
    })

    return data || []
  }

  async getByStoreId(storeId: string) {
    const { data } = await axiosWithAuth<IBrand[]>({
      url: API_URL.brands(`/by-storeId/${storeId}`),
      method: 'GET',
    });

    return data || []
  }

  async getById(id: string) {
    const { data } = await axiosWithAuth<IBrand>({
      url: API_URL.brands(`/by-id/${id}`),
      method: 'GET',
    });

    return data
  }

  async create(data: IBrandInput, storeId: string) {
    const { data: createdCategory } = await axiosWithAuth<IBrand>({
      url: API_URL.brands(`/${storeId}`),
      method: 'POST',
      data,
    })

    return createdCategory
  }

  async update(id: string, data: IBrandInput) {
    const { data: updatedCategory } = await axiosWithAuth<IColor>({
      url: API_URL.brands(`/${id}`),
      method: 'PUT',
      data,
    })

    return updatedCategory
  }

  async delete(id: string) {
    const { data: deletedCategory } = await axiosWithAuth<IColor>({
      url: API_URL.brands(`/${id}`),
      method: 'DELETE',
    })

    return deletedCategory
  }

}

export const brandService = new BrandService()