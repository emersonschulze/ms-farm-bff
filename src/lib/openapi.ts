import type { OpenAPIV3 } from 'openapi-types';

const contact = {
  type:       'object',
  properties: {
    type:      { type: 'integer', example: 1, description: '1=Phone 2=Email 3=WhatsApp' },
    value:     { type: 'string',  example: '+5511999999999' },
    isPrimary: { type: 'boolean', example: true },
  },
  required: ['type', 'value', 'isPrimary'],
} satisfies OpenAPIV3.SchemaObject;

const owner = {
  type:       'object',
  properties: {
    description:             { type: 'string',  example: 'João Silva' },
    personType:              { type: 'integer', example: 1, description: '1=NaturalPerson 2=LegalPerson' },
    taxId:                   { type: 'string',  nullable: true, example: '123.456.789-00' },
    legalName:               { type: 'string',  nullable: true, example: null },
    relationshipType:        { type: 'integer', example: 1, description: '1=Buyer 2=Supplier' },
    contacts:                { type: 'array', items: { $ref: '#/components/schemas/ContactRequest' } },
    participationPercentage: { type: 'number',  example: 50.00 },
  },
  required: ['description', 'personType', 'relationshipType', 'contacts', 'participationPercentage'],
} satisfies OpenAPIV3.SchemaObject;

const farmResponse = {
  type:       'object',
  properties: {
    id:                       { type: 'string',  format: 'uuid' },
    description:              { type: 'string',  example: 'Fazenda Santa Maria' },
    postalCode:               { type: 'string',  nullable: true, example: '01310-100' },
    address:                  { type: 'string',  nullable: true, example: 'Av. Paulista' },
    neighborhood:             { type: 'string',  nullable: true, example: 'Bela Vista' },
    city:                     { type: 'string',  nullable: true, example: 'São Paulo' },
    state:                    { type: 'string',  nullable: true, example: 'SP' },
    contacts:                 { type: 'array', items: { $ref: '#/components/schemas/ContactRequest' } },
    companyTaxId:             { type: 'string',  nullable: true, example: '12.345.678/0001-99' },
    legalName:                { type: 'string',  nullable: true, example: 'Fazenda Santa Maria Ltda' },
    stateRegistration:        { type: 'string',  nullable: true },
    incraNumber:              { type: 'string',  nullable: true },
    area:                     { type: 'number',  nullable: true, example: 500.00 },
    unitOfMeasureId:          { type: 'integer', nullable: true, example: 1 },
    unitOfMeasureDescription: { type: 'string',  nullable: true, example: 'Hectare' },
    owners: {
      type:  'array',
      items: {
        type: 'object',
        properties: {
          id:                      { type: 'string', format: 'uuid' },
          personId:                { type: 'string', format: 'uuid' },
          personDescription:       { type: 'string', example: 'João Silva' },
          personContacts:          { type: 'array', items: { $ref: '#/components/schemas/ContactRequest' } },
          participationPercentage: { type: 'number', example: 100.00 },
        },
      },
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
} satisfies OpenAPIV3.SchemaObject;

export const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title:       'ms-farm-bff',
    description: 'BFF de fazendas — roteia chamadas do frontend para ms-farm-process.',
    version:     '1.0.0',
  },
  servers: [
    { url: 'http://localhost:3002', description: 'Local development' },
  ],
  tags: [
    { name: 'Health',  description: 'Status do serviço' },
    { name: 'Farms',   description: 'CRUD de fazendas' },
    { name: 'Address', description: 'Consulta de CEP via ViaCEP' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags:        ['Health'],
        summary:     'Health check',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'Serviço saudável',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } } },
          },
        },
      },
    },

    '/api/v1/farms': {
      get: {
        tags:        ['Farms'],
        summary:     'Listar fazendas',
        operationId: 'listFarms',
        security:    [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de fazendas',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/FarmResponse' } } } },
          },
          '401': { description: 'Não autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      post: {
        tags:        ['Farms'],
        summary:     'Criar fazenda',
        operationId: 'createFarm',
        security:    [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateFarmRequest' } } },
        },
        responses: {
          '201': {
            description: 'Fazenda criada',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/FarmResponse' } } },
          },
          '400': { description: 'Dados inválidos',  content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '401': { description: 'Não autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/api/v1/farms/{id}': {
      get: {
        tags:        ['Farms'],
        summary:     'Buscar fazenda por ID',
        operationId: 'getFarmById',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': { description: 'Fazenda encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/FarmResponse' } } } },
          '401': { description: 'Não autenticado',   content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Não encontrada',    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      put: {
        tags:        ['Farms'],
        summary:     'Atualizar fazenda',
        operationId: 'updateFarm',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateFarmRequest' } } },
        },
        responses: {
          '200': { description: 'Fazenda atualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/FarmResponse' } } } },
          '401': { description: 'Não autenticado',   content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Não encontrada',    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        tags:        ['Farms'],
        summary:     'Remover fazenda',
        operationId: 'deleteFarm',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '204': { description: 'Removida com sucesso' },
          '401': { description: 'Não autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'Não encontrada',  content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },

    '/api/v1/address/{postalCode}': {
      get: {
        tags:        ['Address'],
        summary:     'Consultar CEP',
        description: 'Busca endereço pelo CEP via ms-farm-process → ms-farm-system → ViaCEP.',
        operationId: 'getAddress',
        security:    [{ bearerAuth: [] }],
        parameters: [{ name: 'postalCode', in: 'path', required: true, schema: { type: 'string' }, example: '01310100' }],
        responses: {
          '200': {
            description: 'Endereço encontrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AddressResponse' } } },
          },
          '401': { description: 'Não autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '404': { description: 'CEP não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },

  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status:    { type: 'string',  example: 'healthy' },
          service:   { type: 'string',  example: 'ms-farm-bff' },
          timestamp: { type: 'string',  format: 'date-time' },
        },
      },

      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Internal server error' },
        },
      },

      ContactRequest: contact,

      OwnerRequest: owner,

      CreateFarmRequest: {
        type: 'object',
        required: ['description', 'relationshipType', 'contacts', 'owners'],
        properties: {
          description:       { type: 'string',  example: 'Fazenda Santa Maria' },
          postalCode:        { type: 'string',  nullable: true, example: '01310100' },
          address:           { type: 'string',  nullable: true },
          neighborhood:      { type: 'string',  nullable: true },
          city:              { type: 'string',  nullable: true },
          state:             { type: 'string',  nullable: true },
          relationshipType:  { type: 'integer', example: 1 },
          contacts:          { type: 'array', items: { $ref: '#/components/schemas/ContactRequest' } },
          companyTaxId:      { type: 'string',  nullable: true, example: '12.345.678/0001-99' },
          legalName:         { type: 'string',  nullable: true },
          stateRegistration: { type: 'string',  nullable: true },
          incraNumber:       { type: 'string',  nullable: true },
          area:              { type: 'number',  nullable: true, example: 500.00 },
          unitOfMeasureId:   { type: 'integer', nullable: true, example: 1 },
          owners:            { type: 'array', items: { $ref: '#/components/schemas/OwnerRequest' } },
        },
      },

      FarmResponse: farmResponse,

      AddressResponse: {
        type: 'object',
        properties: {
          postalCode:   { type: 'string', nullable: true, example: '01310-100' },
          address:      { type: 'string', nullable: true, example: 'Av. Paulista' },
          neighborhood: { type: 'string', nullable: true, example: 'Bela Vista' },
          city:         { type: 'string', nullable: true, example: 'São Paulo' },
          state:        { type: 'string', nullable: true, example: 'SP' },
        },
      },
    },

    securitySchemes: {
      bearerAuth: {
        type:         'http',
        scheme:       'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
