const KEYCLOAK_URL          = process.env.KEYCLOAK_URL          ?? 'http://localhost:8080';
// Inside Docker, HTTP requests must use the internal hostname.
// Falls back to KEYCLOAK_URL when not set (local dev without Docker).
const KEYCLOAK_INTERNAL_URL = process.env.KEYCLOAK_INTERNAL_URL ?? KEYCLOAK_URL;
const KEYCLOAK_REALM        = process.env.KEYCLOAK_REALM        ?? 'sigfaz';

export const keycloakUrls = {
  // issuer must match the `iss` claim in the JWT — always the public URL
  issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
  // JWKS is fetched server-to-server — use internal URL when inside Docker
  jwks:   `${KEYCLOAK_INTERNAL_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`,
};
