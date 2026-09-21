import assert from "node:assert";
export class Entry {}
class FunctionEntry extends Entry {
  returnLoc;
  constructor(returnLoc) {
    super();
    this.returnLoc = returnLoc;
  }
}
export class LoopEntry extends Entry {
  breakLoc;
  continueLoc;
  label;
  constructor(breakLoc, continueLoc, label = null) {
    super();
    this.breakLoc = breakLoc;
    this.continueLoc = continueLoc;
    this.label = label;
  }
}
export class SwitchEntry extends Entry {
  breakLoc;
  constructor(breakLoc) {
    super();
    this.breakLoc = breakLoc;
  }
}
export class TryEntry extends Entry {
  firstLoc;
  catchEntry;
  finallyEntry;
  constructor(firstLoc, catchEntry = null, finallyEntry = null) {
    super();
    assert.ok(catchEntry || finallyEntry);
    this.firstLoc = firstLoc;
    this.catchEntry = catchEntry;
    this.finallyEntry = finallyEntry;
  }
}
export class CatchEntry extends Entry {
  firstLoc;
  paramId;
  constructor(firstLoc, paramId) {
    super();
    this.firstLoc = firstLoc;
    this.paramId = paramId;
  }
}
export class FinallyEntry extends Entry {
  firstLoc;
  afterLoc;
  constructor(firstLoc, afterLoc) {
    super();
    this.firstLoc = firstLoc;
    this.afterLoc = afterLoc;
  }
}
export class LabeledEntry extends Entry {
  breakLoc;
  label;
  constructor(breakLoc, label) {
    super();
    this.breakLoc = breakLoc;
    this.label = label;
  }
}
export class LeapManager {
  emitter;
  entryStack;
  constructor(emitter) {
    this.emitter = emitter;
    this.entryStack = [new FunctionEntry(emitter.finalLoc)];
  }
  withEntry(entry, callback) {
    this.entryStack.push(entry);
    try {
      callback.call(this.emitter);
    } finally {
      const popped = this.entryStack.pop();
      assert.strictEqual(popped, entry);
    }
  }
  _findLeapLocation(property, label) {
    for (let i = this.entryStack.length - 1; i >= 0; --i) {
      const entry = this.entryStack[i];
      const loc = entry[property];
      if (loc) {
        if (label) {
          if (entry.label && entry.label.name === label.name) {
            return loc;
          }
        } else if (entry instanceof LabeledEntry) {} else {
          return loc;
        }
      }
    }
    throw new Error("unreachable");
  }
  getBreakLoc(label) {
    return this._findLeapLocation("breakLoc", label);
  }
  getContinueLoc(label) {
    return this._findLeapLocation("continueLoc", label);
  }
}