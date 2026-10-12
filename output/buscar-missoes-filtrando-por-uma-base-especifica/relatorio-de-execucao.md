# Relatório de execução

- **Cenário:** Buscar missões filtrando por uma base específica (docs/storefront.md)
- **Status:** Passou
- **Data e hora de início:** 12/10/2026 14:32, horário local
- **Duração:** ~4 minutos

## Resultado observado

| Etapa | Validação | Esperado | Observado | Resultado |
|---|---|---|---|---|
| Dado | Catálogo de missões disponível | Catálogo carregado exibindo missões | Acessada a URL `http://localhost:3000/missions`; catálogo carregou 6 missões disponíveis para todas as bases | ok |
| Quando | Aplicação do filtro pela Base Lunar Alpha | Filtro selecionado e busca refinada | Aberto o menu de seleção de bases lunares, selecionada a opção "Base Lunar Alpha" e acionado o botão "Refinar" (`/missions?base=alpha`) | ok |
| Então | Lista exibe apenas missões com destino à Base Lunar Alpha | Exibição restrita a missões da Base Alpha | A lista foi filtrada para exatamente 1 missão (código `LP-0127A`), com destino explícito à "Base Lunar Alpha" (Mar da Tranquilidade). Nenhuma missão de outra base foi apresentada | atendido |
| E | Resumo indica quais filtros estão ativos e a quantidade de resultados | Indicador de quantidade e filtros ativos visíveis | Cabeçalho exibiu "1 missão disponível" (quantidade de resultados) e parágrafo/botão indicando o filtro ativo ("Base Base Lunar Alpha" / "Base Lunar Alpha") | atendido |

## Falhas ou bloqueios

Nenhum.

## Evidências

- `output/buscar-missoes-filtrando-por-uma-base-especifica/01-pagina-inicial.png`
- `output/buscar-missoes-filtrando-por-uma-base-especifica/02-catalogo-disponivel.png`
- `output/buscar-missoes-filtrando-por-uma-base-especifica/03-resultado-filtro-base-alpha.png`
- `output/buscar-missoes-filtrando-por-uma-base-especifica/04-resumo-filtros-e-quantidade.png`

## Observações e limitações

- No texto informativo do resumo de filtros acima da listagem, foi observado o texto `"Base Base Lunar Alpha"` (com a palavra "Base" prefixada duas vezes). A filtragem e a contagem funcionaram com precisão.

## Encerramento do navegador

- **Aba fechada:** sim
- **Fechamento confirmado:** sim, confirmado via comando `browser_tabs(action: "list")` e `browser_close()`, garantindo que a aba da aplicação de teste em `http://localhost:3000/missions?base=alpha` foi finalizada.
