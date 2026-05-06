# Proxy Sidecar: mTLS pós-quântico + DPoP linear

## Decisão técnica

O sidecar protege trocas entre agentes combinando:

- mTLS para autenticação do canal;
- ML-KEM/Kyber como acordo de chave pós-quântico/híbrido;
- DPoP linear para provar posse por mensagem;
- replay cache por `jti` para impedir reuso serializado.

Nesta PoC, a assinatura executável usa Ed25519 via Node.js, e `pqSessionId` representa o transcript/binding da sessão mTLS híbrida.

## Fluxo

```text
Agent A -> Sidecar A
  cria mensagem
  cria DPoP linear ligado a method/uri/hash/pqSessionId

Sidecar A -> Sidecar B
  envia mensagem + token sobre canal protegido

Sidecar B
  verifica assinatura
  verifica binding
  consome token linear
  checa replay cache
  libera mensagem
```

## Garantias da PoC

- Mensagem alterada muda o hash e falha.
- Sessão PQ/mTLS errada falha por `pqSessionId`.
- O mesmo objeto token não pode ser consumido duas vezes.
- O mesmo `jti` serializado é recusado pelo replay cache.

## Referências

- NIST FIPS 203 ML-KEM: https://csrc.nist.gov/pubs/fips/203/final
- RFC 9449 DPoP: https://www.rfc-editor.org/rfc/rfc9449
- TLS hybrid ECDHE + ML-KEM draft: https://datatracker.ietf.org/doc/html/draft-ietf-tls-ecdhe-mlkem-03
