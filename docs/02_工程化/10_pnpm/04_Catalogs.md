# Catalogs

`catalogs` 是 pnpm workspace 内置的**统一依赖版本中心**，解决 monorepo 多子包版本重复维护问题：把所有第三方依赖版本统一写在根目录一处，所有子包引用统一别名，不用每个包重复写版本号。

只在 `pnpm-workspace.yaml` 中配置，搭配 `catalog:` 协议使用。

## 解决的问题

1. **维护唯一版本** - 我们通常希望在工作空间中共同的依赖项版本一致。 Catalog 让工作区内共同依赖项的版本更容易维护。 重复的依赖关系可能会在运行时冲突并导致错误。 当使用打包器时，不同版本的重复依赖项也会增大项目体积。
2. **易于更新** — 升级或者更新依赖项版本时，只需编辑 `pnpm-workspace.yaml` 中的目录，而不需要更改所有用到该依赖项的 `package.json` 文件。 这样可以节省时间 — 只需更改一行，而不是多行。
3. **减少合并冲突** — 由于在升级依赖项时不需要编辑 `package.json`文件，所以这些依赖项版本更新时就不会发生 git 冲突。

## 配置

### 在 `pnpm-workspace.yaml` 中定义 catalog

在根目录的 `pnpm-workspace.yaml` 中新增`catalog`、 `catalogs` 字段，把需要统一版本的依赖写进去：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'

# 默认目录, 通过 catalog:default 或者 catalog: 引用
catalog:
  react: ^16.14.0
  react-dom: ^16.14.0

catalogs:
# 使用具名目录, 可以通过 "catalog:react18" 引用
  react18:
    react: '^18.2.0'
    react-dom: '^18.2.0'
```

`default` 是默认 catalog 名称。每个依赖只需写一次版本号，整个工作空间共同引用。

### 在子包 `package.json` 中引用 catalog

将原本写具体版本号的地方替换为 `catalog:` 协议：

```json
{
  "dependencies": {
    "lodash": "catalog:"
  },
  "devDependencies": {
     // 使用具名目录
    "react": "catalog:react18"
  }
}
```

## 在 `pnpm add` 命令中指定 Catalog

从 pnpm v10.12.1 开始，你可以直接在安装命令中指定将依赖保存到哪个 catalog:

* **保存到默认 Catalog**: 使用 `--save-catalog` 参数

  ```bash
  pnpm add lodash --save-catalog
  ```

* **保存到指定的具名 Catalog**: 使用 `--save-catalog-name <catalog_name>` 参数

  ```bash
  pnpm add axios --save-catalog-name react18
  ```

**会自动保存到 `pnpm-workspace.yaml` 文件, 以及在 `package.json` 中引用**

## 和 workspace:*、overrides 区别

这三个机制都出现在 pnpm 工作空间中，但解决的问题完全不同：

### catalog: vs workspace:*

| 对比项 | `catalog:` | `workspace:*` |
|--------|-----------|--------------|
| 引用对象 | 外部依赖（如 `react`、`lodash`） | 工作空间内的本地子包 |
| 版本来源 | `pnpm-workspace.yaml` 中的 catalog | 本地子包的 `package.json` |
| 典型场景 | 统一第三方依赖版本 | 子包之间互相引用源码 |
| 是否发布到 npm | 发布时替换为具体版本号 | 发布时替换为具体版本号 |

```json
{
  "dependencies": {
    "react": "catalog:",           // 引用 catalog 中定义的外部依赖版本
    "@my-scope/core": "workspace:*" // 引用工作空间内的本地子包
  }
}
```

### catalog: vs pnpm.overrides

| 对比项 | `catalog:` | `pnpm.overrides` |
|--------|-----------|-----------------|
| 作用层级 | 控制 `package.json` 中声明的版本 | 控制依赖解析后的最终版本 |
| 是否可见 | 子包 `package.json` 中显式声明 | 只在根 `package.json` 中配置 |
| 使用场景 | 统一声明常用依赖版本 | 强制覆盖某个依赖的解析版本 |
| 对子包影响 | 需要子包主动引用 catalog | 所有子包都会被强制覆盖 |

`pnpm.overrides` 示例：

```json
{
  "pnpm": {
    "overrides": {
      "lodash": "4.17.21"
    }
  }
}
```

这会强制整个工作空间中所有地方解析出来的 `lodash` 都使用 `4.17.21`，即使某个依赖声明了 `lodash@^3.0.0`。

### 总结

- **`catalog:`**：子包主动约定"我用哪个版本的第三方依赖"
- **`workspace:*`**：子包引用"工作空间里的其他本地包"
- **`pnpm.overrides`**：根包强制规定"整个依赖树中某个包必须用什么版本"

## 配置参数: catalogMode 和 cleanupUnusedCatalogs

这两个参数都写在根目录的 `pnpm-workspace.yaml` 中，用于控制 catalog 的自动行为。

### catalogMode

`catalogMode` 控制 `pnpm add` 新增依赖时**是否强制 / 优先使用 catalog**

- **支持版本**: pnpm v10.12.1
- **默认值**: `manual`
- **可选值**: `manual`、`strict`、`prefer`

```yaml
packages:
  - 'packages/*'

catalog:
  react: '^18.2.0'

catalogMode: strict
```

三种模式区别：

| 模式 | 行为 |
|------|------|
| `manual`（默认） | **不会自动写入 catalog**，默认只会在子包写死版本 `^x.y.z`。想使用 catalog 必须手动加标识。 |
| `prefer` | 优先使用 catalog 中的版本，如果 catalog 中没有兼容版本，则回退到直接声明版本 |
| `strict` | 只允许安装 catalog 中已存在的版本范围，超出范围或不存在会报错；`pnpm add react` 会强制使用 catalog 中的版本 |

::: tip 使用建议

- 小型项目或刚迁移到 catalog 时：用 `manual`，保持完全可控
- 大型项目逐步迁移：用 `prefer`，既享受 catalog 便利，又保留回退空间
- 希望强制统一版本的项目：用 `strict`，避免有人绕过 catalog 安装其他版本

:::

### cleanupUnusedCatalogs

`cleanupUnusedCatalogs` 控制安装时是否自动清理未被任何子包引用的 catalog 条目。

- **支持版本**: pnpm v10.15.0
- **默认值**: `false`
- **类型**: Boolean

```yaml
packages:
  - 'packages/*'

catalog:
  react: '^18.2.0'
  lodash: '^4.17.21'

cleanupUnusedCatalogs: true
```

开启后，运行 `pnpm install` 时，pnpm 会自动删除 `pnpm-workspace.yaml` 中没有任何子包在使用的 catalog 依赖条目。



### 组合使用示例

```yaml
packages:
  - 'packages/*'
  - 'apps/*'

catalog:
  react: '^18.2.0'
  react-dom: '^18.2.0'

catalogMode: strict
cleanupUnusedCatalogs: true
```

这个配置表示：

- 所有子包中声明的 `react` 和 `react-dom` 必须使用 catalog 中指定的版本
- 如果有人尝试安装不在 catalog 版本范围内的 `react`，pnpm 会直接报错
- 当某个 catalog 条目不再被子包引用时，下次安装会自动清理

## 参考链接

- [pnpm 中文文档 - Catalogs](https://pnpm.io/zh/catalogs)
