import is from "../validators/is.js";
import { validateField, validateChild } from "../validators/validate.js";
export const VISITOR_KEYS = {};
export const ALIAS_KEYS = {};
export const FLIPPED_ALIAS_KEYS = {};
export const NODE_FIELDS = {};
export const BUILDER_KEYS = {};
export const DEPRECATED_KEYS = {};
export const NODE_PARENT_VALIDATIONS = {};
export const NODE_UNION_SHAPES__PRIVATE = {};
function getType(val) {
  if (Array.isArray(val)) {
    return "array";
  } else if (val === null) {
    return "null";
  } else {
    return typeof val;
  }
}
export function combine(fn, ...validators) {
  return Object.assign(fn, ...validators);
}
export function validate(validate) {
  return {
    validate
  };
}
export function validateType(...typeNames) {
  return validate(assertNodeType(...typeNames));
}
export function validateOptional(validate) {
  return {
    validate,
    optional: true
  };
}
export function validateDefault(validate, defaultValue) {
  return {
    validate,
    default: defaultValue,
    optional: false
  };
}
export function validateOptionalType(...typeNames) {
  return {
    validate: assertNodeType(...typeNames),
    optional: true
  };
}
export function arrayOf(elementType) {
  return chain(assertValueType("array"), assertEach(elementType));
}
export function arrayOfType(...typeNames) {
  return arrayOf(assertNodeType(...typeNames));
}
export function validateArrayOfType(...typeNames) {
  return validate(arrayOfType(...typeNames));
}
export function assertEach(callback) {
  const childValidator = validateChild;
  function validator(node, key, val) {
    if (!Array.isArray(val)) return;
    let i = 0;
    const subKey = {
      toString() {
        return `${key}[${i}]`;
      }
    };
    for (; i < val.length; i++) {
      const v = val[i];
      callback(node, subKey, v);
      childValidator(node, subKey, v);
    }
  }
  validator.each = callback;
  return validator;
}
export function assertOneOf(...values) {
  function validate(node, key, val) {
    if (!values.includes(val)) {
      throw new TypeError(`Property ${key} expected value to be one of ${JSON.stringify(values)} but got ${JSON.stringify(val)}`);
    }
  }
  validate.oneOf = values;
  return validate;
}
export const allExpandedTypes = [];
export function assertNodeType(...types) {
  const expandedTypes = new Set();
  allExpandedTypes.push({
    types,
    set: expandedTypes
  });
  function validate(node, key, val) {
    const valType = val?.type;
    if (valType != null) {
      if (expandedTypes.has(valType)) {
        validateChild(node, key, val);
        return;
      }
      if (valType === "Placeholder") {
        for (const type of types) {
          if (is(type, val)) {
            validateChild(node, key, val);
            return;
          }
        }
      }
    }
    throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types)} but instead got ${JSON.stringify(valType)}`);
  }
  validate.oneOfNodeTypes = types;
  return validate;
}
export function assertNodeOrValueType(...types) {
  function validate(node, key, val) {
    const primitiveType = getType(val);
    for (const type of types) {
      if (primitiveType === type || is(type, val)) {
        validateChild(node, key, val);
        return;
      }
    }
    throw new TypeError(`Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(types)} but instead got ${JSON.stringify(val?.type)}`);
  }
  validate.oneOfNodeOrValueTypes = types;
  return validate;
}
export function assertValueType(type) {
  function validate(node, key, val) {
    if (getType(val) === type) {
      return;
    }
    throw new TypeError(`Property ${key} expected type of ${type} but got ${getType(val)}`);
  }
  validate.type = type;
  return validate;
}
export function assertShape(shape) {
  const keys = Object.keys(shape);
  function validate(node, key, val) {
    const errors = [];
    for (const property of keys) {
      try {
        validateField(node, property, val[property], shape[property]);
      } catch (error) {
        if (error instanceof TypeError) {
          errors.push(error.message);
          continue;
        }
        throw error;
      }
    }
    if (errors.length) {
      throw new TypeError(`Property ${key} of ${node.type} expected to have the following:\n${errors.join("\n")}`);
    }
  }
  validate.shapeOf = shape;
  return validate;
}
export function assertOptionalChainStart() {
  function validate(node) {
    let current = node;
    while (node) {
      const {
        type
      } = current;
      if (type === "OptionalCallExpression") {
        if (current.optional) return;
        current = current.callee;
        continue;
      }
      if (type === "OptionalMemberExpression") {
        if (current.optional) return;
        current = current.object;
        continue;
      }
      break;
    }
    throw new TypeError(`Non-optional ${node.type} must chain from an optional OptionalMemberExpression or OptionalCallExpression. Found chain from ${current?.type}`);
  }
  return validate;
}
export function chain(...fns) {
  function validate(...args) {
    for (const fn of fns) {
      fn(...args);
    }
  }
  validate.chainOf = fns;
  if (fns.length >= 2 && "type" in fns[0] && fns[0].type === "array" && !("each" in fns[1])) {
    throw new Error(`An assertValueType("array") validator can only be followed by an assertEach(...) validator.`);
  }
  return validate;
}
const validTypeOpts = new Set(["aliases", "builder", "deprecatedAlias", "fields", "inherits", "visitor", "validate", "unionShape"]);
const validFieldKeys = new Set(["default", "optional", "deprecated", "validate"]);
const store = {};
export function defineAliasedType(...aliases) {
  return (type, opts = {}) => {
    let defined = opts.aliases;
    if (!defined) {
      if (opts.inherits) defined = store[opts.inherits].aliases?.slice();
      defined ??= [];
      opts.aliases = defined;
    }
    const additional = aliases.filter(a => !defined.includes(a));
    defined.unshift(...additional);
    defineType(type, opts);
  };
}
export default function defineType(type, opts = {}) {
  const inherits = opts.inherits && store[opts.inherits] || {};
  const visitor = opts.visitor || inherits.visitor || [];
  const aliases = opts.aliases || inherits.aliases || [];
  const builder = opts.builder || inherits.builder || opts.visitor || [];
  let fields = opts.fields;
  if (!fields) {
    fields = {};
    if (inherits.fields) {
      const keys = Object.getOwnPropertyNames(inherits.fields);
      for (const key of keys) {
        const field = inherits.fields[key];
        const def = field.default;
        if (Array.isArray(def) ? def.length > 0 : def && typeof def === "object") {
          throw new Error("field defaults can only be primitives or empty arrays currently");
        }
        fields[key] = {
          default: Array.isArray(def) ? [] : def,
          optional: field.optional,
          deprecated: field.deprecated,
          validate: field.validate
        };
      }
    }
  }
  for (const k of Object.keys(opts)) {
    if (!validTypeOpts.has(k)) {
      throw new Error(`Unknown type option "${k}" on ${type}`);
    }
  }
  if (opts.deprecatedAlias) {
    DEPRECATED_KEYS[opts.deprecatedAlias] = type;
  }
  for (const key of visitor.concat(builder)) {
    fields[key] = fields[key] || {};
  }
  for (const key of Object.keys(fields)) {
    const field = fields[key];
    if (field.default === null) {
      field.optional ??= true;
    }
    if (field.default === undefined) {
      field.default = null;
      field.optional ??= false;
    } else if (!field.validate && field.default != null) {
      field.validate = assertValueType(getType(field.default));
    }
    for (const k of Object.keys(field)) {
      if (!validFieldKeys.has(k)) {
        throw new Error(`Unknown field key "${k}" on ${type}.${key}`);
      }
    }
  }
  VISITOR_KEYS[type] = opts.visitor = visitor;
  BUILDER_KEYS[type] = opts.builder = builder;
  NODE_FIELDS[type] = opts.fields = fields;
  ALIAS_KEYS[type] = opts.aliases = aliases;
  aliases.forEach(alias => {
    FLIPPED_ALIAS_KEYS[alias] = FLIPPED_ALIAS_KEYS[alias] || [];
    FLIPPED_ALIAS_KEYS[alias].push(type);
  });
  if (opts.validate) {
    NODE_PARENT_VALIDATIONS[type] = opts.validate;
  }
  if (opts.unionShape) {
    NODE_UNION_SHAPES__PRIVATE[type] = opts.unionShape;
  }
  store[type] = opts;
}