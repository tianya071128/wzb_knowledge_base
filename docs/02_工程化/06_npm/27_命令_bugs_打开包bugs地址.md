# bugs 打开包 bugs 地址

[`npm bugs`](https://docs.npmjs.com/cli/v10/commands/npm-bugs) 使用浏览器打开包的 `bugs` 地址

```bash
npm bugs [<pkgname> [<pkgname> ...]]

alias: issues
```

## 描述

此命令会尝试猜测包的 `错误 URL` 或支持电子邮件的 `mailto URL` 的可能位置。

- 尝试使用 `package.json` 中 [`bugs`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#bugs) 字段的地址

## 配置

### `--browser` 调用以打开网站的浏览器。

- 默认值：OS X: "open", Windows: "start", Others: "xdg-open"
- 类型：`null`、`Boolean`、`String`
  - `true`使用默认系统 URL 打开器。
  - `false`不打开浏览器，而是将 url 打印到终端。

### `--registry` **注册表**

- 默认值：npm 配置中的 `registry`, 默认为 [https://registry.npmjs.org/](https://registry.npmjs.org/)
- 类型：`URL`

注册表的基本 URL。
