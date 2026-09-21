import { template, types as t } from "@babel/core";
import { visitors } from "@babel/traverse";
import ReplaceSupers from "@babel/helper-replace-supers";
import memberExpressionToFunctions from "@babel/helper-member-expression-to-functions";
import optimiseCall from "@babel/helper-optimise-call-expression";
import annotateAsPure from "@babel/helper-annotate-as-pure";
import { skipTransparentExprWrapperNodes } from "@babel/helper-skip-transparent-expression-wrappers";
import * as ts from "./typescript.js";
export function buildPrivateNamesMap(className, privateFieldsAsSymbolsOrProperties, props) {
  const privateNamesMap = new Map();
  let classBrandId;
  for (const prop of props) {
    if (prop.isPrivate()) {
      const {
        name
      } = prop.node.key.id;
      let update = privateNamesMap.get(name);
      if (!update) {
        const isMethod = !prop.isProperty();
        const isStatic = prop.node.static;
        let initAdded = false;
        let id;
        if (!privateFieldsAsSymbolsOrProperties && isMethod && !isStatic) {
          initAdded = !!classBrandId;
          classBrandId ??= prop.scope.generateUidIdentifier(`${className}_brand`);
          id = classBrandId;
        } else {
          id = prop.scope.generateUidIdentifier(name);
        }
        update = {
          id,
          static: isStatic,
          method: isMethod,
          initAdded
        };
        privateNamesMap.set(name, update);
      }
      if (prop.isClassPrivateMethod()) {
        if (prop.node.kind === "get") {
          const {
            body
          } = prop.node.body;
          let $;
          if (body.length === 1 && t.isReturnStatement($ = body[0]) && t.isCallExpression($ = $.argument) && $.arguments.length === 1 && t.isThisExpression($.arguments[0]) && t.isIdentifier($ = $.callee)) {
            update.getId = t.cloneNode($);
            update.getterDeclared = true;
          } else {
            update.getId = prop.scope.generateUidIdentifier(`get_${name}`);
          }
        } else if (prop.node.kind === "set") {
          const {
            params
          } = prop.node;
          const {
            body
          } = prop.node.body;
          let $;
          if (body.length === 1 && t.isExpressionStatement($ = body[0]) && t.isCallExpression($ = $.expression) && $.arguments.length === 2 && t.isThisExpression($.arguments[0]) && t.isIdentifier($.arguments[1], {
            name: params[0].name
          }) && t.isIdentifier($ = $.callee)) {
            update.setId = t.cloneNode($);
            update.setterDeclared = true;
          } else {
            update.setId = prop.scope.generateUidIdentifier(`set_${name}`);
          }
        } else if (prop.node.kind === "method") {
          update.methodId = prop.scope.generateUidIdentifier(name);
        }
      }
      privateNamesMap.set(name, update);
    }
  }
  return privateNamesMap;
}
export function buildPrivateNamesNodes(privateNamesMap, privateFieldsAsProperties, privateFieldsAsSymbols, state) {
  const initNodes = [];
  const injectedIds = new Set();
  for (const [name, value] of privateNamesMap) {
    const {
      static: isStatic,
      method: isMethod
    } = value;
    const id = t.cloneNode(value.id);
    let init;
    if (privateFieldsAsProperties) {
      init = t.callExpression(state.addHelper("classPrivateFieldLooseKey"), [t.stringLiteral(name)]);
    } else if (privateFieldsAsSymbols) {
      init = t.callExpression(t.identifier("Symbol"), [t.stringLiteral(name)]);
    } else if (!isStatic) {
      if (injectedIds.has(id.name)) continue;
      injectedIds.add(id.name);
      init = t.newExpression(t.identifier(isMethod ? "WeakSet" : "WeakMap"), []);
    }
    if (init) {
      if (!privateFieldsAsSymbols) {
        annotateAsPure(init);
      }
      initNodes.push(template.statement.ast`var ${id} = ${init}`);
    }
  }
  return initNodes;
}
export function privateNameVisitorFactory(visitor) {
  const nestedVisitor = visitors.environmentVisitor({
    ...visitor
  });
  const privateNameVisitor = {
    ...visitor,
    Class(path) {
      const {
        privateNamesMap
      } = this;
      const body = path.get("body.body");
      const visiblePrivateNames = new Map(privateNamesMap);
      const redeclared = [];
      for (const prop of body) {
        if (!prop.isPrivate()) continue;
        const {
          name
        } = prop.node.key.id;
        visiblePrivateNames.delete(name);
        redeclared.push(name);
      }
      if (!redeclared.length) {
        return;
      }
      path.get("body").traverse(nestedVisitor, {
        ...this,
        redeclared
      });
      path.traverse(privateNameVisitor, {
        ...this,
        privateNamesMap: visiblePrivateNames
      });
      path.skipKey("body");
    }
  };
  return privateNameVisitor;
}
const privateNameVisitor = privateNameVisitorFactory({
  PrivateName(path, {
    noDocumentAll
  }) {
    const {
      privateNamesMap,
      redeclared
    } = this;
    const {
      node,
      parentPath
    } = path;
    if (!parentPath.isMemberExpression({
      property: node
    }) && !parentPath.isOptionalMemberExpression({
      property: node
    })) {
      return;
    }
    const {
      name
    } = node.id;
    if (!privateNamesMap.has(name)) return;
    if (redeclared?.includes(name)) return;
    this.handle(parentPath, noDocumentAll);
  }
});
function unshadow(name, scope, innerBinding) {
  while (scope?.hasBinding(name) && scope.getBindingIdentifier(name) !== innerBinding) {
    scope.rename(name);
    scope = scope.parent;
  }
}
export function buildCheckInRHS(rhs, file, inRHSIsObject) {
  if (inRHSIsObject || !file.availableHelper?.("checkInRHS")) return rhs;
  return t.callExpression(file.addHelper("checkInRHS"), [rhs]);
}
const privateInVisitor = privateNameVisitorFactory({
  BinaryExpression(path, {
    file
  }) {
    const {
      operator,
      left,
      right
    } = path.node;
    if (operator !== "in") return;
    if (!t.isPrivateName(left)) return;
    const {
      privateFieldsAsProperties,
      privateNamesMap,
      redeclared
    } = this;
    const {
      name
    } = left.id;
    if (!privateNamesMap.has(name)) return;
    if (redeclared?.includes(name)) return;
    unshadow(this.classRef.name, path.scope, this.innerBinding);
    if (privateFieldsAsProperties) {
      const {
        id
      } = privateNamesMap.get(name);
      path.replaceWith(template.expression.ast`
        Object.prototype.hasOwnProperty.call(${buildCheckInRHS(right, file)}, ${t.cloneNode(id)})
      `);
      return;
    }
    const {
      id,
      static: isStatic
    } = privateNamesMap.get(name);
    if (isStatic) {
      path.replaceWith(template.expression.ast`${buildCheckInRHS(right, file)} === ${t.cloneNode(this.classRef)}`);
      return;
    }
    path.replaceWith(template.expression.ast`${t.cloneNode(id)}.has(${buildCheckInRHS(right, file)})`);
  }
});
function readOnlyError(file, name) {
  return t.callExpression(file.addHelper("readOnlyError"), [t.stringLiteral(`#${name}`)]);
}
function writeOnlyError(file, name) {
  return t.callExpression(file.addHelper("writeOnlyError"), [t.stringLiteral(`#${name}`)]);
}
function buildStaticPrivateFieldAccess(expr, noUninitializedPrivateFieldAccess) {
  if (noUninitializedPrivateFieldAccess) return expr;
  return t.memberExpression(expr, t.identifier("_"));
}
function autoInherits(fn) {
  return function (member) {
    return t.inherits(fn.apply(this, arguments), member.node);
  };
}
const privateNameHandlerSpec = {
  memoise(member, count) {
    const {
      scope
    } = member;
    const {
      object
    } = member.node;
    const memo = scope.maybeGenerateMemoised(object);
    if (!memo) {
      return;
    }
    this.memoiser.set(object, memo, count);
  },
  receiver(member) {
    const {
      object
    } = member.node;
    if (this.memoiser.has(object)) {
      return t.cloneNode(this.memoiser.get(object));
    }
    return t.cloneNode(object);
  },
  get: autoInherits(function (member) {
    const {
      classRef,
      privateNamesMap,
      file,
      innerBinding,
      noUninitializedPrivateFieldAccess
    } = this;
    const privateName = member.node.property;
    const {
      name
    } = privateName.id;
    const {
      id,
      static: isStatic,
      method: isMethod,
      methodId,
      getId,
      setId
    } = privateNamesMap.get(name);
    const isGetterOrSetter = getId || setId;
    const cloneId = id => t.inherits(t.cloneNode(id), privateName);
    if (isStatic) {
      unshadow(classRef.name, member.scope, innerBinding);
      const receiver = this.receiver(member);
      const skipCheck = t.isIdentifier(receiver) && receiver.name === classRef.name;
      if (!isMethod) {
        if (skipCheck) {
          return buildStaticPrivateFieldAccess(cloneId(id), noUninitializedPrivateFieldAccess);
        }
        return buildStaticPrivateFieldAccess(t.callExpression(file.addHelper("assertClassBrand"), [t.cloneNode(classRef), receiver, cloneId(id)]), noUninitializedPrivateFieldAccess);
      }
      if (getId) {
        if (skipCheck) {
          return t.callExpression(cloneId(getId), [receiver]);
        }
        return t.callExpression(file.addHelper("classPrivateGetter"), [t.cloneNode(classRef), receiver, cloneId(getId)]);
      }
      if (setId) {
        const err = t.buildUndefinedNode();
        if (skipCheck) return err;
        return t.sequenceExpression([t.callExpression(file.addHelper("assertClassBrand"), [t.cloneNode(classRef), receiver]), err]);
      }
      if (skipCheck) return cloneId(id);
      return t.callExpression(file.addHelper("assertClassBrand"), [t.cloneNode(classRef), receiver, cloneId(id)]);
    }
    if (isMethod) {
      if (isGetterOrSetter) {
        if (!getId) {
          return t.sequenceExpression([this.receiver(member), writeOnlyError(file, name)]);
        }
        return t.callExpression(file.addHelper("classPrivateGetter"), [t.cloneNode(id), this.receiver(member), cloneId(getId)]);
      }
      return t.callExpression(file.addHelper("assertClassBrand"), [t.cloneNode(id), this.receiver(member), cloneId(methodId)]);
    }
    return t.callExpression(file.addHelper("classPrivateFieldGet2"), [cloneId(id), this.receiver(member)]);
  }),
  boundGet(member) {
    this.memoise(member, 1);
    return t.callExpression(t.memberExpression(this.get(member), t.identifier("bind")), [this.receiver(member)]);
  },
  set: autoInherits(function (member, value) {
    const {
      classRef,
      privateNamesMap,
      file,
      noUninitializedPrivateFieldAccess
    } = this;
    const privateName = member.node.property;
    const {
      name
    } = privateName.id;
    const {
      id,
      static: isStatic,
      method: isMethod,
      setId
    } = privateNamesMap.get(name);
    const cloneId = id => t.inherits(t.cloneNode(id), privateName);
    if (isStatic) {
      const receiver = this.receiver(member);
      const skipCheck = t.isIdentifier(receiver) && receiver.name === classRef.name;
      if (isMethod && !setId) {
        const err = readOnlyError(file, name);
        if (skipCheck) return t.sequenceExpression([value, err]);
        return t.sequenceExpression([value, t.callExpression(file.addHelper("assertClassBrand"), [t.cloneNode(classRef), receiver]), readOnlyError(file, name)]);
      }
      if (setId) {
        if (skipCheck) {
          return t.callExpression(t.cloneNode(setId), [receiver, value]);
        }
        return t.callExpression(file.addHelper("classPrivateSetter"), [t.cloneNode(classRef), cloneId(setId), receiver, value]);
      }
      return t.assignmentExpression("=", buildStaticPrivateFieldAccess(cloneId(id), noUninitializedPrivateFieldAccess), skipCheck ? value : t.callExpression(file.addHelper("assertClassBrand"), [t.cloneNode(classRef), receiver, value]));
    }
    if (isMethod) {
      if (setId) {
        return t.callExpression(file.addHelper("classPrivateSetter"), [t.cloneNode(id), cloneId(setId), this.receiver(member), value]);
      }
      return t.sequenceExpression([this.receiver(member), value, readOnlyError(file, name)]);
    }
    return t.callExpression(file.addHelper("classPrivateFieldSet2"), [cloneId(id), this.receiver(member), value]);
  }),
  destructureSet(member) {
    const {
      privateNamesMap,
      file,
      noUninitializedPrivateFieldAccess
    } = this;
    const privateName = member.node.property;
    const {
      name
    } = privateName.id;
    const {
      static: isStatic,
      method: isMethod,
      setId
    } = privateNamesMap.get(name);
    if (isMethod && !setId) {
      return t.memberExpression(t.sequenceExpression([member.node.object, readOnlyError(file, name)]), t.identifier("_"));
    }
    if (isStatic && !isMethod) {
      const getCall = this.get(member);
      if (!noUninitializedPrivateFieldAccess || !t.isCallExpression(getCall)) {
        return getCall;
      }
      const ref = getCall.arguments.pop();
      getCall.arguments.push(template.expression.ast`(_) => ${ref} = _`);
      return t.memberExpression(t.callExpression(file.addHelper("toSetter"), [getCall]), t.identifier("_"));
    }
    const setCall = this.set(member, t.identifier("_"));
    if (!t.isCallExpression(setCall) || !t.isIdentifier(setCall.arguments[setCall.arguments.length - 1], {
      name: "_"
    })) {
      throw member.buildCodeFrameError("Internal Babel error while compiling this code. This is a Babel bug. " + "Please report it at https://github.com/babel/babel/issues.");
    }
    let args;
    if (t.isMemberExpression(setCall.callee, {
      computed: false
    }) && t.isIdentifier(setCall.callee.property) && setCall.callee.property.name === "call") {
      args = [setCall.callee.object, t.arrayExpression(setCall.arguments.slice(1, -1)), setCall.arguments[0]];
    } else {
      args = [setCall.callee, t.arrayExpression(setCall.arguments.slice(0, -1))];
    }
    return t.memberExpression(t.callExpression(file.addHelper("toSetter"), args), t.identifier("_"));
  },
  call(member, args) {
    this.memoise(member, 1);
    return optimiseCall(this.get(member), this.receiver(member), args, false);
  },
  optionalCall(member, args) {
    this.memoise(member, 1);
    return optimiseCall(this.get(member), this.receiver(member), args, true);
  },
  delete() {
    throw new Error("Internal Babel error: deleting private elements is a parsing error.");
  }
};
const privateNameHandlerLoose = {
  get(member) {
    const {
      privateNamesMap,
      file
    } = this;
    const {
      object
    } = member.node;
    const {
      name
    } = member.node.property.id;
    return template.expression`BASE(REF, PROP)[PROP]`({
      BASE: file.addHelper("classPrivateFieldLooseBase"),
      REF: t.cloneNode(object),
      PROP: t.cloneNode(privateNamesMap.get(name).id)
    });
  },
  set() {
    throw new Error("private name handler with loose = true don't need set()");
  },
  boundGet(member) {
    return t.callExpression(t.memberExpression(this.get(member), t.identifier("bind")), [t.cloneNode(member.node.object)]);
  },
  simpleSet(member) {
    return this.get(member);
  },
  destructureSet(member) {
    return this.get(member);
  },
  call(member, args) {
    return t.callExpression(this.get(member), args);
  },
  optionalCall(member, args) {
    return t.optionalCallExpression(this.get(member), args, true);
  },
  delete() {
    throw new Error("Internal Babel error: deleting private elements is a parsing error.");
  }
};
export function transformPrivateNamesUsage(ref, path, privateNamesMap, {
  privateFieldsAsProperties,
  noUninitializedPrivateFieldAccess,
  noDocumentAll,
  innerBinding
}, state) {
  if (!privateNamesMap.size) return;
  const body = path.get("body");
  const handler = privateFieldsAsProperties ? privateNameHandlerLoose : privateNameHandlerSpec;
  memberExpressionToFunctions(body, privateNameVisitor, {
    privateNamesMap,
    classRef: ref,
    file: state,
    ...handler,
    noDocumentAll,
    noUninitializedPrivateFieldAccess,
    innerBinding
  });
  body.traverse(privateInVisitor, {
    privateNamesMap,
    classRef: ref,
    file: state,
    privateFieldsAsProperties,
    innerBinding
  });
}
function buildPrivateFieldInitLoose(ref, prop, privateNamesMap) {
  const {
    id
  } = privateNamesMap.get(prop.node.key.id.name);
  const value = prop.node.value || t.buildUndefinedNode();
  return inheritPropComments(template.statement.ast`
      Object.defineProperty(${ref}, ${t.cloneNode(id)}, {
        // configurable is false by default
        // enumerable is false by default
        writable: true,
        value: ${value}
      });
    `, prop);
}
function buildPrivateInstanceFieldInitSpec(ref, prop, privateNamesMap, state) {
  const {
    id
  } = privateNamesMap.get(prop.node.key.id.name);
  const value = prop.node.value || t.buildUndefinedNode();
  const helper = state.addHelper("classPrivateFieldInitSpec");
  return inheritLoc(inheritPropComments(t.expressionStatement(t.callExpression(helper, [t.thisExpression(), inheritLoc(t.cloneNode(id), prop.node.key), value])), prop), prop.node);
}
function buildPrivateStaticFieldInitSpec(prop, privateNamesMap, noUninitializedPrivateFieldAccess) {
  const privateName = privateNamesMap.get(prop.node.key.id.name);
  const value = noUninitializedPrivateFieldAccess ? prop.node.value : template.expression.ast`{
        _: ${prop.node.value || t.buildUndefinedNode()}
      }`;
  return inheritPropComments(t.variableDeclaration("var", [t.variableDeclarator(t.cloneNode(privateName.id), value)]), prop);
}
function buildPrivateMethodInitLoose(ref, prop, privateNamesMap) {
  const privateName = privateNamesMap.get(prop.node.key.id.name);
  const {
    methodId,
    id,
    getId,
    setId,
    initAdded
  } = privateName;
  if (initAdded) return;
  if (methodId) {
    return inheritPropComments(template.statement.ast`
        Object.defineProperty(${ref}, ${id}, {
          // configurable is false by default
          // enumerable is false by default
          // writable is false by default
          value: ${methodId.name}
        });
      `, prop);
  }
  const isGetterOrSetter = getId || setId;
  if (isGetterOrSetter) {
    privateNamesMap.set(prop.node.key.id.name, {
      ...privateName,
      initAdded: true
    });
    return inheritPropComments(template.statement.ast`
        Object.defineProperty(${ref}, ${id}, {
          // configurable is false by default
          // enumerable is false by default
          // writable is false by default
          get: ${getId ? getId.name : t.buildUndefinedNode()},
          set: ${setId ? setId.name : t.buildUndefinedNode()}
        });
      `, prop);
  }
}
function buildPrivateInstanceMethodInitSpec(ref, prop, privateNamesMap, state) {
  const privateName = privateNamesMap.get(prop.node.key.id.name);
  if (privateName.initAdded) return;
  return buildPrivateInstanceMethodInitialization(ref, prop, privateNamesMap, state);
}
function buildPrivateInstanceMethodInitialization(ref, prop, privateNamesMap, state) {
  const privateName = privateNamesMap.get(prop.node.key.id.name);
  const {
    id
  } = privateName;
  const helper = state.addHelper("classPrivateMethodInitSpec");
  return inheritPropComments(template.statement.ast`${helper}(
      ${t.thisExpression()},
      ${t.cloneNode(id)}
    )`, prop);
}
function buildPublicFieldInitLoose(ref, prop) {
  const {
    key,
    computed
  } = prop.node;
  const value = prop.node.value || t.buildUndefinedNode();
  return inheritPropComments(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(ref, key, computed || t.isLiteral(key)), value)), prop);
}
function buildPublicFieldInitSpec(ref, prop, state) {
  const {
    key,
    computed
  } = prop.node;
  const value = prop.node.value || t.buildUndefinedNode();
  return inheritPropComments(t.expressionStatement(t.callExpression(state.addHelper("defineProperty"), [ref, computed || t.isLiteral(key) ? key : t.stringLiteral(key.name), value])), prop);
}
function buildPrivateStaticMethodInitLoose(ref, prop, privateNamesMap) {
  const privateName = privateNamesMap.get(prop.node.key.id.name);
  const {
    id,
    methodId,
    getId,
    setId,
    initAdded
  } = privateName;
  if (initAdded) return;
  const isGetterOrSetter = getId || setId;
  if (isGetterOrSetter) {
    privateNamesMap.set(prop.node.key.id.name, {
      ...privateName,
      initAdded: true
    });
    return inheritPropComments(template.statement.ast`
        Object.defineProperty(${ref}, ${id}, {
          // configurable is false by default
          // enumerable is false by default
          // writable is false by default
          get: ${getId ? getId.name : t.buildUndefinedNode()},
          set: ${setId ? setId.name : t.buildUndefinedNode()}
        })
      `, prop);
  }
  return inheritPropComments(template.statement.ast`
      Object.defineProperty(${ref}, ${id}, {
        // configurable is false by default
        // enumerable is false by default
        // writable is false by default
        value: ${methodId.name}
      });
    `, prop);
}
function buildPrivateMethodDeclaration(prop, privateNamesMap, privateFieldsAsSymbolsOrProperties = false) {
  const privateName = privateNamesMap.get(prop.node.key.id.name);
  const {
    id,
    methodId,
    getId,
    setId,
    getterDeclared,
    setterDeclared,
    static: isStatic
  } = privateName;
  const {
    params,
    body,
    generator,
    async
  } = prop.node;
  const isGetter = getId && params.length === 0;
  const isSetter = setId && params.length > 0;
  if (isGetter && getterDeclared || isSetter && setterDeclared) {
    privateNamesMap.set(prop.node.key.id.name, {
      ...privateName,
      initAdded: true
    });
    return null;
  }
  if ((isGetter || isSetter) && !privateFieldsAsSymbolsOrProperties) {
    const scope = prop.get("body").scope;
    const thisArg = scope.generateUidIdentifier("this");
    const state = {
      thisRef: thisArg,
      argumentsPath: []
    };
    prop.traverse(thisContextVisitor, state);
    if (state.argumentsPath.length) {
      const argumentsId = scope.generateUidIdentifier("arguments");
      scope.push({
        id: argumentsId,
        init: template.expression.ast`[].slice.call(arguments, 1)`
      });
      for (const path of state.argumentsPath) {
        path.replaceWith(t.cloneNode(argumentsId));
      }
    }
    params.unshift(t.cloneNode(thisArg));
  }
  let declId = methodId;
  if (isGetter) {
    privateNamesMap.set(prop.node.key.id.name, {
      ...privateName,
      getterDeclared: true,
      initAdded: true
    });
    declId = getId;
  } else if (isSetter) {
    privateNamesMap.set(prop.node.key.id.name, {
      ...privateName,
      setterDeclared: true,
      initAdded: true
    });
    declId = setId;
  } else if (isStatic && !privateFieldsAsSymbolsOrProperties) {
    declId = id;
  }
  return inheritPropComments(t.functionDeclaration(t.cloneNode(declId), params, body, generator, async), prop);
}
const thisContextVisitor = visitors.environmentVisitor({
  Identifier(path, state) {
    if (state.argumentsPath && path.node.name === "arguments") {
      state.argumentsPath.push(path);
    }
  },
  UnaryExpression(path) {
    const {
      node
    } = path;
    if (node.operator === "delete") {
      const argument = skipTransparentExprWrapperNodes(node.argument);
      if (t.isThisExpression(argument)) {
        path.replaceWith(t.booleanLiteral(true));
      }
    }
  },
  ThisExpression(path, state) {
    state.needsClassRef = true;
    path.replaceWith(t.cloneNode(state.thisRef));
  },
  MetaProperty(path) {
    const {
      node
    } = path;
    if (node.meta.name === "new" && node.property.name === "target") {
      path.replaceWith(t.buildUndefinedNode());
    }
  }
});
const innerReferencesVisitor = {
  ReferencedIdentifier(path, state) {
    if (path.scope.getBindingIdentifier(path.node.name) === state.innerBinding) {
      state.needsClassRef = true;
      path.node.name = state.thisRef.name;
    }
  }
};
function replaceThisContext(path, ref, innerBindingRef) {
  const state = {
    thisRef: ref,
    needsClassRef: false,
    innerBinding: innerBindingRef
  };
  if (!path.isMethod()) {
    path.traverse(thisContextVisitor, state);
  }
  if (innerBindingRef != null && state.thisRef?.name && state.thisRef.name !== innerBindingRef.name) {
    path.traverse(innerReferencesVisitor, state);
  }
  return state.needsClassRef;
}
function isNameOrLength({
  key,
  computed
}) {
  if (key.type === "Identifier") {
    return !computed && (key.name === "name" || key.name === "length");
  }
  if (key.type === "StringLiteral") {
    return key.value === "name" || key.value === "length";
  }
  return false;
}
function inheritPropComments(node, prop) {
  t.inheritLeadingComments(node, prop.node);
  t.inheritInnerComments(node, prop.node);
  return node;
}
function inheritLoc(node, original) {
  node.start = original.start;
  node.end = original.end;
  node.loc = original.loc;
  return node;
}
export function buildFieldsInitNodes(ref, superRef, props, privateNamesMap, file, setPublicClassFields, privateFieldsAsSymbolsOrProperties, noUninitializedPrivateFieldAccess, constantSuper, innerBindingRef) {
  let classRefFlags = 0;
  let injectSuperRef;
  const staticNodes = [];
  const instanceNodes = [];
  let lastInstanceNodeReturnsThis = false;
  const pureStaticNodes = [];
  let classBindingNode = null;
  const getSuperRef = t.isIdentifier(superRef) ? () => superRef : () => {
    injectSuperRef ??= props[0].scope.generateUidIdentifierBasedOnNode(superRef);
    return injectSuperRef;
  };
  const classRefForInnerBinding = ref ?? props[0].scope.generateUidIdentifier(innerBindingRef.name || "Class");
  ref ??= t.cloneNode(innerBindingRef);
  for (const prop of props) {
    if (prop.isClassProperty()) {
      ts.assertFieldTransformed(prop);
    }
    const isStatic = !t.isStaticBlock(prop.node) && prop.node.static;
    const isInstance = !isStatic;
    const isPrivate = prop.isPrivate();
    const isPublic = !isPrivate;
    const isField = prop.isProperty();
    const isMethod = !isField;
    const isStaticBlock = prop.isStaticBlock();
    if (isStatic) classRefFlags |= 1;
    if (isStatic || isMethod && isPrivate || isStaticBlock) {
      new ReplaceSupers({
        methodPath: prop,
        constantSuper,
        file: file,
        refToPreserve: innerBindingRef,
        getSuperRef,
        getObjectRef() {
          classRefFlags |= 2;
          if (isStatic || isStaticBlock) {
            return classRefForInnerBinding;
          } else {
            return t.memberExpression(classRefForInnerBinding, t.identifier("prototype"));
          }
        }
      }).replace();
      const replaced = replaceThisContext(prop, classRefForInnerBinding, innerBindingRef);
      if (replaced) {
        classRefFlags |= 2;
      }
    }
    lastInstanceNodeReturnsThis = false;
    switch (true) {
      case isStaticBlock:
        {
          const blockBody = prop.node.body;
          if (blockBody.length === 1 && t.isExpressionStatement(blockBody[0])) {
            staticNodes.push(inheritPropComments(blockBody[0], prop));
          } else {
            staticNodes.push(t.inheritsComments(template.statement.ast`(() => { ${blockBody} })()`, prop.node));
          }
          break;
        }
      case isStatic && isPrivate && isField && privateFieldsAsSymbolsOrProperties:
        staticNodes.push(buildPrivateFieldInitLoose(t.cloneNode(ref), prop, privateNamesMap));
        break;
      case isStatic && isPrivate && isField && !privateFieldsAsSymbolsOrProperties:
        staticNodes.push(buildPrivateStaticFieldInitSpec(prop, privateNamesMap, noUninitializedPrivateFieldAccess));
        break;
      case isStatic && isPublic && isField && setPublicClassFields:
        if (!isNameOrLength(prop.node)) {
          staticNodes.push(buildPublicFieldInitLoose(t.cloneNode(ref), prop));
          break;
        }
      case isStatic && isPublic && isField && !setPublicClassFields:
        staticNodes.push(buildPublicFieldInitSpec(t.cloneNode(ref), prop, file));
        break;
      case isInstance && isPrivate && isField && privateFieldsAsSymbolsOrProperties:
        instanceNodes.push(buildPrivateFieldInitLoose(t.thisExpression(), prop, privateNamesMap));
        break;
      case isInstance && isPrivate && isField && !privateFieldsAsSymbolsOrProperties:
        instanceNodes.push(buildPrivateInstanceFieldInitSpec(t.thisExpression(), prop, privateNamesMap, file));
        break;
      case isInstance && isPrivate && isMethod && privateFieldsAsSymbolsOrProperties:
        instanceNodes.unshift(buildPrivateMethodInitLoose(t.thisExpression(), prop, privateNamesMap));
        pureStaticNodes.push(buildPrivateMethodDeclaration(prop, privateNamesMap, privateFieldsAsSymbolsOrProperties));
        break;
      case isInstance && isPrivate && isMethod && !privateFieldsAsSymbolsOrProperties:
        instanceNodes.unshift(buildPrivateInstanceMethodInitSpec(t.thisExpression(), prop, privateNamesMap, file));
        pureStaticNodes.push(buildPrivateMethodDeclaration(prop, privateNamesMap, privateFieldsAsSymbolsOrProperties));
        break;
      case isStatic && isPrivate && isMethod && !privateFieldsAsSymbolsOrProperties:
        pureStaticNodes.push(buildPrivateMethodDeclaration(prop, privateNamesMap, privateFieldsAsSymbolsOrProperties));
        break;
      case isStatic && isPrivate && isMethod && privateFieldsAsSymbolsOrProperties:
        staticNodes.unshift(buildPrivateStaticMethodInitLoose(t.cloneNode(ref), prop, privateNamesMap));
        pureStaticNodes.push(buildPrivateMethodDeclaration(prop, privateNamesMap, privateFieldsAsSymbolsOrProperties));
        break;
      case isInstance && isPublic && isField && setPublicClassFields:
        instanceNodes.push(buildPublicFieldInitLoose(t.thisExpression(), prop));
        break;
      case isInstance && isPublic && isField && !setPublicClassFields:
        lastInstanceNodeReturnsThis = true;
        instanceNodes.push(buildPublicFieldInitSpec(t.thisExpression(), prop, file));
        break;
      default:
        throw new Error("Unreachable.");
    }
  }
  if (classRefFlags & 2 && innerBindingRef != null) {
    classBindingNode = t.expressionStatement(t.assignmentExpression("=", t.cloneNode(classRefForInnerBinding), t.cloneNode(innerBindingRef)));
  }
  return {
    staticNodes: staticNodes.filter(Boolean),
    instanceNodes: instanceNodes.filter(Boolean),
    lastInstanceNodeReturnsThis,
    pureStaticNodes: pureStaticNodes.filter(Boolean),
    classBindingNode,
    wrapClass(path) {
      for (const prop of props) {
        prop.node.leadingComments = null;
        prop.remove();
      }
      if (injectSuperRef) {
        path.scope.push({
          id: t.cloneNode(injectSuperRef)
        });
        path.set("superClass", t.assignmentExpression("=", injectSuperRef, path.node.superClass));
      }
      if (classRefFlags !== 0) {
        if (path.isClassExpression()) {
          path.scope.push({
            id: ref
          });
          path.replaceWith(t.assignmentExpression("=", t.cloneNode(ref), path.node));
        } else {
          if (innerBindingRef == null) {
            path.node.id = ref;
          }
          if (classBindingNode != null) {
            path.scope.push({
              id: classRefForInnerBinding
            });
          }
        }
      }
      return path;
    }
  };
}