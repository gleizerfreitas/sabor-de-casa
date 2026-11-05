# Sabor de Casa

Sistema Web para marmitarias.

## Stack planejada

- Next.js com TypeScript para a aplicação Web e os serviços no servidor.
- Tailwind CSS para estilização responsiva.
- Supabase Auth para autenticação administrativa.
- Supabase Storage para fotografias dos pratos.
- Supabase PostgreSQL para persistência dos dados.

O registro da arquitetura e das decisões do MVP está em
[docs/arquitetura.md](docs/arquitetura.md) e [docs/adr](docs/adr/).

## Objetivo

Centralizar os artefatos de engenharia de software e o código-fonte
do projeto Sabor de Casa.

## Estrutura do repositório

- `app/`: rotas, páginas e layouts do Next.js (App Router).
- `src/components/`: componentes reutilizáveis de interface.
- `src/server/`: serviços e regras executados no servidor.
- `src/lib/`: clientes e utilitários técnicos.
- `src/validations/`: esquemas de validação de entrada.
- `src/types/`: tipos compartilhados.
- `supabase/`: migrações, seed e artefatos do banco.
- `docs/`: visão geral do projeto, atores do sistema, modelo conceitual e arquitetura.
- `modelagem/`: diagramas UML e modelos de dados.
- `requisitos/`: histórias de usuário, requisitos funcionais, não funcionais e regras de negócio.
- `testes/`: cenários de aceitação e casos de teste documentados.
- `tests/`: testes automatizados.

## Escopo atual do MVP

O sistema administra categorias, pratos, funcionamento, cardápios diários e
disponibilidade. O cliente consulta o cardápio público, prepara uma seleção e
abre o WhatsApp com uma mensagem preenchida. O pedido não é persistido, não há
reserva de itens e a abertura do WhatsApp não representa confirmação.

Pagamentos, descontos, estoque quantitativo, entregas, confirmação automática,
histórico de alterações e múltiplos administradores permanecem fora do MVP.

## Desenvolvimento local

Instale as dependências e copie `.env.example` para `.env.local`, preenchendo
as credenciais do projeto Supabase:

```bash
npm install
npm run dev
```

Validações disponíveis:

```bash
npm run lint
npm run typecheck
npm test
```

Nenhum segredo deve ser versionado; use `.env.local` apenas na máquina de
desenvolvimento.

## Gestão de configuração

As alterações nos artefatos do projeto serão versionadas com Git.

A branch principal será `main`. Após a publicação no GitHub,
as alterações deverão seguir o processo de revisão e aprovação
definido para o projeto.
