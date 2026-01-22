import { axiosClassic } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { ContactUsDto } from '@/generated/orval/types';

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
}

export const mailerService = new MailerService();
