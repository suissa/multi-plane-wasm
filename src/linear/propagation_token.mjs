import { LinearResource } from './linear_resource.mjs';
export class DeliveryToken extends LinearResource { constructor(){super('DeliveryToken');} }
export class RetryToken extends LinearResource { constructor(){super('RetryToken');} }
export function retry(delivery){ delivery.consume('retry'); return new RetryToken(); }
