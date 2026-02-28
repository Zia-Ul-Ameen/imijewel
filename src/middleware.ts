import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  // Allow admin/auth page
  if (pathname === '/admin/auth') {
    // If already logged in, redirect to dashboard
    if (session?.user) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Protect all admin routes
  if (pathname.startsWith('/admin')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/admin/auth', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: '/admin/:path*',
};
