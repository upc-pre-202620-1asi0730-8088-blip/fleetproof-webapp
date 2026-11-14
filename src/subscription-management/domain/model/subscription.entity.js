import { planCatalog } from './plan-catalog.js';

export class Subscription {
    #id; #service; #status; #paymentStatus; #plan; #audience;
    constructor({id, service = 'monitoring', status = 'pending', paymentStatus = 'pending', plan = 'monthly', audience = 'business'} = {}) {
        if (!['monitoring', 'fleet'].includes(service)) throw new Error('Invalid service');
        this.#id = id; this.#service = service; this.#status = status; this.#paymentStatus = paymentStatus;
        if (!Object.hasOwn(planCatalog, audience) || !Object.hasOwn(planCatalog[audience], plan)) throw new Error('Invalid plan');
        this.#plan = plan;
        this.#audience = audience;
    }
    get id() { return this.#id; }
    get service() { return this.#service; }
    get status() { return this.#status; }
    get paymentStatus() { return this.#paymentStatus; }
    get plan() { return this.#plan; }
    get audience() { return this.#audience; }
}
