import { isRequired } from "@babel/helper-compilation-targets";
import { declare } from "@babel/helper-plugin-utils";


const code = `
// 场景 1：基本命名
var g = function () {
  doSmth();
};

// 场景 2：函数体引用外层同名变量（fixtures/collisions、assignment）
var i = function () {
  i = 5;
};

// 场景 3：自由变量引用（fixtures/object 的 h）
var obj = {
  m: function () {
    doSmth();
  },
  h: function () {
    console.log(h);
  }
};

// 场景 4：方法简写豁免
({ x() {} });
`;

// // 场景 1：基本命名
// var g = function g() {
//   doSmth();
// };

// // 场景 2：函数体引用外层同名变量（fixtures/collisions、assignment）
// var _i = function i() {
//   _i = 5;
// };

// // 场景 3：自由变量引用（fixtures/object 的 h）
// var obj = {
//   m: function m() {
//     doSmth();
//   },
//   h: function (_h) {
//     function h() {
//       return _h.apply(this, arguments);
//     }
//     h.toString = function () {
//       return _h.toString();
//     };
//     return h;
//   }(function () {
//     console.log(h);
//   })
// };

// // 场景 4：方法简写豁免
// ({
//   x() {}
// });

export default declare(api => {
  // 版本闸门：Babel 7（含 ^7.0.0-0 预发布）或 Babel 8。
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  // 「按编译目标开关行为」的最小样本：
  // 查询「目标引擎是否仍需要 unicode-escapes 降级」。
  // 若不需要（引擎已支持 Unicode 标识符），supportUnicodeId = true → 命名时允许生成非 ASCII 函数名（如 var ¥ = ...）；
  // 若需要 → 命名走 ASCII 安全路径。
const supportUnicodeId = !isRequired(
    "transform-unicode-escapes",
    api.targets(),
  );

  return {
    name: "transform-function-name",

    visitor: {
      /**
       * 函数表达式节点：
       * {
       *   type: "FunctionExpression",
       *   id: Identifier | null,
       *   params: [参数节点...],
       *   body: BlockStatement,
       *   generator: boolean,
       *   async: boolean
       * }
       */
      FunctionExpression: {
        exit(path) {
          /**
           * path.key: 对象属性 value 形式（{ foo: function(){} }）
           * path.parentPath.isObjectProperty
           */
          if (path.key !== "value" && !path.parentPath.isObjectProperty()) {
            path.ensureFunctionName(supportUnicodeId);
          }
        },
      },

      ObjectProperty(path) {
        const value = path.get("value");
        if (value.isFunction()) {
          // @ts-expect-error Fixme: should check ArrowFunctionExpression
          value.ensureFunctionName(supportUnicodeId);
        }
      },
    },
  };
});
