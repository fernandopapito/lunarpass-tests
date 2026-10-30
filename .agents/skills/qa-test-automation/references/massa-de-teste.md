# Massa de teste (Lunar Pass)

A massa é **híbrida, direto no PostgreSQL via Kysely** (`playwright/support/db.ts`). Não prepare estado navegando a UI quando a função de banco já cobre o **Dado**.

## Funções existentes

| Função | Uso observado |
|---|---|
| `cleanMission(mission)` | Apaga reservas, tickets e a missão pelo `mission.id`. Usado antes de cadastrar missão nova em `register.spec.ts`. |
| `cleanAndInsertMission(mission)` | Limpa e insere. Usado no cenário de código duplicado. |
| `insertMission(mission)` | Insert puro. |
| `deleteMission(id)` | Delete da missão. |
| `deleteReservation(missionId)` | Delete de reservas da missão. |
| `deleteTicket(missionId)` | Delete de tickets da missão. |

Não há função de insert de reserva ou ticket no arquivo atual. Não invente.

## Tipo `Mission` (`playwright/support/types.ts`)

Campos usados nos specs: `id`, `rocket`, `baseId`, `departureDate`, `returnDate`, `price`.

`baseId` nos testes existentes: `'aurora'`, `'orion'` (valores de option, não o rótulo "Aurora").

Datas no objeto: `AAAA-MM-DD`. Exibição na tela de cadastro via `formatDate` (`helpers.ts`).

`Reservation` e `Ticket` só têm `missionId`. Se o cenário precisar de assento ocupado, passagem emitida ou outros campos, **pergunte** — a estrutura de tabelas não está descrita além desses tipos.

## Isolamento

1. **ID exclusivo por cenário.** Formato já usado: `LP-` + quatro dígitos + letra (`LP-0128A`, `LP-3001A`). Procure no repositório antes de escolher. Colisão em paralelo gera `duplicate key`.
2. **Estado conhecido antes de agir:** `cleanMission` ou `cleanAndInsertMission`, como o spec da área.
3. **Specs atuais não usam `afterEach`.** Não introduza sem pedido (dúvida 5 em `SKILL.md`).
4. Dados válidos para regras que não estão em teste: datas futuras, preço positivo, `baseId` que a tela aceita.
5. **Storefront:** nunca `toHaveCount` da lista inteira nem `nth()`. Localize a missão do teste.
6. **Não altere** missões que o teste não criou nem o usuário de demonstração.

## Credenciais e conexão

- Connection string está em `db.ts`. **Não altere. Não copie para a skill, resumo ou novos arquivos.**
- Login de Mission Control: o mesmo email já usado em `login.spec.ts` e `register.spec.ts`. Não cadastre usuário pela UI nem pelo banco (não há função para isso).

## Quando falta uma função de massa

1. Confirme no código existente (`db.ts`, `types.ts`, specs) quais tabelas e campos existem. Não invente.
2. Se a lacuna for só uma composição das funções atuais (ex.: `cleanMission` + `insertMission`), use as funções atuais.
3. Se precisar de campo ou tabela novos, pergunte.
4. Nunca altere o `Pool`, SSL, host ou a connection string.

## Faker

`@faker-js/faker` já é usado em `register.spec.ts` para gerar código **inválido** (fora do formato `LP-0000`). Não crie factories. Não use faker para IDs de missão válidos — IDs válidos nos testes atuais são literais exclusivos.
