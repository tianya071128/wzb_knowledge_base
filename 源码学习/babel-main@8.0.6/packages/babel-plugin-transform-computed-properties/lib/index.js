import { types as t } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  if ("loose" in options) {
    console.warn("@babel/plugin-transform-computed-properties: The 'loose' option has been deprecated, " + "use the 'setComputedProperties' assumption instead (https://babeljs.io/assumptions).");
  }
  const setComputedProperties = api.assumption("setComputedProperties") ?? options.loose;
  const pushComputedProps = setComputedProperties ? pushComputedPropsLoose : pushComputedPropsSpec;
  function buildDefineAccessor(state, obj, prop) {
    const type = prop.kind;
    const key = !prop.computed && t.isIdentifier(prop.key) ? t.stringLiteral(prop.key.name) : prop.key;
    const fn = getValue(prop);
    return t.callExpression(state.addHelper("defineAccessor"), [t.stringLiteral(type), obj, key, fn]);
  }
  function getValue(prop) {
    if (t.isObjectProperty(prop)) {
      return prop.value;
    } else if (t.isObjectMethod(prop)) {
      return t.functionExpression(null, prop.params, prop.body, prop.generator, prop.async);
    }
  }
  function pushAssign(objId, prop, body) {
    body.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.cloneNode(objId), prop.key, prop.computed || t.isLiteral(prop.key)), getValue(prop))));
  }
  function pushComputedPropsLoose(info) {
    const {
      computedProps,
      state,
      initPropExpression,
      objId,
      body
    } = info;
    for (const prop of computedProps) {
      if (t.isObjectMethod(prop) && (prop.kind === "get" || prop.kind === "set")) {
        if (computedProps.length === 1) {
          return buildDefineAccessor(state, initPropExpression, prop);
        } else {
          body.push(t.expressionStatement(buildDefineAccessor(state, t.cloneNode(objId), prop)));
        }
      } else {
        pushAssign(t.cloneNode(objId), prop, body);
      }
    }
  }
  function pushComputedPropsSpec(info) {
    const {
      objId,
      body,
      computedProps,
      state
    } = info;
    const CHUNK_LENGTH_CAP = 10;
    let currentChunk = null;
    const computedPropsChunks = [];
    for (const prop of computedProps) {
      if (!currentChunk || currentChunk.length === CHUNK_LENGTH_CAP) {
        currentChunk = [];
        computedPropsChunks.push(currentChunk);
      }
      currentChunk.push(prop);
    }
    for (const chunk of computedPropsChunks) {
      const single = computedPropsChunks.length === 1;
      let node = single ? info.initPropExpression : t.cloneNode(objId);
      for (const prop of chunk) {
        if (t.isObjectMethod(prop) && (prop.kind === "get" || prop.kind === "set")) {
          node = buildDefineAccessor(info.state, node, prop);
        } else {
          node = t.callExpression(state.addHelper("defineProperty"), [node, t.toComputedKey(prop), getValue(prop)]);
        }
      }
      if (single) return node;
      body.push(t.expressionStatement(node));
    }
  }
  return {
    name: "transform-computed-properties",
    visitor: {
      ObjectExpression: {
        exit(path, state) {
          const {
            node,
            parent,
            scope
          } = path;
          let hasComputed = false;
          for (const prop of node.properties) {
            hasComputed = prop.computed === true;
            if (hasComputed) break;
          }
          if (!hasComputed) return;
          const initProps = [];
          const computedProps = [];
          let foundComputed = false;
          for (const prop of node.properties) {
            if (t.isSpreadElement(prop)) {
              continue;
            }
            if (prop.computed) {
              foundComputed = true;
            }
            if (foundComputed) {
              computedProps.push(prop);
            } else {
              initProps.push(prop);
            }
          }
          const objId = scope.generateUidIdentifierBasedOnNode(parent);
          const initPropExpression = t.objectExpression(initProps);
          const body = [];
          body.push(t.variableDeclaration("var", [t.variableDeclarator(objId, initPropExpression)]));
          const single = pushComputedProps({
            scope,
            objId,
            body,
            computedProps,
            initPropExpression,
            state
          });
          if (single) {
            path.replaceWith(single);
          } else {
            if (setComputedProperties) {
              body.push(t.expressionStatement(t.cloneNode(objId)));
            }
            path.replaceWithMultiple(body);
          }
        }
      }
    }
  };
});