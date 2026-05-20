import { axiosClassic } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import {
  ContactUsDto,
  SubscribedEmailsDtoResponse,
  SubscribeEmailDto,
} from '@/generated/orval/types';

class MailerService {
  constructor() {}
  async contactUs(data: ContactUsDto) {
    const res = await axiosClassic<ContactUsDto>({
      url: API_URL.mailer(`/contact-us`),
      method: 'POST',
      data,
    });

    return res;
  }

  async subscribe(data: SubscribeEmailDto) {
    const res = await axiosClassic<SubscribedEmailsDtoResponse>({
      url: API_URL.mailer(`/subscribe`),
      method: 'POST',
      data,
    });

    return res;
  }

  async unsubscribe(email: string) {
    const res = await axiosClassic({
      url: API_URL.mailer(`/unsubscribe/${email}`),
      method: 'DELETE',
    });

    return res;
  }

  async forgotPassword(email: string) {
    const res = await axiosClassic({
      url: API_URL.auth(`/forgot-password`),
      method: 'POST',
      data: { email },
    });

    return res;
  }

  async resetPassword(token: string, password: string) {
    const res = await axiosClassic({
      url: API_URL.auth(`/reset-password`),
      method: 'POST',
      data: { token, password },
    });

    return res;
  }
}

export const mailerService = new MailerService();
