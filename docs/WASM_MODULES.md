# Módulos WASM

## Padrão de módulo

Cada agente deve ficar em uma pasta própria dentro de `planes-modules/`:

```text
planes-modules/<nome>/<nome>.wat
planes-modules/<nome>/<nome>.wasm
```

## Regras

- Um módulo = um agente.
- O módulo deve caber em um arquivo fonte principal.
- O módulo deve exportar memória.
- O módulo não deve importar outro módulo de negócio.
- Comunicação entre agentes deve ser feita por eventos, não por chamada direta.

## Exports recomendados

```text
on_event(kind: i32, value: i32) -> i32
heartbeat() -> i32
fail()
revive()
```

## Supervisor

O supervisor descobre `.wasm`, atribui endereço estático a cada módulo e mantém um mapa de estado por endereço.

Estados principais:

- `running`
- `down`
- `reviving`

Quando `heartbeat` indica falha, o supervisor chama `revive` e incrementa o contador de restarts.
