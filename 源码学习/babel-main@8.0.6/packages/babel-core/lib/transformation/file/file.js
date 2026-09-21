import * as helpers from "@babel/helpers";
import { NodePath } from "@babel/traverse";
import { codeFrameColumns } from "@babel/code-frame";
import * as _t from "@babel/types";
const {
  cloneNode,
  interpreterDirective,
  traverseFast
} = _t;
import { isValid, rangesIntersect } from "verkit";
export default class File {
  _map = new Map();
  opts;
  declarations = {};
  path;
  ast;
  scope;
  metadata = {};
  code = "";
  inputMap;
  hub = {
    file: this,
    getCode: () => this.code,
    getScope: () => this.scope,
    addHelper: this.addHelper.bind(this),
    buildError: this.buildCodeFrameError.bind(this)
  };
  constructor(options, {
    code,
    ast,
    inputMap
  }) {
    this.opts = options;
    this.code = code;
    this.ast = ast;
    this.inputMap = inputMap;
    this.path = NodePath.get({
      hub: this.hub,
      parentPath: null,
      parent: this.ast,
      container: this.ast,
      key: "program"
    }).setContext();
    this.scope = this.path.scope;
  }
  get shebang() {
    const {
      interpreter
    } = this.path.node;
    return interpreter ? interpreter.value : "";
  }
  set shebang(value) {
    if (value) {
      this.path.get("interpreter").replaceWith(interpreterDirective(value));
    } else {
      this.path.get("interpreter").remove();
    }
  }
  set(key, val) {
    this._map.set(key, val);
  }
  get(key) {
    return this._map.get(key);
  }
  has(key) {
    return this._map.has(key);
  }
  availableHelper(name, versionRange) {
    if (helpers.isInternal(name)) return false;
    let minVersion;
    try {
      minVersion = helpers.minVersion(name);
    } catch (err) {
      if (err.code !== "BABEL_HELPER_UNKNOWN") throw err;
      return false;
    }
    if (typeof versionRange !== "string") return true;
    if (isValid(versionRange)) versionRange = `^${versionRange}`;
    return !rangesIntersect(`<${minVersion}`, versionRange) && !rangesIntersect(`>=9.0.0`, versionRange);
  }
  addHelper(name) {
    if (helpers.isInternal(name)) {
      throw new Error("Cannot use internal helper " + name);
    }
    return this._addHelper(name);
  }
  _addHelper(name) {
    const declar = this.declarations[name];
    if (declar) return cloneNode(declar);
    const generator = this.get("helperGenerator");
    if (generator) {
      const res = generator(name);
      if (res) return res;
    }
    helpers.minVersion(name);
    const uid = this.declarations[name] = this.scope.generateUidIdentifier(name);
    const dependencies = {};
    for (const dep of helpers.getDependencies(name)) {
      dependencies[dep] = this._addHelper(dep);
    }
    const {
      nodes,
      globals
    } = helpers.get(name, dep => dependencies[dep], uid.name, Object.keys(this.scope.getAllBindings()));
    globals.forEach(name => {
      if (this.path.scope.hasBinding(name, true)) {
        this.path.scope.rename(name);
      }
    });
    nodes.forEach(node => {
      node._compact = true;
    });
    const added = this.path.unshiftContainer("body", nodes);
    for (const path of added) {
      if (path.isVariableDeclaration()) this.scope.registerDeclaration(path);
    }
    return uid;
  }
  buildCodeFrameError(node, msg, _Error = SyntaxError) {
    let loc = node?.loc;
    if (!loc && node) {
      traverseFast(node, function (node) {
        if (node.loc) {
          loc = node.loc;
          return traverseFast.stop;
        }
      });
      let txt = "This is an error on an internal node. Probably an internal error.";
      if (loc) txt += " Location has been estimated.";
      msg += ` (${txt})`;
    }
    if (loc) {
      const {
        highlightCode = true
      } = this.opts;
      msg += "\n" + codeFrameColumns(this.code, {
        start: {
          line: loc.start.line,
          column: loc.start.column
        },
        end: loc.end && loc.start.line === loc.end.line ? {
          line: loc.end.line,
          column: loc.end.column
        } : undefined
      }, {
        highlightCode
      });
    }
    return new _Error(msg);
  }
}