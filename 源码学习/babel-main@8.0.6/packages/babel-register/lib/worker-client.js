import { ACTIONS } from "./types.js";
import worker_threads from "node:worker_threads";
import { markInRegisterWorker } from "./is-in-register-worker.js";
class Client {
  #send;
  constructor(send) {
    this.#send = send;
  }
  #eCache;
  getDefaultExtensions() {
    return this.#eCache ??= this.#send(ACTIONS.GET_DEFAULT_EXTENSIONS, undefined);
  }
  setOptions(options) {
    return this.#send(ACTIONS.SET_OPTIONS, options);
  }
  transform(code, filename) {
    return this.#send(ACTIONS.TRANSFORM, {
      code,
      filename
    });
  }
  isFileIgnored(filename) {
    return this.#send(ACTIONS.IS_FILE_IGNORED, filename);
  }
  save() {
    this.#send(ACTIONS.SAVE, undefined);
  }
}
class WorkerClient extends Client {
  #worker = new worker_threads.Worker(new URL("./worker/index.js", import.meta.url), {
    env: markInRegisterWorker(process.env),
    execArgv: []
  });
  constructor() {
    super((action, payload) => {
      const signal = new Int32Array(new SharedArrayBuffer(4));
      const subChannel = new worker_threads.MessageChannel();
      this.#worker.postMessage({
        signal,
        port: subChannel.port1,
        action,
        payload
      }, [subChannel.port1]);
      Atomics.wait(signal, 0, 0);
      const {
        message
      } = worker_threads.receiveMessageOnPort(subChannel.port2);
      if (message.error) throw Object.assign(message.error, message.errorData);else return message.result;
    });
    this.#worker.unref();
  }
}
export { WorkerClient };