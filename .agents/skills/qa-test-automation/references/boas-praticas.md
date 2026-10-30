# Boas práticas para o spec (Lunar Pass)

## Estrutura

- Arquivo em `playwright/e2e/mission-control/` ou `playwright/e2e/storefront/`.
- Import obrigatório:

```ts
import { test, expect } from '../../support'
```

- Tipos e massa, quando o spec da área já importa:

```ts
import { Mission } from '../../support/types'
import { cleanMission, cleanAndInsertMission } from '../../support/db'
```

- Consuma `{ app }`. Nunca `new XxxPage(page)`.
- Mission Control: `app.mission.loginPage`, `dashPage`, `registerPage`, `navbar`. Toast: `app.toast.message`.
- Storefront: `app.store.homePage`.
- **Contexto** no `beforeEach` quando os specs da área já fazem isso (`login.spec.ts` e `register.spec.ts`). `home.spec.ts` chama `go()` dentro de cada teste — copie a área.
- Dentro do teste, AAA. Comentários usados no projeto: `// Arrange`, `// Act`, `// Assert` (também há variantes mais longas em `login.spec.ts`). Em arquivo novo na mesma pasta, copie o vizinho.
- Um teste por cenário. Em Esquema do Cenário, um `test` por linha.

## Asserções

- Asserções que esperam sozinhas, já usadas: `toBeVisible`, `toHaveText`, `toContainText`, `toHaveTitle`. Outras (`toHaveURL`, `toBeDisabled`, `toHaveCount` só do elemento do próprio teste) quando a tela e o **Então** pedirem.
- Uma asserção para cada **Então** e cada **E**. Nenhuma a mais, nenhuma a menos.
- Valor exato da tela. `register.spec.ts` usa `toContainText` na mensagem do toast e `toHaveText` no alert.
- Timeout explícito já existe na espera do logout: `{ timeout: 10_000 }`. Só reproduza se o fluxo autenticado do Mission Control exigir a mesma espera do spec vizinho. Não espalhe timeout sem esse precedente.
- Para "não permite o avanço": estado observável (mensagem, etapa que permanece, botão desabilitado). Não force clique.

## Esperas

- Nada de `waitForTimeout`.
- O Playwright espera em ações e asserções. Operação lenta: espere o resultado visível.
- Evite timeout por teste. O único precedente no repo é o logout após login.

## Isolamento

- Nenhum teste depende de outro nem da ordem.
- IDs de missão exclusivos.
- Storefront: sem contagem total e sem posição na lista.
- Nenhum teste altera dados que não criou, salvo login com o usuário de demonstração (sem modificá-lo).

## Nomes

- Variáveis, funções e Page Objects em inglês.
- Títulos novos = nome do cenário (não copie `deve…` / `não deve…` dos testes antigos, e não os renomeie).
- Dados de teste e textos esperados como na tela e na especificação.
