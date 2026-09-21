import { classMethodOrPropertyUnionShapeCommon, classMethodOrPropertyCommon } from "./core.js";
import defineType, { arrayOfType, assertNodeType, assertNodeOrValueType, assertValueType, chain } from "./utils.js";
defineType("ArgumentPlaceholder", {});
defineType("BindExpression", {
  visitor: ["object", "callee"],
  aliases: ["Expression"],
  fields: {
    object: {
      validate: assertNodeOrValueType("null", "Expression")
    },
    callee: {
      validate: assertNodeType("Expression")
    }
  }
});
defineType("ClassAccessorProperty", {
  visitor: ["decorators", "key", "typeAnnotation", "value"],
  builder: ["key", "value", "typeAnnotation", "decorators", "computed", "static"],
  aliases: ["Property", "Accessor"],
  ...classMethodOrPropertyUnionShapeCommon(true),
  fields: {
    ...classMethodOrPropertyCommon(),
    key: {
      validate: chain(function () {
        const normal = assertNodeType("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "PrivateName");
        const computed = assertNodeType("Expression");
        return function (node, key, val) {
          const validator = node.computed ? computed : normal;
          validator(node, key, val);
        };
      }(), assertNodeType("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression", "PrivateName"))
    },
    value: {
      validate: assertNodeType("Expression"),
      optional: true
    },
    definite: {
      validate: assertValueType("boolean"),
      optional: true
    },
    typeAnnotation: {
      validate: assertNodeType("TypeAnnotation", "TSTypeAnnotation"),
      optional: true
    },
    decorators: {
      validate: arrayOfType("Decorator"),
      optional: true
    },
    readonly: {
      validate: assertValueType("boolean"),
      optional: true
    },
    declare: {
      validate: assertValueType("boolean"),
      optional: true
    },
    variance: {
      validate: assertNodeType("Variance"),
      optional: true
    }
  }
});
defineType("Decorator", {
  visitor: ["expression"],
  fields: {
    expression: {
      validate: assertNodeType("Expression")
    }
  }
});
defineType("DoExpression", {
  visitor: ["body"],
  builder: ["body", "async"],
  aliases: ["Expression"],
  fields: {
    body: {
      validate: assertNodeType("BlockStatement")
    },
    async: {
      validate: assertValueType("boolean"),
      default: false
    }
  }
});
defineType("ExportDefaultSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    exported: {
      validate: assertNodeType("Identifier")
    }
  }
});
defineType("ModuleExpression", {
  visitor: ["body"],
  fields: {
    body: {
      validate: assertNodeType("Program")
    }
  },
  aliases: ["Expression"]
});
defineType("TopicReference", {
  aliases: ["Expression"]
});
defineType("VoidPattern", {
  aliases: ["Pattern", "PatternLike", "FunctionParameter"]
});