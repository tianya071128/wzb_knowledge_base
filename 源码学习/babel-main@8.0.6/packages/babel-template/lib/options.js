export function merge(a, b) {
  const {
    placeholderAllowlist = a.placeholderAllowlist,
    placeholderPattern = a.placeholderPattern,
    preserveComments = a.preserveComments,
    syntacticPlaceholders = a.syntacticPlaceholders
  } = b;
  return {
    parser: {
      ...a.parser,
      ...b.parser
    },
    placeholderAllowlist,
    placeholderPattern,
    preserveComments,
    syntacticPlaceholders
  };
}
export function validate(opts) {
  if (opts != null && typeof opts !== "object") {
    throw new Error("Unknown template options.");
  }
  if (opts != null && Object.hasOwn(opts, "placeholderWhitelist")) {
    if (!Object.hasOwn(opts, "placeholderAllowlist")) {
      throw new Error("The 'placeholderWhitelist' option has been renamed to " + "'placeholderAllowlist'. Please update your configuration.");
    }
  }
  const {
    placeholderAllowlist,
    placeholderPattern,
    preserveComments,
    syntacticPlaceholders,
    ...parser
  } = opts || {};
  if (placeholderAllowlist != null && !(placeholderAllowlist instanceof Set)) {
    throw new Error("'.placeholderAllowlist' must be a Set, null, or undefined");
  }
  if (placeholderPattern != null && !(placeholderPattern instanceof RegExp) && placeholderPattern !== false) {
    throw new Error("'.placeholderPattern' must be a RegExp, false, null, or undefined");
  }
  if (preserveComments != null && typeof preserveComments !== "boolean") {
    throw new Error("'.preserveComments' must be a boolean, null, or undefined");
  }
  if (syntacticPlaceholders != null && typeof syntacticPlaceholders !== "boolean") {
    throw new Error("'.syntacticPlaceholders' must be a boolean, null, or undefined");
  }
  if (syntacticPlaceholders === true && (placeholderAllowlist != null || placeholderPattern != null)) {
    throw new Error("'.placeholderAllowlist' and '.placeholderPattern' aren't compatible" + " with '.syntacticPlaceholders: true'");
  }
  return {
    parser,
    placeholderAllowlist: placeholderAllowlist || undefined,
    placeholderPattern: placeholderPattern == null ? undefined : placeholderPattern,
    preserveComments: preserveComments == null ? undefined : preserveComments,
    syntacticPlaceholders: syntacticPlaceholders == null ? undefined : syntacticPlaceholders
  };
}
export function normalizeReplacements(replacements) {
  if (Array.isArray(replacements)) {
    return replacements.reduce((acc, replacement, i) => {
      acc["$" + i] = replacement;
      return acc;
    }, {});
  } else if (typeof replacements === "object" || replacements == null) {
    return replacements || undefined;
  }
  throw new Error("Template replacements must be an array, object, null, or undefined");
}