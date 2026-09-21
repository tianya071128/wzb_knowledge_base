import handleMessage from "./handle-message.js";
import { parentPort } from "node:worker_threads";
parentPort.addListener("message", async ({
  signal,
  port,
  action,
  payload
}) => {
  let response;
  try {
    response = {
      result: await handleMessage(action, payload)
    };
  } catch (error) {
    response = {
      error,
      errorData: {
        ...error
      }
    };
  }
  try {
    port.postMessage(response);
  } catch {
    port.postMessage({
      error: new Error("Cannot serialize worker response")
    });
  } finally {
    port.close();
    Atomics.store(signal, 0, 1);
    Atomics.notify(signal, 0);
  }
});