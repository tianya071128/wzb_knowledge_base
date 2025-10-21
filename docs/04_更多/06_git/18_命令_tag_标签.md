# git tag

## 作用

创建、查看、删除或验证使用 `GPG` 签名的 `tag`

## 概述

```bash
# 创建标签
git tag [-a | -s | -u <key-id>] [-f] [-m <msg> | -F <file>] [-e]
	[(--trailer <token>[(=|:)<value>])…]
	<tagname> [<commit> | <object>]
	
# 删除标签
git tag -d <tagname>…

# 查看标签
git tag [-n[<num>]] -l [--contains <commit>] [--no-contains <commit>]
	[--points-at <object>] [--column[=<options>] | --no-column]
	[--create-reflog] [--sort=<key>] [--format=<format>]
	[--merged <commit>] [--no-merged <commit>] [<pattern>…]
	
# 验证使用 GPG 签名的 tag
git tag -v [--format=<format>] <tagname>…
```

## 标签的两种类型

1. **轻量标签（Lightweight Tag）**：仅指向某个提交的 “指针”，不包含额外信息（如标签创建者、时间、说明），类似分支但不会移动。适合本地临时标记。
2. **附注标签（Annotated Tag）**：完整的 Git 对象，包含标签名、创建者、邮箱、创建时间、详细说明等元信息，会被 Git 永久存储并可推送到远程仓库。适合正式版本发布（如 `v1.0.0`），支持签名验证。

## 创建标签

```bash
git tag [-a | -s | -u <key-id>] [-f] [-m <msg> | -F <file>] [-e]
	[(--trailer <token>[(=|:)<value>])…]
	<tagname> [<commit> | <object>]
```

* **创建轻量标签（默认）**:  直接指定标签名，或指定提交创建
* **创建附注标签（推荐用于正式版本）**： 使用 `-a`（`--annotate`）参数
* **创建签名标签（用于高度可信场景）**：使用 `-s`（`--sign`）参数或 `-u <key-id>`（`--local-user=<key-id>`）参数对标签签名，确保标签未被篡改。需配置 GPG 密钥

```bash
# 为当前提交创建轻量标签
git tag v1.0.0-light

# 为指定提交（哈希 `a1b2c3d`）创建轻量标签
git tag v0.9.0 a1b2c3d

# 为当前提交创建附注标签（-a 表示附注标签）
git tag -a v1.0.0 -m "正式发布 v1.0.0 版本：包含登录、支付功能"

# 创建签名标签
git tag -s v1.0.0 -m "签名发布 v1.0.0"
```

### 推送标签到远程仓库

标签默认不会随 `git push` 推送到远程，需手动指定：

```bash
# 推送单个标签到远程
git push origin v1.0.0

# 推送所有未推送的标签到远程
git push origin --tags
```

## 查看标签

```bash
git tag [-n[<num>]] -l [--contains <commit>] [--no-contains <commit>]
	[--points-at <object>] [--column[=<options>] | --no-column]
	[--create-reflog] [--sort=<key>] [--format=<format>]
	[--merged <commit>] [--no-merged <commit>] [<pattern>…]
```

* 当 `git tag` 命令不带参数或者 `git tag -l` 会列出当前所有的标签
* **显示标签说明（-n）**: 对于**附注标签**（带说明的标签），`-n<数字>` 用于显示标签的说明文字，数字表示显示的最大行数（默认显示第一行）
* **模糊匹配标签（-l/--list + 通配符）**: 可使用筛选标签
* **排序（--sort=<排序规则>）**：指定排序规则对标签进行排序
  * 前缀 `-` 表示按照数值的降序排序。
  * `creatordate`：按标签的**创建时间**排序
  * `version:refname`：按标签名的**版本号规则**排序
  * `refname`：按标签名的**字母 / 数字顺序**排序（Git 默认排序方式，无需显式指定）

```bash
# 模糊匹配标签 --> 查找所有包含 beta 的测试版标签（如 v2.0.0-beta、v3.1-beta.2）
git tag -l "*beta*"

# 按标签创建时间升序（最早的标签在前）
git tag -l "v*" --sort=creatordate

# 按标签创建时间降序（最新的标签在前）
git tag -l "v*" --sort=-creatordate
```

## 删除标签

```bash
git tag -d <tagname>…
```

* **删除本地标签**: 本地标签仅存储在本地仓库，删除操作简单，使用 `git tag -d` 命令

### 删除远程标签

```bash
git push <仓库> --delete tag <标签名1> <标签名2> <标签名3>

# 或者
git push <仓库> :refs/tags/<标签名>
```

* 删除远程之后, 需要让所有成员都同步一下远程分支: `git fetch --prune-tags`，用于**同步远程仓库标签并清理本地无效标签**

## 选项

### 创建标签选项

#### `<提交>`: 指定提交创建

- **作用**：新标签将引用的对象，通常是一个提交。 默认为 `HEAD`。

#### `-a,--annotate`: 创建附注标签

- **作用**：生成包含元信息（创建者、时间、说明）的完整标签对象

#### `-s,--sign, -u <键 ID>, --local-user=<键 ID>`: 创建签名标签

- **作用**：创建 **GPG 签名标签**

#### `-f, --force`: 强制创建

- **作用**：**强制创建或更新标签**的参数，当标签已存在时，它会覆盖原有标签（包括标签指向的提交和标签信息）

#### `-m <消息>,--message 消息> `: 指定标签信息

- **作用**：使用给定的标签信息（而不是提示）。 如果给出多个 `-m` 选项，它们的值将作为单独的段落连接起来。 如果未给出 `-a`、`-s` 或 *-u <键 ID>* 选项，则默认为 `-a`

### 查看标签选项

#### `-l, --list`: 查看标签

- **作用**：
  - 查看标签。使用可选的`<模式>…`，例如`git tag --list 'v-\*'`，只查看符合模式的标签。
  - 运行 `git tag ` 时不加参数也会列出所有标签。

#### `-n<num>`: 显示标签信息

- **作用**：对于**附注标签**（带说明的标签），`-n<数字>` 用于显示标签的说明文字，数字表示显示的最大行数（不带数字则显示第一行）。轻量标签无说明，此参数无效。

#### `--sort=<键>`: 排序

- **作用**：[按指定规则对标签排序查看](#查看标签)

### 删除标签选项

#### `-d, --delete`: 删除标签

- **作用**：[删除给定名字的现存标签](#删除标签)