import { declare } from "@babel/helper-plugin-utils";
import syntaxFlow from "@babel/plugin-syntax-flow";
import { types as t } from "@babel/core";
export default declare((api, opts) => {
  api.assertVersion("8.0.6");
  const FLOW_DIRECTIVE = /@flow(?:\s+(?:strict(?:-local)?|weak))?|@noflow/;
  let skipStrip = false;
  const {
    requireDirective = false
  } = opts;
  return {
    name: "transform-flow-strip-types",
    inherits: syntaxFlow,
    visitor: {
      Program(path, {
        file: {
          ast: {
            comments
          }
        }
      }) {
        skipStrip = false;
        let directiveFound = false;
        if (comments) {
          for (const comment of comments) {
            if (FLOW_DIRECTIVE.test(comment.value)) {
              directiveFound = true;
              comment.value = comment.value.replace(FLOW_DIRECTIVE, "");
              if (!comment.value.replace(/\*/g, "").trim()) {
                comment.ignore = true;
              }
            }
          }
        }
        if (!directiveFound && requireDirective) {
          skipStrip = true;
        }
      },
      ImportDeclaration(path) {
        if (skipStrip) return;
        if (!path.node.specifiers.length) return;
        let typeCount = 0;
        path.node.specifiers.forEach(({
          importKind
        }) => {
          if (importKind === "type" || importKind === "typeof") {
            typeCount++;
          }
        });
        if (typeCount === path.node.specifiers.length) {
          path.remove();
        }
      },
      Flow(path) {
        if (skipStrip) {
          throw path.buildCodeFrameError("A @flow directive is required when using Flow annotations with " + "the `requireDirective` option.");
        }
        path.remove();
      },
      ClassPrivateProperty(path) {
        if (skipStrip) return;
        path.node.typeAnnotation = null;
      },
      Class(path) {
        if (skipStrip) return;
        path.node.implements = null;
        path.get("body.body").forEach(child => {
          if (child.isClassProperty()) {
            const {
              node
            } = child;
            if (node.declare) {
              child.remove();
            } else {
              node.variance = null;
              node.typeAnnotation = null;
            }
          }
        });
      },
      AssignmentPattern({
        node
      }) {
        if (skipStrip) return;
        if (node.left.optional) {
          node.left.optional = false;
        }
      },
      Function({
        node
      }) {
        if (skipStrip) return;
        if (node.params.length > 0 && node.params[0].type === "Identifier" && node.params[0].name === "this") {
          node.params.shift();
        }
        for (let i = 0; i < node.params.length; i++) {
          let param = node.params[i];
          if (param.type === "AssignmentPattern") {
            param = param.left;
          }
          if (param.optional) {
            param.optional = false;
          }
        }
        if (!t.isMethod(node)) {
          node.predicate = null;
        }
      },
      TypeCastExpression(path) {
        if (skipStrip) return;
        let {
          node
        } = path;
        do {
          node = node.expression;
        } while (t.isTypeCastExpression(node));
        path.replaceWith(node);
      },
      CallExpression({
        node
      }) {
        if (skipStrip) return;
        node.typeArguments = null;
      },
      JSXOpeningElement({
        node
      }) {
        if (skipStrip) return;
        node.typeArguments = null;
      },
      OptionalCallExpression({
        node
      }) {
        if (skipStrip) return;
        node.typeArguments = null;
      },
      NewExpression({
        node
      }) {
        if (skipStrip) return;
        node.typeArguments = null;
      }
    }
  };
});