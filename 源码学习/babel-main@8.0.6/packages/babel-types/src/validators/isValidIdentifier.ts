import {
  isIdentifierName,
  isStrictReservedWord,
  isKeyword,
} from "@babel/helper-validator-identifier";

/**
 * 判断 name 能否作「合法的标识符名字」
 * Check if the input `name` is a valid identifier name 检查输入的“name”是否是有效的标识符名称
 * and isn't a reserved word. 这不是一个保留词
 */
export default function isValidIdentifier(
  name: string,
  // reserved 默认 true：名字不允许撞保留字。
  // 传 false 时跳过保留字检查，只做字符合法性校验——用于「知道这是
  // 属性名/内部名，撞关键字无所谓」的场景（如对象键、label）。
  reserved: boolean = true,
): boolean {
  // 防御闸门：非字符串直接 false。
  if (typeof name !== "string") return false;

  if (reserved) {
    // 保留字检查
    // "await" is invalid in module, valid in script; better be safe (see #4952)  “wait”在模块中无效，在脚本中有效；最好是安全的
    if (isKeyword(name) || isStrictReservedWord(name, true)) {
      return false;
    }
  }

  // 最后做字符层校验：`abc-def`、`1abc`、含空格/标点的名字在这里被拦下。
  return isIdentifierName(name);
}
