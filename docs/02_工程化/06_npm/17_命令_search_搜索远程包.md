# search 搜索远程包

[`npm search`](https://docs.npmjs.com/cli/v10/commands/npm-search) 在注册表中搜索与搜索词匹配的包。类似于在 `npmjs` 进行搜索包

```shell
npm search [search terms ...]

aliases: find, s, se
```

## 描述

- 在注册表中搜索与搜索词匹配的包。 npm search 通过包元数据对注册表中的所有文件执行线性、增量、词法排序的搜索。如果您的终端支持颜色，它将进一步突出显示结果中的匹配项。这可以通过配置项颜色禁用
- **命令会在配置注册表中搜索, 如果配置了其他注册表(如淘宝镜像)，可能会执行失败**

## 配置

### `--long, -l` 显示更多扩展信息

- 默认值: `false`
- 类型：`boolean`
  - `true` 将显示更多扩展信息, 但是似乎作用不大

### `--json` 输出 JSON 数据

- 默认值：`false`
- 类型：`boolean`
  - `true`输出 JSON 数据，而不是正常输出。

### `--registry` 搜索的**注册表**

- 默认值：npm 配置中的 `registry`, 默认为 [https://registry.npmjs.org/](https://registry.npmjs.org/)
- 类型：`URL`

注册表的基本 URL。
