# ms-farm-bff

## Stack

| Technology        | Version   |
|-------------------|-----------|
| Node.js           | 22        |
| Next.js           | ^15.0.0   |
| React             | ^19.0.0   |
| TypeScript        | ^5.0.0    |
| jose              | ^5.9.6    |
| openapi-types     | ^12.1.3   |
| swagger-ui-react  | ^5.32.0   |
| Vitest            | ^2.0.0    |
| @vitest/coverage-v8 | ^2.0.0  |

## Architecture

ms-farm-bff is the BFF (Backend for Frontend) layer for the farm domain. It sits between the frontend (SigfazWeb, port 3000) and the process layer (ms-farm-process, port 5002). It has no business logic — its sole responsibilities are:

- Authenticating requests via Keycloak JWT verification
- Proxying requests to ms-farm-process via typed HTTP service classes
- Applying the adapter layer to isolate the frontend from backend contract changes
- Exposing a direct ViaCEP lookup route (`/api/v1/farms/address/[cep]`) that calls ViaCEP externally without going through the process layer
- Serving an OpenAPI 3.0.0 spec at `/api/docs` and Swagger UI at `/docs`

Call flow:

```
Frontend (3000) → ms-farm-bff (3002) → ms-farm-process (5002) → ms-farm-system (5001) → PostgreSQL / ViaCEP
```

The `/api/v1/farms/address/[cep]` route is the exception — it calls ViaCEP directly from the BFF.

## Project Structure

```
ms-farm-bff/
├── next.config.ts                          CORS headers (FRONTEND_URL), standalone output
├── src/
│   ├── middleware.ts                        JWT auth guard — applies to /api/** and /docs
│   ├── app/
│   │   ├── layout.tsx                       Root layout (title: ms-farm-bff)
│   │   ├── docs/
│   │   │   └── page.tsx                     Swagger UI page (client component)
│   │   └── api/
│   │       ├── health/route.ts              GET /api/health — public
│   │       ├── docs/route.ts                GET /api/docs — OpenAPI spec JSON, public
│   │       └── v1/
│   │           ├── farms/
│   │           │   ├── route.ts             GET list, POST create
│   │           │   ├── [id]/
│   │           │   │   ├── route.ts         GET by id, PUT update, DELETE
│   │           │   │   └── inactivate/
│   │           │   │       └── route.ts     PATCH inactivate farm
│   │           │   └── address/
│   │           │       └── [cep]/
│   │           │           └── route.ts     GET — direct ViaCEP lookup (no process)
│   │           ├── pastures/
│   │           │   ├── route.ts             GET list, POST create
│   │           │   └── [id]/
│   │           │       ├── route.ts         GET by id, PUT update
│   │           │       └── inactivate/
│   │           │           └── route.ts     PATCH inactivate pasture
│   │           ├── pasture-statuses/
│   │           │   └── route.ts             GET list — public (no auth)
│   │           ├── cultures/
│   │           │   ├── route.ts             GET list, POST create
│   │           │   └── [id]/
│   │           │       ├── route.ts         GET by id, PUT update
│   │           │       └── inactivate/
│   │           │           └── route.ts     PATCH inactivate culture
│   │           ├── units-of-measure/
│   │           │   └── route.ts             GET list — public (no auth), calls process directly
│   │           └── address/
│   │               └── [postalCode]/
│   │                   └── route.ts         GET — proxies to ms-farm-process address endpoint
│   ├── services/
│   │   ├── farm.service.ts                  HTTP calls to ms-farm-process /api/v1/farms
│   │   ├── pasture.service.ts               HTTP calls — PastureService + PastureStatusService
│   │   ├── culture.service.ts               HTTP calls to ms-farm-process /api/v1/cultures
│   │   └── address.service.ts               HTTP calls to ms-farm-process /api/v1/address
│   ├── adapters/
│   │   ├── farm.adapter.ts                  adaptFarm / adaptFarmList (pass-through, isolates contract)
│   │   └── address.adapter.ts               adaptAddress (pass-through, isolates contract)
│   ├── lib/
│   │   ├── http-client.ts                   fetch wrapper — httpGet/Post/Put/Patch/Delete + HttpError
│   │   ├── jwt.ts                           verifyAccessToken via Keycloak JWKS (lazy-initialized)
│   │   ├── keycloak.ts                      Builds issuer and jwks URLs from env vars
│   │   ├── logger.ts                        Structured JSON logger (info/warn/error)
│   │   └── openapi.ts                       OpenAPI 3.0.0 spec definition
│   └── types/
│       ├── farm.types.ts                    All farm, pasture, culture, owner, contact types
│       └── address.types.ts                 AddressModel
```

## Endpoints

### Public (no authentication required)

| Method | Path                              | Description                                      |
|--------|-----------------------------------|--------------------------------------------------|
| GET    | `/api/health`                     | Health check — `{ status, service, timestamp }`  |
| GET    | `/api/docs`                       | OpenAPI 3.0.0 spec JSON                          |
| GET    | `/docs`                           | Swagger UI (client-side React page)              |
| GET    | `/api/v1/pasture-statuses`        | List all pasture statuses — proxies to process   |
| GET    | `/api/v1/units-of-measure`        | List all units of measure — proxies to process   |

### Protected (Bearer token or `access_token` cookie required)

| Method | Path                                      | Description                                           | Proxies to                              |
|--------|-------------------------------------------|-------------------------------------------------------|-----------------------------------------|
| GET    | `/api/v1/farms`                           | List all farms                                        | process `GET /api/v1/farms`             |
| POST   | `/api/v1/farms`                           | Create farm (201)                                     | process `POST /api/v1/farms`            |
| GET    | `/api/v1/farms/:id`                       | Get farm by ID                                        | process `GET /api/v1/farms/:id`         |
| PUT    | `/api/v1/farms/:id`                       | Update farm                                           | process `PUT /api/v1/farms/:id`         |
| DELETE | `/api/v1/farms/:id`                       | Delete farm (204)                                     | process `DELETE /api/v1/farms/:id`      |
| PATCH  | `/api/v1/farms/:id/inactivate`            | Inactivate farm (soft delete)                         | process `PATCH /api/v1/farms/:id/inactivate` |
| GET    | `/api/v1/farms/address/:cep`              | CEP lookup — calls ViaCEP directly, NOT via process   | ViaCEP external API                     |
| GET    | `/api/v1/pastures`                        | List all pastures                                     | process `GET /api/v1/pastures`          |
| POST   | `/api/v1/pastures`                        | Create pasture (201)                                  | process `POST /api/v1/pastures`         |
| GET    | `/api/v1/pastures/:id`                    | Get pasture by ID                                     | process `GET /api/v1/pastures/:id`      |
| PUT    | `/api/v1/pastures/:id`                    | Update pasture                                        | process `PUT /api/v1/pastures/:id`      |
| PATCH  | `/api/v1/pastures/:id/inactivate`         | Inactivate pasture                                    | process `PATCH /api/v1/pastures/:id/inactivate` |
| GET    | `/api/v1/cultures`                        | List all cultures                                     | process `GET /api/v1/cultures`          |
| POST   | `/api/v1/cultures`                        | Create culture (201)                                  | process `POST /api/v1/cultures`         |
| GET    | `/api/v1/cultures/:id`                    | Get culture by ID                                     | process `GET /api/v1/cultures/:id`      |
| PUT    | `/api/v1/cultures/:id`                    | Update culture                                        | process `PUT /api/v1/cultures/:id`      |
| PATCH  | `/api/v1/cultures/:id/inactivate`         | Inactivate culture                                    | process `PATCH /api/v1/cultures/:id/inactivate` |
| GET    | `/api/v1/address/:postalCode`             | Address lookup via process → system → ViaCEP         | process `GET /api/v1/address/:postalCode` |

## Types

All types are in `src/types/`. Key interfaces:

### farm.types.ts

```typescript
// Culture
interface CultureModel           { id, name, commercialName, cycle, harvest, isActive, createdAt, updatedAt }
interface CreateCultureRequest   { name, commercialName, cycle, harvest }
interface UpdateCultureRequest   { name?, commercialName?, cycle?, harvest? }

// Pasture
interface PastureStatusResponse  { id, name }
interface PastureResponse        { id, pastureNumber, area, unitOfMeasureId, unitOfMeasureSymbol,
                                   statusId, statusName, cultureId, cultureName, farmId, farmName,
                                   animalCapacity, isActive, createdAt, updatedAt }
interface CreatePastureRequest   { pastureNumber, area, unitOfMeasureId, statusId, cultureId, farmId, animalCapacity }
interface UpdatePastureRequest   { pastureNumber?, area?, unitOfMeasureId?, statusId?, cultureId?, animalCapacity? }

// Shared
interface FarmContactModel       { id, phone, email, isPrimary }
interface UnitOfMeasureModel     { id, description, symbol }

// Farm response (process → frontend)
interface FarmOwnerModel         { id, cnpjCpfNumber, personType, name, phone, email, participationPercentage }
                                   // personType: 1=NaturalPerson, 2=LegalPerson
interface FarmModel              { id, name, companyCnpjCpfNumber, legalName, stateRegistration,
                                   municipalRegistration, incraNumber, area, unitOfMeasureId,
                                   unitOfMeasureDescription, postalCode, address, neighborhood,
                                   city, state, contacts, owners, isActive, createdAt, updatedAt }

// Farm requests (frontend → process)
interface CreateFarmContactRequest   { phone, email, isPrimary }
interface PersonContactRequest       { type, value, isPrimary }
interface CreateFarmOwnerRequest     { cnpjCpfNumber, personType, name, contacts, participationPercentage }
interface UpdateFarmOwnerRequest     { cnpjCpfNumber, participationPercentage }
interface CreateFarmRequest          { name, companyCnpjCpfNumber, legalName, stateRegistration,
                                       municipalRegistration, incraNumber, area, unitOfMeasureId,
                                       postalCode, address, neighborhood, city, state, contacts, owners }
interface UpdateFarmRequest          { (all fields optional, owners uses UpdateFarmOwnerRequest) }
```

### address.types.ts

```typescript
interface AddressModel  { postalCode, address, neighborhood, city, state }
```

### Inline (farms/address/[cep]/route.ts)

```typescript
interface ViaCepResponse  { cep, logradouro, bairro, localidade, uf, erro? }
```

## Environment Variables

| Variable                | Required | Description                                                      |
|-------------------------|----------|------------------------------------------------------------------|
| `FARM_PROCESS_URL`      | Yes      | Base URL for ms-farm-process (e.g. `http://localhost:5002`)      |
| `KEYCLOAK_URL`          | Yes      | Public Keycloak URL — used as JWT `iss` claim issuer             |
| `KEYCLOAK_INTERNAL_URL` | No       | Internal Docker hostname for JWKS fetch; falls back to `KEYCLOAK_URL` |
| `KEYCLOAK_REALM`        | No       | Keycloak realm name (default: `sigfaz`)                          |
| `KEYCLOAK_CLIENT_ID`    | No       | Client ID — used only for documentation, not validated in code   |
| `FRONTEND_URL`          | No       | Allowed CORS origin (default: `http://localhost:3000`)           |
| `NEXT_PUBLIC_APP_ENV`   | No       | App environment — `development` or `production`                  |

## Commands

```bash
npm install
npm run dev            # start dev server on port 3002
npm run build          # Next.js production build (standalone output)
npm run start          # start production server on port 3002
npm run lint           # ESLint via next lint
npm run type-check     # tsc --noEmit
npm run test           # vitest run
npm run test:watch     # vitest (watch mode)
npm run test:coverage  # vitest run --coverage
```

## Patterns & Rules

**Auth flow:**
- Middleware (`src/middleware.ts`) runs on all `/api/**` and `/docs` routes
- Cookie `access_token` takes precedence over `Authorization: Bearer <token>` header
- Token is verified against Keycloak JWKS (`/realms/:realm/protocol/openid-connect/certs`)
- JWKS instance is lazy-initialized at first request to avoid build-time env var errors
- `KEYCLOAK_INTERNAL_URL` is used for the JWKS fetch (server-to-server); `KEYCLOAK_URL` is used for the issuer claim (must match the public URL in the token)
- Public routes bypass auth: `/api/health`, `/api/docs`, `/docs`, `/api/v1/pasture-statuses`, `/api/v1/units-of-measure`
- CORS preflight (`OPTIONS`) is passed through; CORS headers are applied by `next.config.ts`

**Error handling:**
- All route handlers catch `HttpError` (thrown by `http-client.ts` on non-2xx responses) and forward the upstream status code and body to the client
- Unknown errors return `500 Internal server error`
- The `/api/v1/farms/address/[cep]` route validates CEP length (must be 8 digits after stripping non-digits) before calling ViaCEP

**Service layer:**
- Each domain has a typed service class (`FarmService`, `PastureService`, `PastureStatusService`, `CultureService`, `AddressService`)
- All services read `FARM_PROCESS_URL` at call time (not at module load) to support runtime injection
- `httpGet/Post/Put/Patch/Delete` helpers in `lib/http-client.ts` always set `Content-Type: application/json`

**Adapter layer:**
- `adaptFarm`, `adaptFarmList`, `adaptAddress` are currently pass-through functions
- The adapter layer exists to isolate the frontend from future backend contract changes without modifying route handlers

**Logging:**
- Structured JSON logs via `lib/logger.ts` (info/warn/error)
- Log entries include `level`, `message`, `timestamp`, and a contextual object
- No sensitive data (tokens, passwords) is ever logged

**CORS:**
- Configured in `next.config.ts` for all `/api/**` routes
- Allowed origin controlled by `FRONTEND_URL` env var
- Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`

**Next.js config:**
- `output: 'standalone'` — produces a self-contained Docker-compatible build
