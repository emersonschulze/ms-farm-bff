---
name: ms-farm-bff
description: Agente especializado do ms-farm-bff — camada BFF de fazendas, roteia chamadas do frontend para ms-farm-process.
type: agent
---

# ms-farm-bff Agent

## Projeto

**ms-farm-bff** é a camada BFF (Backend for Frontend) responsável por rotear e adaptar chamadas do frontend para `ms-farm-process`. Não contém regras de negócio.

- **Repositório:** `D:/GIT/Repositorios/ms-farm-bff`
- **GitHub:** https://github.com/emersonschulze/ms-farm-bff
- **Porta:** 3002 (host) → 3000 (container)
- **Upstream:** `ms-farm-process` (porta 5002)

---

## Stack e Versões

| Tecnologia         | Versão    |
|--------------------|-----------|
| Node.js            | 22        |
| Next.js            | ^15.0.0   |
| React              | ^19.0.0   |
| TypeScript         | ^5.0.0    |
| jose               | ^5.9.6    |
| Vitest             | ^2.0.0    |
| swagger-ui-react   | ^5.32.0   |
| openapi-types      | ^12.1.3   |

---

## Estrutura do Projeto

```
ms-farm-bff/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── docs/page.tsx                          → Swagger UI (/docs)
│   │   └── api/
│   │       ├── health/route.ts
│   │       ├── docs/route.ts
│   │       └── v1/
│   │           ├── farms/
│   │           │   ├── route.ts                   → GET list, POST
│   │           │   └── [id]/route.ts              → GET, PUT, DELETE
│   │           └── address/
│   │               └── [postalCode]/route.ts      → GET CEP
│   ├── services/
│   │   ├── farm.service.ts     → HTTP calls para ms-farm-process /api/v1/farms
│   │   └── address.service.ts  → HTTP calls para ms-farm-process /api/v1/address
│   ├── adapters/
│   │   ├── farm.adapter.ts     → transforma resposta do process → frontend
│   │   └── address.adapter.ts  → transforma resposta do process → frontend
│   ├── lib/
│   │   ├── http-client.ts      → wrapper fetch (GET/POST/PUT/DELETE + HttpError)
│   │   ├── jwt.ts              → JWT verify via Keycloak JWKS
│   │   ├── keycloak.ts         → URLs do Keycloak (issuer, jwks)
│   │   ├── logger.ts           → JSON logging estruturado
│   │   └── openapi.ts          → OpenAPI 3.0.0 spec completo
│   ├── middleware.ts            → JWT auth guard para todas as rotas protegidas
│   └── types/
│       ├── farm.types.ts       → FarmModel, CreateFarmRequest, UpdateFarmRequest, owners, contacts
│       └── address.types.ts    → AddressModel
```

---

## Endpoints

### Públicos (sem autenticação)

| Método | Rota          | Descrição                              |
|--------|---------------|----------------------------------------|
| GET    | `/api/health` | Health check — `{ status, service, timestamp }` |
| GET    | `/api/docs`   | OpenAPI spec JSON                      |
| GET    | `/docs`       | Swagger UI                             |

### Protegidos (Bearer token ou cookie `access_token`)

| Método | Rota                              | Descrição                             |
|--------|-----------------------------------|---------------------------------------|
| GET    | `/api/v1/farms`                   | Lista todas as fazendas               |
| POST   | `/api/v1/farms`                   | Cria fazenda (201)                    |
| GET    | `/api/v1/farms/:id`               | Busca fazenda por UUID                |
| PUT    | `/api/v1/farms/:id`               | Atualiza fazenda                      |
| DELETE | `/api/v1/farms/:id`               | Remove fazenda (204)                  |
| GET    | `/api/v1/address/:postalCode`     | Consulta CEP via ViaCEP (via process) |

---

## Tipos Principais

### farm.types.ts
```typescript
interface PersonContactModel   { type, value, isPrimary }
interface FarmOwnerModel       { description, personType, taxId, legalName, relationshipType, contacts, participationPercentage }
interface FarmOwnerResponse    { id, personId, personDescription, personContacts, participationPercentage }
interface FarmModel            { id, description, postalCode, address, neighborhood, city, state, contacts,
                                  companyTaxId, legalName, stateRegistration, incraNumber, area,
                                  unitOfMeasureId, unitOfMeasureDescription, owners, createdAt, updatedAt }
interface CreateFarmRequest    { description, postalCode?, address?, neighborhood?, city?, state?,
                                  relationshipType, contacts, companyTaxId?, legalName?, stateRegistration?,
                                  incraNumber?, area?, unitOfMeasureId?, owners }
interface UpdateFarmRequest    { (same as CreateFarmRequest) }
```

### address.types.ts
```typescript
interface AddressModel { postalCode, address, neighborhood, city, state }
```

---

## Middleware

**Arquivo:** `src/middleware.ts` — aplica a todas as rotas `/api/**` e `/docs`.

**Rotas públicas** (bypass automático): `/api/health`, `/api/docs`, `/docs`

**Rotas protegidas:** verificação JWT via JWKS do Keycloak. Aceita Bearer header ou cookie `access_token`.

---

## Variáveis de Ambiente

| Variável                | Descrição                                           |
|-------------------------|-----------------------------------------------------|
| `FARM_PROCESS_URL`      | URL base do ms-farm-process                         |
| `KEYCLOAK_URL`          | URL base do Keycloak                                |
| `KEYCLOAK_REALM`        | Realm do Keycloak                                   |
| `KEYCLOAK_CLIENT_ID`    | Client ID do BFF                                    |
| `FRONTEND_URL`          | URL do frontend (CORS Allow-Origin)                 |
| `NEXT_PUBLIC_APP_ENV`   | Ambiente (`development` / `production`)             |

---

## Comandos

```bash
npm install
npm run dev          # porta 3002
npm run build
npm run type-check
npm run lint
npm run test
npm run test:coverage
```

---

## Fluxo de chamadas

```
Frontend → ms-farm-bff (3002) → ms-farm-process (5002) → ms-farm-system (5001) → PostgreSQL / ViaCEP
```
