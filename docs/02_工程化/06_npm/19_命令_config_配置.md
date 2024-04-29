# config 配置

[`npm config`](https://docs.npmjs.com/cli/v10/commands/npm-config) 用于管理 `npm` 配置文件

```bash
npm config set <key>=<value> [<key>=<value> ...]
npm config get [<key> [<key> ...]]
npm config delete <key> [<key> ...]
npm config list [--json]
npm config edit

alias: c
```

## 描述

- 该命令设置配置时, 默认情况下配置位置的是 [用户配置文件](/npm/config.html#用户配置文件)，此时可使用 `--location` 指定位置

## 子命令

支持以下子命令：

### set

```bash
npm config set key=value [key=value...]
npm set key=value [key=value...]
```

将每个配置键设置为提供的值。如果省略值，则将其设置为空字符串。
注意：为了向后兼容，支持 `npm config set key value` 作为 `npm config set key=value` 的别名。

### get

```bash
npm config get [key ...]
npm get [key ...]
```

将配置值回显到标准输出。

### list

```bash
npm config list
```

显示所有配置设置。使用 -l 也可以显示默认值。使用 --json 以 json 格式显示设置。

### delete

```bash
npm config delete key [key ...]
```

从**所有配置文件**中删除指定的配置。

### edit

```bash
npm config edit
```

在编辑器中打开配置文件。使用 --global 标志编辑全局配置。

## 配置

### `--json` 输出 JSON 数据

- 默认值：`false`
- 类型：`boolean`
  - `true`输出 JSON 数据，而不是正常输出。

### `--global, -g` 全局模式

- 默认值：`false`
- 类型：`boolean`
  - `true`在“全局”模式下运行, 配置全局配置

### `--editor` 打开的编辑器

- 默认值：`EDITOR` 或 `VISUAL` 环境变量，或 Windows 上的“notepad.exe”，或 Unix 系统上的“vim”
- 类型：`string`

命令`npm config edit` 运行时, 配置打开的编辑器。

### `--location`配置文件位置

- 默认值：`“user”`，如果传递了` --global`，这也会将此值设置为`“global”`
- 类型："global", "user", 和 "project"

配置要使用的配置文件。
