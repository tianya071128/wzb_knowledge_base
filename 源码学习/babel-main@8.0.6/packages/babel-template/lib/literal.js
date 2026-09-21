import { normalizeReplacements } from "./options.js";
import parseAndBuildMetadata from "./parse.js";
import populatePlaceholders from "./populate.js";
export default function literalTemplate(formatter, tpl, opts) {
  const {
    metadata,
    names
  } = buildLiteralData(formatter, tpl, opts);
  return arg => {
    const defaultReplacements = {};
    arg.forEach((replacement, i) => {
      defaultReplacements[names[i]] = replacement;
    });
    return arg => {
      const replacements = normalizeReplacements(arg);
      if (replacements) {
        Object.keys(replacements).forEach(key => {
          if (Object.hasOwn(defaultReplacements, key)) {
            throw new Error("Unexpected replacement overlap.");
          }
        });
      }
      return formatter.unwrap(populatePlaceholders(metadata, replacements ? Object.assign(replacements, defaultReplacements) : defaultReplacements));
    };
  };
}
function buildLiteralData(formatter, tpl, opts) {
  let prefix = "BABEL_TPL$";
  const raw = tpl.join("");
  do {
    prefix = "$$" + prefix;
  } while (raw.includes(prefix));
  const {
    names,
    code
  } = buildTemplateCode(tpl, prefix);
  const metadata = parseAndBuildMetadata(formatter, formatter.code(code), {
    parser: opts.parser,
    placeholderAllowlist: new Set(names.concat(opts.placeholderAllowlist ? Array.from(opts.placeholderAllowlist) : [])),
    placeholderPattern: opts.placeholderPattern,
    preserveComments: opts.preserveComments,
    syntacticPlaceholders: opts.syntacticPlaceholders
  });
  return {
    metadata,
    names
  };
}
function buildTemplateCode(tpl, prefix) {
  const names = [];
  let code = tpl[0];
  for (let i = 1; i < tpl.length; i++) {
    const value = `${prefix}${i - 1}`;
    names.push(value);
    code += value + tpl[i];
  }
  return {
    names,
    code
  };
}