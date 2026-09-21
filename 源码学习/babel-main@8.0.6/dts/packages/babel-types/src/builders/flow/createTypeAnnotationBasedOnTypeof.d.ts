import type * as t from "../../index.ts";
declare const _default: {
    (type: "string"): t.StringTypeAnnotation;
    (type: "number"): t.NumberTypeAnnotation;
    (type: "undefined"): t.VoidTypeAnnotation;
    (type: "boolean"): t.BooleanTypeAnnotation;
    (type: "function"): t.GenericTypeAnnotation;
    (type: "object"): t.GenericTypeAnnotation;
    (type: "symbol"): t.GenericTypeAnnotation;
    (type: "bigint"): t.AnyTypeAnnotation;
};
export default _default;
//# sourceMappingURL=createTypeAnnotationBasedOnTypeof.d.ts.map