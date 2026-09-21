import isValidIdentifier from "../validators/isValidIdentifier.js";
import { identifier, booleanLiteral, nullLiteral, stringLiteral, numericLiteral, bigIntLiteral, regExpLiteral, arrayExpression, objectProperty, objectExpression, unaryExpression, binaryExpression } from "../builders/generated/index.js";
export default valueToNode;
const objectToString = Function.call.bind(Object.prototype.toString);
function isRegExp(value) {
  return objectToString(value) === "[object RegExp]";
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null || Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || Object.getPrototypeOf(proto) === null;
}
function valueToNode(value) {
  if (value === undefined) {
    return identifier("undefined");
  }
  if (value === true || value === false) {
    return booleanLiteral(value);
  }
  if (value === null) {
    return nullLiteral();
  }
  if (typeof value === "string") {
    return stringLiteral(value);
  }
  if (typeof value === "number") {
    let result;
    if (Number.isFinite(value)) {
      result = numericLiteral(Math.abs(value));
    } else {
      let numerator;
      if (Number.isNaN(value)) {
        numerator = numericLiteral(0);
      } else {
        numerator = numericLiteral(1);
      }
      result = binaryExpression("/", numerator, numericLiteral(0));
    }
    if (value < 0 || Object.is(value, -0)) {
      result = unaryExpression("-", result);
    }
    return result;
  }
  if (typeof value === "bigint") {
    if (value < 0) {
      return unaryExpression("-", bigIntLiteral(-value));
    } else {
      return bigIntLiteral(value);
    }
  }
  if (isRegExp(value)) {
    const pattern = value.source;
    const flags = /\/([a-z]*)$/.exec(value.toString())[1];
    return regExpLiteral(pattern, flags);
  }
  if (Array.isArray(value)) {
    return arrayExpression(value.map(valueToNode));
  }
  if (isPlainObject(value)) {
    const props = [];
    for (const key of Object.keys(value)) {
      let nodeKey,
        computed = false;
      if (isValidIdentifier(key)) {
        if (key === "__proto__") {
          computed = true;
          nodeKey = stringLiteral(key);
        } else {
          nodeKey = identifier(key);
        }
      } else {
        nodeKey = stringLiteral(key);
      }
      props.push(objectProperty(nodeKey, valueToNode(value[key]), computed));
    }
    return objectExpression(props);
  }
  throw new Error("don't know how to turn this value into a node");
}