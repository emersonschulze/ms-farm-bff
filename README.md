# ms-farm-bff

BFF (Backend for Frontend) da camada de fazendas. Roteia chamadas do frontend para `ms-farm-process`, sem conter regras de negócio.

## Stack

- **Runtime:** Node.js 22 + Next.js 15 (App Router API Routes)
- **Linguagem:** TypeScript
- **Auth:** JWT via Keycloak JWKS (jose)
- **Docs:** Swagger UI em `/docs`

## Responsabilidades

| Permitido                                        | Proibido                          |
|--------------------------------------------------|-----------------------------------|
| Roteamento para ms-farm-process                  | Regras de negócio                 |
| Adaptação de formato frontend ↔ process          | Acesso direto a banco de dados    |
| Autenticação via JWT / Bearer token              | Lógica de validação de domínio    |
| Logging estruturado de request e response        | Chamadas diretas a APIs externas  |

## Endpoints

| Método | Rota                              | Descrição                   |
|--------|-----------------------------------|-----------------------------|
| GET    | `/api/health`                     | Health check (público)      |
| GET    | `/api/docs`                       | OpenAPI spec JSON (público) |
| GET    | `/docs`                           | Swagger UI (público)        |
| GET    | `/api/v1/farms`                   | Listar fazendas             |
| POST   | `/api/v1/farms`                   | Criar fazenda               |
| GET    | `/api/v1/farms/:id`               | Buscar fazenda por ID       |
| PUT    | `/api/v1/farms/:id`               | Atualizar fazenda           |
| DELETE | `/api/v1/farms/:id`               | Remover fazenda             |
| GET    | `/api/v1/address/:postalCode`     | Consultar CEP (ViaCEP)      |

## Configuração local

```bash
cp .env.example .env.local
# edite .env.local com suas URLs locais
npm install
npm run dev      # http://localhost:3002
```

## Docker

```bash
# pela raiz do repositório
docker compose up --build ms-farm-bff
```

## Fluxo de chamadas

```
Frontend → ms-farm-bff (3002) → ms-farm-process (5002) → ms-farm-system (5001) → PostgreSQL / ViaCEP
```
