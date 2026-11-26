export class Report {
  #id; #vehicleId; #plate; #status; #requestedAt; #findings; #paymentStatus; #serviceType; #make; #model;
  constructor({ id, vehicleId, plate = '', status = 'draft', requestedAt = '', findings = [], paymentStatus = 'none', serviceType = 'fleet', make, model } = {}) {
    this.#id = id;
    this.#vehicleId = vehicleId;
    this.#plate = plate;
    this.#status = status;
    this.#requestedAt = requestedAt;
    this.#findings = findings.map(item => ({ ...item }));
    this.#paymentStatus = paymentStatus; this.#serviceType = serviceType;
    this.#make = make; this.#model = model;
  }
  get id() { return this.#id; }
  get vehicleId() { return this.#vehicleId; }
  get plate() { return this.#plate; }
  get status() { return this.#status; }
  get requestedAt() { return this.#requestedAt; }
  get findings() { return this.#findings.map(item => ({ ...item })); }
  get paymentStatus() { return this.#paymentStatus; }
  get serviceType() { return this.#serviceType; }
  get make() { return this.#make; }
  get model() { return this.#model; }
}
