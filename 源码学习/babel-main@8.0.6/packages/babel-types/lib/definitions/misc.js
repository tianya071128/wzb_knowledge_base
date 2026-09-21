import { defineAliasedType, assertNodeType, assertOneOf, assertValueType } from "./utils.js";
import { PLACEHOLDERS } from "./placeholders.js";
import { patternLikeCommon } from "./core.js";
const defineType = defineAliasedType("Miscellaneous");
defineType("Placeholder", {
  visitor: [],
  builder: ["expectedNode", "name"],
  fields: {
    name: {
      validate: assertNodeType("Identifier")
    },
    expectedNode: {
      validate: assertOneOf(...PLACEHOLDERS)
    },
    ...patternLikeCommon()
  }
});
defineType("V8IntrinsicIdentifier", {
  builder: ["name"],
  fields: {
    name: {
      validate: assertValueType("string")
    }
  }
});