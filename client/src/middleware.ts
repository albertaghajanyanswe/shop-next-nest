import { NextResponse, type NextRequest } from 'next/server';
import { EnumTokens } from './services/auth/auth-token.service';
import { PUBLIC_URL } from './config/url.config';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest, response: NextResponse) {
  const refreshToken = request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value;
  const accessToken = request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value;

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.includes(PUBLIC_URL.auth());
  const isProtectedRoute =
    pathname.includes('/dashboard') || pathname.includes('/store');

  if (isAuthPage) {
    if (refreshToken && accessToken) {
      return NextResponse.redirect(new URL(PUBLIC_URL.home(), request.url));
    }
  } else if (isProtectedRoute) {
    if (refreshToken === undefined) {
      return NextResponse.redirect(new URL(PUBLIC_URL.auth(), request.url));
    }
  }

  // Apply internationalization routing
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for static assets, API, etc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
