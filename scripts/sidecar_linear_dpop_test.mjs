import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createLinearDpopToken, verifyAndConsume, ReplayCacheCrdt } from '../src/sidecar/linear_dpop_sidecar.mjs';

const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
const prv = privateKey.export({type:'pkcs8', format:'pem'});
const pub = publicKey.export({type:'spki', format:'pem'});
const msg = {x:1};
const token = createLinearDpopToken({privateKeyPem:prv, iss:'agent-a', aud:'agent-b', method:'POST', uri:'/events', message:msg, pqSessionId:'s1'});
const proof = verifyAndConsume({token, trustedPublicKeyPem:pub, expected:{aud:'agent-b', method:'POST', uri:'/events', message:msg, pqSessionId:'s1'}});
assert.equal(proof.kind, 'AcceptedProof');
let twice=false; try { token.consume(); } catch { twice=true; }
assert.equal(twice,true);
const cache = new ReplayCacheCrdt();
assert.equal(cache.claim(proof.jti), true);
assert.equal(cache.claim(proof.jti), false);
console.log('sidecar_linear_dpop_test: ok');
