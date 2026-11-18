Bugs do Cardápio Público

1. Problemas de cache entre a página principal e o pedido. 

Passos: 
- usuario seleciona uma quantidade de um prato especifico
- usuario segue para o pedido e a quantidade esta correta, conforme selecao anterior.
- Usario volta a pagina do cardapio e altera a quantidade
- Usario sehue para o pedido, e a quantidade não foi alterada.

Isso acontece, tambem, ao selecionar quantidades de outros pratos.


2. Erro ao clicar no Botão de WhatsApp.

Aparece um erro na propria tela do pedido: "Invalid UUID"

Correções aplicadas:
- A seleção agora é restaurada a partir da própria query da navegação ao retornar ao cardápio.
- A revisão é remontada quando os itens da seleção mudam.
- A validação do WhatsApp aceita os UUIDs persistidos pelo PostgreSQL, incluindo os identificadores usados nas sementes locais.






Features

1. Menu / Sidebar
A sidebar/menu, em resoluções menores, deveria vir retraida e ser acionada por botão (menu hamburguer)

2. Pratos
A funcionalidade EXCLUIR não foi implementada
