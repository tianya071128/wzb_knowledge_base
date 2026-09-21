import { template, types as t } from "@babel/core";
import assert from "node:assert";
import annotateAsPure from "@babel/helper-annotate-as-pure";
import { skipTransparentExprWrapperNodes } from "@babel/helper-skip-transparent-expression-wrappers";
const ENUMS = new WeakMap();
const buildEnumWrapper = template.expression(`
    (function (ID) {
      ASSIGNMENTS;
      return ID;
    })(INIT)
  `);
export default function transpileEnum(path, t) {
  const {
    node,
    parentPath
  } = path;
  if (node.declare) {
    path.remove();
    return;
  }
  const name = node.id.name;
  const {
    fill,
    data,
    isPure
  } = enumFill(path, t, node.id);
  switch (parentPath.type) {
    case "BlockStatement":
    case "ExportNamedDeclaration":
    case "Program":
      {
        const isGlobal = t.isProgram(path.parent);
        const existingBinding = path.scope.getOwnBinding(name);
        const isSeen = existingBinding != null && existingBinding.identifier !== node.id;
        let init = t.objectExpression([]);
        if (isSeen || isGlobal) {
          init = t.logicalExpression("||", t.cloneNode(fill.ID), init);
        }
        const enumIIFE = buildEnumWrapper({
          ...fill,
          INIT: init
        });
        if (isPure) annotateAsPure(enumIIFE);
        if (isSeen) {
          const toReplace = parentPath.isExportDeclaration() ? parentPath : path;
          toReplace.replaceWith(t.expressionStatement(t.assignmentExpression("=", t.cloneNode(node.id), enumIIFE)));
        } else {
          path.scope.registerDeclaration(path.replaceWith(t.variableDeclaration(isGlobal ? "var" : "let", [t.variableDeclarator(node.id, enumIIFE)]))[0]);
        }
        ENUMS.set(path.scope.getBindingIdentifier(name), data);
        break;
      }
    default:
      throw new Error(`Unexpected enum parent '${path.parent.type}`);
  }
}
const buildStringAssignment = template.statement(`
  ENUM["NAME"] = VALUE;
`);
const buildNumericAssignment = template.statement(`
  ENUM[ENUM["NAME"] = VALUE] = "NAME";
`);
const buildEnumMember = (isString, options) => (isString ? buildStringAssignment : buildNumericAssignment)(options);
function enumFill(path, t, id) {
  const {
    enumValues,
    data,
    isPure
  } = translateEnumValues(path, t);
  const enumMembers = path.get("body").get("members");
  const assignments = [];
  for (let i = 0; i < enumMembers.length; i++) {
    const [memberName, memberValue] = enumValues[i];
    assignments.push(t.inheritsComments(buildEnumMember(isSyntacticallyString(memberValue), {
      ENUM: t.cloneNode(id),
      NAME: memberName,
      VALUE: memberValue
    }), enumMembers[i].node));
  }
  return {
    fill: {
      ID: t.cloneNode(id),
      ASSIGNMENTS: assignments
    },
    data,
    isPure
  };
}
function isSyntacticallyString(expr) {
  expr = skipTransparentExprWrapperNodes(expr);
  switch (expr.type) {
    case "BinaryExpression":
      {
        const left = expr.left;
        const right = expr.right;
        return expr.operator === "+" && (isSyntacticallyString(left) || isSyntacticallyString(right));
      }
    case "TemplateLiteral":
    case "StringLiteral":
      return true;
  }
  return false;
}
function ReferencedIdentifier(expr, state) {
  const {
    seen,
    path,
    t
  } = state;
  const name = expr.node.name;
  if (seen.has(name)) {
    if (expr.scope.hasBinding(name, {
      upToScope: path.scope
    })) {
      return;
    }
    expr.replaceWith(t.memberExpression(t.cloneNode(path.node.id), t.cloneNode(expr.node)));
    expr.skip();
  }
}
const enumSelfReferenceVisitor = {
  ReferencedIdentifier
};
export function translateEnumValues(path, t) {
  const bindingIdentifier = path.scope.getBindingIdentifier(path.node.id.name);
  const seen = ENUMS.get(bindingIdentifier) ?? new Map();
  let constValue = -1;
  let lastName;
  let isPure = true;
  const enumMembers = path.get("body").get("members");
  const enumValues = enumMembers.map(memberPath => {
    const member = memberPath.node;
    const name = t.isIdentifier(member.id) ? member.id.name : member.id.value;
    const initializerPath = memberPath.get("initializer");
    const initializer = member.initializer;
    let value;
    if (initializer) {
      constValue = computeConstantValue(initializerPath, seen);
      if (constValue !== undefined) {
        seen.set(name, constValue);
        assert(typeof constValue === "number" || typeof constValue === "string");
        if (constValue === Infinity || Number.isNaN(constValue)) {
          value = t.identifier(String(constValue));
        } else if (constValue === -Infinity) {
          value = t.unaryExpression("-", t.identifier("Infinity"));
        } else {
          value = t.valueToNode(constValue);
        }
      } else {
        isPure &&= initializerPath.isPure();
        if (initializerPath.isReferencedIdentifier()) {
          ReferencedIdentifier(initializerPath, {
            t,
            seen,
            path
          });
        } else {
          initializerPath.traverse(enumSelfReferenceVisitor, {
            t,
            seen,
            path
          });
        }
        value = initializerPath.node;
        seen.set(name, undefined);
      }
    } else if (typeof constValue === "number") {
      constValue += 1;
      value = t.numericLiteral(constValue);
      seen.set(name, constValue);
    } else if (typeof constValue === "string") {
      throw path.buildCodeFrameError("Enum member must have initializer.");
    } else {
      const lastRef = t.memberExpression(t.cloneNode(path.node.id), t.stringLiteral(lastName), true);
      value = t.binaryExpression("+", t.numericLiteral(1), lastRef);
      seen.set(name, undefined);
    }
    lastName = name;
    return [name, value];
  });
  return {
    isPure,
    data: seen,
    enumValues
  };
}
function computeConstantValue(path, prevMembers, seen = new Set()) {
  return evaluate(path);
  function evaluate(path) {
    const expr = path.node;
    switch (expr.type) {
      case "MemberExpression":
        return evaluateRef(path, prevMembers, seen);
      case "StringLiteral":
        return expr.value;
      case "UnaryExpression":
        return evalUnaryExpression(path);
      case "BinaryExpression":
        return evalBinaryExpression(path);
      case "NumericLiteral":
        return expr.value;
      case "ParenthesizedExpression":
        return evaluate(path.get("expression"));
      case "Identifier":
        return evaluateRef(path, prevMembers, seen);
      case "TemplateLiteral":
        {
          if (expr.quasis.length === 1) {
            return expr.quasis[0].value.cooked ?? undefined;
          }
          const paths = path.get("expressions");
          const quasis = expr.quasis;
          let str = "";
          for (let i = 0; i < quasis.length; i++) {
            str += quasis[i].value.cooked;
            if (i + 1 < quasis.length) {
              const value = evaluateRef(paths[i], prevMembers, seen);
              if (value === undefined) return undefined;
              str += value;
            }
          }
          return str;
        }
      default:
        return undefined;
    }
  }
  function evaluateRef(path, prevMembers, seen) {
    if (path.isMemberExpression()) {
      const expr = path.node;
      const obj = expr.object;
      const prop = expr.property;
      if (!t.isIdentifier(obj) || (expr.computed ? !t.isStringLiteral(prop) : !t.isIdentifier(prop))) {
        return;
      }
      const bindingIdentifier = path.scope.getBindingIdentifier(obj.name);
      const data = ENUMS.get(bindingIdentifier);
      if (!data) return;
      return data.get(prop.computed ? prop.value : prop.name);
    } else if (path.isIdentifier()) {
      const name = path.node.name;
      if (["Infinity", "NaN"].includes(name)) {
        return Number(name);
      }
      let value = prevMembers?.get(name);
      if (value !== undefined) {
        return value;
      }
      if (prevMembers?.has(name)) {
        return undefined;
      }
      if (seen.has(path.node)) return;
      seen.add(path.node);
      value = computeConstantValue(path.resolve(), prevMembers, seen);
      return value;
    }
  }
  function evalUnaryExpression(path) {
    const value = evaluate(path.get("argument"));
    if (value === undefined) {
      return undefined;
    }
    switch (path.node.operator) {
      case "+":
        return value;
      case "-":
        return -value;
      case "~":
        return ~value;
      default:
        return undefined;
    }
  }
  function evalBinaryExpression(path) {
    const left = evaluate(path.get("left"));
    if (left === undefined) {
      return undefined;
    }
    const right = evaluate(path.get("right"));
    if (right === undefined) {
      return undefined;
    }
    switch (path.node.operator) {
      case "|":
        return left | right;
      case "&":
        return left & right;
      case ">>":
        return left >> right;
      case ">>>":
        return left >>> right;
      case "<<":
        return left << right;
      case "^":
        return left ^ right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "%":
        return left % right;
      case "**":
        return left ** right;
      default:
        return undefined;
    }
  }
}