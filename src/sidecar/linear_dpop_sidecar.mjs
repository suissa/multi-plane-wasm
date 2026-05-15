import crypto from 'node:crypto';

export function canonicalHash(message){
  return crypto.createHash('sha256').update(JSON.stringify(message)).digest('hex');
}

export function createLinearDpopToken({privateKeyPem, iss, aud, method, uri, message, pqSessionId}){
  const payload = {
    jti: crypto.randomUUID(), iat: Math.floor(Date.now()/1000), iss, aud, htm: method, htu: uri,
    mhash: canonicalHash(message), pqSessionId
  };
  const data = Buffer.from(JSON.stringify(payload));
  const sig = crypto.sign(null, data, privateKeyPem).toString('base64');
  let consumed = false;
  return { payload, sig, consume(){ if(consumed) throw new Error('token already consumed'); consumed=true; } };
}

export function verifyAndConsume({token, trustedPublicKeyPem, expected}){
  const data = Buffer.from(JSON.stringify(token.payload));
  const okSig = crypto.verify(null, data, trustedPublicKeyPem, Buffer.from(token.sig,'base64'));
  if(!okSig) throw new Error('invalid signature');
  const same = token.payload.aud===expected.aud && token.payload.htm===expected.method && token.payload.htu===expected.uri && token.payload.mhash===canonicalHash(expected.message) && token.payload.pqSessionId===expected.pqSessionId;
  if(!same) throw new Error('binding mismatch');
  token.consume();
  return { kind:'AcceptedProof', jti: token.payload.jti };
}

export class ReplayCacheCrdt {
  constructor(){ this.seen = new Set(); }
  claim(jti){ if(this.seen.has(jti)) return false; this.seen.add(jti); return true; }
}
