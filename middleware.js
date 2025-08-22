// middleware.js
import { NextResponse } from 'next/server';

const SUPPORTED = ['en', 'nl'];
const DEFAULT = 'en';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Ignore Next internals, API routes, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return;
  }

  // If path doesn't start with a supported locale, redirect to default
  const hasLocale = new RegExp(`^/(${SUPPORTED.join('|')})(/|$)`).test(
    pathname
  );
  if (!hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT}${pathname}`;
    return NextResponse.redirect(url);
  }
}

// Limit middleware to all paths except _next, files, and api
export const config = {
  matcher: ['/((?!_next|.*\\..*|api).*)'],
};
