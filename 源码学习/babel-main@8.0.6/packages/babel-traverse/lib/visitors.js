import * as virtualTypes from "./path/lib/virtual-types.js";
import * as virtualTypesValidators from "./path/lib/virtual-types-validator.js";
import * as _t from "@babel/types";
const {
  DEPRECATED_KEYS,
  DEPRECATED_ALIASES,
  FLIPPED_ALIAS_KEYS,
  TYPES,
  __internal__deprecationWarning: deprecationWarning
} = _t;
function isVirtualType(type) {
  return type in virtualTypes;
}
export function isExplodedVisitor(visitor) {
  return visitor?._exploded;
}
export { explode$1 as explode };
function explode$1(visitor) {
  if (isExplodedVisitor(visitor)) return visitor;
  visitor._exploded = true;
  if (Object.hasOwn(visitor, "blacklist")) {
    if (!Object.hasOwn(visitor, "denylist")) {
      throw new Error("The 'blacklist' visitor option has been renamed to 'denylist'. " + "Please update your configuration.");
    }
    delete visitor.blacklist;
  }
  for (const nodeType of Object.keys(visitor)) {
    if (shouldIgnoreKey(nodeType)) continue;
    const parts = nodeType.split("|");
    if (parts.length === 1) continue;
    const fns = visitor[nodeType];
    delete visitor[nodeType];
    for (const part of parts) {
      visitor[part] = fns;
    }
  }
  verify$1(visitor);
  delete visitor.__esModule;
  ensureEntranceObjects(visitor);
  ensureCallbackArrays(visitor);
  const visitorBase = visitor;
  for (const nodeType of Object.keys(visitor)) {
    if (shouldIgnoreKey(nodeType)) continue;
    if (!isVirtualType(nodeType)) continue;
    const fns = visitorBase[nodeType];
    for (const type of Object.keys(fns)) {
      fns[type] = wrapCheck(nodeType, fns[type]);
    }
    delete visitorBase[nodeType];
    const types = virtualTypes[nodeType];
    if (types !== null) {
      for (const type of types) {
        visitorBase[type] ??= {};
        mergePair(visitorBase[type], fns);
      }
    } else {
      mergePair(visitor, fns);
    }
  }
  for (const nodeType of Object.keys(visitor)) {
    if (shouldIgnoreKey(nodeType)) continue;
    let aliases = FLIPPED_ALIAS_KEYS[nodeType];
    if (nodeType in DEPRECATED_KEYS) {
      const deprecatedKey = DEPRECATED_KEYS[nodeType];
      deprecationWarning(nodeType, deprecatedKey, "Visitor ");
      aliases = [deprecatedKey];
    } else if (nodeType in DEPRECATED_ALIASES) {
      const deprecatedAlias = DEPRECATED_ALIASES[nodeType];
      deprecationWarning(nodeType, deprecatedAlias, "Visitor ");
      aliases = FLIPPED_ALIAS_KEYS[deprecatedAlias];
    }
    if (!aliases) continue;
    const fns = visitor[nodeType];
    delete visitor[nodeType];
    for (const alias of aliases) {
      const existing = visitorBase[alias];
      if (existing) {
        mergePair(existing, fns);
      } else {
        visitorBase[alias] = {
          ...fns
        };
      }
    }
  }
  for (const nodeType of Object.keys(visitor)) {
    if (shouldIgnoreKey(nodeType)) continue;
    ensureCallbackArrays(visitor[nodeType]);
  }
  return visitor;
}
export { verify$1 as verify };
function verify$1(visitor) {
  if (visitor._verified) return;
  if (typeof visitor === "function") {
    throw new Error("You passed `traverse()` a function when it expected a visitor object, " + "are you sure you didn't mean `{ enter: Function }`?");
  }
  for (const nodeType of Object.keys(visitor)) {
    if (nodeType === "enter" || nodeType === "exit") {
      validateVisitorMethods(nodeType, visitor[nodeType]);
    }
    if (shouldIgnoreKey(nodeType)) continue;
    if (!TYPES.includes(nodeType)) {
      throw new Error(`You gave us a visitor for the node type ${nodeType} but it's not a valid type in @babel/traverse ${"8.0.6"}`);
    }
    const visitors = visitor[nodeType];
    if (typeof visitors === "object") {
      for (const visitorKey of Object.keys(visitors)) {
        if (visitorKey === "enter" || visitorKey === "exit") {
          validateVisitorMethods(`${nodeType}.${visitorKey}`, visitors[visitorKey]);
        } else {
          throw new Error("You passed `traverse()` a visitor object with the property " + `${nodeType} that has the invalid property ${visitorKey}`);
        }
      }
    }
  }
  visitor._verified = true;
}
function validateVisitorMethods(path, val) {
  const fns = [].concat(val);
  for (const fn of fns) {
    if (typeof fn !== "function") {
      throw new TypeError(`Non-function found defined in ${path} with type ${typeof fn}`);
    }
  }
}
export function merge(visitors, states = [], wrapper) {
  const mergedVisitor = {
    _verified: true,
    _exploded: true
  };
  for (let i = 0; i < visitors.length; i++) {
    const visitor = explode$1(visitors[i]);
    const state = states[i];
    let topVisitor = visitor;
    if (state || wrapper) {
      topVisitor = wrapWithStateOrWrapper(topVisitor, state, wrapper);
    }
    mergePair(mergedVisitor, topVisitor);
    for (const key of Object.keys(visitor)) {
      if (shouldIgnoreKey(key)) continue;
      let typeVisitor = visitor[key];
      if (state || wrapper) {
        typeVisitor = wrapWithStateOrWrapper(typeVisitor, state, wrapper);
      }
      const nodeVisitor = mergedVisitor[key] ||= {};
      mergePair(nodeVisitor, typeVisitor);
    }
  }
  return mergedVisitor;
}
function wrapWithStateOrWrapper(oldVisitor, state, wrapper) {
  const newVisitor = {};
  for (const phase of ["enter", "exit"]) {
    let fns = oldVisitor[phase];
    if (!Array.isArray(fns)) continue;
    fns = fns.map(function (fn) {
      let newFn = fn;
      if (state) {
        newFn = function (path) {
          fn.call(state, path, state);
        };
      }
      if (wrapper) {
        newFn = wrapper(state?.key, phase, newFn);
      }
      if (newFn !== fn) {
        newFn.toString = () => fn.toString();
      }
      return newFn;
    });
    newVisitor[phase] = fns;
  }
  return newVisitor;
}
function ensureEntranceObjects(obj) {
  for (const key of Object.keys(obj)) {
    if (shouldIgnoreKey(key)) continue;
    const fns = obj[key];
    if (typeof fns === "function") {
      obj[key] = {
        enter: fns
      };
    }
  }
}
function ensureCallbackArrays(obj) {
  if (obj.enter && !Array.isArray(obj.enter)) obj.enter = [obj.enter];
  if (obj.exit && !Array.isArray(obj.exit)) obj.exit = [obj.exit];
}
function wrapCheck(nodeType, fn) {
  const fnKey = `is${nodeType}`;
  const validator = virtualTypesValidators[fnKey];
  const newFn = function (path) {
    if (validator.call(path)) {
      return fn.apply(this, arguments);
    }
  };
  newFn.toString = () => fn.toString();
  return newFn;
}
function shouldIgnoreKey(key) {
  if (key.startsWith("_")) return true;
  if (key === "enter" || key === "exit" || key === "shouldSkip") return true;
  if (key === "denylist" || key === "noScope" || key === "skipKeys") {
    return true;
  }
  if (key === "blacklist") {
    throw new Error("The 'blacklist' visitor option has been renamed to 'denylist'. " + "Please update your configuration.");
  }
  return false;
}
function mergePair(dest, src) {
  for (const phase of ["enter", "exit"]) {
    if (!src[phase]) continue;
    dest[phase] = [].concat(dest[phase] || [], src[phase]);
  }
}
const _environmentVisitor = {
  FunctionParent(path) {
    if (path.isArrowFunctionExpression()) return;
    path.skip();
    if (path.isMethod()) {
      path.requeueComputedKeyAndDecorators();
    }
  },
  Property(path) {
    if (path.isObjectProperty()) return;
    path.skip();
    path.requeueComputedKeyAndDecorators();
  }
};
export function environmentVisitor(visitor) {
  return merge([_environmentVisitor, visitor]);
}