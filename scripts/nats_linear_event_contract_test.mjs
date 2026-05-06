import assert from 'node:assert/strict';
import { LinearNatsBus } from '../src/nats/linear_nats_bus.mjs';

const bus = new LinearNatsBus();
assert.equal(bus.publish('entity.user.changed','u1:1',{a:1},'read-model-workers'), true);
const claimed = bus.claim('u1:1','read-model-workers');
assert.ok(claimed.token);
let second=false; try { bus.claim('u1:1','read-model-workers'); } catch { second=true; }
assert.equal(second,true);
assert.equal(bus.ackSync('u1:1',{ok:true}), true);
console.log('nats_linear_event_contract_test: ok');
