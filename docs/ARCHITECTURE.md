# Arquitetura Multi Plane WASM / LEDSA

## Regra principal

Cada módulo tem **uma responsabilidade** e usa **uma tecnologia dominante**:

| Área | Caminho | Tecnologia | Responsabilidade |
| --- | --- | --- | --- |
| Plane CLI | `bin/plane` | Python | Setup, fetch, validate, compile e run |
| Runtime | `runtime/` | Python | Supervisão de módulos WASM |
| Agentes | `planes-modules/` | WAT/WASM | Comportamento isolado de cada agente |
| Linearidade | `src/linear/` | Node.js | Tokens consumíveis uma única vez |
| NATS linear | `src/nats/` | Node.js | Claim/ack com semântica exactly-once |
| Sidecar | `src/sidecar/` | Node.js | DPoP linear + binding de sessão PQ/mTLS |

## Fluxo de execução

```text
plane setup
  -> verifica ferramentas
  -> valida módulos
  -> roda testes de contrato
  -> compila WAT/WASM

plane run
  -> garante artefatos .wasm
  -> inicia NATS local quando disponível
  -> inicia supervisor
  -> supervisor monitora heartbeat/revive
```

## Invariantes

- Um módulo WASM não chama funções de outro módulo.
- Comunicação entre agentes passa por eventos.
- Um evento é tratado como capability linear.
- ACK só é permitido após append local.
- Token DPoP não pode ser consumido duas vezes.
- Replay serializado é rejeitado por `jti`.
