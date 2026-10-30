# Do Gherkin ao teste (Lunar Pass)

O Gherkin declarativo descreve o comportamento de negócio. A automação traduz cada parte para o código **sem mudar o que foi especificado**, usando as camadas do Lunar Pass.

A especificação pode estar na conversa, num arquivo do projeto ou em `docs/storefront.md`. Palavras-chave podem aparecer em texto puro, em **negrito** ou em `.feature`.

## Como cada parte vira código

| Gherkin | No teste | Como no Lunar Pass |
|---|---|---|
| **Contexto** | `test.beforeEach` do arquivo | Mission Control autenticado: `app.mission.loginPage.go()`, `login` com o usuário já usado em `login.spec.ts` / `register.spec.ts`, e espera do logout visível. Storefront: navegação via `app.store.homePage.go()` quando o spec da área já faz isso no teste (hoje o `home.spec.ts` chama `go()` dentro de cada teste, não no `beforeEach` — copie o spec da área). |
| **Dado** | Arrange | Preferir `cleanMission` / `cleanAndInsertMission` de `playwright/support/db.ts`. Pela tela só quando o próprio cenário pede a navegação. |
| **Quando** | Act | Ações do usuário por métodos do Page Object (`app.mission.*` ou `app.store.*`). |
| **Então** / **E** | Assert | Uma asserção para cada resultado esperado, sobre localizadores do Page Object (ou `app.toast`). |
| **Esquema do Cenário** + **Exemplos** | Um teste por linha | Lista de dados percorrida com um `test` por item. |
| Anotações (regra de origem, IDs) | Nada | Não viram código. |

## Título do teste

Regra desta skill para testes **novos** (não renomeie os antigos):

- Cenário: o nome exato. `Cenário: Não deve cadastrar com código duplicado` vira `test('Não deve cadastrar com código duplicado', ...)`.
- Esquema do Cenário: o nome seguido da identificação da linha, por exemplo `Validar os limites dos dados de identificação obrigatórios | tamanho_nome: 2`.
- Um arquivo de spec por funcionalidade, em `playwright/e2e/<modulo>/`.

## Módulo

| Área | Pasta do spec | Fixture | Project |
|---|---|---|---|
| Autenticação, cadastro e painel de missões | `playwright/e2e/mission-control/` | `app.mission`, `app.toast` | `mission-control` |
| Vitrine pública | `playwright/e2e/storefront/` | `app.store`, `app.toast` se a tela usar toast | `storefront` |

Se a área não for nenhum dos dois, pare e pergunte. Só crie terceiro módulo se o usuário pedir, seguindo `docs/arquitetura.md` seção 5.

## Quando o cenário não é suficiente

| Situação | O que fazer |
|---|---|
| O **Então** não diz o que verificar | Pergunte antes de escrever |
| O **Então** descreve uma mensagem sem o texto exato | Use o texto que a tela mostra e registre no resumo: "texto observado, não definido na especificação" |
| O **Quando** é uma ação que a tela impede | Não force o clique. Verifique o estado que impede a ação (`toBeDisabled`) e explique em comentário no Act |
| O **Então** não tem correspondência clara na tela | Automatize o que é verificável, use o elemento mais próximo e registre a divergência no resumo |
| O **Dado** exige estado que `db.ts` / `types.ts` não cobrem | Pergunte. Não invente coluna, tabela ou campo |
| O cenário depende de decisão de negócio em aberto (ex.: itens "A investigar" em `docs/storefront.md`) | Não automatize. Registre como pendente |
| A tela se comporta diferente do **Então** | O teste fica falhando. Reporte como possível defeito do produto |
