import { declare } from "@babel/helper-plugin-utils";
import path from "node:path";
import { types as t } from "@babel/core";
export default declare(api => {
  api.assertVersion("8.0.6");
  function addDisplayName(id, call) {
    const props = call.arguments[0].properties;
    let safe = true;
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (t.isSpreadElement(prop)) {
        continue;
      }
      const key = t.toComputedKey(prop);
      if (t.isStringLiteral(key, {
        value: "displayName"
      })) {
        safe = false;
        break;
      }
    }
    if (safe) {
      props.unshift(t.objectProperty(t.identifier("displayName"), t.stringLiteral(id)));
    }
  }
  const isCreateClassCallExpression = t.buildMatchMemberExpression("React.createClass");
  const isCreateClassAddon = callee => t.isIdentifier(callee, {
    name: "createReactClass"
  });
  function isCreateClass(node) {
    if (!node || !t.isCallExpression(node)) return false;
    if (!isCreateClassCallExpression(node.callee) && !isCreateClassAddon(node.callee)) {
      return false;
    }
    const args = node.arguments;
    if (args.length !== 1) return false;
    const first = args[0];
    if (!t.isObjectExpression(first)) return false;
    return true;
  }
  return {
    name: "transform-react-display-name",
    visitor: {
      ExportDefaultDeclaration({
        node
      }, state) {
        if (isCreateClass(node.declaration)) {
          const filename = state.filename || "unknown";
          let displayName = path.basename(filename, path.extname(filename));
          if (displayName === "index") {
            displayName = path.basename(path.dirname(filename));
          }
          addDisplayName(displayName, node.declaration);
        }
      },
      CallExpression(path) {
        const {
          node
        } = path;
        if (!isCreateClass(node)) return;
        let id;
        path.find(function (path) {
          if (path.isAssignmentExpression()) {
            id = path.node.left;
          } else if (path.isObjectProperty()) {
            id = path.node.key;
          } else if (path.isVariableDeclarator()) {
            id = path.node.id;
          } else if (path.isStatement()) {
            return true;
          }
          if (id) return true;
          return false;
        });
        if (!id) return;
        if (t.isMemberExpression(id)) {
          id = id.property;
        }
        if (t.isIdentifier(id)) {
          addDisplayName(id.name, node);
        }
      }
    }
  };
});