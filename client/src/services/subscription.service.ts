import { axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { GetSubscriptionDto } from '@/generated/orval/types';

class SubscriptionService {
  async getSubscriptions() {
    const { data: subscriptions } = await axiosWithAuth<GetSubscriptionDto[]>({
      url: API_URL.subscriptions(''),
      method: 'GET',
    });

    return subscriptions;
  }
}

export const subscriptionService = new SubscriptionService();
