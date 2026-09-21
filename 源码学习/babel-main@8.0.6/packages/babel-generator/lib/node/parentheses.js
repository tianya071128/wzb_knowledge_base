import * as _t from "@babel/types";
const {
  isMemberExpression,
  isOptionalMemberExpression,
  isYieldExpression,
  isStatement
} = _t;
import { TokenContext } from "./index.js";
const PRECEDENCE = new Map([["||", 0], ["??", 1], ["&&", 2], ["|", 3], ["^", 4], ["&", 5], ["==", 6], ["===", 6], ["!=", 6], ["!==", 6], ["<", 7], [">", 7], ["<=", 7], [">=", 7], ["in", 7], ["instanceof", 7], [">>", 8], ["<<", 8], [">>>", 8], ["+", 9], ["-", 9], ["*", 10], ["/", 10], ["%", 10], ["**", 11]]);
function isTSTypeExpression(nodeId) {
  return nodeId === 154 || nodeId === 199 || nodeId === 207;
}
const isClassExtendsClause = (node, parent, parentId) => {
  return (parentId === 22 || parentId === 23) && parent.superClass === node;
};
const hasPostfixPart = (node, parent, parentId) => {
  switch (parentId) {
    case 109:
    case 133:
      return parent.object === node;
    case 18:
    case 131:
    case 113:
      return parent.callee === node;
    case 220:
      return parent.tag === node;
    case 189:
      return true;
  }
  return false;
};
export function NullableTypeAnnotation(node, parent, parentId) {
  return parentId === 4;
}
export function FunctionTypeAnnotation(node, parent, parentId, tokenContext) {
  return (parentId === 237 || parentId === 91 || parentId === 4 || (tokenContext & TokenContext.arrowFlowReturnType) > 0
  );
}
export function UpdateExpression(node, parent, parentId) {
  return hasPostfixPart(node, parent, parentId) || isClassExtendsClause(node, parent, parentId);
}
function needsParenBeforeExpressionBrace(tokenContext) {
  return (tokenContext & (TokenContext.expressionStatement | TokenContext.arrowBody)) > 0;
}
export function ObjectExpression(node, parent, parentId, tokenContext) {
  return needsParenBeforeExpressionBrace(tokenContext);
}
export function DoExpression(node, parent, parentId, tokenContext) {
  return (tokenContext & TokenContext.expressionStatement) > 0 && !node.async;
}
function BinaryLike(node, parent, parentId, nodeType) {
  if (isClassExtendsClause(node, parent, parentId)) {
    return true;
  }
  if (hasPostfixPart(node, parent, parentId) || parentId === 236 || parentId === 143 || parentId === 8) {
    return true;
  }
  let parentPos;
  switch (parentId) {
    case 11:
    case 108:
      parentPos = PRECEDENCE.get(parent.operator);
      break;
    case 154:
    case 199:
      parentPos = 7;
  }
  if (parentPos !== undefined) {
    const nodePos = nodeType === 2 ? 7 : PRECEDENCE.get(node.operator);
    if (parentPos > nodePos) return true;
    if (parentPos === nodePos && parentId === 11 && (nodePos === 11 ? parent.left === node : parent.right === node)) {
      return true;
    }
    if (nodeType === 1 && parentId === 108 && (nodePos === 1 && parentPos !== 1 || parentPos === 1 && nodePos !== 1)) {
      return true;
    }
  }
  return false;
}
export function UnionTypeAnnotation(node, parent, parentId) {
  switch (parentId) {
    case 4:
    case 116:
    case 91:
    case 237:
      return true;
  }
  return false;
}
export { UnionTypeAnnotation as IntersectionTypeAnnotation };
export function OptionalIndexedAccessType(node, parent, parentId) {
  return parentId === 85 && parent.objectType === node;
}
export function TSAsExpression(node, parent, parentId) {
  if ((parentId === 6 || parentId === 7) && parent.left === node) {
    return true;
  }
  if (parentId === 11 && (parent.operator === "|" || parent.operator === "&") && node === parent.left) {
    return true;
  }
  return BinaryLike(node, parent, parentId, 2);
}
export { TSAsExpression as TSSatisfiesExpression };
export { UnaryLike as TSTypeAssertion };
export function TSConditionalType(node, parent, parentId) {
  switch (parentId) {
    case 153:
    case 193:
    case 209:
    case 210:
    case 179:
    case 217:
      return true;
    case 173:
      return parent.objectType === node;
    case 159:
      return parent.checkType === node || parent.extendsType === node;
  }
  return false;
}
export function TSUnionType(node, parent, parentId) {
  switch (parentId) {
    case 179:
    case 209:
    case 153:
    case 193:
      return true;
    case 173:
      return parent.objectType === node;
  }
  return false;
}
export function TSIntersectionType(node, parent, parentId) {
  return parentId === 209 || TSTypeOperator(node, parent, parentId);
}
export function TSInferType(node, parent, parentId) {
  if (TSTypeOperator(node, parent, parentId)) {
    return true;
  }
  if ((parentId === 179 || parentId === 217) && node.typeParameter.constraint != null) {
    return true;
  }
  return false;
}
export function TSTypeOperator(node, parent, parentId) {
  switch (parentId) {
    case 153:
    case 193:
      return true;
    case 173:
      if (parent.objectType === node) {
        return true;
      }
  }
  return false;
}
export function TSInstantiationExpression(node, parent, parentId) {
  switch (parentId) {
    case 18:
    case 131:
    case 113:
    case 175:
      return parent.typeArguments != null;
  }
  return false;
}
export function TSFunctionType(node, parent, parentId) {
  if (TSUnionType(node, parent, parentId)) return true;
  return parentId === 217 || parentId === 159 && (parent.checkType === node || parent.extendsType === node);
}
export { TSFunctionType as TSConstructorType };
export function BinaryExpression(node, parent, parentId, tokenContext) {
  if (BinaryLike(node, parent, parentId, 0)) return true;
  return (tokenContext & TokenContext.forInOrInitHeadAccumulate) > 0 && node.operator === "in";
}
export function LogicalExpression(node, parent, parentId) {
  return BinaryLike(node, parent, parentId, 1);
}
export function SequenceExpression(node, parent, parentId) {
  if (parentId === 142 || parentId === 134 || parentId === 109 && parent.property === node || parentId === 133 && parent.property === node || parentId === 222) {
    return false;
  }
  if (parentId === 22) {
    return true;
  }
  if (parentId === 69) {
    return parent.right === node;
  }
  if (parentId === 61) {
    return true;
  }
  return !isStatement(parent);
}
export function YieldExpression(node, parent, parentId) {
  return parentId === 11 || parentId === 108 || parentId === 236 || parentId === 143 || hasPostfixPart(node, parent, parentId) || parentId === 8 && isYieldExpression(node) || parentId === 29 && node === parent.test || isClassExtendsClause(node, parent, parentId) || isTSTypeExpression(parentId);
}
export { YieldExpression as AwaitExpression };
export function ClassExpression(node, parent, parentId, tokenContext) {
  return (tokenContext & (TokenContext.expressionStatement | TokenContext.exportDefault)) > 0;
}
function UnaryLike(node, parent, parentId) {
  return hasPostfixPart(node, parent, parentId) || parentId === 11 && parent.operator === "**" && parent.left === node || isClassExtendsClause(node, parent, parentId);
}
export { UnaryLike as UnaryExpression, UnaryLike as SpreadElement };
export function FunctionExpression(node, parent, parentId, tokenContext) {
  return (tokenContext & (TokenContext.expressionStatement | TokenContext.exportDefault)) > 0;
}
export function ConditionalExpression(node, parent, parentId) {
  switch (parentId) {
    case 236:
    case 143:
    case 11:
    case 108:
    case 8:
      return true;
    case 29:
      if (parent.test === node) {
        return true;
      }
  }
  if (isTSTypeExpression(parentId)) {
    return true;
  }
  return UnaryLike(node, parent, parentId);
}
export { ConditionalExpression as ArrowFunctionExpression };
export function OptionalMemberExpression(node, parent, parentId) {
  switch (parentId) {
    case 18:
      return parent.callee === node;
    case 109:
      return parent.object === node;
  }
  return false;
}
export { OptionalMemberExpression as OptionalCallExpression };
export function AssignmentExpression(node, parent, parentId, tokenContext) {
  if (needsParenBeforeExpressionBrace(tokenContext) && node.left.type === "ObjectPattern") {
    return true;
  }
  return ConditionalExpression(node, parent, parentId);
}
export function Identifier(node, parent, parentId, tokenContext, getRawIdentifier) {
  if (getRawIdentifier && getRawIdentifier(node) !== node.name) {
    return false;
  }
  if (parentId === 6 && node.extra?.parenthesized && parent.left === node) {
    const rightType = parent.right.type;
    if ((rightType === "FunctionExpression" || rightType === "ClassExpression") && parent.right.id == null) {
      return true;
    }
  }
  if (tokenContext & TokenContext.forOfHead || (parentId === 109 || parentId === 133) && tokenContext & (TokenContext.expressionStatement | TokenContext.forInitHead | TokenContext.forInHead)) {
    if (node.name === "let") {
      const isFollowedByBracket = isMemberExpression(parent, {
        object: node,
        computed: true
      }) || isOptionalMemberExpression(parent, {
        object: node,
        computed: true,
        optional: false
      });
      if (isFollowedByBracket && tokenContext & (TokenContext.expressionStatement | TokenContext.forInitHead | TokenContext.forInHead)) {
        return true;
      }
      return (tokenContext & TokenContext.forOfHead) > 0;
    }
  }
  return parentId === 69 && parent.left === node && node.name === "async" && !parent.await;
}