# NATS com eventos lineares

## Ideia

NATS entrega mensagens em modelo at-least-once. A camada `LinearNatsBus` modela a disciplina para chegar em semântica exactly-once no domínio:

```text
publish -> claim -> append local -> ackSync
```

## Conceitos

- `eventId`: idempotência do evento, normalmente `entityId:revision`.
- `queueGroup`: grupo lógico de consumidores.
- `QueueInstance`: pendência de entrega por `eventId + queueGroup`.
- `DeliveryToken`: capability linear entregue ao consumidor que venceu o claim.
- `appendReceipt`: prova de persistência local exigida antes do ACK.

## Regras

- Dois consumidores do mesmo `queueGroup` não conseguem reclamar a mesma pendência.
- `ackSync` sem append local falha.
- Double ACK falha.
- Duplicatas devem virar no-op pelo event store/CRDT.

## Limite intencional

Esta camada não substitui JetStream real. Ela define e testa o contrato de runtime que uma integração NATS/JetStream deve obedecer.
