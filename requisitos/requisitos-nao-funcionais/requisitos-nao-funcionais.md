# Requisitos não funcionais

## Usabilidade e dispositivos móveis

### RNF-01
**Descrição:** 
A interface deve ser responsiva, priorizando o uso em smartphones.

### RNF-02
**Descrição:** 
A área administrativa deve permitir gerenciar o catálogo e os cardápios diários por meio de uma interface adequada a dispositivos móveis.

### RNF-03
**Descrição:**
A seleção de pratos e quantidades deve exigir poucas interações.

### RNF-04
**Descrição:** 

Os controles devem ser adequados para telas sensíveis ao toque.

### RNF-05
**Descrição:** 
O resumo do pedido e o total estimado devem ser fáceis de consultar.

### RNF-06
**Descrição:** 
As mensagens de erro, indisponibilidade e encerramento do atendimento devem ser claras e visíveis.

### RNF-07
**Descrição:** 
Os preços devem ser apresentados em reais, com duas casas decimais.

## Segurança

### RNF-08
**Descrição:** 
A área administrativa deve exigir autenticação.

### RNF-09
**Descrição:** 
Somente a proprietária autenticada poderá alterar o catálogo, as configurações e os cardápios.

### RNF-10
**Descrição:** 
A área pública não deve permitir operações administrativas.

### RNF-11
**Descrição:** 
Os dados recebidos devem ser validados no servidor, além das validações realizadas na interface.

### RNF-12
**Descrição:** 
O número de WhatsApp deve ser validado e utilizado de forma consistente na geração dos links.

## Integridade e atualização

### RNF-13
**Descrição:** 
O catálogo, as configurações e os cardápios devem ser armazenados de maneira persistente.

### RNF-14
**Descrição:** 
As alterações administrativas devem ser refletidas no cardápio público após sua efetiva atualização.

### RNF-15
**Descrição:** 
A disponibilidade deve ser validada antes da geração da mensagem.

### RNF-16
**Descrição:** 
Os preços devem ser consistentes entre o cardápio, o resumo e a mensagem do pedido.

### RNF-17
**Descrição:** 
O sistema deve preservar a integridade das associações entre categorias, pratos e cardápios.

## Desempenho

### RNF-18
**Descrição:** 
O cardápio deve apresentar bom desempenho em dispositivos móveis.

### RNF-19
**Descrição:** 
As fotografias devem ser otimizadas para exibição em dispositivos móveis, reduzindo o tempo de carregamento e o consumo de dados.

### RNF-20
**Descrição:** 
O carregamento das fotografias otimizadas não deve impedir a consulta aos nomes, preços e disponibilidades dos itens.

### RNF-21
**Descrição:**
Os arquivos de fotografia devem ser validados pelo conteúdo real, além da extensão ou do nome informado, e devem estar nos formatos JPEG, PNG ou WebP.

### RNF-22
**Descrição:**
O tamanho máximo do arquivo de fotografia enviado deve ser de 1 MB.

### RNF-23
**Descrição:**
As fotografias devem possuir dimensões mínimas de 600 × 600 pixels. A proporção 1:1 é recomendada, mas não obrigatória.