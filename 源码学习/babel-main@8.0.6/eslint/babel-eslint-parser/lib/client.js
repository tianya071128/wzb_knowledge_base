import path from "node:path";
import { Worker, SHARE_ENV, MessageChannel, receiveMessageOnPort } from "node:worker_threads";
export const ACTIONS = {
  MAYBE_PARSE: "MAYBE_PARSE"
};
export class Client {
  #send;
  constructor(send) {
    this.#send = send;
  }
  maybeParse(code, options) {
    return this.#send(ACTIONS.MAYBE_PARSE, {
      code,
      options
    });
  }
}
export class WorkerClient extends Client {
  #worker = new Worker(path.resolve(import.meta.dirname, "../lib/worker/index.js"), {
    env: SHARE_ENV
  });
  constructor() {
    super((action, payload) => {
      const signal = new Int32Array(new SharedArrayBuffer(8));
      const subChannel = new MessageChannel();
      this.#worker.postMessage({
        signal,
        port: subChannel.port1,
        action,
        payload
      }, [subChannel.port1]);
      Atomics.wait(signal, 0, 0);
      const {
        message
      } = receiveMessageOnPort(subChannel.port2);
      if (message.error) throw Object.assign(message.error, message.errorData);else return message.result;
    });
    this.#worker.unref();
  }
}
//# sourceMappingURL=client.js.map
