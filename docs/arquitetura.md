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
configuração global e horários de funcionamento. Integridade, unicidade e
regras que possam ser expressas pelo banco devem ser garantidas por constraints
e políticas RLS, além da validação da aplicação.

### Storage

As fotografias serão armazenadas em bucket público. O upload será aceito
somente após validação no servidor do conteúdo real do arquivo, formato,
tamanho máximo de 1 MB e dimensões mínimas de 600 x 600 pixels.

### WhatsApp

O sistema não enviará nem persistirá pedidos. Após a revalidação de horário,
disponibilidade e preço vigente, o navegador abrirá um link `wa.me` com uma
mensagem codificada contendo data, itens, quantidades, preços, subtotais e
total estimado.

## Segurança

- Rotas e mutações administrativas exigem sessão autenticada.
- RLS impede escrita por clientes anônimos e usuários não autorizados.
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