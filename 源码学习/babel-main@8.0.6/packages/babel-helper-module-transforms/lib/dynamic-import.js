import { types as t, template } from "@babel/core";
export function buildDynamicImport(node, deferToThen, wrapWithPromise, builder) {
  const specifier = t.isCallExpression(node) ? node.arguments[0] : node.source;
  if (t.isStringLiteral(specifier) || t.isTemplateLiteral(specifier) && specifier.quasis.length === 0) {
    if (deferToThen) {
      return template.expression.ast`
        Promise.resolve().then(() => ${builder(specifier)})
      `;
    } else return builder(specifier);
  }
  const specifierToString = t.isTemplateLiteral(specifier) ? t.identifier("specifier") : t.templateLiteral([t.templateElement({
    raw: ""
  }), t.templateElement({
    raw: ""
  })], [t.identifier("specifier")]);
  if (deferToThen) {
    return template.expression.ast`
      (specifier =>
        new Promise(r => r(${specifierToString}))
          .then(s => ${builder(t.identifier("s"))})
      )(${specifier})
    `;
  } else if (wrapWithPromise) {
    return template.expression.ast`
      (specifier =>
        new Promise(r => r(${builder(specifierToString)}))
      )(${specifier})
    `;
  } else {
    return template.expression.ast`
      (specifier => ${builder(specifierToString)})(${specifier})
    `;
  }
}