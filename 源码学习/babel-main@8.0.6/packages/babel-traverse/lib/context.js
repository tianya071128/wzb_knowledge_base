export default class TraversalContext {
  constructor(opts, state) {
    this.state = state;
    this.opts = opts;
  }
  queue = null;
  priorityQueue = null;
  maybeQueue(path, notPriority) {
    if (this.queue) {
      if (notPriority) {
        this.queue.push(path);
      } else {
        this.priorityQueue.push(path);
      }
    }
  }
}