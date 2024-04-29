# help 帮助

[`npm help`](https://docs.npmjs.com/cli/v10/commands/npm-help) 获取有关 npm 的帮助

```bash
npm help <term> [<terms..>]

alias: hlep
```

## 描述

添加、删除和查看包上的标签：

- `add`：使用指定标签标记包的指定版本，如果未指定，则使用 [--tag 配置](https://docs.npmjs.com/cli/v10/using-npm/config#tag)。

- `rm`：从包中清除不再使用的标签。

- `ls`：显示包的所有 dist 标签

::: tip 注意

`latest` 标签对于 `npm` 有着特殊意义, 通常表示最新的版本。默认情况下，`npm install <pkg>` 安装 `latest` 标签。

发布包会将最新标签设置为已发布版本，除非使用 `--tag` 选项。例如，`npmpublish--tag=beta`。

:::

## 配置

### `--viewer` **查看程序**

- 默认值：Posix 上为 `man`，Windows 上为 `browser`
- 类型：String

用于查看帮助内容的程序。设置为 `browser` 可在默认 Web 浏览器中查看 html 帮助内容。
