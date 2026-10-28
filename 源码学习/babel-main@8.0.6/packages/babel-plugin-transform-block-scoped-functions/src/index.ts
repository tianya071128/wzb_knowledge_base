import { declare } from "@babel/helper-plugin-utils";
import { types as t, type Visitor, type NodePath } from "@babel/core";

// 用例设计（对照源码三条分支）：
// 1) if 块内函数声明 -- 非严格模式 -> var（sloppy 模式 Annex B 语义）
// 2) 严格模式（"use strict"）-> let
// 3) async/generator 函数声明 -> 强制 let（var 无法承载的语义）
// 4) switch case 内函数声明 -> 专门的重建分支（let + cloneNode）
// 5) 循环体内块 -> Loop visitor 手工 traverse 的场景
// 6) 函数体 / export 的块 -> 直接 return 跳过（不转换）
const code = `
// 1) sloppy 模式：if 块
if (x) {
  function f() { return 1; }
  f();
}

// 2) 严格模式：let
function strictFn() {
  "use strict";
  {
    function g() { return 2; }
    g();
  }
}

// 3) async / generator 强制 let
if (y) {
  async function h() { return 3; }
  function* k() { yield 4; }
}

// 4) switch case 内
switch (n) {
  case 1:
    function m() { return 5; }
    m();
    break;
  default:
    break;
}

// 5) 循环体内
for (let i = 0; i < 2; i++) {
  function p() { return i; }
  p();
}
`;

// 注意：transformSync 默认 sourceType: "module"，模块代码天然严格模式，
// 所以上面所有块内函数都会走 let。要观察 sloppy 模式的 var 分支，
// 必须显式 sourceType: "script" —— 两个都跑一遍做对比。

// ===== sourceType: script =====
// 1) sloppy 模式：if 块
// if (x) {
//   var f = function () {
//     return 1;
//   };
//   f();
// }

// // 2) 严格模式：let
// function strictFn() {
//   "use strict";

//   {
//     let g = function () {
//       return 2;
//     };
//     g();
//   }
// }

// // 3) async / generator 强制 let
// if (y) {
//   let h = async function () {
//     return 3;
//   };
//   let k = function* () {
//     yield 4;
//   };
// }

// // 4) switch case 内
// {
//   let m = function m() {
//     return 5;
//   };
//   switch (n) {
//     case 1:
//       m();
//       break;
//     default:
//       break;
//   }
// } // 5) 循环体内
// for (let i = 0; i < 2; i++) {
//   var p = function () {
//     return i;
//   };
//   p();
// }

// ===== sourceType: module =====
// 1) sloppy 模式：if 块
// if (x) {
//   let f = function () {
//     return 1;
//   };
//   f();
// }

// // 2) 严格模式：let
// function strictFn() {
//   "use strict";

//   {
//     let g = function () {
//       return 2;
//     };
//     g();
//   }
// }

// // 3) async / generator 强制 let
// if (y) {
//   let h = async function () {
//     return 3;
//   };
//   let k = function* () {
//     yield 4;
//   };
// }

// // 4) switch case 内
// {
//   let m = function m() {
//     return 5;
//   };
//   switch (n) {
//     case 1:
//       m();
//       break;
//     default:
//       break;
//   }
// } // 5) 循环体内
// for (let i = 0; i < 2; i++) {
//   let p = function () {
//     return i;
//   };
//   p();
// }

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  // 公共转换函数：把一个"语句 path 数组"里的函数声明换成 let/var 声明。
  // 被 BlockStatement（path.get("body")）调用。
  function transformStatementList(
    parentPath: NodePath, // 块的 path（只用来查严格模式）
    paths: NodePath<t.Statement>[], // 块内语句的 path 列表
  ) {
    // isInStrictMode：沿父链判断（"use strict" 指令 / module / class 体…）
    const isInStrictMode = parentPath.isInStrictMode();

    for (const path of paths) {
      // 非函数声明直接跳过
      if (!path.isFunctionDeclaration()) continue;

      // 是否必须用 let
      const useLet =
        isInStrictMode || // 严格模式（块级语义必须保留）
        path.node.async || // async / generator（var 化的函数表达式承载不了）
        path.node.generator ||
        // getData：跨插件通信 —— async-generator 插件处理后会把标记存在这个 path 的数据上
        // （getData/setData 是 path 级临时存储，不进 AST），这里读到标记就强制 let
        path.getData(
          "@babel/plugin-transform-async-generator-functions/async_generator_function",
        );

      const func = path.node;      

      // 创建变量声明语句
      const declar = t.variableDeclaration(useLet ? "let" : "var", [
        // 构造变量声明中的「一条绑定」
          t.variableDeclarator(func.id!, 
          // 原地把 FunctionDeclaration 改成 FunctionExpression
          t.toExpression(func)),
      ]);


      // _blockHoist = 2：generator 的排序提示，把声明提到块内其他语句之前，
      // 修复"先使用后声明"的时序（函数声明本应提升，变量声明不会）

      // hoist it up above everything else 把它举起来，凌驾于一切之上
      // @ts-expect-error todo(flow->ts): avoid mutations TS 类型上没有这个字段（历史遗留的生成器协议）
      declar._blockHoist = 2;

      // 清掉函数名
      // todo: name this
      func.id = null;

      // 替换节点
      path.replaceWith(declar);
    }
  }

  const visitor: Visitor = {
   /**
    * 语句块节点 --> 对应一对大括号 `{ ... }`
    * {
    *   type: "BlockStatement",
    *   directives: Directive[],   // 默认 []（"use strict" 一类）
    *   body: Statement[]          // 语句序列
    * }
    */ 
    BlockStatement(path) {
       // node = 本块，parent = 父节点（纯 node 引用）
      const { node, parent } = path;

      // 针对父节点来跳过
      if (
        // ① 父节点为相关函数：函数体、方法体、箭头函数体等
        // 精准判断"这个块就是某函数的 body"
        t.isFunction(parent, { body: node }) ||

        // ② export 包装块：export function f(){} / export default function(){}
        //    的父节点是 ExportNamedDeclaration / ExportDefaultDeclaration，
        //    导出语句的位置与语义特殊，不动。
        t.isExportDeclaration(parent)
      ) {
        return;
      }

      // 其余块（if/while/for 的块、裸块、try 块…）：
      // path.get("body") 取出 Statement[] 槽位的 path 列表，
      // 交给公共函数把其中的函数声明换成 let/var 声明
      transformStatementList(path, path.get("body"));
    },
    
    /**
     * SwitchStatement: switch 语句的 AST 节点
     * {
     *    type: "SwitchStatement",
     *    discriminant: BinaryExpression, // 必需
     *    cases: SwitchCase[]    // 可为空数组 --> 对应 case 分支
     *  }
     */
    SwitchStatement(path) {
      const { node } = path;

      // 收集各 case 里的函数声明(function xx() {})，同时从原数组里摘除
      const fns: t.FunctionDeclaration[] = [];

      /**
       * 直接处理 SwitchCase 数组 --> 即 case 分支
       *  SwitchCase {
       *    type: "SwitchCase",
       *    test: Expression | null, // default 子句时是 null
       *    consequent: Statement[]  // 该 case 下的语句序列（可空）
       *  }
       */
      for (const caseNode of node.cases) {
        // 该 case 的语句数组
        const { consequent } = caseNode;
        // 倒序遍历：splice 会改变长度，正序会漏项/越界
        for (let i = consequent.length - 1; i >= 0; i--) {
          // 判断该语句是否为函数声明
          if (t.isFunctionDeclaration(consequent[i])) {
            // 是函数声明，则收集起来
            fns.push(consequent[i] as t.FunctionDeclaration);
            // 从原数组里摘除
            consequent.splice(i, 1);
          }
        }
      }
      // 一个都没有 → 直接返回，避免无意义的 replaceWith
      if (!fns.length) return;

      // 把整个 switch 换成一个新块：也就是在 switch 上面定义函数表达式
      //   { let m = function m() {}; switch (n) { ...去除了函数声明的... } }
      path.replaceWith(
        // 替换为 BlockStatement --> `{ ... }` 代码块（大括号包裹的一组语句）
        t.blockStatement([

          // 变量声明语句
          // let a = 1, b; --> 支持多个变量同时声明
          t.variableDeclaration(
            "let", // let 变量

            // 函数声明转为函数表达式 → 对应 m = function m() {}
            fns.map(fn =>
              // 单个变量项
              t.variableDeclarator(
                /**
                 * 变量名: 绑定名必须用"副本"。
                 */
                t.cloneNode(fn.id!), 
                // toExpression：FunctionDeclaration → FunctionExpression。
                // 注意它是"就地改 type"，不复制 —— fn 本体被直接复用为 init。
                t.toExpression(fn)
              ),
            ),
          ),

          // 原 switch 节点整块挪进新块的 body（引用复用）
          // 剔除了函数声明的语句
          node,
        ]),
      );
    },
  };

  return {
    name: "transform-block-scoped-functions",

    visitor: {
      ...visitor,
      /**
       * Loop: AST 别名，会一次性匹配下面 5 种循环节点
       * - WhileStatement —— while()
       * - DoWhileStatement —— do() while()
       * - ForStatement —— for
       * - ForInStatement —— for...in
       * - ForOfStatement —— for...of
       */
      Loop(path) {
        // 进入循环节点时，手动把循环子树内的块先「预遍历」一遍。
        path.traverse(visitor);
      },
    },
  };
});
