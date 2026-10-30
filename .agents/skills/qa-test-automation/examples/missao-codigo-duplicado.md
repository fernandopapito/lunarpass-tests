# Exemplo: código de missão duplicado (Mission Control)

Calibração com o padrão **real** de `playwright/e2e/mission-control/register.spec.ts` e dos Page Objects de `playwright/support/pages/mission-control/`.

## 1. O cenário

**Funcionalidade:** Cadastro de missões

**Contexto:**
**Dado** que estou autenticado no controle de missões

**Cenário:** Não deve cadastrar com código duplicado
**Dado** que já existe uma missão com um código válido
**Quando** eu submeto o cadastro com o mesmo código
**Então** eu sou informado de que já existe uma missão com este ID

## 2. Leitura do cenário

| Parte | Tradução no Lunar Pass |
|---|---|
| Contexto | `beforeEach`: `loginPage.go()`, `login` com o usuário dos specs existentes, `expect(navbar.logout).toBeVisible({ timeout: 10_000 })` |
| Dado | `Mission` com ID exclusivo (`LP-3001A` neste spec) e `cleanAndInsertMission(mission)` |
| Quando | Clique em `dashPage.addButton`, espera `registerPage.title`, `registerPage.submit(mission)` |
| Então | `registerPage.alert` com o texto que a tela mostra |

## 3. Descoberta de tela

O cadastro já está coberto por `RegisterPage`. Não inventar locators. Textos observados no spec existente: título `Programar missão`, alerta `Já existe uma missão com este ID.`

## 4. Page Objects

Nenhum arquivo novo. Reutilizar `LoginPage`, `Navbar`, `DashPage`, `RegisterPage` já registrados em `app.mission`.

## 5. O teste (alinhado ao spec existente)

Título abaixo segue a regra desta skill para teste **novo** a partir do Gherkin. O arquivo atual ainda se chama `'não deve cadastrar com código duplicado'`; não renomeie o antigo ao automatizar outro cenário.

Credenciais: as mesmas já hardcoded em `register.spec.ts`. Não as copie para arquivos da skill.

```ts
import { test, expect } from '../../support'

import { Mission } from '../../support/types'
import { cleanAndInsertMission } from '../../support/db'

test.beforeEach(async ({ app }) => {
  await app.mission.loginPage.go()
  await app.mission.loginPage.login(email, password)
  await expect(app.mission.navbar.logout).toBeVisible({ timeout: 10_000 })
})

test('Não deve cadastrar com código duplicado', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-3001A',
    rocket: 'Starship',
    baseId: 'orion',
    departureDate: '2030-01-20',
    returnDate: '2030-01-27',
    price: 500.00
  }

  await cleanAndInsertMission(mission)

  // Act
  await app.mission.dashPage.addButton.click()
  await expect(app.mission.registerPage.title).toBeVisible()
  await app.mission.registerPage.submit(mission)

  // Assert
  await expect(app.mission.registerPage.alert).toHaveText('Já existe uma missão com este ID.')
})
```

## 6. O que observar

- Import de `../../support` e consumo de `{ app }`, sem `new RegisterPage(page)`.
- Massa por `cleanAndInsertMission`, não pela UI de cadastro prévio.
- ID exclusivo no formato `LP-0000A` e `baseId` como valor de option (`orion`), não o rótulo.
- Sem `afterEach` (os specs atuais não têm).
- Page Object existente permanece com `expect` interno em `submit`; o spec não duplica o preenchimento dos campos.
- "Já existe uma missão com este ID." é texto de tela; se o Gherkin não trouxer o texto, registre no resumo como observado.
- Execução: `npx playwright test playwright/e2e/mission-control/register.spec.ts --project=mission-control`.
