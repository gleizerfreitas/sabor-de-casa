# ADR 0002: Autenticação administrativa com Supabase Auth

## Status

Aceita

## Contexto

O protótipo navegável do projeto valida fluxos de interface com persistência
local. A aplicação final precisa de autenticação administrativa, sessões
persistidas por cookies e autorização aplicada no servidor e no banco, sem
acoplar o protótipo a essa infraestrutura.

## Decisão

O sistema utilizará o Supabase Auth com e-mail e senha para autenticar uma
única conta administrativa. A integração com o Next.js usará `@supabase/ssr`
e cookies compartilhados entre navegador e servidor.

As rotas finais ficarão separadas de `app/prototipo`. O proxy do Next.js fará
uma verificação otimista da sessão para proteger a navegação, enquanto
`requireAdmin()` fará a verificação server-side da sessão e da associação do
usuário à tabela `public.admin_profiles`.

O PostgreSQL aplicará RLS para impedir operações administrativas por usuários
anônimos ou autenticados sem autorização. Nenhuma chave privilegiada será
exposta ao navegador.

## Restrições do MVP

- Uma única conta administrativa.
- Cadastro público desabilitado.
- Provisionamento inicial controlado, fora da interface pública.
- Sem recuperação de conta.
- Sem múltiplos perfis ou permissões configuráveis.
- Clientes acessam a área pública sem autenticação.
- O protótipo em `app/prototipo` permanece independente e usa persistência local.

## Segurança e autorização

- Autenticação identifica a sessão; autorização identifica o administrador.
- O proxy protege as rotas finais administrativas contra sessões ausentes.
- Cada operação server-side sensível deve chamar `requireAdmin()`.
- `admin_profiles.id` referencia `auth.users.id`.
- As políticas RLS aplicam a autorização também quando o Supabase é acessado
  diretamente.
- Credenciais não são armazenadas pela aplicação.
- Segredos e chaves privilegiadas não entram no Git nem no navegador.

## Ambientes

O ambiente local e o ambiente hospedado usam instâncias independentes do
Supabase, com contas administrativas e dados separados. A conta inicial é
criada por procedimento controlado e depois associada a `admin_profiles`.

## Consequências

A aplicação depende do Supabase Auth e da configuração correta de cookies,
redirects e políticas RLS em cada ambiente. As próximas features deverão
implementar serviços server-side para catálogo, cardápios e configurações,
sempre depois de validar a autorização.
