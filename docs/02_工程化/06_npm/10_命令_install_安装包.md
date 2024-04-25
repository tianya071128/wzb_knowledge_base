# install 安装包

[`npm install`](https://docs.npmjs.com/cli/v10/commands/npm-install) 用于安装一个包

```shell
npm install [<package-spec> ...]

aliases: add, i, in, ins, inst, insta, instal, isnt, isnta, isntal, isntall

```

## 安装包的版本

### 不指定版本

`npm install [<@scope>/]<name>` 不指定版本:

- 存在 `package.json` 或存在 `package-lock` 类型文件，则会下载声明的语义版本控制规则的最新版本的包

```json
{
  "dependencies": {
    # 此时会安装 2.xx.xx 版本，而不是下载 3.xx.xx 版本
    "vue": "^2.6.14",
	}
}
```

- 不存在上述文件的话，则会按照 **`latest`** 标签指定的版本。

  ::: tip 注意
  `latest` 标签默认为最新版本，但是也可指定 `latest` 对应其他版本
  :::

### 指定标签

`npm install [<@scope>/]<name>@<tag>` 安装指定标签引用的包版本。**如果不存在该标签, 那么将失败**

```bash
$ npm install sax@latest
$ npm install @myorg/mypackage@latest
```

### 指定版本

`npm install [<@scope>/]<name>@<version>` 安装指定版本的包。如果版本尚未发布到注册中心，这将失败。

```bash
$ npm install sax@0.1.1
$ npm install @myorg/privatepackage@1.5.0
```

### 指定版本范围

`npm install [<@scope>/]<name>@<version range>`安装与指定版本范围匹配的软件包版本。

```bash
$ npm install sax@">=0.1.0 <0.2.0"
$ npm install @myorg/privatepackage@"16 - 17"
```

## 标志：控制包保存的位置和方式

默认情况下，`npm install` 将任何指定的包保存到 `dependencies` 中。此外，您可以使用一些额外的标志来控制它们的保存位置和方式：

- `-P, --save-prod` **包将出现在你的 **`dependencies`** 中。这是默认设置，除非存在 -D 或 -O。**
- `-D, --save-dev`包将出现在你的 `devDependencies` 中。
- `-O, --save-optional` 包会出现在你的 `optionalDependencies` 中。
- `--no-save` 不保存到 `dependencies`。

当使用上述任何选项将依赖项保存到 `package.json` 时，还有两个额外的可选标志：

- `-E, --save-exact` 保存的依赖项将配置为精确版本，而不是使用 `npm` 默认的 `semver` 范围运算符。
- `-B, --save-bundle` 保存的依赖项也将被添加到你的 `bundleDependencies` 列表中。

## 配置

### `--save, -S` 控制是否保存到 package.json 中

- 默认值: `true`
- 类型：`boolean`

将已安装的包作为依赖项保存到 `package.json` 文件中

```bash
# 保存到 package.json 的 dependencies 中，因为 --save 默认为 true，默认为 --save-prod
$ npm install vue # 等同于 npm install vue -S -P

# 将 --save 设置为 false，那么就不会保存到 package.json 中
$ npm install vue --save false
```

### `--save-exact, -E`保存为精确版本

- 默认值：`false`
- 类型：`boolean`

保存的依赖项将配置为精确版本，而不是使用 `npm` 默认的 `semver` 范围运算符。

### `--global, -g` 全局安装

- 默认值：`false`
- 类型：`boolean`

在“全局”模式下运行, 以便将包安装到全局文件夹而不是当前工作目录中。

### `--force, -f` 忽略缓存

- 默认值：`false`
- 类型：`boolean`

将强制 `npm` 获取远程资源，即使磁盘上存在本地副本也是如此。

### `--package-lock` 是否更新 `package-lock` 文件中的版本

- 默认值：`true`
- 类型：`boolean`

默认情况下, 会自动更新 `package-lock` 锁文件的版本, 如果设置为 `false` 这将阻止写入 `package-lock.json`。

### `install-strategy` 安装策略

- 默认值：`hoisted`
- 类型： "hoisted", "nested", "shallow", or "linked"

设置在 `node_modules` 中安装包的策略。

- hoisted：提升，在顶级中不重复安装，并根据需要在目录结构中进行复制。

- nested(以前的 `--legacy-bundling`)：就地安装，不在 `node_modules` 中提升包安装，而是以它们所依赖的相同方式安装包。

- shallow(以前的 `--global-style`)：仅在顶级 `node_modules` 中安装直接依赖项，但提升更深层次的依赖项。

- linked(实验性)：安装在 `node_modules/.store` 中，链接到位，未提升。
