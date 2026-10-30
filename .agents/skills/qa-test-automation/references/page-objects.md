# Page Objects (Lunar Pass)

Um Page Object representa uma tela ou componente e expõe o que o usuário faz nela. O teste lê pela fixture `app`.

## Onde vive

| Tipo | Pasta | Exemplos reais |
|---|---|---|
| Mission Control | `playwright/support/pages/mission-control/` | `login.page.ts`, `dash.page.ts`, `register.page.ts`, `navbar.ts` |
| Storefront | `playwright/support/pages/storefront/` | `home.page.ts` |
| Compartilhado entre módulos | `playwright/support/pages/shared/` | `toast.ts` |

Regra de `shared/`: só se **mais de um módulo** consome o elemento. Navbar não é shared.

Imports internos: tipos e helpers de `playwright/support/` (`../../types`, `../../helpers`), nunca da raiz.

## Registro na fixture

Arquivo: `playwright/support/index.ts`. Padrão real:

```ts
const createApp = (page: Page) => ({
  mission: {
    loginPage: new LoginPage(page),
    dashPage: new DashPage(page),
    registerPage: new RegisterPage(page),
    navbar: new Navbar(page),
  },
  store: {
    homePage: new HomePage(page),
  },
  toast: new Toast(page),
})
```

Page Object novo de Mission Control entra em `mission`. De Storefront, em `store`. Toast compartilhado permanece em `app.toast`. Não instancie Page Object no spec.

## Estilo — copie o vizinho

Os Page Objects atuais **não são uniformes**. Arquivo novo deve parecer com o da mesma pasta, não com um modelo genérico.

Padrões observados:

- Classe exportada, construtor com `page: Page`.
- Alguns locators `readonly` no construtor (`alert`, `title`, `addButton`, `logout`, `slogan`, `message`).
- Campos de formulário em `login` e `register` ficam **inline no método**, não como propriedades.
- `LoginPage.go` e `RegisterPage.submit` usam `expect` (sincronização). `DashPage`, `Navbar`, `Toast`, `HomePage` não usam.
- `goto` hoje com URL absoluta (`http://localhost:3000/...`). Ver dúvida 1 em `SKILL.md`.
- Sem dados de teste nem credenciais no Page Object (`login` recebe email/senha por parâmetro).
- Sem `waitForTimeout`.
- `RegisterPage.submit` recebe `Mission` e usa `formatDate` para a data de volta.

## Regras para o que você cria

1. **Um arquivo por tela** (`FooPage` em `foo.page.ts`) ou componente (`Navbar` em `navbar.ts`).
2. Locators na ordem de `descoberta-de-tela.md`.
3. Elemento que depende de dado vira método que devolve `Locator` (ex.: item da missão pelo código), se a tela permitir identificar assim.
4. Métodos são ações: `go()`, `login(email, password)`, `submit(mission)`.
5. Sem dados de teste hardcoded.
6. Sem espera fixa.
7. Não refatore Page Object existente. Ao completar: acrescente locators/métodos sem mudar o comportamento dos que existem; se precisar mudar o que já existe, pergunte.

## Reutilizar ou criar?

| Situação | Decisão |
|---|---|
| A tela já tem Page Object | Reutilize e complete |
| O elemento é usado por mission-control e storefront | `pages/shared/` e, se ainda não estiver, `app.toast`-like na raiz de `createApp` |
| O elemento aparece em várias telas de um módulo (ex.: navbar) | Componente na pasta do módulo |
| Tela nova do módulo existente | Arquivo novo na pasta do módulo + entrada no grupo já existente de `createApp` |
| Módulo novo | Só com pedido explícito; roteiro em `docs/arquitetura.md` seção 5 |
