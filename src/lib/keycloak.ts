const KEYCLOAK_URL   = process.env.KEYCLOAK_URL   ?? 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM ?? 'sigfaz';

export const keycloakUrls = {
  issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
  jwks:   `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`,
};
