# outdated 过时包

[`npm outdated`](https://docs.npmjs.com/cli/v10/commands/npm-outdated) 用于检查过时的包(需要更新的包)

```shell
npm outdated [<package-spec> ...]
```

## 描述

- 此命令将联网检查当前是否有**任何(或特定)已安装的软件包已过时**。
- 默认情况下，仅显示根项目的直接依赖项和配置的工作区的直接依赖项。**使用 **`--all`** 也可以查找所有过时的元依赖项**。

## 示例

![image.png](/img/262.png)

## 配置

### `--all, -a` 显示所有过时的包

- 默认值: `false`
- 类型：`boolean`
  - `true` 将显示所有过时或已安装的包
  - `false` 当前项目直接依赖的包

### `--long, -l` 显示更多扩展信息

- 默认值: `false`
- 类型：`boolean`
  - `true` 将显示更多信息, 例如: `Homepage(主页)`、`Package Type(包类型)`

### `--global, -g` 全局模式

- 默认值：`false`
- 类型：`boolean`
  - `true`在“全局”模式下运行, 检查全局过时的包
