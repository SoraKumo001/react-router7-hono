export class DurableObject {
  constructor(_, env) {
    this.env = env;
    this.app = import("./build/server");
  }
  async fetch(req) {
    return (await this.app).default.fetch(req, this.env);
  }
}

export default {
  async fetch(...params) {
    const env = params[1];
    const id = env.DURABLE_OBJECT.idFromName("any");
    const stub = env.DURABLE_OBJECT.get(id);
    return stub.fetch(...params);
  },
};
