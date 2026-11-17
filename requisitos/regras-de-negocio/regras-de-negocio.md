# Regras de Negócio

## RN-01
**Descrição:**
Uma categoria pode possuir zero ou muitos pratos cadastrados.

## RN-02
**Descrição:**
Cada prato deve pertencer a exatamente uma categoria cadastrada.

## RN-03
**Descrição:**
Um prato não pode pertencer simultaneamente a mais de uma categoria.

## RN-04
**Descrição:**
Cada prato deve possuir um identificador único.

## RN-05
**Descrição:**
O preço-base do prato deve ser maior que zero.

## RN-06
**Descrição:**
A fotografia do prato é obrigatória.

## RN-07
**Descrição:**
Somente os pratos selecionados para um cardápio diário podem aparecer no cardápio público daquela data.

## RN-08
**Descrição:** 
Deve existir, no máximo, um cardápio por dia.

## RN-09
**Descrição:** 
A proprietária poderá preparar cardápios para várias datas futuras.

## RN-10
**Descrição:** 
Um mesmo prato não pode ser incluído mais de uma vez no mesmo cardápio diário.

## RN-11
**Descrição:** 
A disponibilidade deve ser controlada por item do cardápio diário.

## RN-12
**Descrição:** 
A indisponibilidade de um item em uma data não deve desativar o prato no catálogo permanente.

## RN-13
**Descrição:** 
Os itens indisponíveis devem permanecer visíveis no cardápio público, identificados como esgotados ou indisponíveis.

## RN-14
**Descrição:** 
Um item indisponível não pode ser adicionado a uma nova seleção de pedido.

## RN-15
**Descrição:** 
A disponibilidade deve ser verificada durante a preparação e novamente antes do encaminhamento da mensagem.

## RN-16
**Descrição:** 
Categorias sem itens no cardápio do dia não devem ser exibidas no cardápio público.

## RN-17
**Descrição:** 
O preço vigente de um prato é o preço-base cadastrado.

## RN-18
**Descrição:** 
A alteração do preço-base deve refletir-se em todos os cardápios que utilizam o prato.

## RN-19
**Descrição:** 
O MVP não oferecerá funcionalidades de desconto ou promoção.

## RN-20
**Descrição:** 
Somente a proprietária poderá realizar operações administrativas.

## RN-21
**Descrição:** 
A área administrativa deve exigir autenticação.

## RN-22
**Descrição:** 
O cardápio público deve ser acessível sem autenticação.

## RN-23
**Descrição:** 
O funcionamento deve ser determinado pelos dias e horários configurados.

## RN-24
**Descrição:** 
Haverá apenas um intervalo de funcionamento por dia.

## RN-25
**Descrição:** 
A publicação antecipada do cardápio não autoriza o encaminhamento de pedidos antes do horário de abertura.

## RN-26
**Descrição:** 
Após o encerramento do horário, o cardápio permanece consultável, mas o encaminhamento de novos pedidos é bloqueado.

## RN-27
**Descrição:** 
O número de WhatsApp utilizado para os pedidos deve ser o número cadastrado nas configurações administrativas.

## RN-28
**Descrição:** 
A mensagem deve apresentar os itens, quantidades, preços unitários, subtotais e total estimado.

## RN-29
**Descrição:** 
A abertura do WhatsApp não significa que a mensagem foi enviada ou que o pedido foi aceito.

## RN-30
**Descrição:** 
O sistema não manterá histórico de alterações de preços ou disponibilidade.

## RN-31
**Descrição:**
Todo cardápio diário deverá possuir pelo menos um item do cardápio.

## RN-32
**Descrição:**
O número de WhatsApp comercial deve ser validado no formato necessário para a geração do link de encaminhamento das mensagens de pedido.

## RN-33
**Descrição:**
Uma fotografia de prato somente poderá ser aceita quando atender aos critérios de formato, tamanho, dimensões mínimas e validação de conteúdo definidos na Especificação das fotografias.

## RN-34
**Descrição:**
A configuração administrativa deve armazenar o nome da proprietária, que poderá
ser utilizado em saudações e identificações da área administrativa.

## RN-35
**Descrição:**
Devem existir configurações de funcionamento para os sete dias da semana. Cada
dia deve indicar se está aberto e, quando aberto, possuir um horário de abertura
e um horário de encerramento válidos.

## RN-36
**Descrição:**
Cada dia aberto possui um único intervalo de funcionamento independente dos
demais dias. Os horários iniciais sugeridos pela interface são 11:00 e 14:00,
mas a proprietária pode editá-los.

## RN-37
**Descrição:**
A disponibilidade de um item do cardápio diário deve ser alterada imediatamente
ao acionar o respectivo controle e persistida sem confirmação adicional. Em caso
de falha, o estado anterior deve ser restaurado e a proprietária deve receber um
aviso explícito.

## RN-38
**Descrição:**
Somente pratos ativos no catálogo permanente podem ser incluídos em novos cardápios diários.

## RN-39
**Descrição:**
A desativação de um prato não deve removê-lo automaticamente dos cardápios diários aos quais ele já foi associado.

## RN-40
**Descrição:**
Um prato inativo que já esteja associado a um cardápio deve permanecer visível nesse cardápio, respeitando a disponibilidade específica do item para a data.

## RN-41
**Descrição:**
A reativação de um prato permite sua inclusão em novos cardápios diários, desde que as demais regras sejam atendidas.
