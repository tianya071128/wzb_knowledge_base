# init 初始化工程

[`npm init`](https://docs.npmjs.com/cli/v10/commands/npm-init) 用户初始化工程, 创建一个 `package.json` 文件

```bas
npm init <package-spec> (等同于 `npx <package-spec>)
npm init <@scope> (等同于 `npx <@scope>/create`)

aliases: create, innit
```

## 描述

- `npm init ` 可用于设置新的或现有的 npm 包。

  - 如果调用 `npm init` 的话，将回退到旧的行为。会问你一堆问题，然后给你写一个`package.json`。可以使用 `-y/--yes` 完全跳过问卷。如果您传递 `--scope`，它将创建一个作用域包。
  - 如果指定包的话，在这种情况下，`<initializer>` 是一个名为 `create-<initializer>` 的 `npm` 包，它将由 `npm-exec` 安装，然后执行其主 `bin` -- 大概是创建或更新 package.json 并运行任何其他与初始化相关的操作。

    init 命令转化为对应的 `npm exec` 操作如下：

    - npm init foo -> npm exec create-foo
    - npm init @usr/foo -> npm exec @usr/create-foo
    - npm init @usr -> npm exec @usr/create
    - npm init @usr@2.0.0 -> npm exec @usr/create@2.0.0
    - npm init @usr/foo@2.0.0 -> npm exec @usr/create-foo@2.0.0

## 示例

```shell
# 使用 create-react-app 创建一个新的基于 React 的项目：
# 运行 react-app 脚手架, 后面的即为传入 react-app 的参数
$ npm init react-app ./my-react-app

# 使用 init 生成一个普通的旧 package.json：
$ npm init
```

## 配置

### --yes, -y 在命令行上打印的任何提示自动回答“是”。

- 默认值：null
- 类型：null、string
  - true 对 npm 可能在命令行上打印的任何提示自动回答“是”。

### --force 隐式设置 `--yes`。

- 默认值：false
- 类型：Boolean

同 `--yes`，意义不大。

### --scope 创建作用域包

- 默认值：当前项目的范围（如果有）或 ""
- 类型：String
