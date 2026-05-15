import { DeliveryToken } from '../linear/propagation_token.mjs';

export class LinearNatsBus {
  constructor(){ this.pending = new Map(); this.processed = new Set(); }
  publish(subject, eventId, payload, queueGroup){
    const key = `${eventId}:${queueGroup}`;
    if(this.pending.has(key)) return false;
    this.pending.set(key, { subject, eventId, payload, queueGroup });
    return true;
  }
  claim(eventId, queueGroup){
    const key = `${eventId}:${queueGroup}`;
    const msg = this.pending.get(key);
    if(!msg) throw new Error('no queue instance');
    this.pending.delete(key);
    return { msg, token: new DeliveryToken() };
  }
  ackSync(eventId, appendReceipt){
    if(!appendReceipt?.ok) throw new Error('ack before append');
    if(this.processed.has(eventId)) throw new Error('double ack');
    this.processed.add(eventId);
    return true;
  }
}
