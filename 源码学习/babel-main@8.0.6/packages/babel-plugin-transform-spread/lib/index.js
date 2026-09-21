import { declare } from "@babel/helper-plugin-utils";
import { skipTransparentExprWrappers } from "@babel/helper-skip-transparent-expression-wrappers";
import { types as t, template } from "@babel/core";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  if ("loose" in options) {
    console.warn("@babel/plugin-transform-spread: The 'loose' option has been deprecated, " + "use the `iterableIsArray` assumption instead (https://babeljs.io/assumptions).");
  }
  const iterableIsArray = api.assumption("iterableIsArray") ?? options.loose;
  const arrayLikeIsIterable = options.allowArrayLike ?? api.assumption("arrayLikeIsIterable");
  function getSpreadLiteral(spread, scope) {
    if (iterableIsArray && !t.isIdentifier(spread.argument, {
      name: "arguments"
    })) {
      return spread.argument;
    } else {
      const node = spread.argument;
      if (t.isIdentifier(node)) {
        const binding = scope.getBinding(node.name);
        if (binding?.constant && binding.path.isGenericType("Array")) {
          return node;
        }
      }
      if (t.isArrayExpression(node)) {
        return node;
      }
      if (t.isIdentifier(node, {
        name: "arguments"
      })) {
        return template.expression.ast`
          Array.prototype.slice.call(${node})
        `;
      }
      const args = [node];
      let helperName = "toConsumableArray";
      if (arrayLikeIsIterable) {
        args.unshift(scope.path.hub.addHelper(helperName));
        helperName = "maybeArrayLike";
      }
      return t.callExpression(scope.path.hub.addHelper(helperName), args);
    }
  }
  function hasHole(spread) {
    return spread.elements.includes(null);
  }
  function hasSpread(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      if (t.isSpreadElement(nodes[i])) {
        return true;
      }
    }
    return false;
  }
  function push(_props, nodes) {
    if (!_props.length) return _props;
    nodes.push(t.arrayExpression(_props));
    return [];
  }
  function build(props, scope, file) {
    const nodes = [];
    let _props = [];
    for (const prop of props) {
      if (t.isSpreadElement(prop)) {
        _props = push(_props, nodes);
        let spreadLiteral = getSpreadLiteral(prop, scope);
        if (t.isArrayExpression(spreadLiteral) && hasHole(spreadLiteral)) {
          spreadLiteral = t.callExpression(file.addHelper("arrayLikeToArray"), [spreadLiteral]);
        }
        nodes.push(spreadLiteral);
      } else {
        _props.push(prop);
      }
    }
    push(_props, nodes);
    return nodes;
  }
  return {
    name: "transform-spread",
    visitor: {
      ArrayExpression(path) {
        const {
          node,
          scope
        } = path;
        const elements = node.elements;
        if (!hasSpread(elements)) return;
        const nodes = build(elements, scope, this.file);
        let first = nodes[0];
        if (nodes.length === 1 && first !== elements[0].argument) {
          path.replaceWith(first);
          return;
        }
        if (!t.isArrayExpression(first)) {
          first = t.arrayExpression([]);
        } else {
          nodes.shift();
        }
        path.replaceWith(t.callExpression(t.memberExpression(first, t.identifier("concat")), nodes));
      },
      CallExpression(path) {
        const {
          node,
          scope
        } = path;
        const args = node.arguments;
        if (!hasSpread(args)) return;
        const calleePath = skipTransparentExprWrappers(path.get("callee"));
        if (calleePath.isSuper()) {
          throw path.buildCodeFrameError("It's not possible to compile spread arguments in `super()` without compiling classes.\n" + "Please add '@babel/plugin-transform-classes' to your Babel configuration.");
        }
        let contextLiteral = t.buildUndefinedNode();
        node.arguments = [];
        let nodes;
        if (args.length === 1 && t.isIdentifier(args[0].argument, {
          name: "arguments"
        })) {
          nodes = [args[0].argument];
        } else {
          nodes = build(args, scope, this.file);
        }
        const first = nodes.shift();
        if (nodes.length) {
          node.arguments.push(t.callExpression(t.memberExpression(first, t.identifier("concat")), nodes));
        } else {
          node.arguments.push(first);
        }
        const callee = calleePath.node;
        if (t.isMemberExpression(callee)) {
          const temp = scope.maybeGenerateMemoised(callee.object);
          if (temp) {
            callee.object = t.assignmentExpression("=", temp, callee.object);
            contextLiteral = temp;
          } else {
            contextLiteral = t.cloneNode(callee.object);
          }
        }
        node.callee = t.memberExpression(node.callee, t.identifier("apply"));
        if (t.isSuper(contextLiteral)) {
          contextLiteral = t.thisExpression();
        }
        node.arguments.unshift(t.cloneNode(contextLiteral));
      },
      NewExpression(path) {
        const {
          node,
          scope
        } = path;
        if (!hasSpread(node.arguments)) return;
        const nodes = build(node.arguments, scope, this.file);
        const first = nodes.shift();
        let args;
        if (nodes.length) {
          args = t.callExpression(t.memberExpression(first, t.identifier("concat")), nodes);
        } else {
          args = first;
        }
        path.replaceWith(t.callExpression(path.hub.addHelper("construct"), [node.callee, args]));
      }
    }
  };
});