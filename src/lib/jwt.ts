import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { keycloakUrls } from '@/lib/keycloak';

// Cached JWKS — fetched once and reused across requests
const JWKS = createRemoteJWKSet(new URL(keycloakUrls.jwks));

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: keycloakUrls.issuer,
  });

  return payload;
}
