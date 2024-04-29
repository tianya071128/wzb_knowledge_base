# logout 登出

[`npm logout`](https://docs.npmjs.com/cli/v10/commands/npm-logout) 用于退出[注册表](/npm/home.html#注册表)的用户帐户

```bash
npm logout
```

## 描述

- 当登录到支持基于 `token` 的身份验证的注册表时，告诉服务器结束此 `token` 的会话。这将使 `token` 在您使用的任何地方都无效，而不仅仅是当前环境。

- 当登录到使用用户名和密码身份验证的旧注册表时，这将清除用户配置中的凭据。这种情况下，只会影响当前的环境。

![img](/img/275.jpg)

## 配置

### `--registry` **注册表**

- 默认值：npm 配置中的 `registry`, 默认为 [https://registry.npmjs.org/](https://registry.npmjs.org/)
- 类型：`URL`

注册表的基本 URL。

### `--auth-type` **验证类型**

- 默认值：`"web"`
- 类型：`"legacy"` | `"web"`

登录时使用什么身份验证策略。请注意，如果给出了 `otp` 配置，则该值将始终设置为 `legacy`。

## 参考

- [npm 官网：登录](https://docs.npmjs.com/creating-a-new-npm-user-account)
