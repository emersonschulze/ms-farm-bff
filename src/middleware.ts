import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/logger';

// Routes that do not require authentication
const PUBLIC_ROUTES = [
  '/api/health',
  '/api/docs',
  '/docs',
  '/api/v1/pasture-statuses',
  '/api/v1/units-of-measure',
];

// Allowed origins — FRONTEND_URL (single) + ALLOWED_ORIGINS (comma-separated list)
const ALLOWED_ORIGINS: string[] = [
  process.env.FRONTEND_URL ?? 'http://localhost:3000',
  ...(process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean) ?? []),
];

function withCors(response: NextResponse, requestOrigin: string | null): NextResponse {
  const origin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : null;

  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const requestOrigin = request.headers.get('origin');

  // Respond to CORS preflight immediately with the correct headers
  if (request.method === 'OPTIONS') {
    return withCors(new NextResponse(null, { status: 204 }), requestOrigin);
  }

  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return withCors(NextResponse.next(), requestOrigin);
  }

  // Cookie auth takes precedence; Bearer token as fallback
  const cookieToken = request.cookies.get('access_token')?.value;
  const authHeader  = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const token       = cookieToken ?? bearerToken;

  if (!token) {
    logger.warn('[Middleware] No access token — unauthorized', { pathname });
    return withCors(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), requestOrigin);
  }

  try {
    await verifyAccessToken(token);
    return withCors(NextResponse.next(), requestOrigin);
  } catch {
    logger.warn('[Middleware] Invalid or expired token', { pathname });
    return withCors(
      NextResponse.json({ error: 'Unauthorized', hint: 'Token expired or invalid' }, { status: 401 }),
      requestOrigin,
    );
  }
}

export const config = {
  matcher: ['/api/:path*', '/docs'],
};
