import { EnvVariables } from '@/shared/envVariables';
import Cookies from 'js-cookie';

export enum EnumTokens {
  'REFRESH_TOKEN' = 'refreshToken',
}

const checkSecureCookie = () => {
  const isLocalHost = process.env.APP_DOMAIN === 'localhost';
  const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';
  const isSecure = isLocalHost || isProd;
  return isSecure;
};

export const removeFromStorage = () => {
  Cookies.remove(EnumTokens.REFRESH_TOKEN);
};
