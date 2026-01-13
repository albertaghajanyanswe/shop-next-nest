import { axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { GetPlansDto } from '@/generated/orval/types';

class PlanService {
  async getPlans() {
    const { data: plans } = await axiosWithAuth<GetPlansDto[]>({
      url: API_URL.plans(),
      method: 'GET',
    });

    return plans;
  }
}

export const planService = new PlanService();
