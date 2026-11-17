# Histórias de Usuário — Sabor de Casa

## Épico 1 — Administração das categorias

### HU01 — Cadastrar categoria
Como proprietária da Sabor de Casa, quero cadastrar categorias, para organizar os pratos do catálogo.

Critérios de aceitação:
- O sistema deve permitir informar o nome da categoria.
- O nome é obrigatório.
- O sistema deve impedir nomes duplicados, desconsiderando diferenças entre maiúsculas e minúsculas.
- A categoria cadastrada deve ficar disponível para associação aos pratos.
- A categoria poderá permanecer cadastrada sem pratos associados.
- Categorias sem itens no cardápio do dia não devem aparecer no cardápio público.

### HU02 — Consultar categorias
Como proprietária, quero visualizar as categorias cadastradas, para administrar a organização do catálogo.

Critérios de aceitação:
- O sistema deve apresentar as categorias cadastradas.
- Cada categoria deve exibir seu nome.
- A proprietária deve conseguir identificar as categorias disponíveis para associação aos pratos.

### HU03 — Editar categoria
Como proprietária, quero alterar o nome de uma categoria, para manter a organização do catálogo atualizada.

Critérios de aceitação:
- O sistema deve permitir selecionar uma categoria e alterar seu nome.
- O nome deve ser obrigatório.
- O sistema deve impedir nomes duplicados.
- A alteração não deve modificar as associações entre a categoria e seus pratos.
- A alteração deve ser refletida nas consultas administrativas e públicas pertinentes.

### HU04 — Excluir categoria
Como proprietária, quero excluir uma categoria que não seja mais utilizada, para manter o catálogo organizado.

Critérios de aceitação:
- O sistema deve permitir solicitar a exclusão de uma categoria.
- Se houver pratos associados, a exclusão deverá ser impedida.
- O sistema deverá informar o motivo da restrição.
- Se não houver pratos associados, o sistema deverá solicitar confirmação.
- Após a exclusão, a categoria não deverá aparecer nas consultas administrativas.

## Épico 2 — Administração do catálogo de pratos

### HU05 — Cadastrar prato
Como proprietária, quero cadastrar um prato com identificador, nome, descrição, preço, fotografia e categoria, para manter um catálogo permanente que possa ser utilizado na montagem dos cardápios diários.

Critérios de aceitação:
- O sistema deve permitir informar nome, descrição, preço e categoria.
- O sistema deve gerar um identificador único para o prato.
- O nome e o preço são obrigatórios.
- A categoria é obrigatória.
- O preço deve ser maior que zero.
- A fotografia é obrigatória.
- A fotografia deve atender aos critérios definidos em [Especificação das fotografias](especificacoes/especificacao-das-fotografias.md).
- O sistema deve validar o conteúdo real do arquivo, e não apenas sua extensão.
- O sistema deve validar os dados antes de concluir o cadastro.
- O prato deve ficar disponível para inclusão em cardápios diários após o cadastro.
- O prato deve ser cadastrado como ativo por padrão.
- O cadastro não deve incluir automaticamente o prato no cardápio público.

### HU06 — Consultar catálogo de pratos
Como proprietária, quero consultar os pratos cadastrados, para localizar e administrar os itens que poderão ser oferecidos aos clientes.

Critérios de aceitação:
- O sistema deve apresentar os pratos cadastrados.
- Cada prato deve exibir nome, preço-base e categoria.
- Cada prato deve exibir sua situação no catálogo, como ativo ou inativo.
- A proprietária deve conseguir consultar a descrição e a fotografia.
- O sistema deve permitir identificar um prato para edição ou inclusão em um cardápio diário.
- O sistema deve disponibilizar um campo de busca rápida no catálogo.
- A busca deve localizar pratos pelo nome, aceitando correspondência parcial.
- A busca não deve diferenciar letras maiúsculas e minúsculas.
- Os resultados devem ser atualizados enquanto a proprietária digita.
- Quando nenhum prato corresponder à busca, o sistema deve informar claramente que nenhum prato foi encontrado.

### HU07 — Editar prato
Como proprietária, quero editar as informações de um prato, para manter o catálogo atualizado.

Critérios de aceitação:
- O sistema deve permitir alterar nome, descrição, preço-base, fotografia e categoria.
- O sistema deve permitir ativar ou desativar o prato no catálogo.
- Os campos obrigatórios devem ser validados.
- O preço-base deve ser maior que zero.
- A categoria selecionada deve existir.
- A fotografia deve continuar sendo obrigatória.
- A nova fotografia deve atender aos critérios definidos em [Especificação das fotografias](especificacoes/especificacao-das-fotografias.md).
- O sistema deve validar o conteúdo real do arquivo, e não apenas sua extensão.
- Após salvar, as informações atualizadas devem aparecer nas consultas pertinentes.
- A alteração do preço-base deve ser refletida em todos os cardápios que utilizam o prato, inclusive aqueles já publicados.
- Um prato desativado não deve ser apresentado para inclusão em novos cardápios.
- A desativação não deve remover automaticamente o prato de cardápios aos quais ele já esteja associado.
- O sistema não deve manter preços antigos associados aos itens dos cardápios diários.
- Regra importante: se a proprietária alterar o preço de um prato de R$ 20,00 para R$ 22,00, todos os cardápios que utilizam esse prato deverão apresentar R$ 22,00. Não haverá preços independentes por data no MVP.

### HU08 — Excluir prato
Como proprietária, quero excluir um prato que não será mais utilizado, para manter o catálogo organizado.

Critérios de aceitação:
- O sistema deve permitir solicitar a exclusão de um prato.
- O sistema deve solicitar confirmação antes de concluir a operação.
- A exclusão deverá ser impedida se o prato estiver referenciado em cardápios que precisem preservar sua integridade.
- O sistema deverá informar o motivo da restrição.
- Quando a exclusão for permitida, o prato deverá deixar de estar disponível para novas seleções.
- Observação: embora não seja necessário manter histórico de alterações, o sistema deverá preservar a integridade das referências existentes.
- A exclusão definitiva de um prato já associado a cardápios publicados deverá ser tratada com cuidado.

## Épico 3 — Configuração administrativa

### HU09 — Configurar dias e horários de funcionamento
Como proprietária, quero configurar os dias e horários em que a marmitaria aceita pedidos, para informar aos clientes quando podem encaminhar suas solicitações.

Critérios de aceitação:
- O sistema deve permitir configurar cada dia da semana como aberto ou fechado.
- Para cada dia aberto, deve ser possível definir um horário de abertura e um horário de encerramento.
- O sistema deve validar os horários informados.
- A configuração deve permitir apenas um intervalo de funcionamento por dia.
- O sistema deve utilizar a configuração para determinar se está recebendo pedidos.
- As alterações devem ser refletidas nas consultas públicas posteriores.

### HU10 — Configurar número de WhatsApp
Como proprietária, quero cadastrar e alterar o número comercial de WhatsApp nas configurações administrativas, para receber as solicitações de pedidos encaminhadas pelos clientes.

Critérios de aceitação:
- O sistema deve disponibilizar um campo para cadastrar o número comercial.
- O número deve ser obrigatório para habilitar o encaminhamento de pedidos.
- O sistema deve validar o formato do número.
- A proprietária deve conseguir alterar o número quando necessário.
- O sistema deve utilizar o número configurado para gerar o link de encaminhamento ao WhatsApp.
- A alteração do número deve ser aplicada aos encaminhamentos posteriores.
- O número deve ser armazenado e utilizado em formato compatível com o link do WhatsApp, incluindo o código do país e o DDD, conforme necessário.
- O sistema deve aceitar somente celulares brasileiros válidos com DDD e informar erro sem salvar quando o formato for inválido.

### HU10A — Configurar nome da proprietária
Como proprietária, quero informar meu nome nas configurações do sistema, para
que a área administrativa possa utilizá-lo em saudações e identificações.

Critérios de aceitação:
- O sistema deve disponibilizar um campo para o nome da proprietária.
- O nome deve ser obrigatório para salvar a configuração administrativa.
- A proprietária deve conseguir alterar o nome quando necessário.
- O nome configurado deve poder ser utilizado em saudações da área administrativa.
- Nome, WhatsApp e horários devem ser persistidos em uma única operação; em caso de falha, os valores anteriores devem permanecer.

### HU11 — Consultar situação de funcionamento
Como cliente, quero visualizar se a Sabor de Casa está recebendo pedidos, para saber se posso encaminhar minha solicitação naquele momento.

Critérios de aceitação:
- O sistema deve comparar a data e a hora atuais com os dias e horários configurados.
- Dentro do horário de atendimento, deve informar que o estabelecimento está recebendo pedidos, desde que exista um cardápio publicado.
- Fora do horário, deve informar que o estabelecimento está fechado para pedidos.
- Se não houver cardápio publicado para a data, deve informar essa condição.
- O sistema deve impedir o encaminhamento de pedidos pelo fluxo normal quando o estabelecimento estiver fechado.
- A interface deve explicar claramente por que o pedido não pode ser encaminhado.
- Exemplos de mensagens:
  - Aberto: "Estamos recebendo pedidos!"
  - Fechado: "Nosso horário de atendimento foi encerrado. Você pode consultar o cardápio, mas não pode encaminhar pedidos neste momento."
  - Sem cardápio: "Ainda não temos um cardápio publicado para esta data."

## Épico 4 — Administração do cardápio diário

### HU12 — Criar cardápio do dia
Como proprietária, quero criar o cardápio de uma data selecionando pratos do catálogo, para definir quais itens serão oferecidos naquele dia.

Critérios de aceitação:
- O sistema deve permitir selecionar uma data.
- A data deve ser hoje ou uma data futura, informada no formato de calendário, considerando o fuso horário do estabelecimento.
- O sistema deve apresentar os pratos cadastrados para seleção.
- O sistema deve apresentar para seleção somente os pratos ativos no catálogo.
- A proprietária deve poder selecionar vários pratos.
- O cardápio deve ser salvo com status "rascunho" e o sistema deve informar o sucesso da operação.
- O sistema deve impedir a inclusão duplicada do mesmo prato no mesmo cardápio diário.
- O sistema deve permitir salvar o cardápio em preparação antes de publicá-lo.
- Os pratos que não forem selecionados não devem aparecer no cardápio público daquela data.
- O sistema deve permitir consultar e editar o cardápio antes da publicação.
- A proprietária deve conseguir preparar cardápios para diferentes datas futuras.
- O sistema deve impedir a criação de mais de um cardápio para a mesma data.
- Ao editar um cardápio, a validação de unicidade deve desconsiderar o próprio cardápio e continuar impedindo conflito com outra data já cadastrada.

### HU13 — Publicar cardápio do dia
Como proprietária, quero publicar o cardápio preparado para uma data, para disponibilizar aos clientes as opções que serão oferecidas naquele dia.

Critérios de aceitação:
- O sistema deve permitir publicar um cardápio previamente preparado.
- O cardápio deve apresentar somente os itens selecionados para a data.
- Todos os itens publicados devem possuir informações válidas, incluindo fotografia.
- O cardápio público deve apresentar os preços-base vigentes dos pratos.
- A publicação deve disponibilizar o cardápio no endereço público.
- A publicação poderá ocorrer antes do horário de abertura.
- Publicar antecipadamente não deverá habilitar o encaminhamento de pedidos antes do horário de funcionamento.
- A proprietária deve conseguir atualizar a disponibilidade dos itens depois da publicação.
- O sistema deve impedir a publicação de um cardápio sem itens.

### HU14 — Alterar cardápio publicado
Como proprietária, quero alterar um cardápio já publicado, para corrigir informações ou atualizar os itens oferecidos.

Critérios de aceitação:
- O sistema deve permitir editar um cardápio publicado.
- A proprietária deve conseguir adicionar ou remover itens, respeitando as regras de integridade.
- A proprietária deve conseguir alterar a disponibilidade dos itens.
- As alterações devem ser refletidas no cardápio público após serem salvas e atualizadas.
- A edição não deve exigir a criação de um novo endereço público.
- As alterações devem afetar somente o cardápio da data selecionada, exceto quando se tratar de alterações nos dados globais do prato, como seu preço-base.

### HU15 — Marcar item do dia como indisponível
Como proprietária, quero marcar um item do cardápio diário como indisponível, para informar que ele não pode mais receber pedidos naquele dia.

Critérios de aceitação:
- O sistema deve permitir alterar a disponibilidade de um item do cardápio diário.
- O item indisponível deve continuar visível no cardápio público.
- O sistema deve identificá-lo claramente como esgotado ou indisponível.
- O item indisponível não deve permitir novas seleções.
- Se o item já estiver selecionado por um cliente, o sistema deverá avisá-lo quando detectar a indisponibilidade durante a revisão ou a tentativa de encaminhamento.
- A indisponibilidade deve afetar somente o item daquele cardápio diário.
- A alteração não deve desativar o prato no catálogo permanente.
- A alteração deve ser refletida nas consultas públicas posteriores.
- A alteração deve ser executada automaticamente ao acionar o controle, sem uma etapa extra de confirmação.
- Se a persistência falhar, a interface deve restaurar o estado anterior e exibir um alerta breve explicando que a atualização não foi concluída.

### HU16 — Reativar item do dia
Como proprietária, quero reativar um item anteriormente marcado como indisponível, para voltar a aceitar pedidos quando ele estiver disponível.

Critérios de aceitação:
- O sistema deve permitir reativar um item indisponível.
- O item deve voltar a ser apresentado como disponível.
- O preço deverá corresponder ao preço-base vigente do prato.
- A alteração deve ser refletida nas consultas posteriores.
- A reativação não deve modificar a disponibilidade do mesmo prato em outros cardápios diários.
- A reativação deve usar o mesmo controle de disponibilidade e ser persistida automaticamente.

## Épico 5 — Consulta pública ao cardápio

### HU17 — Consultar cardápios diários
Como proprietária, quero consultar os cardápios preparados e publicados, para verificar os itens selecionados para cada data.

Critérios de aceitação:
- O sistema deve permitir consultar cardápios por data.
- A proprietária deve conseguir identificar quais estão em preparação e quais foram publicados.
- A consulta deve apresentar os itens selecionados e suas disponibilidades.
- A consulta deve permitir acessar um cardápio para edição.
- O sistema não deve permitir mais de um cardápio para a mesma data.

### HU18 — Visualizar cardápio do dia
Como cliente, quero acessar o cardápio da Sabor de Casa por um endereço público, para conhecer os pratos oferecidos na data.

Critérios de aceitação:
- O sistema deve disponibilizar uma página pública sem necessidade de autenticação.
- O cardápio deve apresentar os itens selecionados para a data correspondente.
- Os pratos devem ser organizados por categoria.
- As categorias sem itens no cardápio do dia não devem ser exibidas.
- Cada prato deve apresentar nome, descrição, preço e fotografia.
- Os itens indisponíveis devem permanecer visíveis e ser identificados claramente.
- O cardápio deve informar se o estabelecimento está recebendo pedidos.
- O sistema não deve apresentar itens não selecionados para aquela data.
- O cardápio deve refletir as alterações administrativas após a atualização dos dados.

### HU19 — Consultar disponibilidade de um item
Como cliente, quero visualizar a disponibilidade dos pratos, para escolher opções que possam receber pedidos.

Critérios de aceitação:
- O sistema deve identificar claramente os itens disponíveis e indisponíveis.
- Os itens indisponíveis não devem permitir novas seleções.
- Se um item ficar indisponível depois de ser selecionado, o sistema deverá avisar o cliente quando essa condição for detectada.
- O aviso deverá identificar o item indisponível.
- O sistema deverá permitir remover o item indisponível e continuar a preparação do pedido.
- Os demais itens deverão permanecer selecionados, desde que continuem válidos.

### HU20 — Compartilhar o endereço do cardápio
Como proprietária, quero compartilhar um endereço permanente para o cardápio, para facilitar o acesso dos clientes pelo WhatsApp.

Critérios de aceitação:
- O sistema deve disponibilizar um endereço público para consulta do cardápio.
- A proprietária deve conseguir copiar esse endereço e compartilhá-lo pelo WhatsApp.
- O endereço deve continuar válido quando os pratos, preços e disponibilidades forem alterados.
- Os clientes devem consultar as informações atualizadas ao acessar o endereço.
- A alteração do cardápio não deve exigir a criação de um novo endereço.

## Épico 6 — Preparação e encaminhamento de pedidos

### HU21 — Selecionar pratos e quantidades
Como cliente, quero selecionar os pratos desejados e informar suas quantidades, para preparar meu pedido sem precisar digitar manualmente cada item.

Critérios de aceitação:
- O sistema deve permitir selecionar itens disponíveis do cardápio do dia.
- O cliente deve conseguir informar a quantidade desejada de cada item.
- A quantidade deve ser um número inteiro positivo.
- O sistema deve permitir aumentar ou diminuir a quantidade.
- O sistema deve permitir remover um item da seleção.
- Os itens indisponíveis não devem permitir novas seleções.
- O sistema deve apresentar um resumo dos itens selecionados.
- O resumo deve apresentar quantidade, preço unitário e subtotal de cada item.
- O sistema deve apresentar o total estimado do pedido.
- Os cálculos devem utilizar os preços-base vigentes dos pratos.

### HU22 — Revisar pedido antes do encaminhamento
Como cliente, quero revisar os itens e valores selecionados antes de gerar a mensagem, para verificar se o pedido corresponde ao que desejo solicitar.

Critérios de aceitação:
- O sistema deve apresentar todos os itens selecionados.
- Cada item deve exibir nome, quantidade, preço unitário e subtotal.
- O sistema deve apresentar o total estimado.
- O cliente deve conseguir voltar à seleção para alterar quantidades ou remover itens.
- O sistema deve verificar novamente a disponibilidade antes de permitir o encaminhamento.
- Se algum item estiver indisponível, o sistema deverá identificá-lo e solicitar que o cliente corrija a seleção.
- O sistema deverá impedir o encaminhamento quando a seleção estiver vazia.
- O sistema deverá impedir o encaminhamento quando o estabelecimento estiver fora do horário de atendimento.
- O sistema deverá considerar os preços vigentes no momento da revisão final.

### HU23 — Gerar mensagem de pedido
Como cliente, quero gerar automaticamente uma mensagem de texto com meu pedido, para encaminhá-la à Sabor de Casa pelo WhatsApp.

Critérios de aceitação:
- O sistema deve gerar uma mensagem com os itens selecionados.
- A mensagem deve apresentar o nome, a quantidade e o preço unitário de cada item.
- A mensagem deve apresentar os subtotais e o total estimado.
- Os valores devem corresponder aos preços vigentes.
- A mensagem deve conter uma identificação clara de que se trata de uma solicitação de pedido.
- O texto deve ser legível e adequado ao WhatsApp.
- A mensagem só poderá ser gerada para uma seleção válida, após a verificação da disponibilidade e do horário.
- O sistema deverá informar que a confirmação final depende da resposta da proprietária.

### HU24 — Encaminhar pedido pelo WhatsApp
Como cliente, quero abrir o WhatsApp com a mensagem do pedido previamente preenchida, para encaminhar minha solicitação sem redigitar as informações.

Critérios de aceitação:
- O sistema deve disponibilizar um botão para encaminhar o pedido pelo WhatsApp.
- Ao acioná-lo, o sistema deve abrir o WhatsApp ou sua interface Web com a mensagem preenchida.
- O destinatário deve corresponder ao número comercial cadastrado nas configurações administrativas.
- A mensagem deve preservar os itens, quantidades e valores apresentados no resumo.
- O sistema deverá informar que a mensagem precisa ser enviada pelo cliente.
- A abertura do WhatsApp não deve ser interpretada como confirmação de envio ou aceitação do pedido.
- O sistema deve informar que a proprietária confirmará o pedido pela conversa.
- Caso o cliente altere a quantidade de um item, deverá retornar ao resumo e gerar uma nova mensagem.
- Se o cliente voltar ao cardápio, alterar a seleção e gerar uma nova mensagem, os valores e as quantidades deverão ser recalculados.
- O sistema deverá realizar novamente as validações necessárias antes de disponibilizar a nova mensagem.

## Épico 7 — Autenticação e controle de acesso

### HU25 — Autenticar-se no sistema
Como proprietária, quero entrar no sistema utilizando meu usuário e senha para acessar a área administrativa e gerenciar as informações do Sabor de Casa.

Critérios de validação:
- Dado que a proprietária possui credenciais válidas, quando informar seu usuário e senha na tela de login, então o sistema deverá autenticar a usuária e permitir o acesso à área administrativa.
- Dado que a proprietária informa credenciais inválidas, quando tentar entrar no sistema, então o acesso deverá ser negado e uma mensagem de erro deverá ser apresentada.
- Dado que uma pessoa não está autenticada, quando tentar acessar diretamente uma página administrativa, então o sistema deverá impedir o acesso.
- Dado que uma pessoa não está autenticada, quando tentar executar diretamente uma operação administrativa pela API, então o servidor deverá negar a operação.
- Dado que o sistema está sendo configurado pela primeira vez, quando a conta administrativa for provisionada, então o procedimento deverá permitir definir as credenciais iniciais sem disponibilizar cadastro público de usuários.
- Dado que as credenciais são armazenadas pelo sistema, quando a senha for persistida, então ela deverá ser armazenada de forma segura, sem ser registrada em texto puro.

### HU26 — Encerrar sessão
Como proprietária, quero encerrar minha sessão para impedir que outras pessoas utilizem a área administrativa a partir de uma sessão que deixei aberta.

Critérios de validação:
- Dado que a proprietária está autenticada, quando solicitar o encerramento da sessão, então o sistema deverá invalidar a sessão e redirecioná-la para uma página pública ou para a tela de login.
- Dado que a sessão foi encerrada, quando a usuária tentar acessar uma página administrativa protegida, então o sistema deverá exigir uma nova autenticação.
- Dado que a sessão foi encerrada, quando a usuária tentar executar uma operação administrativa utilizando a sessão anterior, então o servidor deverá negar a operação.
- Dado que a proprietária encerrou sua sessão, quando consultar o cardápio público, então o sistema deverá permitir o acesso sem autenticação.

### HU27 — Restringir operações administrativas
Como responsável pelo sistema, quero que as operações administrativas sejam protegidas contra acessos não autorizados, para impedir que visitantes alterem os dados do Sabor de Casa.

Critérios de validação:
- Dado que uma requisição administrativa é realizada sem autenticação válida, quando o servidor processar a requisição, então deverá negar a operação.
- Dado que a proprietária está autenticada, quando executar uma operação administrativa permitida e atender às regras de negócio, então o sistema deverá processá-la.
- Dado que uma pessoa tenta contornar as restrições da interface e acessar diretamente uma API administrativa, quando o servidor processar a requisição, então deverá aplicar as mesmas verificações de autenticação.
- Dado que uma pessoa não está autenticada, quando consultar o cardápio público ou preparar uma mensagem de pedido, então o sistema deverá permitir essas operações sem exigir login.