# Modelo conceitual do domínio

A especificação distingue quatro conceitos centrais:

1. **Categoria:** agrupa os pratos.
2. **Prato:** representa um produto cadastrado permanentemente.
3. **Cardápio diário:** representa a seleção de pratos oferecidos em determinada data.
4. **Item do cardápio diário:** representa um prato incluído em um cardápio específico, com disponibilidade própria.

Também haverá uma configuração administrativa para os horários de funcionamento e o número comercial do WhatsApp.

## Configuração administrativa

A configuração administrativa deverá armazenar os dados necessários para o funcionamento do sistema.

### Informações

| Informação | Descrição |
|---|---|
| Nome da proprietária | Nome exibido em saudações e identificações da área administrativa. |
| Número de WhatsApp | Número comercial para o qual as mensagens de pedido serão encaminhadas. |
| Dias de funcionamento | Dias da semana em que a marmitaria aceita pedidos. |
| Horário de abertura | Início do período de recebimento de pedidos. |
| Horário de encerramento | Fim do período de recebimento de pedidos. |

Para o MVP, haverá um único intervalo de funcionamento por dia, sem múltiplos turnos.
Cada um dos sete dias da semana poderá ser marcado como aberto ou fechado. Para
cada dia aberto, serão informados os horários de abertura e encerramento. A
interface poderá sugerir `11:00` e `14:00` como valores iniciais, mas os horários
de cada dia poderão ser editados independentemente.

O número de WhatsApp deverá ser configurado pela proprietária na área administrativa. A aplicação deverá validar o formato necessário para gerar o link de encaminhamento.

## Categoria

As categorias iniciais serão:

- Pratos executivos.
- Massas.
- Acompanhamentos.
- Bebidas.

### Atributos

| Atributo | Descrição |
|---|---|
| `id` | Identificador único. |
| `nome` | Nome da categoria. |

### Regras

- O nome é obrigatório.
- Não podem existir categorias com nomes duplicados, desconsiderando diferenças entre maiúsculas e minúsculas.
- Uma categoria pode conter zero ou vários pratos.
- Categorias sem pratos podem permanecer cadastradas.
- Uma categoria sem itens no cardápio do dia não deve ser exibida no cardápio público.

## Prato

O prato representa um produto cadastrado no catálogo permanente.

### Atributos

| Atributo | Descrição |
|---|---|
| `id` | Identificador único. |
| `nome` | Nome do prato. |
| `descricao` | Descrição complementar. |
| `preco` | Preço vigente do prato. |
| `foto` | Referência à fotografia obrigatória. |
| `categoria_id` | Identificador da categoria associada. |

### Regras

- O identificador deve ser único.
- O nome é obrigatório.
- A descrição será obrigatória ou opcional conforme a decisão final de validação dos campos; para o MVP, propõe-se que seja opcional.
- O preço-base deve ser maior que zero.
- A fotografia é obrigatória.
- Cada prato deve pertencer a exatamente uma categoria cadastrada.
- O preço-base representa o valor vigente do prato, sem desconto.
- A alteração do preço-base deverá refletir-se nos cardápios que utilizam esse prato.
- O preço pertence ao cadastro permanente do prato. O cardápio diário não terá um campo independente de preço no MVP. Assim, não haverá divergência entre preços antigos armazenados em cardápios e o preço vigente no catálogo.

## Cardápio diário

O cardápio diário representa os pratos que a proprietária pretende oferecer em uma data específica.

### Atributos

| Atributo | Descrição |
|---|---|
| `id` | Identificador único do cardápio. |
| `data` | Data a que o cardápio se refere. |
| `status` | Situação do cardápio, como em preparação ou publicado. |

### Regras

- Deve existir, no máximo, um cardápio por dia.
- A data deve ser informada no formato `AAAA-MM-DD`, interpretada no fuso horário configurado para o estabelecimento, e não pode ser anterior ao dia atual.
- A proprietária poderá preparar cardápios para várias datas futuras.
- Ao criar ou editar, o cardápio começa com status `rascunho`; a operação deve apresentar confirmação de sucesso.
- Na edição, a própria data do cardápio não constitui duplicidade, mas qualquer outra data já cadastrada deve bloquear o salvamento.
- Um cardápio poderá ser publicado antes do horário de abertura.
- A publicação antecipada não significa que o estabelecimento esteja recebendo pedidos.
- Somente os pratos selecionados para aquela data poderão aparecer no cardápio público.
- O cardápio publicado poderá ser alterado posteriormente.
- A ausência de cardápio para uma data deverá ser informada ao cliente.
- O cardápio poderá continuar visível após o encerramento do horário de atendimento.

## Item do cardápio diário

O item do cardápio diário associa um prato cadastrado a um cardápio de uma data.

### Atributos

| Atributo | Descrição |
|---|---|
| `id` | Identificador único do item diário. |
| `cardapio_diario_id` | Referência ao cardápio diário. |
| `prato_id` | Referência ao prato cadastrado. |
| `disponivel` | Indica se o item está disponível para receber pedidos naquele dia. |

### Regras

- Cada item deve referenciar um prato existente.
- O mesmo prato não pode ser incluído duas vezes no mesmo cardápio.
- A disponibilidade é específica para a data.
- Um prato indisponível em um dia poderá ser oferecido normalmente em outro.
- A indisponibilidade não deve desativar o prato no catálogo permanente.
- O preço do item deverá corresponder ao preço-base vigente do prato.
- Os itens indisponíveis permanecerão visíveis no cardápio público, identificados como esgotados ou indisponíveis.
- A alteração de `disponivel` deve ser persistida imediatamente e afetar somente o item do cardápio e da data selecionados.
- A interface administrativa deve oferecer feedback de erro quando a persistência da alteração não for concluída, sem apresentar a operação como bem-sucedida.
