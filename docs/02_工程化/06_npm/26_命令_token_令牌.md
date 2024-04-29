# token 令牌

[`npm token`](https://docs.npmjs.com/cli/v10/commands/npm-token) 用于管理 `tokens`

```bash
npm token list
npm token revoke <id|token>
npm token create [--read-only] [--cidr=list]
```

## 描述

用于查询、创建、删除(撤销) `token`:

- `npm token list`: 显示所有的 `token`;

- `npm token create [--read-only] [--cidr=<cidr-ranges>]`: 创建新的 `token`。这将提示您输入密码，如果启用了双因素身份验证，则会提示您输入 `otp`。

- `npm token revoke <token|id>`: 删除指定的 `token`。

## 配置

### `--registry` **注册表**

- 默认值：npm 配置中的 `registry`, 默认为 [https://registry.npmjs.org/](https://registry.npmjs.org/)
- 类型：`URL`

注册表的基本 URL。

### `--read-only` **只读**

- 默认值：`false`
- 类型：`Boolean`

用于在使用 `npm token create` 命令配置受限访问令牌时将令牌标记为无法发布。

### `--cidr` **[CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)地址列表**

- 默认值：`null`
- 类型：`null 或 String(可设置多次)`

用于在使用 `npm token create` 命令配置受限访问令牌时要使用的 CIDR 地址列表。

## 参考

- [npm 官网：登录](https://docs.npmjs.com/creating-a-new-npm-user-account)
