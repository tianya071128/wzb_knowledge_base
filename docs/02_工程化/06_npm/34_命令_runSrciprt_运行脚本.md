# run-script 运行脚本

[`npm run-script`](https://docs.npmjs.com/cli/v10/commands/npm-run-script) 运行任意包脚本

```bash
npm run-script <command> [-- <args>]

aliases: run, rum, urn
```

## 描述

- 运行 `scripts` 字段中的任意命令，如果未提供 `“命令”`，它将列出可用的脚本。

- 使用 `--` 传递 --prefixed 标志和选项给指定脚本，而不传递给任何前置或后置脚本。

  ```shell
  # 传递 grep="pattern" 给 test 脚本
  npm run test -- --grep="pattern"
  ```

- `env` 脚本是一个特殊的内置命令，可用于列出脚本在运行时可用的环境变量。如果你的包中定义了 `“env”` 命令，它将优先于内置命令。
