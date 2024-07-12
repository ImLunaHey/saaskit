import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');

  // if there is no hostname, return a 400
  // this should never happen, but it's good to be safe
  if (!hostname) {
    return new Response(null, { status: 400 });
  }

  // admin subdomain is for admin routes
  const isAdmin = hostname.split('.')[0] === 'admin';

  // get the locale from the header
  const knownLocales = ['en', 'fr'];
  const wantedLocale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en';
  const locale = knownLocales.includes(wantedLocale) ? wantedLocale : 'en';
  const newUrl = new URL(`/${hostname}/${locale}/${isAdmin ? 'admin' : 'app'}${url.pathname}`, request.url);

  console.info(`Rewriting URL from ${url.pathname} to ${newUrl.pathname}`);

  // rewrite the URL to include the app or admin path
  return NextResponse.rewrite(newUrl, {
    headers: {
      ...request.headers,
      'X-Next-Locale': locale,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
