# deprecate 弃用包的某个版本

[`npm deprecate`](https://docs.npmjs.com/cli/v10/commands/npm-deprecate) 弃用包的某个版本

```bash
npm deprecate <package-spec> <message>
```

## 描述

- 此命令将更新软件包的 npm 注册表项，向所有尝试安装它的人提供弃用警告。

- 适用于版本范围以及特定版本：`npm deprecate my-thing@"< 0.2.3" "v0.2.3 中修复的严重错误"`

- 必须是包所有者才能弃用某些内容

- 要取消弃用某个包，请为消息参数指定一个空字符串 ("")。请注意，必须使用双引号（双引号之间不带空格）来格式化空字符串。

![img](/img/276.jpg)

## 配置

### `--registry` **注册表**

- 默认值：npm 配置中的 `registry`, 默认为 [https://registry.npmjs.org/](https://registry.npmjs.org/)
- 类型：`URL`

注册表的基本 URL。
