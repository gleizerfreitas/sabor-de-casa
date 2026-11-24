# Fase 2: Migração da UI para API REST - Resumo

**Data**: 2026-11-23  
**Status**: ✅ CONCLUÍDO  
**Estratégia**: Big Bang (tudo de uma vez, 1 commit)

---

## ✅ Executado

### 1. API Client Layer (`src/lib/api-client.ts`)
- ✅ Classe `ApiError` com `statusCode` e `code`
- ✅ Função `handleApiResponse()` que:
  - Desembrulha `{ data: ... }` automaticamente
  - Lança `ApiError` com status/code/message
- ✅ Funções wrapper para todos endpoints:
  - Categorias: `apiGetCategories`, `apiCreateCategory`, `apiUpdateCategory`, `apiDeleteCategory`
  - Pratos: `apiGetDishes`, `apiDeleteDish`
  - Cardápios: `apiGetDailyMenus`, `apiGetTodayMenuSummary`, `apiGetTodayMenuAvailability`, `apiSetMenuItemAvailability`
  - Configurações: `apiGetSettings`, `apiUpdateSettings`

### 2. Componentes Atualizados
- ✅ **admin-catalog.tsx**
  - Trocar `saveCategory` → `apiCreateCategory` / `apiUpdateCategory`
  - Trocar `removeCategory` → `apiDeleteCategory`
  - Trocar `removeDish` → `apiDeleteDish`
  - Usar `try/catch` em vez de checar `result.ok`

- ✅ **admin-menu-availability.tsx**
  - Trocar `setMenuAvailability` → `apiSetMenuItemAvailability`
  - Mesmo comportamento visual (toggle rápido + revert on error)

- ✅ **admin-settings-form.tsx**
  - Trocar `saveAdminSettings` → `apiUpdateSettings`
  - Mantém estado local e feedback ao usuário

### 3. Correções de Tipagem (Next.js 16)
- ✅ Atualizar params em Route Handlers para `Promise<{ id: string }>`
- ✅ Usar `await params` antes de acessar
- ✅ Ajustar todos 7 Route Handlers com parâmetros dinâmicos:
  - `app/api/categorias/[id]/route.ts`
  - `app/api/pratos/[id]/route.ts`
  - `app/api/cardapios/[id]/disponibilidade/route.ts`
  - `app/api/cardapios/[id]/disponibilidade/items/route.ts`

### 4. Tratamento de Erro Consistente
- ✅ `ApiError` capturado em cada componente
- ✅ Mensagens amigáveis do servidor (`error.message`)
- ✅ Fallback para "Não foi possível..." se error não for ApiError
- ✅ Estado visual de feedback (success/error) em todos componentes

### 5. Validação
- ✅ TypeScript: 0 erros
- ✅ Testes: 31 passando (0 falhas)
- ✅ Sem regressões visuais

---

## 🎯 Resultado

A **UI administrativa agora consome a API REST**:

| Componente | Antes | Depois | Status |
|-----------|-------|--------|--------|
| admin-catalog.tsx | Server Actions | REST API (/api/categorias, /api/pratos) | ✅ |
| admin-menu-availability.tsx | Server Actions | REST API (/api/cardapios/{id}/disponibilidade/items) | ✅ |
| admin-settings-form.tsx | Server Actions | REST API (/api/configuracoes) | ✅ |

**Fluxo de dados**:
```
User Input (form/button)
    ↓
React Component (try/catch)
    ↓
fetch wrapper (src/lib/api-client.ts)
    ↓
HTTP Request (POST/PUT/DELETE /api/**)
    ↓
Route Handler (app/api/**/route.ts)
    ↓
Domain Service (src/server/services/**)
    ↓
Database (Supabase)
    ↓
(Response: { data: ... } or { error: ... })
    ↓
React Component (setState + feedback)
```

---

## 📊 Cobertura

### Endpoints Consumindo API:
✅ POST /api/categorias (criar)
✅ PUT /api/categorias/{id} (atualizar)
✅ DELETE /api/categorias/{id} (excluir)
✅ DELETE /api/pratos/{id} (excluir)
✅ PATCH /api/cardapios/{id}/disponibilidade/items (atualizar disponibilidade)
✅ PUT /api/configuracoes (atualizar configurações)

### Endpoints Não Consumindo Ainda (Fase 3):
⏭️ POST /api/pratos (criar prato - requer upload)
⏭️ PUT /api/pratos/{id} (editar prato - requer upload)
⏭️ POST /api/cardapios (criar cardápio)
⏭️ PUT /api/cardapios/{id} (editar cardápio)
⏭️ DELETE /api/cardapios/{id} (deletar cardápio)

---

## 🧪 Testes

```
Test Files  12 passed (12)
Tests  31 passed (31)
Duration  4.98s
```

Nenhuma regressão. Componentes ainda funcionam como antes, mas agora via API.

---

## 🚀 Próximos Passos (Opcional - Fase 3)

Se quiser completar a migração de 100%:

1. Refatorar upload de foto nos endpoints `/api/pratos`
2. Criar endpoints completos para cardápios (POST, PUT, DELETE)
3. Atualizar `dish-form.tsx`, `admin-menu-form.tsx`, `admin-menu-actions.tsx`
4. Remover Server Actions antigas completamente
5. Testes E2E completos

---

## 💡 Decisões Arquiteturais

### Por que "Big Bang"?
- ✅ Menor complexidade cognitiva (sem State Action + API simultaneamente)
- ✅ Um commit, uma reversão se precisar
- ✅ Reduz duplicação de lógica
- ✅ Mais fácil testar (uma "fonte da verdade")

### Por que reutilizar serviços existentes?
- ✅ Sem duplicação de lógica de negócio
- ✅ Mesmo RLS (Supabase defende as duas camadas)
- ✅ Mesmo tratamento de erro
- ✅ Versioning: se mudar serviço, Server Actions e API mudam juntos

### Por que `try/catch` nos componentes?
- ✅ Padrão moderno em React (melhor que callbacks)
- ✅ Permite cleanup com `finally`
- ✅ Código mais legível

---

## 📝 Lições

1. **Params em Next.js 16**: Precisam ser awaited antes de usar
2. **Desembrulho automático**: ApiError sabe desembrulhar `{ data }` para o chamador
3. **Feedback imediato**: Componentes mostram erro/sucesso para o usuário
4. **Type-safe**: ApiError tem propriedades conhecidas, não `any`

