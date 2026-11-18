
Página de Visão Geral 

Painel de Destaque:
1. formato da data deveria ser DD/MM/AAAA
2. Quando o cardapio esta em preparação, deveria aparecer o botão de PUBLICAR.
   - Corrigido: cardápios em rascunho exibem a ação Publicar.
3. Quando o cardápio está publicado, deverá aparecer o botão de gerenciar disponibilidade.



Features

1. 
Menu / Sidebar
A sidebar/menu, em resoluções menores, deveria vir retraida e ser acionada por botão (menu hamburguer)

2. Pratos
A funcionalidade EXCLUIR não foi implementada

Bugs
MINOR:

Mensagem das configurações está esquisita: 
[ { "code": "custom", "path": [ "hours", 4, "closingTime" ], "message": "O encerramento deve ser posterior à abertura." } ]
E deveria aparecer abaixo dos campos de formulário que estão errados.
E o campo ser focado, para correção


DE FATO, as mensagens gerais estão sem padrão. Ora é em cima, ora em baixo, ta tudo meio bagunçado.
Mas acho quea gente tem que avançar e depois vê isso

## BUGS CORRIGIDOS — 18/11/2026

- Ao criar ou editar um cardápio, a listagem agora é dinâmica e revalidada pelo layout administrativo.
- Após salvar, a navegação volta à listagem com `push` e `refresh`, evitando dados antigos do cache.
- Corrigido: a visão geral mostra a data no formato DD/MM/AAAA.
- Corrigido: cardápios em preparação mostram Publicar e publicados mostram Gerenciar disponibilidade.
- Implementado: tela rápida de disponibilidade para os pratos do cardápio publicado do dia.
- Corrigido: alterações nos pratos do cardápio revalidam a tela de disponibilidade e remontam os itens atualizados.