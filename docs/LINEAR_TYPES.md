# Tipos lineares

## LinearResource

`LinearResource` é a base Node.js para recursos que só podem ser consumidos uma vez.

Características:

- id único;
- flag privada de consumo;
- `consume(operation)` falha em segundo uso;
- trace de debug com operação e timestamp.

## Fluxo de storage local

```text
AppendToken -> append -> PersistedEventToken -> ack -> AckToken
```

## Fluxo de propagação

```text
DeliveryToken -> retry -> RetryToken
```

## LinearAutoDestroy

O runtime Python também possui `LinearAutoDestroy`, um valor write-once/read-once que apaga a célula automaticamente no primeiro acesso de leitura.
