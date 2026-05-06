# Plane CLI

`bin/plane` é o package manager e orquestrador local do projeto.

## `plane setup`

Instala/verifica dependências, valida módulos, executa testes e compila artefatos quando possível.

```bash
./bin/plane setup
```

Flags:

- `--check-only`: não instala dependências; apenas verifica e roda validações possíveis.
- `--skip-install`: não tenta instalar dependências ausentes.
- `--skip-compile`: pula a etapa de compilação WASM.

## `plane fetch <url-base>`

Baixa `modules.json` e os módulos descritos nele via `curl` para `planes-modules/`.

```bash
./bin/plane fetch https://example.com/planes-modules
```

## `plane validate`

Valida os módulos locais.

Regras atuais:

- deve existir ao menos um módulo;
- módulo WAT precisa declarar memória;
- imports não nativos são recusados.

## `plane compile`

Converte `.wat` para `.wasm` e gera `dist/main.wasm` com metadados dos módulos descobertos.

```bash
./bin/plane compile
```

## `plane run`

Executa tudo que é necessário para usar a PoC localmente:

1. compila módulos se necessário;
2. inicia `nats-server` local quando disponível;
3. executa o supervisor.

```bash
./bin/plane run
```

Flags:

- `--skip-compile`: assume que os `.wasm` já existem.
- `--no-nats`: não tenta iniciar NATS local.
- `--nats-port <porta>`: altera a porta local do NATS.
- `--tick <segundos>`: altera intervalo de supervisão.
