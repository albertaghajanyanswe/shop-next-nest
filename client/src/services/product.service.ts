import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import {
  GetProductDto,
  GetProductWithDetails,
  GetProductWithDetailsAndCount,
} from '@/generated/orval/types';
import { iParams } from '@/shared/types/filter.interface';
import { IProductInput } from '@/shared/types/product.interface';

class ProductService {
  async getAll(params?: iParams) {
    try {
      const { data } = await axiosClassic<GetProductWithDetailsAndCount>({
        url: API_URL.products(
          `?params=${encodeURIComponent(JSON.stringify(params))}`
        ),
        method: 'GET',
        // params: params ? encodeURIComponent(JSON.stringify(params)) : undefined,
      });
      return data;
    } catch (err) {
      console.log('\n\n ProductService getAll ERR = ', err);
    }
  }

  async getByStoreId(
    storeId: string,
    params?: any | null
  ): Promise<GetProductWithDetailsAndCount> {
    const { data } = await axiosWithAuth<GetProductWithDetailsAndCount>({
      url: API_URL.products(
        `/by-storeId/${storeId}?params=${encodeURIComponent(JSON.stringify(params))}`
      ),
      method: 'GET',
    });

    return data || { products: [], totalCount: 0 };
  }

  async getById(id: string) {
    const { data } = await axiosClassic<GetProductWithDetails>({
      url: API_URL.products(`/by-id/${id}`),
      method: 'GET',
    });

    return data;
  }
  async getProductById(id: string) {
    const { data } = await axiosClassic<GetProductWithDetails>({
      url: API_URL.products(`/product-by-id/${id}`),
      method: 'GET',
    });
    return data;
  }

  async getMostPopular(params?: iParams) {
    try {
      const { data } = await axiosClassic<GetProductWithDetails[]>({
        url: API_URL.products(
          `/most-popular?params=${encodeURIComponent(JSON.stringify(params))}`
        ),
        method: 'GET',
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getSimilar(id: string, params?: iParams) {
    const { data } = await axiosClassic<GetProductWithDetails[]>({
      url: API_URL.products(
        `/similar/${id}?params=${encodeURIComponent(JSON.stringify(params))}`
      ),
      method: 'GET',
    });

    return data;
  }

  async create(data: IProductInput, storeId: string) {
    const { data: createdStore } = await axiosWithAuth<GetProductDto>({
      url: API_URL.products(`/${storeId}`),
      method: 'POST',
      data,
    });

    return createdStore;
  }

  async update(id: string, data: IProductInput) {
    const { data: updatedStore } = await axiosWithAuth<GetProductDto>({
      url: API_URL.products(`/${id}`),
      method: 'PUT',
      data,
    });

    return updatedStore;
  }

  async delete(id: string) {
    const { data: deletedStore } = await axiosWithAuth<GetProductDto>({
      url: API_URL.products(`/${id}`),
      method: 'DELETE',
    });

    return deletedStore;
  }
}

export const productService = new ProductService();
