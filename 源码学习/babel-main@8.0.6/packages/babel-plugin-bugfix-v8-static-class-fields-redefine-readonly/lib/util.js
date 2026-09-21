import { types as t } from "@babel/core";
function isNameOrLength(key) {
  if (t.isIdentifier(key)) {
    return key.name === "name" || key.name === "length";
  }
  if (t.isStringLiteral(key)) {
    return key.value === "name" || key.value === "length";
  }
  return false;
}
function isStaticFieldWithValue(node) {
  return (t.isClassProperty(node) || t.isClassPrivateProperty(node)) && node.static && !!node.value;
}
const hasReferenceVisitor = {
  ReferencedIdentifier(path, state) {
    if (path.node.name === state.name) {
      state.ref();
      path.stop();
    }
  },
  Scope(path, {
    name
  }) {
    if (path.scope.hasOwnBinding(name)) {
      path.skip();
    }
  }
};
function isReferenceOrThis(node, name) {
  return t.isThisExpression(node) || name && t.isIdentifier(node, {
    name
  });
}
const hasReferenceOrThisVisitor = {
  "ThisExpression|ReferencedIdentifier"(path, state) {
    if (isReferenceOrThis(path.node, state.name)) {
      state.ref();
      path.stop();
    }
  },
  FunctionParent(path, state) {
    if (path.isArrowFunctionExpression()) return;
    if (state.name && !path.scope.hasOwnBinding(state.name)) {
      path.traverse(hasReferenceVisitor, state);
    }
    path.skip();
    if (path.isMethod()) {
      path.requeueComputedKeyAndDecorators();
    }
  }
};
export function getPotentiallyBuggyFieldsIndexes(path) {
  const buggyPublicStaticFieldsIndexes = [];
  let classReferenced = false;
  const className = path.node.id?.name;
  const hasReferenceState = {
    name: className,
    ref: () => classReferenced = true
  };
  if (className) {
    for (const el of path.get("body.body")) {
      if (el.node.computed) {
        el.get("key").traverse(hasReferenceVisitor, hasReferenceState);
        if (classReferenced) break;
      }
    }
  }
  let nextPotentiallyBuggy = false;
  const {
    body
  } = path.node.body;
  for (let i = 0; i < body.length; i++) {
    const node = body[i];
    if (!nextPotentiallyBuggy) {
      if (t.isStaticBlock(node)) {
        classReferenced = true;
        nextPotentiallyBuggy = true;
      } else if (isStaticFieldWithValue(node)) {
        if (!classReferenced) {
          if (isReferenceOrThis(node.value, className)) {
            classReferenced = true;
          } else {
            path.get(`body.body.${i}.value`).traverse(hasReferenceOrThisVisitor, hasReferenceState);
          }
        }
        if (classReferenced) {
          nextPotentiallyBuggy = !path.scope.isPure(node.value);
        }
      }
    }
    if (t.isClassProperty(node, {
      static: true
    }) && (nextPotentiallyBuggy || node.computed || isNameOrLength(node.key))) {
      buggyPublicStaticFieldsIndexes.push(i);
    }
  }
  return buggyPublicStaticFieldsIndexes;
}
export function getNameOrLengthStaticFieldsIndexes(path) {
  const indexes = [];
  const {
    body
  } = path.node.body;
  for (let i = 0; i < body.length; i++) {
    const node = body[i];
    if (t.isClassProperty(node, {
      static: true,
      computed: false
    }) && isNameOrLength(node.key)) {
      indexes.push(i);
    }
  }
  return indexes;
}
export function toRanges(nums) {
  const ranges = [];
  if (nums.length === 0) return ranges;
  let start = nums[0];
  let end = start + 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] <= nums[i - 1]) {
      throw new Error("Internal Babel error: nums must be in ascending order");
    }
    if (nums[i] === end) {
      end++;
    } else {
      ranges.push([start, end]);
      start = nums[i];
      end = start + 1;
    }
  }
  ranges.push([start, end]);
  return ranges;
}