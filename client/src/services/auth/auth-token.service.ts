import { EnvVariables } from '@/shared/envVariables';
import Cookies from 'js-cookie';

export enum EnumTokens {
  'ACCESS_TOKEN' = 'accessToken',
  'REFRESH_TOKEN' = 'refreshToken',
}

export const getAccessToken = () => {
  const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN);
  return accessToken || null;
};

const checkSecureCookie = () => {
  const isSecure =
    process.env.NODE_ENV === 'production' ||
    process.env.APP_DOMAIN === 'localhost';
  console.log('\n\n\n process.env.NODE_ENV - ', process.env.NODE_ENV);
  console.log('process.env.SERVER_DOMAIN - ', process.env.SERVER_DOMAIN);
  console.log('checkSecureCookie - ', isSecure);
  return isSecure;
};

/*
 * TODO - Cookie temporary solution
 * Need to add domain in any NODE_ENV
 */
export const saveTokenStorage = (accessToken: string) => {
  Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
    ...(checkSecureCookie() ? { domain: process.env.APP_DOMAIN } : {}),
    domain: process.env.APP_DOMAIN,
    sameSite: 'strict',
    expires: 1,
  });
};

export const removeFromStorage = () => {
  Cookies.remove(EnumTokens.ACCESS_TOKEN);
};
