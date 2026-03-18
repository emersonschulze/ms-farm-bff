import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/logger';

// Routes that do not require authentication
const PUBLIC_ROUTES = [
  '/api/health',
  '/api/docs',
  '/docs',
];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Allow CORS preflight through — headers are applied by next.config.ts
  if (request.method === 'OPTIONS') {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Cookie auth takes precedence; Bearer token as fallback
  const cookieToken = request.cookies.get('access_token')?.value;
  const authHeader  = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const token       = cookieToken ?? bearerToken;

  if (!token) {
    logger.warn('[Middleware] No access token — unauthorized', { pathname });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await verifyAccessToken(token);
    return NextResponse.next();
  } catch {
    logger.warn('[Middleware] Invalid or expired token', { pathname });
    return NextResponse.json({ error: 'Unauthorized', hint: 'Token expired or invalid' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*', '/docs'],
};
