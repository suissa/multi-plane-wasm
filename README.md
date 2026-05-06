# Multi Plane WASM (LEDSA PoC)

Arquitetura separada por módulos de **responsabilidade única** e **uma tecnologia por módulo**.

## Módulos

- `src/linear/*` (Node.js): tipos lineares e transições de token.
- `src/sidecar/*` (Node.js): proxy sidecar com DPoP linear + binding de sessão mTLS/PQ.
- `src/nats/*` (Node.js): semântica linear sobre NATS (claim -> append -> ack).
- `runtime/*` (Python): supervisor de módulos WASM e revive automático.
- `planes-modules/*` (WAT/WASM): agentes independentes por arquivo único.

## Proxy sidecar: mTLS pós-quântico + DPoP linear

Decisão técnica da PoC:
- mTLS no canal entre sidecars;
- ML-KEM/Kyber modelado como `pqSessionId` (binding da sessão);
- DPoP linear por mensagem;
- replay cache estilo CRDT para rejeitar reuso de `jti`.

> Nesta máquina a criptografia executável usa Ed25519 (Node nativo).

## Package manager

`bin/plane`:
- `fetch <url-base>`
- `validate`
- `compile`
- `run`

## Testes

```bash
node scripts/linear_token_system_core_test.mjs
node scripts/sidecar_linear_dpop_test.mjs
node scripts/nats_linear_event_contract_test.mjs
```
# Multi Plane WASM

Framework de orquestração de módulos WASM orientado a eventos (NATS) com isolamento de memória por módulo e supervisor reativo estilo BEAM.

## Conceitos

- **Módulo = agent coreografado**: cada módulo vive em `planes-modules/<nome>/<nome>.wat` ou `<nome>.wasm`.
- **Arquivo único por módulo**: sem dependências externas, sem imports entre módulos.
- **Comunicação apenas por evento**: runtime publica e assina tópicos via NATS.
- **Sem contexto global compartilhado**: cada módulo recebe faixa de memória estática privada.
- **Recuperação automática**: supervisor detecta falha, marca estado no endereço estático e revive o módulo.
- **`main.wasm` agregador**: artefato que importa metadados dos módulos e inicia execução.

## Estrutura

```text
planes-modules/
  echo/
    echo.wat
runtime/
  supervisor.py
  linear_types.py
bin/
  plane
```

## Package Manager (`plane`)

Comandos:

- `plane fetch <url-base>`: baixa via `curl` os módulos para `planes-modules`.
- `plane validate`: valida regras do framework.
- `plane compile`: compila módulos (`wat -> wasm`) e gera `dist/main.wasm`.
- `plane run`: inicia supervisor + loop de eventos NATS.

### Requisitos

- Python 3.11+
- `curl`
- `wat2wasm` (WABT)
- `wasmtime` (opcional para execução real)
- NATS acessível (default `nats://127.0.0.1:4222`)

## Exemplo rápido

```bash
./bin/plane validate
./bin/plane compile
./bin/plane run --tick 0.5
```

## LinearAutoDestroy

O tipo `LinearAutoDestroy` está em `runtime/linear_types.py`.

- Escreve uma vez.
- Leitura única destrutiva.
- Depois de lido, o valor é apagado da memória e leituras seguintes falham.
- Não possui método público de destruição manual.

## Segurança de execução

O runtime recusa:

- módulo sem memória exportada;
- módulos que importem de outros módulos não nativos;
- módulos fora de arquivo único.

## Observação

Este projeto entrega um framework funcional de referência para o modelo solicitado, com simulação de supervisão de atores e reinicialização automática baseada em mapa estático de memória por módulo.
