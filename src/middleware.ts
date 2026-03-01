import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl, auth: session, method } = req;
  const pathname = nextUrl.pathname;

  // 1. Allow admin/auth page explicitly
  if (pathname === '/admin/auth') {
    if (session?.user) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // 2. Global API Protection
  if (pathname.startsWith('/api')) {
    // Always allow auth endpoints
    if (pathname.startsWith('/api/auth')) return NextResponse.next();

    // Sensitive GET routes
    const isSensitiveGet = pathname === '/api/imagekit-auth';

    // Protect sensitive methods and sensitive GETs
    if (method !== 'GET' || isSensitiveGet) {
      if (!session?.user) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return NextResponse.next();
  }

  // 3. Protect all admin UI routes
  if (pathname.startsWith('/admin')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/admin/auth', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
