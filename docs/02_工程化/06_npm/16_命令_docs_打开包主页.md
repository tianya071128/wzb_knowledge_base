# docs 打开包主页

[`npm docs`](https://docs.npmjs.com/cli/v10/commands/npm-docs) 在 Web 浏览器中打开包的文档

```shell
npm docs [<pkgname> [<pkgname> ...]]

alias: home
```

## 描述

- 此命令尝试猜测包的文档 `URL` 的可能位置，然后尝试使用 `--browser` 配置参数打开它。您可以一次传递多个包名称。如果未提供包名称，它将在当前文件夹中搜索 `package.json` 并使用 `name` 属性。

## 配置

### `--browser` 调用以打开网站的浏览器。

- 默认值：OS X: "open", Windows: "start", Others: "xdg-open"
- 类型：`null`、`Boolean`、`String`
  - `true`使用默认系统 URL 打开器。
  - `false`不打开浏览器，而是将 url 打印到终端。
