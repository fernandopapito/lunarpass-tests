---
name: playwright-navigation
description: >-
  Navegar, interagir e inspecionar páginas web utilizando as ferramentas do Playwright MCP.
  Use esta skill sempre que o usuário solicitar acesso a páginas web, exploração no navegador,
  cliques em elementos, preenchimento de formulários, captura de snapshots de acessibilidade
  e screenshots via Playwright MCP.
---

# Navegação Web com Playwright MCP

Esta skill orienta a interação automatizada e navegação no navegador web utilizando o servidor **Playwright MCP** configurado no projeto (`.agents/mcp_config.json`).

## Visão Geral das Ferramentas MCP

As ferramentas de navegação disponíveis através do Playwright MCP operam prioritariamente sobre a **árvore de acessibilidade**, proporcionando interações determinísticas, rápidas e estruturadas:

| Ferramenta | Descrição |
| :--- | :--- |
| `browser_navigate` | Abre ou redireciona a página para uma URL específica. |
| `browser_snapshot` | Captura o estado atual da página e a árvore de acessibilidade (essencial para obter IDs e seletores dos elementos). |
| `browser_find` | Pesquisa elementos específicos ou textos na árvore de acessibilidade da página. |
| `browser_click` | Clica em um elemento específico (identificado pelo snapshot). |
| `browser_hover` | Move o cursor sobre um elemento (útil para menus suspensos e tooltips). |
| `browser_type` | Digita texto em campos de entrada de formulários. |
| `browser_fill_form` | Preenche múltiplos campos de formulário de forma consolidada. |
| `browser_press_key` | Dispara teclas do teclado (ex: `Enter`, `Tab`, `Escape`). |
| `browser_wait_for` | Aguarda texto, elemento ou tempo de espera antes de continuar. |
| `browser_take_screenshot` | Captura uma imagem da tela atual para validação visual ou relatórios. |
| `browser_tabs` | Lista, alterna ou gerencia abas abertas no navegador. |
| `browser_close` | Fecha a aba ou encerra a sessão do navegador. |

---

## Fluxo de Trabalho Recomendado

Para realizar tarefas de navegação e inspeção de forma confiável, siga este procedimento:

### 1. Inicializar e Navegar
Abra a URL desejada utilizando `browser_navigate`:
- Certifique-se de usar a URL completa (ex: `http://localhost:3000/` ou `https://exemplo.com`).

### 2. Mapear Elementos com Snapshot
Sempre execute `browser_snapshot` logo após a navegação ou após qualquer ação que altere o DOM:
- O snapshot retorna a árvore de acessibilidade com as referências, papéis (roles) e nomes acessíveis dos elementos.
- Use o snapshot para identificar os seletores e referências corretos dos botões, inputs e links antes de interagir.

### 3. Interagir com a Página
Utilize as ações adequadas para cada objetivo:
- **Preenchimento**: Use `browser_type` ou `browser_fill_form` nos inputs localizados.
- **Ações de clique**: Use `browser_click` passando a referência correta obtida no snapshot.
- **Teclado**: Use `browser_press_key` quando necessário enviar atalhos ou submeter formulários via `Enter`.

### 4. Sincronização e Espera
Após ações que disparam carregamento assíncrono (como submissão de formulários, chamadas de API ou transições de página):
- Utilize `browser_wait_for` para aguardar que um elemento ou texto esperado fique visível na tela.
- Gere um novo `browser_snapshot` para atualizar as referências dos novos elementos renderizados.

### 5. Validação e Registro Visual
- Quando necessário validar a interface ou gerar evidências para o usuário, chame `browser_take_screenshot`.
- Inspecione a presença de mensagens de sucesso, erro ou mudanças de URL.

### 6. Encerramento
- Ao concluir as operações de navegação, invoque `browser_close` para liberar recursos do sistema.

---

## Boas Práticas

1. **Acessibilidade Primeiro**: Sempre baseie suas interações nas referências obtidas via `browser_snapshot`. Evite "chutar" seletores CSS ou XPath.
2. **Re-snapshot após Navegação**: Se a página sofrer redirecionamento ou atualização dinâmica, os IDs dos elementos mudam. Sempre capture novo snapshot antes de clicar no próximo elemento.
3. **Manejo de Diálogos**: Se a página exibir alertas ou confirmações nativas, utilize `browser_handle_dialog` para aceitar ou recusar.
4. **Isolamento de Erros**: Se um clique falhar ou elemento não for encontrado, execute `browser_find` ou `browser_snapshot` para inspecionar se a página está no estado esperado.
