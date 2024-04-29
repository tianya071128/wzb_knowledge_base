# login 登录

[`npm login`](https://docs.npmjs.com/cli/v10/commands/npm-login) 用于登录[注册表](/npm/home.html#注册表)的用户帐户

```bash
npm login
```

## 描述

验证指定注册表中的用户，并将凭据保存到 `.npmrc` 文件中。如果未指定注册表，则将使用默认注册表。

![img](/img/274.jpg)

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
