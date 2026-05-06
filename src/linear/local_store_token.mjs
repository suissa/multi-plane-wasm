import { LinearResource } from './linear_resource.mjs';
export class AppendToken extends LinearResource { constructor(){super('AppendToken');} }
export class PersistedEventToken extends LinearResource { constructor(){super('PersistedEventToken');} }
export class AckToken extends LinearResource { constructor(){super('AckToken');} }
export function append(token){ token.consume('append'); return new PersistedEventToken(); }
export function ack(persisted){ persisted.consume('ack'); return new AckToken(); }
