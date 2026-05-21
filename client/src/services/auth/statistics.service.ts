import { axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import {
  IMainStatistics,
  IMiddleStatistics,
  ITopProduct,
  ICategorySales,
  ISalesHistory,
} from '@/shared/types/statistics.interface';

class StatisticsService {
  async getMainStatistics(storeId: string) {
    const { data } = await axiosWithAuth<IMainStatistics[]>({
      url: API_URL.statistics(`/main/${storeId}`),
      method: 'GET',
    });

    return data;
  }

  async getMiddleStatistics(storeId: string) {
    const { data } = await axiosWithAuth<IMiddleStatistics>({
      url: API_URL.statistics(`/middle/${storeId}`),
      method: 'GET',
    });

    return data;
  }

  async getTopProducts(storeId: string, limit: number = 10) {
    const { data } = await axiosWithAuth<ITopProduct[]>({
      url: API_URL.statistics(`/top-products/${storeId}?limit=${limit}`),
      method: 'GET',
    });

    return data;
  }

  async getCategorySales(storeId: string) {
    const { data } = await axiosWithAuth<ICategorySales[]>({
      url: API_URL.statistics(`/category-sales/${storeId}`),
      method: 'GET',
    });

    return data;
  }

  async getSalesHistory(
    storeId: string,
    range: '1w' | '1m' | '6m' | '1y' | 'all' = '1m'
  ) {
    const { data } = await axiosWithAuth<ISalesHistory[]>({
      url: API_URL.statistics(`/sales-history/${storeId}?range=${range}`),
      method: 'GET',
    });

    return data;
  }
}

export const statisticsService = new StatisticsService();
