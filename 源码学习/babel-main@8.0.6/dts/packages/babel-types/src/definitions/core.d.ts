import type * as t from "../index.ts";
export declare const classMethodOrPropertyUnionShapeCommon: (allowPrivateName?: boolean) => {
    unionShape: {
        discriminator: string;
        shapes: {
            name: string;
            value: boolean[];
            properties: {
                key: {
                    validate: import("./utils.ts").Validator<t.Node>;
                };
            };
        }[];
    };
};
export declare const functionDeclarationCommon: () => {
    declare: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
    id: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
    params: t.FieldOptions<t.Node>;
    generator: {
        default: boolean;
    };
    async: {
        default: boolean;
    };
};
export declare const patternLikeCommon: () => {
    typeAnnotation: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
    optional: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
    decorators: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
};
export declare const importAttributes: {
    attributes: {
        optional: boolean;
        validate: import("./utils.ts").Validator<t.Node>;
    };
};
export declare const classMethodOrPropertyCommon: () => {
    abstract: {
        validate: import("./utils.ts").Validator<t.Node>;
        default: boolean;
        optional: boolean;
    };
    accessibility: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
    static: {
        default: boolean;
    };
    override: {
        optional: boolean;
        validate: import("./utils.ts").Validator<t.Node>;
        default: boolean;
    };
    computed: {
        default: boolean;
    };
    optional: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
    key: {
        validate: import("./utils.ts").Validator<t.ClassAccessorProperty | t.ClassMethod | t.ClassPrivateMethod | t.ClassProperty | t.MemberExpression | t.ObjectMethod | t.ObjectProperty | t.OptionalMemberExpression | t.TSDeclareMethod | t.TSMethodSignature | t.TSPropertySignature>;
    };
};
export declare const classMethodOrDeclareMethodCommon: (allowDecorators?: boolean) => {
    decorators?: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    } | undefined;
    params: t.FieldOptions<t.Node>;
    kind: {
        validate: import("./utils.ts").Validator<t.Node>;
        default: string;
    };
    access: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
    abstract: {
        validate: import("./utils.ts").Validator<t.Node>;
        default: boolean;
        optional: boolean;
    };
    accessibility: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
    static: {
        default: boolean;
    };
    override: {
        optional: boolean;
        validate: import("./utils.ts").Validator<t.Node>;
        default: boolean;
    };
    computed: {
        default: boolean;
    };
    optional: {
        validate: import("./utils.ts").Validator<t.Node>;
        optional: boolean;
    };
    key: {
        validate: import("./utils.ts").Validator<t.ClassAccessorProperty | t.ClassMethod | t.ClassPrivateMethod | t.ClassProperty | t.MemberExpression | t.ObjectMethod | t.ObjectProperty | t.OptionalMemberExpression | t.TSDeclareMethod | t.TSMethodSignature | t.TSPropertySignature>;
    };
    generator: {
        default: boolean;
    };
    async: {
        default: boolean;
    };
};
//# sourceMappingURL=core.d.ts.map