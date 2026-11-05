# Visão geral do projeto

**Tipo de sistema**: Aplicação Web responsiva, com prioridade para dispositivos móveis.
**Objetivo**: Administrar o catálogo de pratos, preparar e publicar cardápios diários e facilitar a elaboração e o encaminhamento de pedidos pelo WhatsApp.


## 1. Contextualização

A Sabor de Casa comercializa marmitas por meio de aplicativos de mensagens. Atualmente, o cardápio é divulgado por fotografias de um quadro escrito à mão.

Esse processo apresenta algumas dificuldades:

- Fotografias antigas continuam circulando após alterações de preços.
- Clientes podem solicitar pratos que já não estão disponíveis.
- Os pratos oferecidos variam de um dia para outro.
- A proprietária precisa informar quais pratos serão oferecidos em cada dia de funcionamento.
- Os clientes precisam escrever manualmente os itens e as quantidades desejadas.
- A proprietária precisa atualizar o cardápio e comunicar eventuais indisponibilidades.

Para resolver esses problemas, será desenvolvido um sistema Web que centralize a administração do catálogo e permita preparar o cardápio de cada dia de funcionamento.

Os clientes acessarão um endereço público, consultarão o cardápio do dia, selecionarão pratos e quantidades e gerarão automaticamente uma mensagem com o pedido para encaminhamento pelo WhatsApp.

## 2. Objetivo geral

Desenvolver um sistema Web que permita à proprietária da Sabor de Casa administrar o catálogo de pratos, configurar o funcionamento da marmitaria, preparar e publicar cardápios diários e controlar a disponibilidade dos itens, oferecendo aos clientes uma maneira simples de consultar as opções e encaminhar pedidos pelo WhatsApp.

## 3. Objetivos específicos

1. Organizar os pratos em categorias.
2. Manter um catálogo permanente de pratos.
3. Permitir o cadastro de identificador, nome, descrição, preço e fotografia dos pratos.
4. Permitir a preparação antecipada de cardápios para diferentes datas.
5. Permitir selecionar os pratos que serão oferecidos em cada dia.
6. Permitir publicar o cardápio antes do horário de abertura.
7. Configurar os dias e horários de funcionamento.
8. Permitir atualizar preços no catálogo, refletindo as alterações nos cardápios.
9. Controlar a disponibilidade dos itens de cada cardápio diário.
10. Manter visíveis os itens esgotados, identificando-os como indisponíveis.
11. Informar aos clientes quando o estabelecimento estiver fechado para pedidos.
12. Permitir que os clientes selecionem pratos e quantidades.
13. Gerar automaticamente uma mensagem de texto com os dados do pedido.
14. Abrir o WhatsApp com a mensagem previamente preenchida.
15. Priorizar a usabilidade em dispositivos móveis, tanto na administração quanto na consulta pública.

## 4. Escopo do MVP

O sistema terá três módulos principais:

### 4.1. Administração do catálogo

Responsável por manter o catálogo permanente de pratos e categorias.

Principais funcionalidades:

- Cadastrar categorias.
- Consultar categorias e pratos.
- Cadastrar pratos com identificador, nome, descrição, preço e fotografia.
- Editar dados de categorias e pratos.
- Excluir categorias e pratos.
- Atualizar os preços dos pratos.

### 4.2. Administração do funcionamento e dos cardápios diários

Responsável pela configuração da operação da marmitaria e pela preparação dos cardápios.

Principais funcionalidades:

- Configurar os dias e horários de funcionamento.
- Cadastrar o número de WhatsApp utilizado para os pedidos.
- Preparar cardápios para datas futuras.
- Selecionar os pratos disponíveis em cada data.
- Publicar cardápios antecipadamente.
- Controlar a disponibilidade dos itens de cada cardápio.
- Identificar itens esgotados ou indisponíveis.

### 4.3. Cardápio público e preparação de pedidos

Responsável pela consulta pública das opções disponíveis e pela preparação da mensagem do pedido.

Principais funcionalidades:

- Consultar o cardápio de uma data.
- Visualizar nomes, descrições, preços e fotografias dos pratos.
- Identificar itens disponíveis e indisponíveis.
- Selecionar pratos e quantidades.
- Visualizar o resumo do pedido.
- Consultar o total estimado.
- Gerar a mensagem de pedido.
- Abrir o WhatsApp com a mensagem preenchida.
- Informar quando o estabelecimento estiver fechado para novos pedidos.

## 5. Funcionalidades fora do escopo

O MVP não contemplará:

- Cadastro ou aplicação de descontos promocionais.
- Pagamentos on-line.
- Confirmação automática de pedidos.
- Gerenciamento de entregas.
- Controle quantitativo de estoque.
- Gestão de funcionários.
- Histórico de alterações de preços e disponibilidade.
- Versão específica para impressão.
- Armazenamento de pedidos como pedidos comercialmente confirmados.
- Recebimento automático de mensagens ou confirmação de pedidos pelo WhatsApp.

O sistema preparará a mensagem, mas o envio dependerá da ação do cliente. A aceitação do pedido continuará sendo realizada pela proprietária por meio da conversa no WhatsApp.

## 6. Relação com os demais artefatos

Este documento estabelece a visão geral, os objetivos e os limites funcionais do projeto Sabor de Casa.

Os requisitos funcionais, requisitos não funcionais, regras de negócio, histórias de usuário, critérios de aceitação, modelos UML e casos de teste deverão detalhar aspectos específicos dessa visão, mantendo coerência com o escopo definido para o MVP.

Quando uma decisão posterior modificar os objetivos ou os limites aqui estabelecidos, este documento deverá ser revisado para refletir a decisão aprovada.