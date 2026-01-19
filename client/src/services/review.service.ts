import { axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import {
  GetReviewDto,
  GetReviewWithUserDto,
  GetReviewWithUserDtoAndCount,
} from '@/generated/orval/types';
import { iParams } from '@/shared/types/filter.interface';
import { IReviewInput } from '@/shared/types/review.interface';

class ReviewService {
  async getByStoreId(storeId: string, params?: iParams) {
    const { data } = await axiosWithAuth<GetReviewWithUserDtoAndCount>({
      url: `${API_URL.reviews(`/store/${storeId}`)}?params=${encodeURIComponent(JSON.stringify(params))}`,
      method: 'GET',
    });

    return data || [];
  }

  async create(data: IReviewInput, productId: string, storeId: string) {
    const { data: createdReview } = await axiosWithAuth<GetReviewDto>({
      url: API_URL.reviews(`/${productId}/${storeId}`),
      method: 'POST',
      data,
    });

    return createdReview;
  }

  async delete(id: string) {
    const { data: deletedReview } = await axiosWithAuth<GetReviewDto>({
      url: API_URL.reviews(`/${id}`),
      method: 'DELETE',
    });

    return deletedReview;
  }
}

export const reviewService = new ReviewService();
