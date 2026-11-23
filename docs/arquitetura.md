# Arquitetura da solução

## Objetivo

Registrar as escolhas técnicas do sistema Sabor de Casa e orientar a evolução
do código, do banco e da infraestrutura local.

## Visão geral

O sistema será uma aplicação Web responsiva construída com Next.js e
TypeScript. A área pública será acessível sem autenticação. A área de
administração exigirá autenticação pelo Supabase Auth e autorização no banco.

```text
Cliente Web
    |
    v
Next.js (App Router)
    |-- páginas públicas e administrativas
    |-- componentes e validações compartilhadas
    |-- Server Actions/Route Handlers para mutações e integrações
    |
    +--> Supabase Auth
    +--> Supabase PostgreSQL + RLS
    +--> Supabase Storage (fotografias públicas)
    +--> WhatsApp via link wa.me
```

## Responsabilidades

### Next.js e TypeScript

- Renderizar o cardápio público e a área administrativa.
- Organizar rotas públicas, login e administração.
- Executar leituras e mutações no servidor quando houver credenciais ou
  regras que não podem ficar sob controle do navegador.
- Aplicar validações de entrada antes de acessar o banco ou o Storage.

### Supabase Auth

O MVP terá um usuário administrativo. O usuário será criado no Supabase Auth e
será associado a uma representação de autorização no banco. A autenticação
identifica o usuário; as políticas RLS autorizam as operações.

### PostgreSQL

O banco persistirá categorias, pratos, cardápios diários, itens de cardápio,
configuração global, nome da proprietária e horários de funcionamento. A
configuração global possui uma linha para os dados administrativos e sete
linhas filhas, uma para cada dia da semana. Integridade, unicidade e
regras que possam ser expressas pelo banco devem ser garantidas por constraints
e políticas RLS, além da validação da aplicação.

### Storage

As fotografias serão armazenadas em bucket público. O upload será aceito
somente após validação no servidor do conteúdo real do arquivo, formato,
tamanho máximo de 1 MB e dimensões mínimas de 600 x 600 pixels.

### WhatsApp

O número administrativo aceita somente celular brasileiro com DDD e é
normalizado para o formato internacional sem máscara (`55` + DDD + número).
O sistema não enviará nem persistirá pedidos. Após a revalidação de horário,
disponibilidade e preço vigente, o navegador abrirá um link `wa.me` com uma
mensagem codificada contendo data, itens, quantidades, preços, subtotais e
total estimado.

## Segurança

- Rotas e mutações administrativas exigem sessão autenticada.
- RLS impede escrita por clientes anônimos e usuários não autorizados.
- A autenticação administrativa usa Supabase Auth com e-mail e senha, sessões
  em cookies via `@supabase/ssr` e uma associação explícita em
  `public.admin_profiles`.
- O proxy protege a navegação das rotas finais; `requireAdmin()` valida sessão
  e autorização antes de operações server-side.
- O protótipo em `app/prototipo` permanece separado da aplicação final e não
  participa da autenticação.
- A área pública expõe somente cardápios publicados e os dados necessários à
  consulta.
- A chave privada do Supabase só poderá ser usada no servidor.
- Uploads não serão confiados ao MIME informado pelo navegador.

## Consistência do pedido

O preço é o preço vigente no prato e não é congelado no item diário. Por isso,
o resumo do cliente é apenas uma estimativa. Antes de abrir o WhatsApp, o
servidor deve verificar novamente preço, disponibilidade, funcionamento e
configuração do número de WhatsApp.

Essa verificação não cria reserva: a disponibilidade pode mudar depois que o
link for aberto. Essa limitação é explícita no MVP.

## Estrutura prevista

```text
app/                 rotas, páginas e layouts Next.js
src/components/      componentes de interface
src/components/prototype/ componentes exclusivos do protótipo navegável
src/lib/             clientes, serviços e regras técnicas
src/validations/     esquemas de validação de entrada
src/types/           tipos compartilhados e tipos do banco
supabase/migrations/ esquema, constraints e RLS
supabase/seed.sql    dados iniciais para desenvolvimento
tests/               testes unitários, integração e E2E
```

## Evolução

Múltiplos administradores, arquivamento de pratos, preços congelados por
cardápio, persistência de pedidos e reserva de disponibilidade são extensões
possíveis, mas não devem ser antecipadas no esquema inicial do MVP.
## API HTTP REST (v0.2.0+)

A partir da versão 0.2.0, o sistema expõe uma **API HTTP REST** interna para gerenciamento do catálogo, cardápios e configurações. Os Route Handlers do Next.js (em `app/api/**`) implementam esta interface.

### Padrão

**Autenticação**: Todos os endpoints administrativos exigem autenticação via Supabase Auth (cookie de sessão).

**Resposta de sucesso**:
```json
{ "data": { /* Entidade ou array */ } }
```

**Resposta de erro**:
```json
{ "error": { "code": "ERROR_CODE", "message": "...", "details": {...} } }
```

### Endpoints

#### Categorias (`/api/categorias`)
- `GET` → Listar categorias
- `POST` → Criar categoria
- `PUT /{id}` → Atualizar categoria
- `DELETE /{id}` → Excluir categoria

#### Pratos (`/api/pratos`)
- `GET` → Listar pratos
- `DELETE /{id}` → Excluir prato

#### Cardápios (`/api/cardapios`)
- `GET` → Listar cardápios
- `GET /hoje-resumo` → Resumo de hoje
- `GET /{id}/disponibilidade` → Disponibilidade de hoje
- `PATCH /{id}/disponibilidade/items` → Atualizar disponibilidade de item

#### Configurações (`/api/configuracoes`)
- `GET` → Obter configurações
- `PUT` → Atualizar configurações

**Veja** `docs/api-reference.md` para exemplos completos com curl, Postman, estruturas de request/response.

### Mapeamento de Erros de Domínio

A camada de API mapeia exceções de domínio (definidas em `src/server/services/domain-errors.ts`) para HTTP status:

| Exceção | Status | Código |
|---------|--------|--------|
| `DuplicateResourceError` | 409 | `DUPLICATE_RESOURCE` |
| `InvalidOperationError` | 409 | `INVALID_OPERATION` |
| `ResourceNotFoundError` | 404 | `NOT_FOUND` |
| `ValidationError` | 400 | `VALIDATION_ERROR` |
| `AuthenticationRequiredError` | 401 | `UNAUTHENTICATED` |
| `AdminAuthorizationError` | 403 | `FORBIDDEN` |

Exemplos:
- Tentar criar categoria duplicada → `409 DUPLICATE_RESOURCE`
- Deletar categoria com pratos → `409 INVALID_OPERATION`
- Prato inexistente → `404 NOT_FOUND`
- Sem sessão autenticada → `401 UNAUTHENTICATED`

### Integração na UI

A interface administrativa (Fase 2) consome esta API via fetch wrappers em `src/lib/api-client.ts`, em vez de chamar Server Actions diretamente.

