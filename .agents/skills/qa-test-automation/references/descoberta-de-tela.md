# Descoberta de tela com o Playwright MCP (Lunar Pass)

O cenário diz **o que** acontece; a tela diz **como**. Antes de escrever o Page Object, percorra o caminho na aplicação e anote os elementos reais.

## Ambiente

- URL configurada nos projects: `http://localhost:3000`.
- Mission Control login: `/mission-control/login` (como em `login.page.ts`).
- Storefront home: `/` (como em `home.page.ts`).
- Não invente outra `baseURL` (há um TODO no project `storefront`; a URL em uso é a mesma).

## Procedimento

1. Confirme que a aplicação responde em `http://localhost:3000`. Se não responder, não invente a tela: siga só com Page Objects já existentes e entregue como "não executado".
2. Use **somente** o Playwright MCP da sessão (navegação, snapshot de acessibilidade, clique, digitação, abas). Confirme as ferramentas disponíveis antes de começar. Não use script, `curl` ou outro navegador para descobrir a tela.
3. Abra a página inicial do caminho do cenário.
4. Leia o **snapshot de acessibilidade** de cada tela (papel, nome acessível, estado).
5. Execute as ações do **Quando** para ver as telas seguintes e o resultado do **Então**.
6. Anote, por tela: caminho da URL, cada elemento usado e o locator segundo a ordem abaixo.
7. Feche a aba ao terminar.

## Cuidados

- A descoberta pode precisar de dados. Use a massa que o teste vai criar (`massa-de-teste.md`) e alinhe a limpeza ao spec da área, ou use dados de demonstração **sem alterá-los**.
- Não conclua compras, cadastros ou envios com dados reais só para explorar.
- Credenciais vêm dos testes existentes (`login.spec.ts` / `register.spec.ts`). Não invente usuários.
- `docs/aderencia.md` sugere atributos (`data-mission-code`, `data-testid` de datas, empty state, etc.). Só use se o snapshot **mostrar** esse atributo. Solicitação à aplicação não é locator.

## Ordem de locators (`docs/arquitetura.md`)

| Prioridade | Locator | Quando |
|---|---|---|
| 1 | `getByRole(papel, { name })` | Botões, links, títulos, diálogos, alertas, textbox, spinbutton |
| 2 | `getByLabel(rótulo)` | Campos associados a rótulo (`select` de base lunar, etc.) |
| 3 | `getByPlaceholder(texto)` | Campos identificados pelo texto de ajuda (login usa isso) |
| 4 | `getByTestId(id)` | Quando a semântica não basta (`mission-form-return-date` no cadastro) |

Evite XPath, subidas no DOM (`/..`) e classes CSS.

`getByText` não está na lista da arquitetura. Ver dúvida 6 em `SKILL.md`.

Exemplos **já usados** no repositório (não são lista fechada; a tela manda):

- `getByRole('heading', { name: 'Mission Control' })`
- `getByRole('button', { name: 'Entrar' })` / `{ name: 'Sair' }` / `{ name: 'Salvar missão' }`
- `getByRole('link', { name: 'Nova missão' })`
- `getByRole('alert')`
- `getByPlaceholder('Informe seu email')`
- `getByLabel('Base lunar')`
- `getByTestId('mission-form-return-date')`
- Toast: `getByRole('listitem')`

## Estados que a descoberta precisa revelar

- **Botões desabilitados:** o snapshot nem sempre mostra. Verifique o estado antes de planejar um clique.
- **Mensagens dinâmicas:** anote o texto de cada estado que o cenário usa.
- **Contraprova:** quando a asserção verifica um estado (desabilitado, vazio), confirme na tela que o estado oposto existe.
- **Storefront / listas:** identifique como localizar **a missão do teste** (código visível, link `href` de reserva, testid). Nunca planeje asserção por índice da lista.
