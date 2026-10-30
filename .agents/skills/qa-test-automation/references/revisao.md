# Revisão antes de entregar (Lunar Pass)

Passe por todos os itens. Corrija o que falhar e só então entregue.

## Fidelidade ao cenário

- [ ] O título de cada teste **novo** é o nome do cenário (ou cenário + linha de Exemplos).
- [ ] Testes antigos não foram renomeados.
- [ ] Existe uma asserção para cada **Então** e cada **E**, e nenhuma além delas.
- [ ] Nenhum passo, regra ou resultado foi inventado.
- [ ] Textos observados na tela e não definidos na especificação estão no resumo.

## Arquitetura Lunar Pass

- [ ] Spec em `playwright/e2e/<modulo>/` e import de `{ test, expect }` de `../../support`.
- [ ] Page Objects novos em `playwright/support/pages/<modulo>/` (ou `shared/` só se dois módulos usam).
- [ ] Page Object novo registrado em `createApp` no grupo certo (`mission`, `store` ou `toast`).
- [ ] Nenhum `new XxxPage(page)` no spec.
- [ ] Nenhum teste ou Page Object existente foi refatorado sem pedido.
- [ ] Estilo (indentação, locators no construtor vs inline, `goto` absoluto vs relativo, `expect` no PO) copiado do vizinho, sem unificar o repo.
- [ ] `playwright.config.ts`, connection string e dependências não foram alterados (salvo pedido explícito de **módulo novo**, seção 5 da arquitetura).

## Locators e esperas

- [ ] Ordem: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId`.
- [ ] Não há XPath, subida no DOM nem classe CSS.
- [ ] Locators não foram copiados de solicitações de `docs/aderencia.md` que a tela não mostra.
- [ ] Não há `waitForTimeout`.
- [ ] Cada asserção de estado teve contraprova na tela.

## Dados

- [ ] ID de missão exclusivo, inexistente em outros specs.
- [ ] Massa via funções atuais de `db.ts`, no estilo do spec da área.
- [ ] Sem `afterEach` novo, a menos que o usuário tenha pedido.
- [ ] Storefront sem contagem total e sem posição.
- [ ] Connection string e senhas não foram copiadas para a skill nem para o resumo.

## Execução

- [ ] Rodou com `--project` do módulo, e o resultado no resumo é o que aconteceu.
- [ ] Rodou mais de uma vez em série (`--repeat-each=3 --workers=1`), sem variar o resultado.
- [ ] Falhas de produto reportadas com esperado e observado, sem asserção alterada.
- [ ] Nenhum `test.only`, `test.skip` ou asserção comentada ficou no código.
