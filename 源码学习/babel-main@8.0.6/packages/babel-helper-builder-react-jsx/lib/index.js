import annotateAsPure from "@babel/helper-annotate-as-pure";
import { types as t } from "@babel/core";
const {
  booleanLiteral,
  callExpression,
  inherits,
  isIdentifier,
  isJSXExpressionContainer,
  isJSXIdentifier,
  isJSXMemberExpression,
  isJSXNamespacedName,
  isJSXSpreadAttribute,
  isReferenced,
  isStringLiteral,
  isValidIdentifier,
  memberExpression,
  nullLiteral,
  objectExpression,
  objectProperty,
  react,
  spreadElement,
  stringLiteral,
  thisExpression
} = t;
export default function (opts) {
  const visitor = {};
  visitor.JSXNamespacedName = function (path) {
    if (opts.throwIfNamespace) {
      throw path.buildCodeFrameError(`Namespace tags are not supported by default. React's JSX doesn't support namespace tags. \
You can set \`throwIfNamespace: false\` to bypass this warning.`);
    }
  };
  visitor.JSXSpreadChild = function (path) {
    throw path.buildCodeFrameError("Spread children are not supported in React.");
  };
  visitor.JSXElement = {
    exit(path, state) {
      const callExpr = buildElementCall(path, state);
      if (callExpr) {
        path.replaceWith(inherits(callExpr, path.node));
      }
    }
  };
  visitor.JSXFragment = {
    exit(path, state) {
      if (opts.compat) {
        throw path.buildCodeFrameError("Fragment tags are only supported in React 16 and up.");
      }
      const callExpr = buildFragmentCall(path, state);
      if (callExpr) {
        path.replaceWith(inherits(callExpr, path.node));
      }
    }
  };
  return visitor;
  function convertJSXIdentifier(node, parent) {
    if (isJSXIdentifier(node)) {
      if (node.name === "this" && isReferenced(node, parent)) {
        return thisExpression();
      } else if (isValidIdentifier(node.name, false)) {
        node.type = "Identifier";
        return node;
      } else {
        return stringLiteral(node.name);
      }
    } else if (isJSXMemberExpression(node)) {
      return memberExpression(convertJSXIdentifier(node.object, node), convertJSXIdentifier(node.property, node));
    } else if (isJSXNamespacedName(node)) {
      return stringLiteral(`${node.namespace.name}:${node.name.name}`);
    }
    return node;
  }
  function convertAttributeValue(node) {
    if (isJSXExpressionContainer(node)) {
      return node.expression;
    } else {
      return node;
    }
  }
  function convertAttribute(node) {
    if (isJSXSpreadAttribute(node)) {
      return spreadElement(node.argument);
    }
    const value = convertAttributeValue(node.value || booleanLiteral(true));
    if (isStringLiteral(value) && !isJSXExpressionContainer(node.value)) {
      value.value = value.value.replace(/\n\s+/g, " ");
      delete value.extra?.raw;
    }
    if (isJSXNamespacedName(node.name)) {
      node.name = stringLiteral(node.name.namespace.name + ":" + node.name.name.name);
    } else if (isValidIdentifier(node.name.name, false)) {
      node.name.type = "Identifier";
    } else {
      node.name = stringLiteral(node.name.name);
    }
    return inherits(objectProperty(node.name, value), node);
  }
  function buildElementCall(path, pass) {
    if (opts.filter && !opts.filter(path.node, pass)) return;
    const openingPath = path.get("openingElement");
    path.node.children = react.buildChildren(path.node);
    const tagExpr = convertJSXIdentifier(openingPath.node.name, openingPath.node);
    const args = [];
    let tagName;
    if (isIdentifier(tagExpr)) {
      tagName = tagExpr.name;
    } else if (isStringLiteral(tagExpr)) {
      tagName = tagExpr.value;
    }
    const state = {
      tagExpr: tagExpr,
      tagName: tagName,
      args: args,
      pure: false
    };
    if (opts.pre) {
      opts.pre(state, pass);
    }
    const attribs = openingPath.node.attributes;
    let convertedAttributes;
    if (attribs.length) {
      convertedAttributes = objectExpression(attribs.map(convertAttribute));
    } else {
      convertedAttributes = nullLiteral();
    }
    args.push(convertedAttributes, ...path.node.children);
    if (opts.post) {
      opts.post(state, pass);
    }
    const call = state.call || callExpression(state.callee, args);
    if (state.pure) annotateAsPure(call);
    return call;
  }
  function buildFragmentCall(path, pass) {
    if (opts.filter && !opts.filter(path.node, pass)) return;
    path.node.children = react.buildChildren(path.node);
    const args = [];
    const tagName = null;
    const tagExpr = pass.get("jsxFragIdentifier")();
    const state = {
      tagExpr: tagExpr,
      tagName: tagName,
      args: args,
      pure: false
    };
    if (opts.pre) {
      opts.pre(state, pass);
    }
    args.push(nullLiteral(), ...path.node.children);
    if (opts.post) {
      opts.post(state, pass);
    }
    pass.set("usedFragment", true);
    const call = state.call || callExpression(state.callee, args);
    if (state.pure) annotateAsPure(call);
    return call;
  }
}