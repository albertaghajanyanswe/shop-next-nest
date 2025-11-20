import { axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { TypeData } from './order.service';
import {
  IPaymentResponse,
  IStripePaymentResponse,
} from '@/shared/types/order.interface';

class StripeService {
  async upgradePlan(planId: string) {
    const { data: upgradedPlan } = await axiosWithAuth<{ planId: string }>({
      url: API_URL.payment(`/sub-upgrade`),
      method: 'POST',
      data: { planId, provider: 'STRIPE' }, // todo add provider enum
    });

    return upgradedPlan;
  }

  async cancelUpgrade() {
    const { data: cancelUpgrade } = await axiosWithAuth({
      url: API_URL.payment(`/stripe/sub-cancel-upgrade`),
      method: 'POST',
      data: {},
    });

    return cancelUpgrade;
  }

  async getManagementLink() {
    const { data: managementLink } = await axiosWithAuth({
      url: API_URL.payment(`/stripe/sub-get-management-link`),
      method: 'GET',
    });

    return managementLink;
  }

  async getSubscriptions() {
    const { data: subscriptions } = await axiosWithAuth({
      url: API_URL.payment(`/subscriptions`),
      method: 'GET',
    });

    return subscriptions;
  }

  async getPlans() {
    const { data: plans } = await axiosWithAuth({
      url: API_URL.payment(`/plans`),
      method: 'GET',
    });

    return plans;
  }

  async createConnectAccountStripe() {
    const { data } = await axiosWithAuth<{ accountLink: string }>({
      url: API_URL.payment(`/stripe/create-connect-account`),
      method: 'POST',
      data: {},
    });

    return data;
  }

  async createStripeAccountLink(stripeAccountId: string) {
    const { data } = await axiosWithAuth<{ url: string }>({
      url: API_URL.payment(`/create-account-link`),
      method: 'POST',
      data: { stripeAccountId },
    });

    return data;
  }

  async pay(data: TypeData) {
    return axiosWithAuth<IStripePaymentResponse>({
      url: API_URL.payment('/buy-product'),
      method: 'POST',
      data,
    });
  }

  async simulateStripeTestClockAdvance(numberOfDays: number) {
    const { data } = await axiosWithAuth<{ message: string }>({
      url: API_URL.payment(`/stripe/simulate-test-clock`),
      method: 'POST',
      data: { numberOfDays },
    });
    return data;
  }
}

export const stripeService = new StripeService();
