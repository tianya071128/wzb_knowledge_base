import { declare } from "@babel/helper-plugin-utils";
import { template, types as t } from "@babel/core";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  if ("loose" in options) {
    console.warn("@babel/plugin-transform-template-literals: The 'loose' option has been deprecated, " + "use the `ignoreToPrimitiveHint` and `mutableTemplateObject` assumptions instead (https://babeljs.io/assumptions).");
  }
  const ignoreToPrimitiveHint = api.assumption("ignoreToPrimitiveHint") ?? options.loose;
  const mutableTemplateObject = api.assumption("mutableTemplateObject") ?? options.loose;
  let helperName = "taggedTemplateLiteral";
  if (mutableTemplateObject) helperName += "Loose";
  function buildConcatCallExpressions(items) {
    let avail = true;
    return items.reduce(function (left, right) {
      let canBeInserted = t.isLiteral(right);
      if (!canBeInserted && avail) {
        canBeInserted = true;
        avail = false;
      }
      if (canBeInserted && t.isCallExpression(left)) {
        left.arguments.push(right);
        return left;
      }
      return t.callExpression(t.memberExpression(left, t.identifier("concat")), [right]);
    });
  }
  return {
    name: "transform-template-literals",
    visitor: {
      TaggedTemplateExpression(path) {
        const {
          node
        } = path;
        const {
          quasi
        } = node;
        const strings = [];
        const raws = [];
        let isStringsRawEqual = true;
        for (const elem of quasi.quasis) {
          const {
            raw,
            cooked
          } = elem.value;
          const value = cooked == null ? t.buildUndefinedNode() : t.stringLiteral(cooked);
          strings.push(value);
          raws.push(t.stringLiteral(raw));
          if (raw !== cooked) {
            isStringsRawEqual = false;
          }
        }
        const helperArgs = [t.arrayExpression(strings)];
        if (!isStringsRawEqual) {
          helperArgs.push(t.arrayExpression(raws));
        }
        const tmp = path.scope.generateUidIdentifier("templateObject");
        path.scope.getProgramParent().push({
          id: t.cloneNode(tmp)
        });
        path.replaceWith(t.callExpression(node.tag, [template.expression.ast`
              ${t.cloneNode(tmp)} || (
                ${tmp} = ${this.addHelper(helperName)}(${helperArgs})
              )
            `, ...quasi.expressions]));
      },
      TemplateLiteral(path) {
        if (path.parent.type === "TSLiteralType") {
          return;
        }
        const nodes = [];
        const expressions = path.get("expressions");
        let index = 0;
        for (const elem of path.node.quasis) {
          if (elem.value.cooked) {
            nodes.push(t.stringLiteral(elem.value.cooked));
          }
          if (index < expressions.length) {
            const expr = expressions[index++];
            const node = expr.node;
            if (!t.isStringLiteral(node, {
              value: ""
            })) {
              nodes.push(node);
            }
          }
        }
        if (!t.isStringLiteral(nodes[0]) && !(ignoreToPrimitiveHint && t.isStringLiteral(nodes[1]))) {
          nodes.unshift(t.stringLiteral(""));
        }
        let root = nodes[0];
        if (ignoreToPrimitiveHint) {
          for (let i = 1; i < nodes.length; i++) {
            root = t.binaryExpression("+", root, nodes[i]);
          }
        } else if (nodes.length > 1) {
          root = buildConcatCallExpressions(nodes);
        }
        path.replaceWith(root);
      }
    }
  };
});