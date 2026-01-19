import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { GetBrandDto, GetBrandDtoAndCount } from '@/generated/orval/types';
import { IBrandInput } from '@/shared/types/brand.interface';
import { iParams } from '@/shared/types/filter.interface';

class BrandService {
  async getAll(params?: iParams) {
    const { data } = await axiosClassic<GetBrandDtoAndCount>({
      url: `${API_URL.brands()}?params=${encodeURIComponent(JSON.stringify(params))}`,
      method: 'GET',
    });

    return data;
  }

  async getByStoreId(storeId: string) {
    const { data } = await axiosWithAuth<GetBrandDto[]>({
      url: API_URL.brands(`/store/${storeId}`),
      method: 'GET',
    });

    return data || [];
  }

  async getById(id: string) {
    const { data } = await axiosClassic<GetBrandDto>({
      url: API_URL.brands(`/${id}`),
      method: 'GET',
    });

    return data;
  }

  async create(data: IBrandInput, storeId: string) {
    const { data: createdCategory } = await axiosWithAuth<GetBrandDto>({
      url: API_URL.brands(`/${storeId}`),
      method: 'POST',
      data,
    });

    return createdCategory;
  }

  async update(id: string, data: IBrandInput) {
    const { data: updatedCategory } = await axiosWithAuth<GetBrandDto>({
      url: API_URL.brands(`/${id}`),
      method: 'PUT',
      data,
    });

    return updatedCategory;
  }

  async delete(id: string) {
    const { data: deletedCategory } = await axiosWithAuth<GetBrandDto>({
      url: API_URL.brands(`/${id}`),
      method: 'DELETE',
    });

    return deletedCategory;
  }
}

export const brandService = new BrandService();
