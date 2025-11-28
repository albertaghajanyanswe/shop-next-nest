import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { GetColorDto, GetColorDtoAndCount } from '@/generated/orval/types';
import { IColorInput } from '@/shared/types/color.interface';
import { iParams } from '@/shared/types/filter.interface';

class ColorService {
  async getAll(params?: iParams) {
    const { data } = await axiosClassic<GetColorDtoAndCount>({
      url: `${API_URL.colors()}?params=${encodeURIComponent(JSON.stringify(params))}`,
      method: 'GET',
    });

    return data;
  }

  async getByStoreId(storeId: string) {
    const { data } = await axiosWithAuth<GetColorDto[]>({
      url: API_URL.colors(`/by-storeId/${storeId}`),
      method: 'GET',
    });

    return data || [];
  }

  async getById(id: string) {
    const { data } = await axiosWithAuth<GetColorDto>({
      url: API_URL.colors(`/by-id/${id}`),
      method: 'GET',
    });

    return data;
  }

  async create(data: IColorInput, storeId: string) {
    const { data: createdCategory } = await axiosWithAuth<GetColorDto>({
      url: API_URL.colors(`/${storeId}`),
      method: 'POST',
      data,
    });

    return createdCategory;
  }

  async update(id: string, data: IColorInput) {
    const { data: updatedCategory } = await axiosWithAuth<GetColorDto>({
      url: API_URL.colors(`/${id}`),
      method: 'PUT',
      data,
    });

    return updatedCategory;
  }

  async delete(id: string) {
    const { data: deletedCategory } = await axiosWithAuth<GetColorDto>({
      url: API_URL.colors(`/${id}`),
      method: 'DELETE',
    });

    return deletedCategory;
  }
}

export const colorService = new ColorService();
