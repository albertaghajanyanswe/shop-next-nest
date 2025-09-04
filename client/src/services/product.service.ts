import { axiosClassic, axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { IProduct, IProductInput } from '@/shared/types/product.interface';

class ProductService {
  async getAll(searchTerm?: string | null) {
    const { data } = await axiosClassic<IProduct[]>({
      url: API_URL.products(),
      method: 'GET',
      params: searchTerm ? { searchTerm } : undefined,
    });

    return data || [];
  }

  async getByStoreId(storeId: string) {
    const { data } = await axiosWithAuth<IProduct[]>({
      url: API_URL.products(`/by-storeId/${storeId}`),
      method: 'GET',
    });

    return data || [];
  }

  async getById(id: string) {
    const { data } = await axiosClassic<IProduct>({
      url: API_URL.products(`/by-id/${id}`),
      method: 'GET',
    });

    return data;
  }
  async getProductById(id: string) {
    const { data } = await axiosClassic<IProduct>({
      url: API_URL.products(`/product-by-id/${id}`),
      method: 'GET',
    });
    return data;
  }

  async getByCategoryId(categoryId: string) {
    const { data } = await axiosClassic<IProduct[]>({
      url: API_URL.products(`/by-categoryId/${categoryId}`),
      method: 'GET',
    });

    return data;
  }

  async getMostPopular() {
    try {
      const { data } = await axiosClassic<IProduct[]>({
        url: API_URL.products(`/most-popular`),
        method: 'GET',
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getSimilar(id: string) {
    const { data } = await axiosClassic<IProduct[]>({
      url: API_URL.products(`/similar/${id}`),
      method: 'GET',
    });

    return data;
  }

  async create(data: IProductInput, storeId: string) {
    const { data: createdStore } = await axiosWithAuth<IProduct>({
      url: API_URL.products(`/${storeId}`),
      method: 'POST',
      data,
    });

    return createdStore;
  }

  async update(id: string, data: IProductInput) {
    const { data: updatedStore } = await axiosWithAuth<IProduct>({
      url: API_URL.products(`/${id}`),
      method: 'PUT',
      data,
    });

    return updatedStore;
  }

  async delete(id: string) {
    const { data: deletedStore } = await axiosWithAuth<IProduct>({
      url: API_URL.products(`/${id}`),
      method: 'DELETE',
    });

    return deletedStore;
  }
}

export const productService = new ProductService();
