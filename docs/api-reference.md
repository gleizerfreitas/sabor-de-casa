# Referência da API REST

## Autenticação

Todos os endpoints administrativos (`/api/**`) exigem autenticação via Supabase Auth. A sessão é armazenada em cookies HTTP-Only.

**Status de Erro**:
- `401 UNAUTHENTICATED`: Sessão não encontrada ou expirada
- `403 FORBIDDEN`: Usuário autenticado mas sem permissão administrativa

## Padrão de Resposta

### Sucesso

```json
{ "data": { /* Entidade */ } }
```

Ou para listas:
```json
{ "data": [ /* Entidades */ ] }
```

### Erro

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem amigável",
    "details": {
      "field": "descrição do problema"
    }
  }
}
```

**Códigos de Erro**:
- `VALIDATION_ERROR` (400): Dados inválidos
- `UNAUTHENTICATED` (401): Sem autenticação
- `FORBIDDEN` (403): Sem permissão
- `NOT_FOUND` (404): Recurso não encontrado
- `DUPLICATE_RESOURCE` (409): Recurso duplicado (ex: categoria com mesmo nome)
- `INVALID_OPERATION` (409): Operação inválida (ex: deletar categoria com pratos)
- `INTERNAL_ERROR` (500): Erro do servidor

---

## Categorias

### GET /api/categorias

Lista todas as categorias cadastradas.

**Autenticação**: Sim (admin)

**Exemplo**:
```bash
curl -b "sb-auth=<token>" http://localhost:3000/api/categorias
```

**Resposta (200)**:
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Bebidas",
      "created_at": "2026-11-23T10:00:00Z",
      "updated_at": "2026-11-23T10:00:00Z"
    }
  ]
}
```

---

### POST /api/categorias

Cria uma nova categoria.

**Autenticação**: Sim (admin)

**Request**:
```json
{ "name": "Bebidas" }
```

**Exemplo**:
```bash
curl -X POST -b "sb-auth=<token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bebidas"}' \
  http://localhost:3000/api/categorias
```

**Resposta (201)**:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Bebidas",
    "created_at": "2026-11-23T10:00:00Z",
    "updated_at": "2026-11-23T10:00:00Z"
  }
}
```

**Erros**:
- `409` - Categoria com esse nome já existe
- `400` - Nome inválido (vazio, muito longo)

---

### PUT /api/categorias/{id}

Atualiza uma categoria existente.

**Autenticação**: Sim (admin)

**Request**:
```json
{ "name": "Sucos" }
```

**Exemplo**:
```bash
curl -X PUT -b "sb-auth=<token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sucos"}' \
  http://localhost:3000/api/categorias/550e8400-e29b-41d4-a716-446655440000
```

**Resposta (200)**:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Sucos",
    "created_at": "2026-11-23T10:00:00Z",
    "updated_at": "2026-11-23T10:30:00Z"
  }
}
```

---

### DELETE /api/categorias/{id}

Exclui uma categoria (só se não possui pratos vinculados).

**Autenticação**: Sim (admin)

**Exemplo**:
```bash
curl -X DELETE -b "sb-auth=<token>" \
  http://localhost:3000/api/categorias/550e8400-e29b-41d4-a716-446655440000
```

**Resposta (204)**:
(sem corpo)

**Erros**:
- `404` - Categoria não encontrada
- `409` - Categoria possui pratos vinculados

---

## Pratos

### GET /api/pratos

Lista todos os pratos cadastrados.

**Autenticação**: Sim (admin)

**Exemplo**:
```bash
curl -b "sb-auth=<token>" http://localhost:3000/api/pratos
```

**Resposta (200)**:
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Suco de Laranja",
      "description": "Suco fresco preparado na hora",
      "price": 5.50,
      "category_id": "550e8400-e29b-41d4-a716-446655440000",
      "photo_url": "https://...",
      "is_active": true,
      "created_at": "2026-11-23T10:00:00Z",
      "updated_at": "2026-11-23T10:00:00Z"
    }
  ]
}
```

---

### DELETE /api/pratos/{id}

Exclui um prato e sua fotografia (só se não está em nenhum cardápio).

**Autenticação**: Sim (admin)

**Exemplo**:
```bash
curl -X DELETE -b "sb-auth=<token>" \
  http://localhost:3000/api/pratos/550e8400-e29b-41d4-a716-446655440001
```

**Resposta (204)**:
(sem corpo)

**Erros**:
- `404` - Prato não encontrado
- `409` - Prato está vinculado a cardápio(s)

---

## Cardápios

### GET /api/cardapios

Lista todos os cardápios diários (ativos e passados).

**Autenticação**: Sim (admin)

**Exemplo**:
```bash
curl -b "sb-auth=<token>" http://localhost:3000/api/cardapios
```

**Resposta (200)**:
```json
{
  "data": {
    "activeMenus": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "menu_date": "2026-11-23",
        "status": "PUBLICADO",
        "published_at": "2026-11-23T10:00:00Z",
        "items": [
          { "id": "...", "dish_id": "...", "available": true }
        ]
      }
    ],
    "pastMenuCount": 5
  }
}
```

---

### GET /api/cardapios/hoje-resumo

Obtém um resumo do cardápio de hoje e próximos cardápios.

**Autenticação**: Sim (admin)

**Exemplo**:
```bash
curl -b "sb-auth=<token>" http://localhost:3000/api/cardapios/hoje-resumo
```

**Resposta (200)**:
```json
{
  "data": {
    "ownerName": "Maria",
    "today": "2026-11-23",
    "menu": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "menu_date": "2026-11-23",
      "status": "PUBLICADO",
      "item_count": 5
    },
    "upcomingMenus": [...]
  }
}
```

---

### GET /api/cardapios/{id}/disponibilidade

Obtém a disponibilidade dos pratos do cardápio de hoje (só funciona para hoje).

**Autenticação**: Sim (admin)

**Exemplo**:
```bash
curl -b "sb-auth=<token>" \
  http://localhost:3000/api/cardapios/550e8400-e29b-41d4-a716-446655440002/disponibilidade
```

**Resposta (200)**:
```json
{
  "data": {
    "menu": { "id": "...", "menu_date": "2026-11-23", "status": "PUBLICADO" },
    "items": [
      {
        "dish_id": "550e8400-e29b-41d4-a716-446655440001",
        "available": true,
        "name": "Suco de Laranja",
        "category_id": "550e8400-e29b-41d4-a716-446655440000",
        "category_name": "Bebidas"
      }
    ]
  }
}
```

---

### PATCH /api/cardapios/{id}/disponibilidade/items

Atualiza a disponibilidade de um prato no cardápio de hoje.

**Autenticação**: Sim (admin)

**Request**:
```json
{
  "dishId": "550e8400-e29b-41d4-a716-446655440001",
  "available": false
}
```

**Exemplo**:
```bash
curl -X PATCH -b "sb-auth=<token>" \
  -H "Content-Type: application/json" \
  -d '{"dishId":"550e8400-e29b-41d4-a716-446655440001","available":false}' \
  http://localhost:3000/api/cardapios/550e8400-e29b-41d4-a716-446655440002/disponibilidade/items
```

**Resposta (200)**:
```json
{ "data": null }
```

---

## Configurações

### GET /api/configuracoes

Obtém as configurações administrativas (nome da proprietária, WhatsApp, fuso horário, horários de funcionamento).

**Autenticação**: Sim (admin)

**Exemplo**:
```bash
curl -b "sb-auth=<token>" http://localhost:3000/api/configuracoes
```

**Resposta (200)**:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "owner_name": "Maria",
    "whatsapp": "5585987654321",
    "timezone": "America/Fortaleza",
    "business_hours": [
      {
        "day_of_week": "MON",
        "is_open": true,
        "opening_time": "11:00",
        "closing_time": "14:00"
      }
    ]
  }
}
```

---

### PUT /api/configuracoes

Atualiza as configurações administrativas (tudo ou nada - atômico).

**Autenticação**: Sim (admin)

**Request**:
```json
{
  "ownerName": "Maria",
  "whatsapp": "5585987654321",
  "timezone": "America/Fortaleza",
  "businessHours": [
    { "day_of_week": "MON", "is_open": true, "opening_time": "11:00", "closing_time": "14:00" },
    { "day_of_week": "TUE", "is_open": true, "opening_time": "11:00", "closing_time": "14:00" },
    { "day_of_week": "WED", "is_open": false, "opening_time": null, "closing_time": null },
    { "day_of_week": "THU", "is_open": true, "opening_time": "11:00", "closing_time": "14:00" },
    { "day_of_week": "FRI", "is_open": true, "opening_time": "11:00", "closing_time": "14:00" },
    { "day_of_week": "SAT", "is_open": false, "opening_time": null, "closing_time": null },
    { "day_of_week": "SUN", "is_open": false, "opening_time": null, "closing_time": null }
  ]
}
```

**Exemplo**:
```bash
curl -X PUT -b "sb-auth=<token>" \
  -H "Content-Type: application/json" \
  -d '{"ownerName":"Maria",...}' \
  http://localhost:3000/api/configuracoes
```

**Resposta (200)**:
```json
{ "data": null }
```

