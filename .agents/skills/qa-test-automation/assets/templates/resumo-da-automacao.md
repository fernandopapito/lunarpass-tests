# Resumo da automação

- **Módulo:** [mission-control | storefront]
- **Cenário(s):** [nome]
- **Spec:** `playwright/e2e/<modulo>/<arquivo>.spec.ts`
- **Page Objects:** [caminhos criados ou apenas reutilizados]
- **Fixture:** [ex.: `app.mission.registerPage` / nenhuma alteração]
- **Massa:** [funções de `db.ts` e ID(s) de missão]
- **Comando:** `npx playwright test playwright/e2e/<modulo>/<arquivo>.spec.ts --project=<modulo>`
- **Resultado da execução:** [passou | falhou (produto) | falhou (automação, já corrigida) | não executado]
- **Vezes em série:** `--repeat-each=3 --workers=1` — [estável | instável | não rodou]

## Observações

- Textos de tela não definidos no Gherkin:
- Locators sem role/label/placeholder/testid:
- Dúvidas em aberto (ver `SKILL.md`):

## Falha de produto (se houver)

- Esperado (Então):
- Observado:
- Evidência (`test-results/` ou relatório):

## O que não foi feito

- [config, credenciais, refatoração, afterEach, módulo novo, etc.]
