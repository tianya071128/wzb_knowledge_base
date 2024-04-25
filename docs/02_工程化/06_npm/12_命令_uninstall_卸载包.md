# uninstall 卸载包

[`npm uninstall`](https://docs.npmjs.com/cli/v10/commands/npm-uninstall) 用于卸载包

```shell
npm uninstall [<@scope>/]<pkg>...

aliases: unlink, remove, rm, r, un
```

## 描述

- 此命令将卸载一个包(必须指定包)，完全删除这个包**以及这个包的所有依赖**
- 默认情况下，同时会在 `package.json`、`npm-shrinkwrap.json` 和 `package-lock.json` 文件中删除包。
- **但是 --no-save 或者 --save false 时**，只会在 `node_modules` 删除包，不会在 `package.json`、`npm-shrinkwrap.json` 和 `package-lock.json` 文件中删除包。
- -g, --global 全局模式下，将会卸载全局包

## 示例

```bash
# vue 会被卸载，以及不会在 package.json、npm-shrinkwrap.json 或 package-lock.json 文件中。
$ npm uninstall vue

# vue 会被卸载，但是不会从 package.json... 相关文件中删除
# 当只需要删除包，而要保存这个项目依赖时会有用
$ npm uninstall vue --no-save
```

## 配置

### `--save, -S` 是否更新 `package.json` 中的版本

- 默认值: `true`
- 类型：`boolean`
  - `true` 在 `package.json`、`npm-shrinkwrap.json` 和 `package-lock.json` 文件中删除包
  - `false` 只会在 `node_modules` 删除包，不会在 `package.json`、`npm-shrinkwrap.json` 和 `package-lock.json` 文件中删除包。
