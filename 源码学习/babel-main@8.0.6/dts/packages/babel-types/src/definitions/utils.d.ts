import type * as t from "../index.ts";
export declare const VISITOR_KEYS: Record<string, string[]>;
export declare const ALIAS_KEYS: Partial<Record<NodeTypesWithoutComment, string[]>>;
export declare const FLIPPED_ALIAS_KEYS: Record<string, NodeTypesWithoutComment[]>;
export declare const NODE_FIELDS: Record<string, FieldDefinitions<any>>;
export declare const BUILDER_KEYS: Record<string, string[]>;
export declare const DEPRECATED_KEYS: Record<string, NodeTypesWithoutComment>;
export declare const NODE_PARENT_VALIDATIONS: Record<string, Validator<any>>;
export declare const NODE_UNION_SHAPES__PRIVATE: Record<string, UnionShape<any>>;
declare function getType(val: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "array" | "null";
type NodeTypesWithoutComment = t.Node["type"] | keyof t.Aliases;
type NodeTypes = NodeTypesWithoutComment | t.Comment["type"];
type PrimitiveTypes = ReturnType<typeof getType>;
type FieldDefinitions<T extends t.Node> = Record<string, FieldOptions<T>>;
type UnionShape<T extends t.Node> = {
    discriminator: string;
    shapes: {
        name: string;
        value: any[];
        properties: Record<string, FieldOptions<T>>;
    }[];
};
type DefineTypeOpts<T extends t.Node> = {
    fields?: FieldDefinitions<NoInfer<T>>;
    visitor?: string[];
    aliases?: string[];
    builder?: string[];
    inherits?: NodeTypes;
    deprecatedAlias?: string;
    validate?: Validator<NoInfer<T>>;
    unionShape?: UnionShape<NoInfer<T>>;
};
export type ValidatorImpl<T extends t.Node> = (node: T, key: string | {
    toString(): string;
}, val: any) => void;
type ValidatorType<T extends t.Node> = {
    type: PrimitiveTypes;
} & ValidatorImpl<T>;
type ValidatorEach<T extends t.Node> = {
    each: Validator<T>;
} & ValidatorImpl<T>;
type ValidatorChainOf<T extends t.Node> = {
    chainOf: readonly Validator<T>[];
} & ValidatorImpl<T>;
type ValidatorOneOf<T extends t.Node> = {
    oneOf: readonly any[];
} & ValidatorImpl<T>;
type ValidatorOneOfNodeTypes<T extends t.Node> = {
    oneOfNodeTypes: readonly NodeTypes[];
} & ValidatorImpl<T>;
type ValidatorOneOfNodeOrValueTypes<T extends t.Node> = {
    oneOfNodeOrValueTypes: readonly (NodeTypes | PrimitiveTypes)[];
} & ValidatorImpl<T>;
type ValidatorShapeOf<T extends t.Node> = {
    shapeOf: Record<string, FieldOptions<T>>;
} & ValidatorImpl<T>;
export type Validator<T extends t.Node> = ValidatorType<T> | ValidatorEach<T> | ValidatorChainOf<T> | ValidatorOneOf<T> | ValidatorOneOfNodeTypes<T> | ValidatorOneOfNodeOrValueTypes<T> | ValidatorShapeOf<T> | ValidatorImpl<T>;
export type FieldOptions<T extends t.Node> = {
    default?: string | number | boolean | [] | null;
    optional?: boolean;
    deprecated?: boolean;
    validate?: Validator<T>;
};
export declare function combine<T extends t.Node>(fn: ValidatorImpl<T>, ...validators: ({
    type: PrimitiveTypes;
} | {
    each: Validator<T>;
} | {
    chainOf: readonly Validator<T>[];
} | {
    oneOf: readonly any[];
} | {
    oneOfNodeTypes: readonly NodeTypes[];
} | {
    oneOfNodeOrValueTypes: readonly (NodeTypes | PrimitiveTypes)[];
} | {
    shapeOf: Record<string, FieldOptions<T>>;
})[]): Validator<T>;
export declare function validate<T extends t.Node>(validate: Validator<T>): FieldOptions<T>;
export declare function validateType(...typeNames: NodeTypes[]): t.FieldOptions<t.Node>;
export declare function validateOptional<T extends t.Node>(validate: Validator<T>): FieldOptions<T>;
export declare function validateDefault<T extends t.Node>(validate: Validator<T>, defaultValue: any): FieldOptions<T>;
export declare function validateOptionalType(...typeNames: NodeTypes[]): FieldOptions<t.Node>;
export declare function arrayOf<T extends t.Node>(elementType: Validator<T>): Validator<T>;
export declare function arrayOfType(...typeNames: NodeTypes[]): Validator<t.Node>;
export declare function validateArrayOfType(...typeNames: NodeTypes[]): t.FieldOptions<t.Node>;
export declare function assertEach<T extends t.Node>(callback: Validator<T>): Validator<T>;
export declare function assertOneOf<T extends t.Node>(...values: any[]): Validator<T>;
export declare const allExpandedTypes: {
    types: NodeTypes[];
    set: Set<string>;
}[];
export declare function assertNodeType<T extends t.Node>(...types: NodeTypes[]): Validator<T>;
export declare function assertNodeOrValueType<T extends t.Node>(...types: (NodeTypes | PrimitiveTypes)[]): Validator<T>;
export declare function assertValueType<T extends t.Node>(type: PrimitiveTypes): Validator<T>;
export declare function assertShape<T extends t.Node>(shape: Record<string, FieldOptions<T>>): Validator<T>;
export declare function assertOptionalChainStart<T extends t.Node>(): Validator<T>;
export declare function chain<T extends t.Node>(...fns: Validator<T>[]): Validator<T>;
export declare function defineAliasedType(...aliases: string[]): <T extends t.Node["type"]>(type: T, opts?: DefineTypeOpts<Extract<t.Node, {
    type: T;
}>>) => void;
export default function defineType<T extends t.Node["type"]>(type: T, opts?: DefineTypeOpts<Extract<t.Node, {
    type: T;
}>>): void;
export {};
//# sourceMappingURL=utils.d.ts.map