# Multi Plane WASM (LEDSA PoC)

Framework experimental para executar agentes WASM isolados com comunicação por eventos, disciplina linear e sidecar de segurança.

## Comece aqui

Use o guia rápido:

```bash
./bin/plane setup
./bin/plane run
```

Detalhes completos em [`QUICKSTART.md`](QUICKSTART.md).

## Arquitetura por responsabilidade única

Cada módulo tem **uma responsabilidade** e usa **uma tecnologia dominante**:

- `bin/plane` (Python): package manager e orquestrador local.
- `runtime/` (Python): supervisor de módulos WASM e revive automático.
- `planes-modules/` (WAT/WASM): agentes independentes por arquivo único.
- `src/linear/` (Node.js): tipos lineares e transições de token.
- `src/sidecar/` (Node.js): proxy sidecar com DPoP linear + binding mTLS/PQ.
- `src/nats/` (Node.js): semântica linear sobre NATS.

## Funcionalidades

### Package manager

`bin/plane` fornece:

- `setup`: instala/verifica dependências, valida, testa e compila;
- `fetch <url-base>`: baixa módulos via `curl`;
- `validate`: valida regras de isolamento;
- `compile`: gera módulos `.wasm` e `dist/main.wasm`;
- `run`: compila se necessário, inicia NATS quando disponível e executa o supervisor.

### Runtime WASM

O supervisor descobre módulos `.wasm`, atribui endereços estáticos, monitora `heartbeat` e chama `revive` quando detecta falha.

### Linearidade

Eventos e tokens são tratados como capabilities consumíveis uma única vez. Isso evita double-processing local e reforça a semântica de ACK somente após persistência local.

### Sidecar seguro

A PoC modela:

- mTLS no canal;
- ML-KEM/Kyber via `pqSessionId` como binding de sessão;
- DPoP linear por mensagem;
- replay cache por `jti`.

## Documentação

- [`QUICKSTART.md`](QUICKSTART.md): setup e run em um comando cada.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): desenho geral e invariantes.
- [`docs/PLANE_CLI.md`](docs/PLANE_CLI.md): comandos do package manager.
- [`docs/WASM_MODULES.md`](docs/WASM_MODULES.md): padrão dos agentes WASM.
- [`docs/LINEAR_TYPES.md`](docs/LINEAR_TYPES.md): recursos lineares.
- [`docs/LINEAR_NATS.md`](docs/LINEAR_NATS.md): eventos lineares sobre NATS.
- [`docs/SIDECAR_SECURITY.md`](docs/SIDECAR_SECURITY.md): mTLS/PQ/DPoP linear.

## Testes rápidos

```bash
node scripts/linear_token_system_core_test.mjs
node scripts/sidecar_linear_dpop_test.mjs
node scripts/nats_linear_event_contract_test.mjs
./bin/plane validate
```
