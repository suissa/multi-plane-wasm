import assert from 'node:assert/strict';
import { AppendToken, append, ack } from '../src/linear/local_store_token.mjs';

const t = new AppendToken();
const persisted = append(t);
const acked = ack(persisted);
assert.ok(acked.id);
let failed = false;
try { append(t); } catch { failed = true; }
assert.equal(failed, true);
console.log('linear_token_system_core_test: ok');
