# view 查看包信息

[`npm view`](https://docs.npmjs.com/cli/v10/commands/npm-view) 显示有关包的数据并将其打印到标准输出。

```shell
npm view [<package-spec>] [<field>[.subfield]...]

aliases: info, show, v
```

## 描述

- 此命令显示有关包的数据并将其打印到标准输出。如果未指定包版本，则默认版本为 `"latest"`。

  ![image.png](/img/264.jpg)

- 可以在包描述符之后指定字段名称，同时也可以用句点分隔来查看子字段

  ![image.png](/img/265.jpg)

## 配置

#### `--json` 输出 JSON 数据

- 默认值：`false`
- 类型：`boolean`
  - `true`输出 JSON 数据，而不是正常输出。
