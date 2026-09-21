import type * as t from "../../src/index.ts";
/**
 * Check if all fields after the given field name are nullable.
 */
export declare function areAllRemainingFieldsNullable(fieldName: string, fieldNames: string[], fields: Record<string, t.FieldOptions<t.Node>>): boolean;
/**
 * Check if a field has a default value.
 */
export declare function hasDefault(field: t.FieldOptions<t.Node>): boolean;
/**
 * Check if a field is nullable. That means it is either optional
 * or has a default value.
 */
export declare function isNullable(field: t.FieldOptions<t.Node>): boolean;
/**
 * Sort field names based on their order in the builder keys.
 */
export declare function sortFieldNames(fields: string[], type: string): string[];
//# sourceMappingURL=fieldHelpers.d.ts.map