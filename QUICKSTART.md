# QUICKSTART

Este guia deixa o ambiente pronto com **um comando de setup** e executa o sistema com **um comando de run**.

## 1. Setup completo

```bash
./bin/plane setup
```

O `setup` executa, nesta ordem:

1. verifica ferramentas obrigatórias (`python3`, `curl`, `node`, `wat2wasm`, `nats-server`) e opcionais (`wasmtime`);
2. tenta instalar dependências obrigatórias ausentes quando o ambiente suporta `apt-get`/`sudo`;
3. cria diretórios operacionais (`planes-modules`, `dist`);
4. valida módulos WASM;
5. executa testes de contrato Node.js;
6. compila `.wat -> .wasm` e gera `dist/main.wasm` quando `wat2wasm` está disponível.

### Setup sem instalar nada

Use este modo em CI ou ambientes bloqueados:

```bash
./bin/plane setup --check-only
```

### Setup sem compilar

```bash
./bin/plane setup --skip-compile
```

### Setup tentando ferramentas opcionais

```bash
./bin/plane setup --install-optional
```

## 2. Run completo

```bash
./bin/plane run
```

O `run` executa, nesta ordem:

1. compila os módulos se ainda não existir nenhum `.wasm`;
2. inicia `nats-server` local se ele estiver instalado;
3. inicia o supervisor Python;
4. monitora módulos WASM e revive módulos que falharem.

### Run usando NATS externo

```bash
NATS_URL=nats://127.0.0.1:4222 ./bin/plane run --no-nats
```

### Run sem recompilar

```bash
./bin/plane run --skip-compile
```

### Run de teste com uma iteração

```bash
./bin/plane run --once
```

## 3. Comandos úteis

```bash
./bin/plane validate
./bin/plane compile
node scripts/linear_token_system_core_test.mjs
node scripts/sidecar_linear_dpop_test.mjs
node scripts/nats_linear_event_contract_test.mjs
```

## 4. Instalação manual alternativa

Se o setup não puder instalar automaticamente, instale manualmente:

- Python 3.11+
- Node.js 20+
- curl
- WABT (`wat2wasm`)
- Wasmtime
- NATS Server

Depois rode:

```bash
./bin/plane setup --skip-install
./bin/plane run
```
