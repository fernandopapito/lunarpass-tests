# Resumo do pipeline

- **Modo:** [`/qa-ct --go` (criar | ajustar) | diagnóstico]
- **Arquivo:** `.github/workflows/tests.yml`
- **Alvo:** sandbox na Vercel (`BASE_URL`)
- **Gerenciador e Playwright:** Yarn 1 · `@playwright/test` [versão do yarn.lock]
- **Agendamento:** [ex.: todo dia às 07:00 de Brasília · `0 10 * * *` UTC]

| Job | Roda em | O que faz |
|---|---|---|
| `validate` | push e PR | lista os testes, sem navegador e sem segredos |
| `check-env` | agendado e manual | confere variáveis, recusa a conexão direta do Supabase e testa o sandbox |
| `regression` | agendado e manual | suíte inteira contra o sandbox; resumo dos testes na página do job; artefato `playwright-regression-<n>` sempre |

## Cadastrar em Settings → Secrets and variables → Actions

| Nome | Tipo | Valor |
|---|---|---|
| `BASE_URL` | Variable | URL do sandbox na Vercel |
| `DATABASE_URL` | Secret | string do Session pooler do Supabase, com a senha atual |

## Primeira execução

1. Commit e push (roda só o `validate`).
2. Aba *Actions* → **Testes contínuos** → **Run workflow**.
3. No fim, leia o resumo dos testes na página do job. Para investigar uma falha, baixe o artefato `playwright-regression-<n>` e abra `reports/html/index.html` ou o trace.

- **Resultado:** [passou | falhou (produto) | falhou (infra, já corrigida) | não executado]

## Observações

- Pré-requisitos conferidos: [BASE_URL no config · DATABASE_URL no db.ts · .env no .gitignore · reporter]
- Caminhos dos relatórios: [reports/html e reports/junit.xml | outro]
- Resumo dos testes na página do job: [reporter @estruyf/github-actions-reporter no config | sem o reporter: rode o A6 do `/qa-ct --audit`]

## O que não foi feito

- [testes, config, retries, segredos, deploy, gate de PR, etc.]
