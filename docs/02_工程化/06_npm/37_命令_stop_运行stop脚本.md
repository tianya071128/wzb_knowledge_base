# stop 运行 stop 脚本

[`npm stop`](https://docs.npmjs.com/cli/v10/commands/npm-stop) 运行 stop 脚本

```bash
npm stop [-- <args>]
```

## 描述

- 将运行包的 `scripts` 对象的 `“stop”` 属性中指定的预定义命令。

- 与 [`npm start`](/npm/npm-start) 不同，如果未定义 `“stop”` 属性，则不会运行默认脚本。
