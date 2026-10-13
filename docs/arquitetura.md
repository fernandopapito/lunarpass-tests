# Arquitetura e Estrutura de Testes — LunarPass

**Projeto:** LunarPass Test Automation  
**Stack Tecnológica:** Playwright, TypeScript, Kysely, PostgreSQL (Supabase)  
**Objetivo:** Estabelecer o padrão arquitetural, organização de pastas e boas práticas para automação de testes ponta a ponta (E2E).

---

## 1. Visão Geral e Princípios Arquiteturais

A arquitetura de testes do **LunarPass** foi projetada para garantir manutenibilidade, confiabilidade, velocidade e baixo acoplamento entre a camada de negócio e os seletores visuais da interface.

### Pilares Arquiteturais

1. **Fixtures First & Dependency Injection (DI):**  
   Eliminação de instanciações manuais de classes (`new LoginPage(page)`) diretamente nos testes. O runner do Playwright é estendido para injetar um fixture centralizado (`app`), fornecendo acesso tipado e sob demanda a todas as páginas e componentes.

2. **Page Component Object Model (PCOM):**  
   Evolução do tradicional *Page Object Model* (POM). As páginas são decompostas em componentes visuais reutilizáveis (como `Navbar` e `Toast`), impedindo duplicidade de mapeamento de elementos e ações compartilhadas entre telas.

3. **Data Management Híbrido (Database Direct Seeding):**  
   Controle de pré-condições e massa de dados diretamente no banco de dados via **Kysely**, aplicando operações atômicas de limpeza e inserção (`cleanMission`, `cleanAndInsertMission`). Isso reduz o tempo de preparação de cenários e evita testes lentos baseados em navegação desnecessária de UI.

4. **Locators Semânticos e Resilientes (A11y-driven):**  
   Adoção de localizadores orientados à acessibilidade (`getByRole`, `getByLabel`, `getByPlaceholder`). Evita-se o uso de classes CSS transitórias e caminhos relacionais de XPath (como `/..`), reduzindo a fragilidade dos testes perante alterações de design.

5. **Isolamento e Paralelismo Total:**  
   Cada teste é concebido como uma unidade atômica e independente. A massa de dados é gerenciada por cenário para viabilizar execução multi-worker paralela sem condições de corrida (*race conditions*).

---

## 2. Estrutura de Diretórios do Projeto

Organização do repositório baseada em separação de responsabilidades:

```plaintext
lunarpass-tests/
├── docs/                         # Documentações técnicas e guias do projeto
│   ├── aderencia.md              # Análise de aderência de seletores e acessibilidade
│   ├── arquitetura.md            # Este documento de arquitetura
│   └── storefront.md             # Regras de negócio e especificações funcionais
├── pages/                        # Abstração de telas (Page Objects)
│   ├── components/               # Componentes compartilhados entre telas
│   │   ├── navbar.ts             # Barra de navegação e controles de autenticação
│   │   └── toast.ts              # Feedback flutuante e notificações do sistema
│   ├── dash.page.ts              # Painel de controle e listagem de missões
│   ├── login.page.ts             # Formulário de autenticação (Mission Control)
│   └── register.page.ts          # Formulário de cadastro de missões
├── support/                      # Utilitários, conexões de dados e fixtures
│   ├── db.ts                     # Conexão com banco via Kysely e queries de apoio
│   ├── helpers.ts                # Funções utilitárias puras (datas, formatações)
│   ├── index.ts                  # Extensão do runner do Playwright e fixture { app }
│   └── types.ts                  # Tipagem e interfaces do modelo de domínio
├── tests/                        # Especificações de teste (*.spec.ts)
│   ├── home.spec.ts              # Validações da vitrine pública de missões
│   ├── login.spec.ts             # Validações de fluxos de autenticação
│   └── register.spec.ts          # Validações de cadastro e integridade de missões
├── package.json                  # Dependências, scripts e metadados do projeto
├── playwright.config.ts          # Configuração mestre de execução do Playwright
├── tsconfig.json                 # Configuração do compilador TypeScript
└── users.ts                      # Arquivo de apoio / sandbox de usuários
```

---

## 3. Detalhamento das Camadas

### 3.1. Camada de Fixtures e Injeção de Dependências (`support/index.ts`)

A inicialização e o ciclo de vida dos Page Objects são gerenciados através da extensão do objeto `test` nativo do Playwright:

```typescript
import { test as base, expect, Page } from '@playwright/test'

import { LoginPage } from '../pages/login.page'
import { DashPage } from '../pages/dash.page'
import { RegisterPage } from '../pages/register.page'
import { Navbar } from '../pages/components/navbar'
import { Toast } from '../pages/components/toast'

const createApp = (page: Page) => ({
  loginPage: new LoginPage(page),
  dashPage: new DashPage(page),
  registerPage: new RegisterPage(page),
  navbar: new Navbar(page),
  toast: new Toast(page),
})

type App = ReturnType<typeof createApp>

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    await use(createApp(page))
  },
})

export { expect }
```

**Benefícios:**
- Os testes importam `test` e `expect` diretamente de `../support`.
- O parâmetro `{ app }` disponibiliza todas as instâncias prontas para uso, com auto-complete total no TypeScript.

---

### 3.2. Camada de Abstração de Interface (PCOM) (`pages/`)

* **Páginas:** Representam uma tela ou rota específica, contendo os locators e ações daquele contexto (ex.: `login.page.ts` com `go()` e `login()`).
* **Componentes:** Representam partes modulares e repetíveis da interface (ex.: `navbar.ts` com o botão `logout`, `toast.ts` com o elemento `message`).

#### Diretriz de Seletores (Selector Strategy)

1. **`page.getByRole()`**: Primeira escolha para botões, links, títulos, diálogos e alertas.
2. **`page.getByLabel()`**: Preferencial para inputs associados a rótulos.
3. **`page.getByPlaceholder()`**: Usado para campos de entrada de texto com dicas descritivas.
4. **`page.getByTestId()`**: Utilizado quando a semântica de acessibilidade não for suficiente.
5. **Seletores a Evitar**: XPath absoluto, subidas no DOM (`/..`) e dependência exclusiva de classes de estilização (CSS).

---

### 3.3. Camada de Suporte e Banco de Dados (`support/db.ts`)

O acesso direto ao banco PostgreSQL é feito utilizando **Kysely** com **pg Pool**:
- **Setup e Teardown Ágeis:** Métodos como `cleanMission(mission)` removem registros de bilhetes (`tickets`), reservas (`reservations`) e missões (`missions`) em cascata.
- **Inserção Direta:** O método `cleanAndInsertMission(mission)` garante massa de dados pré-existente sem necessidade de automação de UI para cadastro prévio.
- **CamelCasePlugin:** Padroniza a nomenclatura entre o banco relacional e as interfaces em TypeScript.

---

### 3.4. Camada de Especificação de Testes (`tests/`)

Os cenários são implementados seguindo a estrutura **Arrange-Act-Assert (AAA)**:

1. **Arrange:** Preparação do banco de dados via Kysely e navegação inicial (frequentemente em `test.beforeEach`).
2. **Act:** Realização de interações do usuário através do fixture `app`.
3. **Assert:** Validações de expectativas com asserções web-first do Playwright (`toBeVisible()`, `toHaveText()`, `toContainText()`).

---

## 4. Configuração de Execução (`playwright.config.ts`)

A suíte está configurada com:
- **`fullyParallel: true`**: Execução paralela por arquivo e por cenário.
- **`trace: 'on-first-retry'`**: Coleta de traces completa do Playwright apenas em tentativas de reexecução para investigar causas raiz de falhas.
- **`screenshot: 'only-on-failure'`**: Captura automática de evidências visuais no momento exato da quebra de um teste.
- **`reporter: 'html'`**: Geração de relatório visual completo ao término das execuções.

---

## 5. Recomendações e Próximos Passos de Evolução

> [!NOTE]
> **Aviso de Priorização:** As recomendações descritas abaixo representam oportunidades de evolução técnica e melhorias mapeadas para a maturidade do projeto, porém **não serão priorizadas neste momento**. O foco atual permanece na expansão da cobertura e estabilização dos cenários existentes.

1. **Gestão de Variáveis de Ambiente (`.env`):**  
   Extrair a string de conexão com o banco de dados e URLs base para arquivos `.env`, evitando credenciais codificadas diretamente em arquivos do repositório.

2. **Reaproveitamento de Sessão de Autenticação (`storageState`):**  
   Implementar um mecanismo de *setup* de autenticação global para persistir o estado do login (cookies/localStorage) em arquivo JSON, permitindo que os testes que exigem autenticação iniciem já autenticados sem refazer o login pela UI a cada teste.

3. **Fábrica de Dados Dedicada (Data Factories):**  
   Estruturar geradores de dados com `@faker-js/faker` encapsulados em módulos de *factory*, padronizando a geração de identificadores de missão (`LP-0000`), datas válidas e valores monetários.

4. **Tratamento de Fechamento de Pool no Teardown:**  
   Adicionar um hook de encerramento (`db.destroy()`) no encerramento da suíte para garantir liberação imediata das conexões do pool do PostgreSQL.
