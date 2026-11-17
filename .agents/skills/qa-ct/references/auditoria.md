# Auditoria do projeto — `/qa-ct --audit`

Confira os itens na ordem. Para cada um: **como conferir**, **por quê**, **o que propor** e **o que fica com o usuário**. Mostre os diffs com segredos mascarados (`postgresql://***`) e só aplique depois da aprovação.

O **Por quê** de cada item vai para o diagnóstico que o usuário lê: na tabela (uma frase) e antes de cada diff (o raciocínio completo, em linguagem simples). Ninguém aprova um ajuste sem saber o problema que ele resolve.

Os itens **A1, A2, A3 e A5** são pré-requisitos do `/qa-ct --go`.

## A1 · `baseURL` vem de `BASE_URL`

**Como conferir:** `playwright.config.ts` usa `process.env.BASE_URL` no `baseURL` dos projects `mission-control` e `storefront`. Está em falta se o `baseURL` for um endereço fixo (`http://localhost:3000` ou a URL da Vercel).

**Por quê:** o endereço muda conforme o lugar onde a suíte roda: localhost na máquina, sandbox na Vercel, e o mesmo sandbox no CI. Com o endereço fixo, trocar de ambiente é editar o config, e cedo ou tarde essa edição vai parar num commit. Lido da variável, o mesmo código roda em qualquer ambiente sem mudar uma linha. O valor padrão `http://localhost:3000` mantém o `npx playwright test` funcionando para quem não criou o `.env`.

**Proposta:** uma constante no topo do config, usada nos dois projects, e remover o `TODO` do storefront.

```ts
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
```

```ts
use: {
  ...devices['Desktop Chrome'],
  baseURL,
},
```

Se o `baseURL` estava com a URL da Vercel, essa URL vai para o `.env` (A5).

## A2 · Nenhuma URL completa em `goto`

**Como conferir:** procure em `playwright/` por `goto('http` e por `localhost:3000`.

**Por quê:** um `page.goto` com endereço completo ignora o `baseURL`. O teste fica preso a um ambiente sem avisar ninguém: no CI ele tentaria abrir o localhost do runner (que não tem app nenhum) e falharia com `ERR_CONNECTION_REFUSED`, ou, no sentido contrário, uma execução "local" testaria a Vercel. Com o caminho relativo, o ambiente fica decidido num lugar só, o A1.

**Proposta:** trocar pelo caminho relativo, que o Playwright completa com o `baseURL`.

```ts
await this.page.goto(`/booking/${missionId}`)
```

Não mexa em asserções de URL (`toHaveURL`) além do necessário para o caminho relativo, e não mude o que o teste faz.

## A3 · Senha fora do `db.ts`

**Como conferir:** `playwright/support/db.ts` lê `process.env.DATABASE_URL`, e não há nenhuma string `postgresql://` no repositório (procure em todos os arquivos versionados).

**Por quê:** a string de conexão carrega a senha do banco. No código, ela vai para o Git e qualquer pessoa com acesso ao repositório (ou ao histórico dele) entra no banco com permissão total. No CI, o segredo só chega como variável de ambiente, vindo do GitHub Secrets, então o código precisa ler dali de qualquer jeito. A falha cedo (`throw` quando a variável falta) troca um timeout de conexão confuso, no meio de um teste, por uma mensagem clara já na primeira linha.

**Proposta:**

```ts
const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('Defina DATABASE_URL (veja .env.example).')
```

E usar `connectionString` no `Pool`, no lugar da string fixa. No diff, mostre a linha antiga como `connectionString: 'postgresql://***'`.

**Atenção (fica com o usuário):** a senha que já foi commitada está **queimada**, porque continua no histórico do Git mesmo depois da correção. Tirar do código protege o futuro, não o passado. O usuário precisa:

1. trocar a senha no Supabase (*Database → Settings → Reset database password*);
2. copiar a string do **Session pooler** (*Connect → Session pooler*), já com a senha nova;
3. colar no `.env` (A5) e, depois, no Secret do GitHub (`/qa-ct --go`).

Não reaproveite a string antiga e não peça a nova no chat.

## A4 · `.env` carregado pelo config

**Como conferir:** o topo do `playwright.config.ts` carrega o `.env` quando ele existe.

**Por quê:** sem isso, as variáveis do A1 e do A3 só chegam ao Playwright se o usuário exportar cada uma à mão em todo terminal novo, e o jeito de exportar muda entre Bash, PowerShell e CMD. Carregado pelo config, basta o arquivo existir. O `process.loadEnvFile()` é do próprio Node, sem instalar o `dotenv`. O `existsSync` é porque no CI não há `.env` (os valores vêm do workflow), e o `loadEnvFile()` dá erro quando o arquivo falta.

**Proposta:**

```ts
import { existsSync } from 'node:fs'

if (existsSync('.env')) process.loadEnvFile()
```

**Atenção:** ele exige **Node 20.12 ou mais novo**. Rode `node -v` e, se for mais antigo, peça ao usuário para atualizar o Node antes de aplicar. No CI o workflow usa Node 24.

## A5 · `.env` fora do Git e `.env.example` versionado

**Como conferir:** existe `.env.example` só com os nomes, o `.gitignore` tem `.env`, e o `.env` local tem `BASE_URL` e `DATABASE_URL`.

**Por quê:** o `.env` guarda a senha de verdade, então nunca pode ir para o Git: é o A3 de novo, por outra porta. O `.env.example` é o contrário: vai para o Git, sem valores, para quem clonar saber quais nomes preencher. O `.env` nasce com um texto de exemplo no lugar da senha porque a string antiga está queimada (A3) e a skill nunca escreve senha.

**Proposta:**

`.env.example` (versionado):

```env
BASE_URL=https://<projeto>.vercel.app
DATABASE_URL=postgresql://postgres.<ref>:<senha>@aws-0-<regiao>.pooler.supabase.com:5432/postgres
```

`.env` (local, fora do Git). Crie só se não existir:

```env
BASE_URL=<a URL do sandbox que estava no config, ou http://localhost:3000>
DATABASE_URL=COLE_AQUI_A_STRING_DO_SESSION_POOLER
```

`.gitignore`: acrescentar `.env`.

Se o `.env` já existir, não sobrescreva: só diga quais nomes faltam. Para saber se o `DATABASE_URL` já foi preenchido, confira sem mostrar o valor: se ainda é `COLE_AQUI_A_STRING_DO_SESSION_POOLER`, está pendente; se contém `@db.` e `.supabase.co`, é a conexão direta e precisa virar a do pooler (**Atenção**), porque o GitHub Actions não tem IPv6.

## A6 · Relatórios: terminal, pasta conhecida e resumo no GitHub

**Como conferir:** o `reporter` tem `list`, `html` em `reports/html`, `junit` em `reports/junit.xml` e `@estruyf/github-actions-reporter`, e o `package.json` tem `@estruyf/github-actions-reporter` em `devDependencies`, com a versão fixa.

**Por quê:** cada reporter tem uma função.
- `list`: com só `'html'`, o terminal (e o log do CI) mostra pouco. O `list` imprime cada teste com o resultado.
- `html` em `reports/html` com `open: 'never'`: o upload do pipeline procura um caminho fixo. O `open: 'never'` evita que, numa falha local, o Playwright abra o relatório e prenda o terminal num servidor.
- `junit`: é o formato padrão que ferramentas de CI e de gestão de testes leem. O pipeline o publica no artefato.
- `@estruyf/github-actions-reporter`: escreve o resumo dos testes na página do job do GitHub Actions (aba *Summary*). Quem abre o job vê os totais, uma seção por arquivo, os testes instáveis (*flaky*) marcados e o erro com link para a linha do teste, sem baixar o artefato. Ele é melhor que montar o resumo a partir do JUnit porque conhece as retentativas do Playwright: no JUnit, um teste que falhou e passou na retentativa vira só "passou". Rodando local, ele não faz nada. Não precisa de passo no workflow nem de permissão extra.
  - `useDetails: true`: cada arquivo vira uma seção recolhível, e o resumo continua legível com a suíte inteira.
  - `showError: true`: mostra a mensagem do erro e o link para a linha que falhou. Desligado, o resumo diz só que falhou.
  - **Versão fixa** (`-E`): é a única dependência que a skill acrescenta, e uma atualização sozinha não pode mudar o pipeline sem ninguém ver.
- `reports/` no `.gitignore`: é saída gerada a cada execução, não código.

**Proposta:**

```bash
yarn add -D -E @estruyf/github-actions-reporter@1.14.0
```

```ts
reporter: [
  ['list'],
  ['html', { outputFolder: 'reports/html', open: 'never' }],
  ['junit', { outputFile: 'reports/junit.xml' }],
  ['@estruyf/github-actions-reporter', { title: 'Regressão Lunar Pass', useDetails: true, showError: true }],
],
```

E acrescentar `reports/` no `.gitignore`.

O `yarn add` muda o `package.json` e o `yarn.lock`: os dois precisam ir no commit, porque o CI instala com `--frozen-lockfile` e falha se o lock não bater. Antes de propor, confira em `npm view @estruyf/github-actions-reporter version` se há versão nova; se houver, proponha a versão estável mais recente publicada há pelo menos duas semanas e diga qual escolheu.

Não ligue o `prComment` nem o `githubStorage`: eles pedem permissões de escrita no workflow, e o pipeline do curso não comenta em PR nem guarda anexos no repositório.

## A7 · Evidência em toda falha, sem vídeo

**Como conferir:** no `use` do config:

| Configuração | Estado |
|---|---|
| `trace: 'retain-on-failure'` | OK |
| `trace: 'on'` | OK (sugestão opcional: `retain-on-failure`) |
| `trace: 'on-first-retry'`, `'off'` ou ausente | Falta |
| `screenshot: 'only-on-failure'` | OK |
| `video` ausente ou `'off'` | OK |
| `video` com qualquer outro valor | Falta |

**Por quê:**
- **`trace`:** é a evidência principal. Tem a tela antes e depois de cada ação, o DOM, a rede, o console e a linha do teste. Com `on-first-retry` (o padrão do Playwright), ele só é gravado na retentativa, e localmente `retries` é 0: fora do CI, nunca existe. O `on` já resolve, porque grava sempre. O `retain-on-failure` grava do mesmo jeito, mas apaga o trace dos testes que passaram: o tempo de execução é o mesmo, e o ganho é a pasta `test-results/` só com o que falhou e um artefato do CI pequeno (o pipeline guarda 30 dias, todo dia).
- **`screenshot: 'only-on-failure'`:** uma imagem do estado final do teste vermelho, que aparece direto no relatório HTML sem abrir o trace. Custa quase nada.
- **`video: 'off'`:** o trace já tem a tela de cada ação, quadro a quadro. Com o vídeo ligado, o Playwright grava e codifica um vídeo de **todos** os testes (até no `retain-on-failure`, que só apaga depois), e isso custa tempo e disco para mostrar menos do que o trace mostra.

**Proposta:**

```ts
use: {
  /* Evidência só das falhas. Sem vídeo: o trace já tem a tela de cada ação. */
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'off',
},
```

Se acima do `trace` estiver o comentário do template do Playwright (`Collect trace when retrying the failed test…`), troque pelo comentário acima: ele descreve o `on-first-retry` e engana quem lê.

Com `trace: 'on'`, o item é **OK**: não proponha diff. Só cite na coluna *Por quê* que `retain-on-failure` deixa o artefato menor, e aplique só se o usuário pedir.

Não mexa em `retries`, `workers`, `timeout` nem `forbidOnly`: eles mudam o resultado da suíte, não a evidência. Isso é com a `qa-test-automation`.

## Depois de aplicar

1. `npx playwright test --list` precisa listar os testes sem erro (prova que o config e os imports carregam).
2. Se o `DATABASE_URL` do `.env` já está preenchido, ofereça rodar a suíte contra o sandbox e mostre o resultado real.
3. Próximo passo: **`/qa-ct --go`**.

## Fora do escopo da auditoria

- Teste instável, clique antes da hidratação, seletor frágil: é com a `qa-test-automation`, modo `corrigir`. Se aparecer na execução, registre como observação e encaminhe.
- Publicar ou republicar o sandbox na Vercel.
