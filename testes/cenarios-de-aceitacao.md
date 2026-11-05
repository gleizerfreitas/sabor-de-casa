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

## Rastreabilidade

Os cenários validam fluxos integrados e complementam as histórias de usuário e regras de negócio relacionadas.

| Cenário | Histórias de usuário relacionadas | Regras de negócio relacionadas |
|---|---|---|
| CT01 — Preparação antecipada do cardápio | HU12 — Criar cardápio do dia | RN-09, RN-31 |
| CT02 — Publicação antecipada | HU13 — Publicar cardápio do dia; HU11 — Consultar situação de funcionamento | RN-07, RN-25 |
| CT03 — Categoria sem itens no dia | HU01 — Cadastrar categoria; HU18 — Visualizar cardápio do dia | RN-07, RN-16 |
| CT04 — Atualização do preço | HU07 — Editar prato | RN-17, RN-18 |
| CT05 — Prato esgotado após a seleção | HU15 — Marcar item do dia como indisponível; HU19 — Consultar disponibilidade de um item; HU22 — Revisar pedido antes do encaminhamento | RN-11, RN-14, RN-15 |
| CT06 — Encerramento do atendimento | HU11 — Consultar situação de funcionamento; HU24 — Encaminhar pedido pelo WhatsApp | RN-23, RN-26 |
| CT07 — Geração da mensagem | HU23 — Gerar mensagem de pedido | RN-28 |
| CT08 — Alteração de quantidade | HU21 — Selecionar pratos e quantidades; HU22 — Revisar pedido antes do encaminhamento; HU23 — Gerar mensagem de pedido | RN-28 |
| CT09 — Encaminhamento pelo WhatsApp | HU24 — Encaminhar pedido pelo WhatsApp | RN-27, RN-29 |
