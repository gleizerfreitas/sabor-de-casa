# Especificação das fotografias

## 1. Objetivo

Definir os requisitos para validação, armazenamento e exibição das fotografias dos pratos cadastrados no sistema Sabor de Casa.

Como a fotografia é obrigatória, o sistema deverá validar os arquivos durante o cadastro e a edição dos pratos.

## 2. Requisitos aprovados

| Característica | Especificação |
|---|---|
| Obrigatoriedade | Obrigatória para todos os pratos cadastrados. |
| Formatos aceitos | JPEG, PNG e WebP. |
| Tamanho máximo do arquivo enviado | 1 MB. |
| Dimensões mínimas | 600 × 600 pixels. |
| Proporção recomendada | 1:1. A proporção não é obrigatória. |
| Exibição | Imagens otimizadas para dispositivos móveis. |

## 3. Validação

Durante o cadastro e a edição de um prato, o sistema deverá:

- Exigir o envio de uma fotografia.
- Aceitar somente arquivos nos formatos JPEG, PNG e WebP.
- Recusar arquivos com tamanho superior a 1 MB.
- Recusar imagens com largura ou altura inferior a 600 pixels.
- Validar o conteúdo real do arquivo, e não apenas sua extensão ou o nome informado.

## 4. Otimização para exibição

O sistema deverá produzir ou armazenar uma versão otimizada da fotografia para exibição no cardápio público, reduzindo o tempo de carregamento e o consumo de dados em dispositivos móveis.

A otimização não deverá impedir a consulta aos nomes, preços e disponibilidades dos itens do cardápio.
