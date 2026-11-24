# Práticas de Código Limpo - Evidências no Repositório

Este documento apresenta links para trechos do código que evidenciam a aplicação de quatro práticas fundamentais de desenvolvimento de software:

---

## 1. Nomes Significativos

### 1.1 Tipos Bem Nomeados
**Link:** `src/types/menu.ts` (linhas 1-18)

**Explicação:** O arquivo utiliza nomes descritivos e autoexplicativos como `MenuStatus`, `DailyMenu` e `DailyMenuListing`. Cada tipo comunica claramente sua responsabilidade através de nomenclatura em inglês padrão e sem abreviações confusas, facilitando a compreensão do código sem necessidade de comentários adicionais.

### 1.2 Variáveis com Nomes Claros
**Link:** `src/types/catalog.ts`

**Explicação:** Define tipos como `Category`, `Dish` e campos como `is_active`, `photo_url`, `category_id` que deixam explícito o propósito de cada propriedade. O uso de nomenclatura snake_case para colunas de banco de dados é consistente e facilita a manutenção.

### 1.3 Funções com Nomes Verbos
**Link:** `app/api/middleware/auth.ts` (linha 5)

**Explicação:** A função `requireApiAdmin()` começa com um verbo claro (`require`) que deixa evidente que ela irá validar/exigir autenticação. Este padrão facilita a leitura do código: `await requireApiAdmin()` é autoexplicativo.

### 1.4 Classes de Erro Especializadas
**Link:** `src/server/services/domain-errors.ts` (linhas 1-12)

**Explicação:** Em vez de usar genéricos "Error", o código define classes especializadas: `ResourceNotFoundError`, `DuplicateResourceError`, `InvalidOperationError`. Os nomes indicam exatamente qual tipo de problema ocorreu, eliminando ambiguidade e facilitando tratamento de erros específicos.

---

## 2. Funções Curtas com Responsabilidade Única

### 2.1 Função de Validação de Autenticação
**Link:** `app/api/middleware/auth.ts` (linhas 5-14)

**Explicação:** A função `requireApiAdmin()` tem apenas 10 linhas e uma responsabilidade única: verificar se o usuário é um administrador autenticado. Não trata erros de banco de dados, não busca dados adicionais, apenas valida a autorização conforme seu nome promete.

### 2.2 Funções Utilitárias de Resposta
**Link:** `app/api/utils/response-builder.ts` (linhas 1-8)

**Explicação:** Duas funções muito simples (`jsonResponse` e `successResponse`) cada uma com uma única razão para mudar. `jsonResponse()` cria respostas JSON genéricas, `successResponse()` padroniza o formato de sucesso. Reutilizáveis e testáveis individualmente.

### 2.3 Função de Remoção de Foto
**Link:** `src/server/services/catalog-service.ts` (linhas 5-10)

**Explicação:** A função `removeUploadedPhoto()` tem 6 linhas e faz exatamente o que promete: remover uma foto do storage. Não valida, não busca dados, apenas deleta. Essa responsabilidade única a torna fácil de testar e reutilizar.

### 2.4 Função de Verificação de Autenticação
**Link:** `src/server/auth/require-admin.ts` (linhas 8-26)

**Explicação:** Função com 19 linhas que tem uma única responsabilidade clara: verificar se o usuário autenticado tem perfil de administrador. Não cria usuários, não modifica dados, apenas valida e retorna o usuário e perfil.

### 2.5 Função de Mapeamento de Erros
**Link:** `app/api/errors/api-error.ts` (linhas 23-98)

**Explicação:** A função `mapErrorToApiResponse()` tem uma responsabilidade bem definida: converter qualquer tipo de erro em uma resposta HTTP padronizada. Embora tenha mais linhas, cada branch (`if`) mapeia um tipo de erro específico para uma resposta específica, sem lógica adicional.

### 2.6 Listar Catálogo
**Link:** `src/server/services/catalog-service.ts` (linhas 12-20)

**Explicação:** A função `listCatalog()` tem 9 linhas com responsabilidade única: buscar categorias e pratos do banco de dados. Não filtra, não transforma dados, apenas retorna o que foi solicitado.

---

## 3. Separação em Camadas

A arquitetura segue o padrão de camadas separadas por diretório:

### 3.1 Camada de API (Roteamento)
**Link:** `app/api/pratos/route.ts`

**Explicação:** Esta camada (`app/api/`) contém apenas endpoints HTTP (GET, POST, PUT, DELETE). Os handlers recebem requests, delegam a trabalho pesado para services, e retornam respostas HTTP. Exemplo: `GET /api/pratos` chama `listCatalog()` e retorna a resposta via `successResponse()`.

### 3.2 Camada de Middleware
**Link:** `app/api/middleware/auth.ts`

**Explicação:** Middleware separado em seu próprio diretório/módulo. Esta camada intercepta requests antes de chegar aos handlers principais para validar autenticação. Reutilizado em múltiplos endpoints: `await requireApiAdmin()` aparece em vários routes.

### 3.3 Camada de Negócio (Services)
**Link:** `src/server/services/catalog-service.ts`

**Explicação:** A camada de serviço implementa a lógica de negócio (criar, atualizar, deletar pratos/categorias). Não conhece HTTP, não conhece detalhes de autenticação. Apenas trabalha com dados de domínio e regras de negócio.

### 3.4 Camada de Dados (Types & Validations)
**Link:** `src/types/catalog.ts` e `src/validations/catalog.ts`

**Explicação:** Tipos TypeScript definem a estrutura de dados (`Category`, `Dish`), enquanto schemas Zod definem validações. Esta separação permite reutilizar validações em múltiplos pontos (API, frontend, etc.).

### 3.5 Camada de Autenticação
**Link:** `src/server/auth/require-admin.ts`

**Explicação:** Lógica de autenticação isolada em seu próprio módulo. Pode ser testada independentemente e reutilizada em qualquer camada que precise verificar permissões.

### 3.6 Camada de Tratamento de Erros
**Link:** `app/api/errors/api-error.ts`

**Explicação:** Mapeamento centralizado de erros de domínio para respostas HTTP. Cada camada lança seus próprios erros especializados, e esta camada traduz para HTTP status codes e formatos padronizados.

**Fluxo de Dados:**
```
Request HTTP → Middleware (Auth) → API Handler → Service → Domain Errors → Error Handler → Response HTTP
```

---

## 4. Ausência de Código Duplicado (DRY - Don't Repeat Yourself)

### 4.1 Classe Base para Erros de Domínio
**Link:** `src/server/services/domain-errors.ts` (linhas 1-12)

**Explicação:** Em vez de repetir lógica de classe Error múltiplas vezes, existe uma classe base `DomainError` que implementa a inicialização comum. As classes filhas (`ResourceNotFoundError`, `DuplicateResourceError`, etc.) herdam comportamento sem duplicação. Este padrão permite que novos tipos de erro sejam criados sem repetir código.

### 4.2 Schemas Validação Reutilizáveis
**Link:** `src/validations/catalog.ts` (linhas 1-23)

**Explicação:** O schema `postgresUuid` é definido uma vez (linhas 7-12) e reutilizado em múltiplos schemas. O `dishSchema` reutiliza este UUID válido. Sem DRY, teríamos a regex duplicada em vários places. Assim, mudanças na validação de UUID são feitas em um único lugar.

### 4.3 Funções Utilitárias Reutilizadas
**Link:** `app/api/utils/response-builder.ts` (linhas 1-8)

**Explicação:** Em vez de cada endpoint retornar `Response.json({ data }, { status: 200 })`, existe a função `successResponse()` reutilizável. Sem ela, veríamos o mesmo padrão repetido em dúzias de endpoints. Isto facilita manutenção: se o formato mudar, muda-se um lugar.

### 4.4 Funções de Manipulação de Storage
**Link:** `src/server/services/catalog-service.ts` (linhas 5-10 e 70)

**Explicação:** A função `removeUploadedPhoto()` é definida uma vez e reutilizada. No `deleteDish()` (linha 70), ao invés de repetir a lógica de remoção do storage, chama-se a função existente. Sem DRY, haveria duplicação de lógica de tratamento de errors do storage.

### 4.5 Reutilização de Função de Mapeamento de Erros
**Link:** `app/api/pratos/route.ts` (linhas 21 e 103)

**Explicação:** Em ambos os handlers (GET e POST), usa-se a mesma função `mapErrorToApiResponse()` para converter erros em respostas HTTP. Sem DRY, teríamos 50+ linhas de lógica de tratamento de erro duplicadas em cada endpoint.

### 4.6 Reutilização de Schemas de Validação em POST
**Link:** `app/api/pratos/route.ts` (linha 32) e validação em `src/validations/catalog.ts`

**Explicação:** Embora este endpoint não use explicitamente o schema Zod, o objeto esperado (name, description, price, categoryId, isActive) é validado seguindo a mesma estrutura do `dishSchema`. Assim, frontend e backend compartilham as mesmas regras de validação, eliminando duplicação de lógica de negócio.

---

## Conclusão

Este repositório evidencia o compromisso com qualidade de código através de:

- ✅ **Nomes Significativos**: Tipos, variáveis e funções comunicam propósito sem ambiguidade
- ✅ **Responsabilidade Única**: Cada função e classe tem uma única razão para mudar
- ✅ **Separação em Camadas**: Código organizado em middleware, services, types, auth, etc.
- ✅ **DRY**: Lógica reutilizável centralizada, evitando duplicação

Estas práticas facilitam manutenção, testes, compreensão do código e reduzem bugs associados a inconsistências.
