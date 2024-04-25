# dedupe 去除重复包

[`npm dedupe`](https://docs.npmjs.com/cli/v10/commands/npm-dedupe) 减少树中的重复包

```shell
npm dedupe

alias: ddp
```

## 描述

- 搜索本地包树并尝试通过将依赖项进一步向上移动树来简化整体结构，在这些树中它们可以更有效地由多个依赖包共享。
- 在 `--dry-run` 模式下运行 `npm dedupe`，使 `npm` 只输出重复项，而不实际更改包树。

## 示例

例如，这个依赖关系图：

```
a
+-- b <-- depends on c@1.0.x
|   `-- c@1.0.3
`-- d <-- depends on c@~1.0.9
    `-- c@1.0.10
```

`npm dedupe` 会将树转换为：

```
a
+-- b
+-- d
`-- c@1.0.10
```

## 配置

### `--global, -g` 全局模式

- 默认值：`false`
- 类型：`boolean`
  - `true`在“全局”模式下运行

### `--dry-run` **试运行**

- 默认值：`false`
- 类型：`boolean`
  - `true`不进行更改

表示您不希望 `npm` 进行任何更改，并且它应该只报告它会做的事情。这可以传递到修改本地安装的任何命令中，例如，安装、更新、重复数据删除、卸载以及打包和发布。
