# Atores do sistema

## 1. Objetivo

Este documento identifica os atores que interagem com o sistema Web Sabor de Casa, descreve seus objetivos e estabelece as permissões previstas para cada um no escopo do MVP.

Serão considerados apenas dois atores: **Proprietária** e **Cliente**.

## 2. Atores

| Ator | Descrição | Objetivos |
|---|---|---|
| Proprietária | Responsável pela administração da Sabor de Casa. | Gerenciar o catálogo, configurar o funcionamento, preparar os cardápios e atualizar a disponibilidade. |
| Cliente | Pessoa interessada em adquirir os produtos. | Consultar o cardápio, selecionar pratos e quantidades e encaminhar um pedido pelo WhatsApp. |

## 3. Permissões da proprietária

A proprietária poderá:

- Autenticar-se na área administrativa.
- Cadastrar e administrar categorias.
- Cadastrar e administrar pratos.
- Configurar os dias e horários de funcionamento.
- Cadastrar e alterar o número de WhatsApp comercial.
- Preparar cardápios para diferentes datas.
- Publicar cardápios antes do horário de abertura.
- Alterar cardápios publicados.
- Atualizar a disponibilidade dos itens.
- Consultar os cardápios preparados e publicados.

## 4. Permissões do cliente

O cliente poderá:

- Acessar o cardápio por um endereço público.
- Consultar os pratos organizados por categoria.
- Visualizar fotografias, descrições e preços.
- Identificar itens disponíveis e indisponíveis.
- Selecionar pratos e informar quantidades.
- Alterar quantidades ou remover itens.
- Consultar o resumo e o total estimado.
- Gerar uma mensagem de pedido.
- Abrir o WhatsApp com a mensagem previamente preenchida.

O cliente não precisará criar uma conta nem se autenticar.

## 5. Limites de interação

A interação dos atores com o sistema respeitará os seguintes limites:

- **Proprietária:** o acesso às funcionalidades administrativas dependerá de autenticação e autorização.
- **Cliente:** o acesso ao cardápio público e às funcionalidades de preparação da mensagem de pedido não exigirá autenticação.
- **Encaminhamento do pedido:** o sistema preparará a mensagem e abrirá o WhatsApp com o conteúdo preenchido. O envio dependerá da ação do cliente.
- **Aceitação do pedido:** continuará sendo realizada pela proprietária por meio da conversa no WhatsApp. O sistema não registrará a mensagem gerada como um pedido comercialmente confirmado.
