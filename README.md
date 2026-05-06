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
