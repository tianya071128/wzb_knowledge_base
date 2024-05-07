# start 运行 start 脚本

[`npm start`](https://docs.npmjs.com/cli/v10/commands/npm-start) 运行 start 脚本

```bash
npm start [-- <args>]
```

## 描述

- 将运行包的 `scripts` 对象的 `start` 属性中指定的预定义命令。

- 如果 `“scripts”` 对象没有定义 `“start”` 属性，`npm` 将运行 `node server.js`。
