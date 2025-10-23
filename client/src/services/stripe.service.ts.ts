import { axiosWithAuth } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { TypeData } from './order.service';
import { IPaymentResponse, IStripePaymentResponse } from '@/shared/types/order.interface';

class StripeService {
  async upgradePlan(planId: string) {
    const { data: upgradedPlan } = await axiosWithAuth<{ planId: string }>({
      url: API_URL.stripe(`/upgrade/${planId}`),
      method: 'POST',
      data: { planId },
    });

    return upgradedPlan;
  }

  async cancelUpgrade() {
    const { data: cancelUpgrade } = await axiosWithAuth({
      url: API_URL.stripe(`/cancel-upgrade`),
      method: 'POST',
      data: {},
    });

    return cancelUpgrade;
  }

  async getManagementLink() {
    const { data: managementLink } = await axiosWithAuth({
      url: API_URL.stripe(`/get-management-link`),
      method: 'GET',
    });

    return managementLink;
  }

  async getSubscriptions() {
    const { data: subscriptions } = await axiosWithAuth({
      url: API_URL.stripe(`/get-subscriptions`),
      method: 'GET',
    });

    return subscriptions;
  }

  async getPlans() {
    const { data: plans } = await axiosWithAuth({
      url: API_URL.stripe(`/get-plans`),
      method: 'GET',
    });

    return plans;
  }

  async createConnectAccountStripe() {
    const { data } = await axiosWithAuth<{ accountLink: string }>({
      url: API_URL.stripe(`/create-connect-account`),
      method: 'POST',
      data: {},
    });

    return data;
  }

  async createStripeAccountLink(stripeAccountId: string) {
    const { data } = await axiosWithAuth<{ url: string }>({
      url: API_URL.stripe(`/create-account-link`),
      method: 'POST',
      data: { stripeAccountId },
    });

    return data;
  }

  async pay(data: TypeData) {
    return axiosWithAuth<IStripePaymentResponse>({
      url: API_URL.stripe('/pay-stripe'),
      method: 'POST',
      data,
    });
  }
}

export const stripeService = new StripeService();
