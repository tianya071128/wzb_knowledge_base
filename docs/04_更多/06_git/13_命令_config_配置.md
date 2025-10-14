# git config

## 作用

用于配置环境变量、用户信息、行为偏好等的核心命令，通过它可以定制 Git 的各种行为。

## 概述

```bash
git config list [<file-option>] [<display-option>] [--includes]
git config get [<file-option>] [<display-option>] [--includes] [--all] [--regexp] [--value=<pattern>] [--fixed-value] [--default=<default>] [--url=<url>] <name>
git config set [<file-option>] [--type=<type>] [--all] [--value=<pattern>] [--fixed-value] <name> <value>
git config unset [<file-option>] [--all] [--value=<pattern>] [--fixed-value] <name>
git config rename-section [<file-option>] <old-name> <new-name>
git config remove-section [<file-option>] <name>
git config edit [<file-option>]
git config [<file-option>] --get-colorbool <name> [<stdout-is-tty>]
```

## 描述

* 可以用这个命令查询/设置/替换/取消选项。名称(name)实际上是用点隔开的节和键，值(value)会被转义。
* 读取配置时，默认从系统、全局和资源库的本地配置文件中读取数值，选项 `--system`、`--global`、`--local`、`--worktree` 和 `--file`*<文件名>* 可以用来告诉命令只从选定的位置读取
* 写入时，新值默认写入仓库的本地配置文件，选项 `--system`、`--global`、`--worktree`、`--file` *<文件名>* 可以用来告诉命令写到那个位置（可以给出 `--local` 选项，但是默认选项就是本地(local)）。

## 子命令

### `git config list`

`git config list [--local|--global|--system]`: 列出配置文件中设置的所有变量，以及它们的值。

**若未指定范围, 则将获取所有范围的配置**

```bash
# 列出所有生效的配置（默认）
$ git config list

# 仅列出全局配置
$ git config list --global
```

### `git config get`

`git config get [--local|--global|--system] <配置项>`: 获取指定键的值。如果配置中键出现多次，则获取最后一个值。

部分配置项支持多个值（如 `remote.origin.fetch`），需用 `--all` 选项获取所有值

**若未指定范围, 则将优先级高的配置。指定范围，则只返回指定范围的**

```bash
# 获取当前仓库实际使用的用户名（局部存在则返回局部，否则返回全局）
git config get user.name

# 仅查询全局配置中的邮箱（忽略局部配置）
git config get --global user.email

# 获取远程仓库 origin 的所有 fetch 规则
git config get --all remote.origin.fetch
```

### `git config set`

`git config set [--local|--global|--system] <配置项> <值>`:  为一个或多个配置选项设置值。默认情况下，此命令拒绝写入多值配置选项。传递 `--all` 将用新值替换所有多值配置选项，而 `--value=` 将替换所有其值与给定模式匹配的配置选项。

**默认设置当前仓库的配置, 可指定范围**

```bash
# 设置当前仓库
git config set user.email "zhangsan-project@example.com"

# 设置全局用户名（所有仓库提交时使用）
git config set --global user.name "张三"
```

### `git config unset`

`git config unset [--local|--global|--system] <配置项>`: **删除设置一个或多个配置选项的值**。默认情况下，此命令拒绝取消设置多值键。传递 `--all` 将取消设置所有多值配置选项，而 `--value` 将取消设置所有其值与给定模式匹配的配置选项。

**默认清除当前仓库的配置, 可指定范围清除**

```bash
# 删除当前仓库的局部邮箱配置（恢复使用全局邮箱）
git config unset user.email

# 删除该配置项的所有值
git config unset --all remote.origin.fetch
```

### `git config edit`

`git config edit [--local|--global|--system]`: 打开编辑器来修改指定的配置文件；

### `git config rename-section`

`git config rename-section <旧段落名> <新段落名>`: **重命名配置文件中的段落（section）**，段落内的所有键值对保持不变。

* 配置文件中的「段落」：

  Git 配置文件采用 INI 格式，以 `[段落名]` 划分区块，例如：

  ```ini
  [user]                  # 段落名：user
      name = Alice
      email = alice@x.com
  
  [remote "origin"]       # 段落名：remote "origin"
      url = https://github.com/alice/repo.git
      fetch = +refs/heads/*:refs/remotes/origin/*
  ```

* `rename-section` 命令正是针对这些 `[段落名]` 进行重命名操作。

```bash
# 将当前仓库配置中的 [user] 段落重命名为 [author]
git config rename-section user author


# 重命名前
[user]
    name = Alice
    email = alice@x.com

# 重命名后
[author]
    name = Alice
    email = alice@x.com
```

### `git config remove-section`

`git config remove-section <段落名>`: 删除完整删除配置文件中的整个段落（section）

## 配置层级（优先级）

配置分为多级，优先级从低到高为：

1. **系统配置（`--system`）**：作用于系统所有用户，配置文件位于 `/etc/gitconfig`（Linux/macOS）或 `Git安装目录/etc/gitconfig`（Windows）
2. **全局配置（`--global`）**：作用于当前用户的所有仓库，配置文件位于 `~/.gitconfig`（Linux/macOS）或 `C:\Users\用户名\.gitconfig`（Windows）
3. **仓库特定的配置（`--local`）**：仅作用于当前仓库，配置文件位于 `.git/config`
4. **特定配置**(`--worktree`): 这是可选的，与 `--local` 选项类似，只是如果启用了 `extensions.worktreeConfig` ，则从 `$GIT_DIR/config.worktree` 读取或写入。如果没有，则与 `--local` 选项行为相同。
5. **参数指定配置文件(`--file`)**: 参数指定配置文件


## 范围(作用域)

每个配置源都属于一个配置范围，[参考如上](#配置层级-优先级)

每个范围都对应于一个命令行选项：`--system`、`--global`、`--local`、`--worktree`、`--file`。

* 当读取选项时，指定一个范围将只从该范围内的文件读取选项。
* 当写选项时，指定一个范围将写到该范围内的文件（而不是仓库的特定配置文件）

### 受保护的配置

大多数配置选项无论在哪个作用域中定义都会生效，但有些选项只在某些作用域中被生效。完整的细节请参见相应选项的文档。

受保护的配置指的是 *system*、*global* 和 *command* 范围。 出于安全考虑，某些选项只有在受保护的配置中指定时才会生效，否则会被忽略。

## 常用配置项

* `user.name`: 提交信息中的作者
* `user.email`: 提交信息中的邮箱，**代码托管平台(GitHub、GitLab、Gitee)**等平台会通过提交信息中的 `user.email` 与用户账号绑定的邮箱进行匹配，从而：
  - 识别提交者身份，在仓库贡献者列表中正确显示用户。
  - 统计用户的贡献量（如 GitHub 的贡献热图）。
  - 触发相关通知（如提交关联的 Issue 通知）。
* `core.editor`: 默认编辑器配置

## 选项

### `--local,--global,...`: 配置的范围

- **作用**：指定命令的范围, [详情参考](#配置层级-优先级)

### `--show-origin`: 显示配置项来源文件路径

* **作用**: 用于在查看 Git 配置时**显示每个配置项的来源文件路径**，帮助定位配置的具体出处

* **示例**:

  ```bash
  $ git config list --show-origin
  
  file:C:/Program Files/Git/etc/gitconfig diff.astextplain.textconv=astextplain
  file:C:/Program Files/Git/etc/gitconfig filter.lfs.clean=git-lfs clean -- %f
  file:C:/Program Files/Git/etc/gitconfig filter.lfs.smudge=git-lfs smudge -- %f
  file:C:/Program Files/Git/etc/gitconfig filter.lfs.process=git-lfs filter-process
  ```

### `--show-scope`: 显示配置项所属的作用域

* **作用**: 类似于 `--show-origin` 选项，用于在查看配置时**显示每个配置项所属的作用域**（局部、全局或系统），帮助快速识别配置的生效范围

* **示例**:

  ```bash
  $ git config list --show-scope
  
  system  diff.astextplain.textconv=astextplain
  local   core.filemode=false
  ```

  



