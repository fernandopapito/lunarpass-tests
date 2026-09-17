# CT-001 — Busca por base lunar (fluxo principal)

---

## Identificação

| Campo                   | Valor                                                                |
| :---------------------- | :------------------------------------------------------------------- |
| **ID**                  | CT-001                                                               |
| **Título**              | Busca por base lunar via formulário da página inicial — fluxo principal |
| **Requisito**           | RF-01 — Buscar missões por base lunar (Funcionalidade: Busca de Missões) |
| **Módulo**              | Storefront Lunar Pass                                                |
| **Versão do documento** | `docs/storefront-rfs.md`                                             |
| **Data de execução**    | 2026-09-15                                                           |
| **Ambiente**            | `http://localhost:3000/`                                             |

---

## Pré-condições

1. A aplicação Lunar Pass está acessível em `http://localhost:3000/`.
2. O catálogo de missões contém ao menos uma missão para a base lunar a ser selecionada.
3. O usuário não está em nenhuma sessão ou fluxo de reserva ativo.
4. A página inicial está carregada e o formulário de busca está visível.

---

## Dados de teste

| Campo                          | Valor                                                                        |
| :----------------------------- | :--------------------------------------------------------------------------- |
| **Base selecionada**           | Base Lunar Alpha                                                             |
| **Ordenação**                  | Padrão (não alterada — "Missão mais próxima")                                |
| **URL da página inicial**      | `http://localhost:3000/`                                                     |
| **URL esperada de resultados** | `/missions?base=alpha` (ou equivalente para a base selecionada)              |

---

## Passos

| #  | Passo                                                                                                                                                           |
| :- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | Acessar `http://localhost:3000/`.                                                                                                                               |
| 2  | Verificar que o formulário de busca está presente na página inicial, contendo as opções de bases lunares e o botão "Buscar missões".                            |
| 3  | Selecionar o checkbox "Base Lunar Alpha" no grupo de bases lunares.                                                                                             |
| 4  | Manter a ordenação padrão ("Missão mais próxima") sem alterá-la.                                                                                               |
| 5  | Clicar no botão "Buscar missões".                                                                                                                               |
| 6  | Aguardar o carregamento da página de resultados.                                                                                                                |
| 7  | Verificar a quantidade de resultados exibida na página de resultados.                                                                                           |
| 8  | Verificar se a base selecionada ("Base Lunar Alpha") está indicada como filtro ativo na página de resultados.                                                   |
| 9  | Verificar se as missões listadas pertencem exclusivamente à "Base Lunar Alpha".                                                                                 |
| 10 | Verificar a ordenação dos resultados apresentados.                                                                                                              |

---

## Resultado esperado

| # do passo | Resultado esperado                                                                                                                                                                                                                 |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–2        | A página inicial é exibida com o formulário de busca contendo as quatro opções de bases lunares (Alpha, Orion, Aurora, Selene), um seletor de ordenação e o botão "Buscar missões".                                               |
| 3          | O checkbox "Base Lunar Alpha" é marcado; as demais bases permanecem desmarcadas.                                                                                                                                                   |
| 4          | A opção "Missão mais próxima" permanece selecionada no combobox de ordenação.                                                                                                                                                      |
| 5–6        | O sistema processa a busca e exibe a página de resultados.                                                                                                                                                                         |
| 7          | A quantidade de missões encontradas é exibida na página de resultados (ex.: "N missão(ões) disponível(is)").                                                                                                                       |
| 8          | A base usada como filtro ("Base Lunar Alpha") está identificada na página de resultados (ex.: como tag/badge ou subtexto), indicando quais bases estão sendo usadas como filtro.                                                   |
| 9          | Todas as missões listadas pertencem à "Base Lunar Alpha"; nenhuma missão de outras bases é exibida.                                                                                                                                |
| 10         | Os resultados são apresentados ordenados pela data de partida mais próxima (conforme ordenação padrão e regra de negócio).                                                                                                         |

---
