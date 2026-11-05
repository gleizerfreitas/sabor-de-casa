# ADR 0001: Decisões do MVP

## Status

Aceita

## Contexto

O projeto precisa de uma base implementável sem transformar funcionalidades
futuras em dependências obrigatórias do primeiro incremento.

## Decisões

1. O preço exibido será sempre o preço vigente cadastrado no prato.
2. Pratos só poderão ser excluídos fisicamente quando não houver referências
   em itens de cardápio.
3. O cardápio terá os estados `RASCUNHO` e `PUBLICADO`.
4. Cardápios publicados poderão ser consultados para datas passadas e futuras.
5. O MVP terá um único administrador autenticado pelo Supabase Auth.
6. O fuso horário oficial será `America/Fortaleza`.
7. As fotografias usarão um bucket público do Supabase Storage.
8. A seleção do cliente não será persistida e não reservará itens.

## Consequências

- Alterações de preço podem mudar cardápios já publicados.
- O cliente deve ser avisado de que o total é estimado.
- O encaminhamento precisa revalidar preço, disponibilidade e funcionamento.
- O banco deve impedir a exclusão de pratos referenciados.
- A autorização deve ser testada com RLS, e não somente na interface.
- Arquivamento, histórico e múltiplos administradores ficam para uma evolução.