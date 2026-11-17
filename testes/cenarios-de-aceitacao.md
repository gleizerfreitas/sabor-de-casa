# Cenários de aceitação

Estes cenários complementam os critérios individuais das histórias de usuário e ajudam a validar os principais fluxos do sistema.

## CT01 — Preparação antecipada do cardápio

**Dado que** a proprietária possui pratos cadastrados  
**Quando** ela criar um cardápio para uma data futura, selecionar os pratos e salvar  
**Então** o sistema deverá permitir manter esse cardápio preparado sem publicá-lo imediatamente.

## CT02 — Publicação antecipada

**Dado que** existe um cardápio preparado para o dia seguinte  
**Quando** a proprietária publicá-lo antes do horário de abertura  
**Então** os clientes deverão conseguir consultar o cardápio, mas não poderão encaminhar pedidos antes do início do horário de atendimento.

## CT03 — Categoria sem itens no dia

**Dado que** uma categoria possui pratos cadastrados, mas nenhum desses pratos foi incluído no cardápio da data  
**Quando** o cliente acessar o cardápio público  
**Então** a categoria não deverá ser exibida.

## CT04 — Atualização do preço

**Dado que** um prato está associado a vários cardápios  
**Quando** a proprietária alterar seu preço  
**Então** todos os cardápios que utilizam esse prato deverão apresentar o novo preço.

## CT04A — Inclusão somente de pratos ativos

**Dado que** existem pratos ativos e inativos no catálogo
**Quando** a proprietária preparar um novo cardápio
**Então** somente os pratos ativos deverão ser apresentados para seleção.

## CT04B — Desativação de prato já associado

**Dado que** um prato está associado a um cardápio existente
**Quando** a proprietária desativá-lo no catálogo
**Então** o prato não deverá ser oferecido em novos cardápios, mas deverá permanecer no cardápio existente, respeitando sua disponibilidade para a data.

## CT10 — Busca por nome

**Dado que** existem vários pratos cadastrados
**Quando** a proprietária informar parte do nome de um prato no campo de busca
**Então** o catálogo deverá exibir somente os pratos correspondentes.

## CT11 — Busca sem distinção de maiúsculas

**Dado que** existe um prato chamado “Feijoada da Casa”
**Quando** a proprietária buscar por “feijoada”
**Então** o prato deverá ser encontrado.

## CT12 — Nenhum resultado na busca

**Dado que** nenhum prato corresponde ao texto informado
**Quando** a proprietária realizar a busca
**Então** o sistema deverá informar claramente que nenhum prato foi encontrado.

## CT05 — Prato esgotado após a seleção

**Dado que** o cliente selecionou um prato disponível e a proprietária o marcou como indisponível  
**Quando** o cliente tentar revisar ou encaminhar o pedido  
**Então** o sistema deverá detectar a indisponibilidade, identificar o prato e impedir o encaminhamento até que a seleção seja corrigida.

## CT06 — Encerramento do atendimento

**Dado que** o horário de encerramento foi atingido  
**Quando** o cliente acessar o cardápio  
**Então** o cardápio deverá continuar consultável, mas o sistema deverá bloquear o encaminhamento de novos pedidos.

## CT07 — Geração da mensagem

**Dado que** o cliente selecionou dois pratos disponíveis, com suas respectivas quantidades  
**Quando** solicitar a geração do pedido  
**Então** o sistema deverá produzir uma mensagem com os itens, as quantidades, os preços unitários, os subtotais e o total estimado.

## CT08 — Alteração de quantidade

**Dado que** o cliente já gerou uma mensagem para o pedido  
**Quando** retornar ao resumo e alterar a quantidade de um item  
**Então** o sistema deverá recalcular os valores e gerar uma nova mensagem com os dados atualizados.

## CT09 — Encaminhamento pelo WhatsApp

**Dado que** o pedido foi revisado e validado  
**Quando** o cliente acionar o botão de encaminhamento  
**Então** o WhatsApp deverá abrir com o destinatário configurado e a mensagem preenchida, sem que o sistema considere o pedido enviado ou confirmado.

## CT14 — Disponibilidade somente para o cardápio do dia

**Dado que** existem cardápios para hoje, amanhã e uma data passada
**Quando** a proprietária consultar a lista de cardápios
**Então** somente o cardápio de hoje deverá exibir a ação “Gerenciar disponibilidade”.

## CT15 — Bloqueio de acesso direto à disponibilidade

**Dado que** a proprietária possui um cardápio futuro ou passado
**Quando** acessar diretamente a tela de disponibilidade desse cardápio
**Então** o sistema deverá bloquear o acesso e informar que a disponibilidade só pode ser gerenciada para o cardápio do dia.

## CT16 — Entrada na visão geral administrativa

**Dado que** a proprietária está autenticada
**Quando** acessar a rota principal da administração
**Então** o sistema deverá apresentar a visão geral, sem os resumos de quantidade de pratos ativos, itens disponíveis hoje e próximo cardápio.

## CT17 — Acesso ao catálogo pela navegação

**Dado que** a proprietária está na visão geral
**Quando** selecionar o catálogo no sidebar ou no atalho da visão geral
**Então** o sistema deverá abrir a tela de catálogo.

## CT18 — Resumo de cardápios futuros

**Dado que** existem cardápios preparados para datas futuras
**Quando** a proprietária acessar a visão geral
**Então** o sistema deverá visualizar uma seção com as datas, situações e quantidades de itens desses cardápios.

## CT13 — Configuração administrativa

**Dado que** a proprietária está autenticada
**Quando** informar nome, celular brasileiro, dias abertos e horários válidos
**Então** o sistema deverá salvar a configuração e informar sucesso.

**Dado que** um dia está aberto
**Quando** o horário de encerramento não for posterior ao horário de abertura
**Então** o sistema deverá rejeitar o salvamento e informar o erro.

**Dado que** o número informado não é um celular brasileiro válido com DDD
**Quando** a proprietária salvar a configuração
**Então** o sistema deverá rejeitar o salvamento sem alterar os valores anteriores.

**Dado que** a configuração foi salva com máscara
**Quando** o sistema gerar o encaminhamento
**Então** deverá utilizar o número normalizado no formato `https://wa.me/55...`.

## Rastreabilidade

Os cenários validam fluxos integrados e complementam as histórias de usuário e regras de negócio relacionadas.

| Cenário | Histórias de usuário relacionadas | Regras de negócio relacionadas |
|---|---|---|
| CT01 — Preparação antecipada do cardápio | HU12 — Criar cardápio do dia | RN-09, RN-31 |
| CT02 — Publicação antecipada | HU13 — Publicar cardápio do dia; HU11 — Consultar situação de funcionamento | RN-07, RN-25 |
| CT03 — Categoria sem itens no dia | HU01 — Cadastrar categoria; HU18 — Visualizar cardápio do dia | RN-07, RN-16 |
| CT04 — Atualização do preço | HU07 — Editar prato | RN-17, RN-18 |
| CT04A — Inclusão somente de pratos ativos | HU07 — Editar prato; HU12 — Criar cardápio do dia | RN-38, RN-41 |
| CT04B — Desativação de prato já associado | HU07 — Editar prato; HU14 — Alterar cardápio publicado | RN-39, RN-40 |
| CT10 — Busca por nome | HU06 — Consultar catálogo de pratos | RNF-24 |
| CT11 — Busca sem distinção de maiúsculas | HU06 — Consultar catálogo de pratos | RNF-24 |
| CT12 — Nenhum resultado na busca | HU06 — Consultar catálogo de pratos | RNF-06, RNF-24 |
| CT05 — Prato esgotado após a seleção | HU15 — Marcar item do dia como indisponível; HU19 — Consultar disponibilidade de um item; HU22 — Revisar pedido antes do encaminhamento | RN-11, RN-14, RN-15 |
| CT06 — Encerramento do atendimento | HU11 — Consultar situação de funcionamento; HU24 — Encaminhar pedido pelo WhatsApp | RN-23, RN-26 |
| CT07 — Geração da mensagem | HU23 — Gerar mensagem de pedido | RN-28 |
| CT08 — Alteração de quantidade | HU21 — Selecionar pratos e quantidades; HU22 — Revisar pedido antes do encaminhamento; HU23 — Gerar mensagem de pedido | RN-28 |
| CT09 — Encaminhamento pelo WhatsApp | HU24 — Encaminhar pedido pelo WhatsApp | RN-27, RN-29 |
| CT14 — Disponibilidade somente para o cardápio do dia | HU15 — Marcar item do dia como indisponível; HU16 — Reativar item do dia | RN-42 |
| CT15 — Bloqueio de acesso direto à disponibilidade | HU15 — Marcar item do dia como indisponível | RN-42, RNF-11 |
| CT16 — Entrada na visão geral administrativa | HU28 — Consultar visão geral administrativa | RN-43, RNF-25 |
| CT17 — Acesso ao catálogo pela navegação | HU28 — Consultar visão geral administrativa; HU06 — Consultar catálogo de pratos | RN-43, RNF-25 |
| CT18 — Resumo de cardápios futuros | HU28 — Consultar visão geral administrativa | RN-09, RN-43 |
