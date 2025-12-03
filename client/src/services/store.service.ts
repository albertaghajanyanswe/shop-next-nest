import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { GetStoreDto, GetStoreDtoAndCount } from '@/generated/orval/types';
import { iParams } from '@/shared/types/filter.interface';
import {
  ICreateStore,
  IStore,
  IUpdateStore,
} from '@/shared/types/store.interface';

class StoreService {
  async getAll(params?: iParams) {
    try {
      const { data } = await axiosClassic<GetStoreDtoAndCount>({
        url: API_URL.stores(
          `?params=${encodeURIComponent(JSON.stringify(params))}`
        ),
        method: 'GET',
      });
      return data;
    } catch (err) {
      console.log('\n\n StoreService getAll ERR = ', err);
    }
  }

  async getById(id: string) {
    const { data } = await axiosWithAuth<IStore>({
      url: API_URL.stores(`/by-id/${id}`),
      method: 'GET',
    });

    return data;
  }

  async create(data: ICreateStore) {
    const { data: createdStore } = await axiosWithAuth<IStore>({
      url: API_URL.stores(``),
      method: 'POST',
      data,
    });

    return createdStore;
  }

  async update(id: string, data: IUpdateStore) {
    const { data: updatedStore } = await axiosWithAuth<IStore>({
      url: API_URL.stores(`/${id}`),
      method: 'PUT',
      data,
    });

    return updatedStore;
  }

  async delete(id: string) {
    const { data: deletedStore } = await axiosWithAuth<IStore>({
      url: API_URL.stores(`/${id}`),
      method: 'DELETE',
    });

    return deletedStore;
  }
}

export const storeService = new StoreService();
