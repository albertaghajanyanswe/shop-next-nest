import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { GetCategoryDto, GetCategoryDtoAndCount } from '@/generated/orval/types';
import { ICategoryInput } from '@/shared/types/category.interface';
import { iParams } from '@/shared/types/filter.interface';

class CategoryService {
  async getAll(params?: iParams) {
    const { data } = await axiosClassic<GetCategoryDtoAndCount>({
      url: `${API_URL.categories()}?params=${encodeURIComponent(JSON.stringify(params))}`,
      method: 'GET',
    });

    return data;
  }

  async getByStoreId(storeId: string) {
    const { data } = await axiosWithAuth<GetCategoryDto[]>({
      url: API_URL.categories(`/by-storeId/${storeId}`),
      method: 'GET',
    });

    return data;
  }

  async getById(id: string) {
    const { data } = await axiosClassic<GetCategoryDto>({
      url: API_URL.categories(`/by-id/${id}`),
      method: 'GET',
    });

    return data;
  }

  async create(data: ICategoryInput, storeId: string) {
    const { data: createdCategory } = await axiosWithAuth<GetCategoryDto>({
      url: API_URL.categories(`/${storeId}`),
      method: 'POST',
      data,
    });

    return createdCategory;
  }

  async update(id: string, data: ICategoryInput) {
    const { data: updatedCategory } = await axiosWithAuth<GetCategoryDto>({
      url: API_URL.categories(`/${id}`),
      method: 'PUT',
      data,
    });

    return updatedCategory;
  }

  async delete(id: string) {
    const { data: deletedCategory } = await axiosWithAuth<GetCategoryDto>({
      url: API_URL.categories(`/${id}`),
      method: 'DELETE',
    });

    return deletedCategory;
  }
}

export const categoryService = new CategoryService();
