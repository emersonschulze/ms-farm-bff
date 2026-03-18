import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { keycloakUrls } from '@/lib/keycloak';

// Lazy-initialized JWKS — deferred to runtime to avoid build-time env var errors
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS(): ReturnType<typeof createRemoteJWKSet> {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(keycloakUrls.jwks));
  }
  return jwks;
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getJWKS(), {
    issuer: keycloakUrls.issuer,
  });

  return payload;
}
