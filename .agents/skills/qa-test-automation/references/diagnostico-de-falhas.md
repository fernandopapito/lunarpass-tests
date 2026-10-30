# Diagnóstico de falhas (Lunar Pass)

Usado ao rodar um teste recém-criado (passo 7) e no modo `corrigir`.

## Como rodar o recorte certo

```bash
npx playwright test playwright/e2e/<modulo>/<arquivo>.spec.ts --project=<modulo>
```

`<modulo>` é `mission-control` ou `storefront`. Sem `--project`, a descoberta ainda usa `testDir` por project; prefira o project do módulo para não misturar.

Instabilidade: `--repeat-each=5 --workers=1` no mesmo arquivo e project. Em paralelo, o mesmo ID de missão colide (`duplicate key value violates unique constraint`); isso **não** é flake de UI.

## Onde olhar

1. Mensagem no terminal: linha, locator, esperado e recebido.
2. `error-context.md` em `test-results/`.
3. Screenshot na mesma pasta (`screenshot: 'only-on-failure'`).
4. Relatório HTML: `npx playwright show-report`.
5. Se ainda houver dúvida, reproduza o caminho com o Playwright MCP.

## Classifique a causa antes de mexer

| Causa | Sinais típicos | O que fazer |
|---|---|---|
| **Locator** | Elemento não encontrado; strict mode (mais de um); texto ou papel mudou | Corrija o locator no Page Object, pela ordem da arquitetura |
| **Sincronização** | Passa às vezes; age antes da tela carregar | Espere estado visível (logout, title, toast). Nunca `waitForTimeout` |
| **Dados** | `duplicate key`; missão sumiu; storefront viu missão de outro teste; ID repetido | Troque o ID; use `cleanMission` / `cleanAndInsertMission`; não asserte lista inteira |
| **Ambiente** | `localhost:3000` fora do ar; banco `getaddrinfo ENOTFOUND` / SSL / auth; `Executable doesn't exist` | Não altere teste, `baseURL` nem `db.ts`. Entregue como "não executado". Navegador ausente: `npx playwright install chromium`, com autorização do usuário |
| **Produto** | Tela diferente do **Então**, de forma consistente | Não altere a asserção. Reporte esperado e observado |

## Regras da correção

- Corrija só a causa identificada. Uma correção por vez, rodando de novo depois.
- **Nunca** altere asserção, valor esperado ou título para o teste passar.
- **Nunca** use `test.skip`, `retries` no teste ou comentários para esconder a falha. Não mude `retries` do `playwright.config.ts` (já é `2` em CI e `0` local).
- Se a causa não ficar clara, entregue o diagnóstico com evidências e hipóteses, sem alterar o código.
