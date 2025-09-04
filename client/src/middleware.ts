import { NextResponse, type NextRequest } from 'next/server';
import { EnumTokens } from './services/auth/auth-token.service';
import { PUBLIC_URL } from './config/url.config';

export async function middleware(request: NextRequest, response: NextResponse) {
  console.log('request', request);
  console.log('response', response);
  const refreshToken = request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value;
  const accessToken = request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value;
  const isAuthPage = request.url.includes(PUBLIC_URL.auth());

  console.log('isAuthPage', isAuthPage);
  console.log('refreshToken', refreshToken);
  console.log('accessToken', accessToken);

  if (isAuthPage) {
    if (refreshToken && accessToken) {
      console.log('111 redirect home')
      return NextResponse.redirect(new URL(PUBLIC_URL.home(), request.url));
    }
    console.log('222 next')
    return NextResponse.next();
  }

  if (refreshToken === undefined) {
    console.log('333 redirect auth')
    return NextResponse.redirect(new URL(PUBLIC_URL.auth(), request.url));
  }

  console.log('444 next')
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/store/:path*', '/auth'],
};
