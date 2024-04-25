# update 更新包

[`npm update`](https://docs.npmjs.com/cli/v10/commands/npm-update) 用于更新包

```shell
npm update [<pkg>...]

aliases: up, upgrade, udpate
```

## 描述

- **此命令会将列出的所有包根据 **`package.json`** 文件中的版本规则更新到最新版本**
  例如：`"vue": "^2.4.4",` 此时会更新到版本 `"2.6.14"`，而不是最新的 `3.xx.xx` 版本
- 如果未指定包名称，则将更新指定位置（全局或本地）中的所有包。
- 如果指定了 -g 标志，此命令将更新全局安装的软件包。
- 默认情况下不会更新项目 `package.json` 中直接依赖项的 `semver` 值。

  需要运行：`npm update --save`（或添加 `save=true` 选项到配置文件以使其成为默认行为）。

- **如果软件包已升级到比最新版本更新的版本，它将被降级**。
- **注意：该命令无法指定版本更新(将会失败), 只会根据版本规则更新至最新版本, 如果需要更新到指定版本下, 那么需要使用 **`npm install`** 安装**

## 示例

```bash
# 更新所有包 -- 根据 package.json 版本约束更新
$ npm update

# 更新指定包 -- 根据 package.json 版本约束更新
$ npm update <package-spec>

# 更新全局包
$ npm update [<package-spec>...] -g

# 无法更新至指定版本，此时应该使用 npm install
$ npm update <package-spec>@版本 # 失败
```

## 配置

### `--save, -S` 是否更新 `package.json` 中的版本

- 默认值: `false`
- 类型：`boolean`

**注意: 默认情况下, 是不会更新 **`package.json`** 中的版本号的**

### `--global, -g` 全局安装

- 默认值：`false`
- 类型：`boolean`

在“全局”模式下运行, 以便将包安装到全局文件夹而不是当前工作目录中。

### `--package-lock` 是否更新 `package-lock` 文件中的版本

- 默认值：`true`
- 类型：`boolean`

默认情况下, 会自动更新 `package-lock` 锁文件的版本, 如果设置为 `false` 这将阻止写入 `package-lock.json`。

### `install-strategy` 安装策略

- 默认值：`hoisted`
- 类型： "hoisted", "nested", "shallow", or "linked"

同 [安装包](/npm/npm-install.html#install-strategy-安装策略) 的参数
