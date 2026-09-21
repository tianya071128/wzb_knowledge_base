import { declare } from "@babel/helper-plugin-utils";

export interface Options {
  /** @deprecated Use the `noNewArrows` assumption instead. 请改用`noNewArrows`假设 */
  spec?: boolean;
}

/**
 * declare: 声明一个插件工厂函数，并使用 Babel 的插件 utils 进行包装。
 */
export default declare((api, options: Options) => {
  // 断言版本
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  // 废弃选项（deprecated option）的兼容性警告
  if ("spec" in options) {
    console.warn(
      "@babel/plugin-transform-arrow-functions: The 'spec' option has been deprecated, " + // "@babel/plugin-transform-arrow-functions: 'spec' 选项已被弃用，"
        `use the 'noNewArrows: ${!options.spec}' assumption instead (https://babeljs.io/assumptions).`,
    );
  }

  // 决定箭头函数转换策略的核心取值逻辑
  // api.assumption("noNewArrows"): 读取 babel.config 中的 assumptions 配置
  const noNewArrows = api.assumption("noNewArrows") ?? !options.spec;

  return {
    // 插件名
    name: "transform-arrow-functions",

    // 访问器模式
    visitor: {
      // 注册 ArrowFunctionExpression 的访问函数: 遍历器每遇到一个箭头函数节点，就调用一次这个回调
      ArrowFunctionExpression(path) {
        // In some conversion cases, it may have already been converted to a function while this callback 在某些转换情况下，此回调可能已经转换为函数
        // was queued up. 被排队等候
        if (!path.isArrowFunctionExpression()) return;

        path.arrowFunctionToExpression({
          // While other utils may be fine inserting other arrows to make more transforms possible, 虽然其他工具可能能够很好地插入其他箭头，以实现更多的转换可能
          // the arrow transform itself absolutely cannot insert new arrow functions. 箭头函数本身绝对不能插入新的箭头函数
          allowInsertArrow: false,
          noNewArrows,
        });
      },
    },
  };
});
