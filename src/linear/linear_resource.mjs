import crypto from 'node:crypto';
export class LinearResource {
  #consumed = false;
  #trace = [];
  constructor(kind) { this.kind = kind; this.id = crypto.randomUUID(); }
  consume(operation) {
    if (this.#consumed) throw new Error(`${this.kind}:${this.id} already consumed`);
    this.#consumed = true;
    this.#trace.push({ operation, at: new Date().toISOString() });
  }
  get trace() { return [...this.#trace]; }
}
