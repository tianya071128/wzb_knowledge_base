import type { Validator } from "../../src/definitions/utils.ts";
import type * as t from "../../src/index.ts";
/**
 * Stringify a validator to its corresponding TypeScript type.
 */
export default function stringifyValidator(validator: Validator<t.Node> | undefined, nodePrefix: string): string;
/**
 * Heuristic to decide whether or not the given type is a value type (eg. "null")
 * or a Node type (eg. "Expression").
 */
export declare function isValueType(type: string): boolean;
//# sourceMappingURL=stringifyValidator.d.ts.map