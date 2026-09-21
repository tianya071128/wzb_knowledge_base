import "./core.js";
import "./flow.js";
import "./jsx.js";
import "./misc.js";
import "./experimental.js";
import "./typescript.js";
import { VISITOR_KEYS, ALIAS_KEYS, FLIPPED_ALIAS_KEYS, NODE_FIELDS, BUILDER_KEYS, DEPRECATED_KEYS, NODE_PARENT_VALIDATIONS, NODE_UNION_SHAPES__PRIVATE, allExpandedTypes } from "./utils.js";
import { PLACEHOLDERS, PLACEHOLDERS_ALIAS, PLACEHOLDERS_FLIPPED_ALIAS } from "./placeholders.js";
import { DEPRECATED_ALIASES } from "./deprecated-aliases.js";
Object.keys(DEPRECATED_ALIASES).forEach(deprecatedAlias => {
  FLIPPED_ALIAS_KEYS[deprecatedAlias] = FLIPPED_ALIAS_KEYS[DEPRECATED_ALIASES[deprecatedAlias]];
});
for (const {
  types,
  set
} of allExpandedTypes) {
  for (const type of types) {
    const aliases = FLIPPED_ALIAS_KEYS[type];
    if (aliases) {
      aliases.forEach(set.add, set);
    } else {
      set.add(type);
    }
  }
}
const TYPES = [].concat(Object.keys(VISITOR_KEYS), Object.keys(FLIPPED_ALIAS_KEYS), Object.keys(DEPRECATED_KEYS));
export { NODE_UNION_SHAPES__PRIVATE };
export { VISITOR_KEYS, ALIAS_KEYS, FLIPPED_ALIAS_KEYS, NODE_FIELDS, BUILDER_KEYS, DEPRECATED_ALIASES, DEPRECATED_KEYS, NODE_PARENT_VALIDATIONS, PLACEHOLDERS, PLACEHOLDERS_ALIAS, PLACEHOLDERS_FLIPPED_ALIAS, TYPES };