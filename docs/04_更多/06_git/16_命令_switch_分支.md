# git switch

## 作用

用于**分支管理**的核心命令，主要功能是创建、查看、重命名和删除分支

## 概述

```bash
# 查看分支
git branch [--color[=<when>] | --no-color] [--show-current]
	[-v [--abbrev=<n> | --no-abbrev]]
	[--column[=<options>] | --no-column] [--sort=<key>]
	[--merged [<commit>]] [--no-merged [<commit>]]
	[--contains [<commit>]] [--no-contains [<commit>]]
	[--points-at <object>] [--format=<format>]
	[(-r | --remotes) | (-a | --all)]
	[--list] [<pattern>…​]

# 创建分支
git branch [--track[=(direct|inherit)] | --no-track] [-f]
	[--recurse-submodules] <分支名> [<起始点>]

# 设置分支与远程跟踪分支的关联
git branch (--set-upstream-to=<上游> | -u <上游>) [<分支名>]

# 删除分支与远程跟踪分支的关联
git branch --unset-upstream [<分支名>]

# 移动/重命名分支
git branch (-m | -M) [<旧分支>] <新分支>

# 复制分支
git branch (-c | -C) [<旧分支>] <新分支>

# 删除分支
git branch (-d | -D) [-r] <分支名>…

# 使用编辑器编辑分支信息
git branch --edit-description [<分支名>]
```

## 查看分支

```bash
git branch [--color[=<when>] | --no-color] [--show-current]
	[-v [--abbrev=<n> | --no-abbrev]]
	[--column[=<options>] | --no-column] [--sort=<key>]
	[--merged [<commit>]] [--no-merged [<commit>]]
	[--contains [<commit>]] [--no-contains [<commit>]]
	[--points-at <object>] [--format=<format>]
	[(-r | --remotes) | (-a | --all)]
	[--list] [<pattern>…​]
```

- 如果给了`--list`，或者没有非选项参数，现有的分支将被列出；**当前的分支将以绿色突出显示，并标有星号**。
- 选项`-r`会将远程跟踪的分支被列出，选项`-a`显示本地和远程分支。
- 选项 `-vv` 显示本地分支与远程分支的关联关系（跟踪信息）和最新提交信息

```bash
# 查看本地所有分支（当前分支前会显示 *）
git branch

# 查看本地和远程跟踪分支（-a = all）
git branch -a

# 查看远程分支（-r = remote）
git branch -r

# 查看分支关联的远程跟踪分支（-vv 显示详细关联信息）
git branch -vv
```

## 创建分支

```bash
git branch [--track[=(direct|inherit)] | --no-track] [-f]
	[--recurse-submodules] <分支名> [<起始点>]
```

该命令可以用来创建新分支，指向当前的 `HEAD`，也可以指定 `\<起始点>`。注意，这将创建新的分支，但不会将工作树切换到它；使用 `git switch <newbranch>`来切换到新的分支。

```bash
# 基于当前分支创建新分支（创建后仍在当前分支）
git branch <新分支名>

# 基于指定分支（或远程分支）创建新分支
git branch <新分支名> <基准分支名>
```

## 设置本地分支与远程跟踪分支的关联

```bash
# 设置分支与远程跟踪分支的关联
git branch (--set-upstream-to=<上游> | -u <上游>) [<分支名>]

# 删除分支与远程跟踪分支的关联
git branch --unset-upstream [<分支名>]
```

- 当本地分支未关联远程跟踪分支时，直接执行 `git pull` 或 `git push` 会报错（Git 不知道从哪个远程分支同步数据）。通过该命令建立关联后，Git 会自动识别对应远程分支，简化操作。

```bash
# 将本地 feature 分支重新关联到 origin/new-feature
git branch --set-upstream-to=origin/new-feature feature

# 将本地 feature 分支解除关联
git branch --unset-upstream feature
```

## 移动/重命名分支

```bash
# 移动/重命名分支
git branch (-m | -M) [<旧分支>] <新分支>
```

- 选项`-m`用于重命名分支
- `-M`: 是 `--move --force` 的快捷方式。**强制覆盖已存在的目标分支**，完成重命名。
- 远程分支无法直接重命名, 需要先删除旧的远程分支，并将新命名的本地分支推送到远程。同时通知其他成员更新

## 复制分支

```bash
# 复制分支
git branch (-c | -C) [<旧分支>] <新分支>
```

- 选项`-c,--copy`用于复制分支，将其连同其配置和日志一起复制到一个新的名称。
- 选项 `-C` 是 `--copy --force`的快捷方式。**强制覆盖已存在的目标分支**，完成复制。

## 删除分支

```bash
# 删除分支
git branch (-d | -D) [-r] <分支名>…
```

- 删除分支是**不可逆操作**，确保分支不再需要后再执行
- **该分支必须完全合并在其上游分支(远程仓库)中，如果没有用`--track`或`--set-upstream-to`设置的上游分支，则必须在`HEAD`中。**
- 选项`D` 是 `--delete --force`的快捷方式。可**强制删除**未合并的分支
- 使用 `-r` 和 `-d` 来删除[远程跟踪的分支](./branch.html#跟踪分支)。注意，只有当远程分支不再存在于远程仓库或 "git fetch "被配置为不再获取它们时，删除远程跟踪分支才有意义。
- 远程分支使用其他命令删除: `git push <远程仓库名> --delete <远程分支名>`

```bash
# 删除已合并到当前分支的本地分支（-d = delete）
git branch -d <分支名>

# 强制删除未合并的本地分支（-D = 强制 delete，慎用）
git branch -D <分支名>

# 删除远程分支（实际是推送一个删除请求）
git push origin --delete <远程分支名>
```

## 选项

### `<新分支>`: 创建分支

- **作用**：可以用于[创建分支](#创建分支)

### `-d, --delete`: 删除分支

- **作用**：[删除分支](#删除分支)

### `-D`: 强制删除分支

- **作用**：[强制删除分支](#删除分支)，本质上是 `--delete --force` 的快捷方式。

### `-m, --move`: 移动/重命名分支

- **作用**：[移动/重命名分支](#移动-重命名分支)

### `-M`: 强制移动/重命名分支

- **作用**：[强制移动/重命名分支](#移动-重命名分支)，本质上是 `--move --force` 的快捷方式。

### `-c, --copy`: 复制分支

- **作用**：[复制分支](#复制分支)

### `-C`: 强制复制分支

- **作用**：[强制复制分支](#复制分支)，本质上是 `--copy --force` 的快捷方式。

### `-u <跟踪分支>,--set-upstream-to=<跟踪分支>`: 设置分支与远程跟踪分支的关联

- **作用**：[设置本地分支与远程跟踪分支的关联](设置本地分支与远程跟踪分支的关联)

### `--unset-upstream`: 删除分支与远程跟踪分支的关联

- **作用**：[删除分支与远程跟踪分支的关联](设置本地分支与远程跟踪分支的关联)，如果没有指定分支，则默认为当前分支。

### 基础查看分支选项

#### `-l,--list`: 查看本地分支

- **作用**：查看分支。 使用可选的 `<pattern>…`，例如 `git branch --list maint-*`，只列出符合该模式的分支。

#### `-a,--all`: 查看全部分支

- **作用**：查看远程跟踪的分支和本地分支。 可与`--list`组合，以匹配可选的模式。

#### `-r,--remotes`: 远程分支的操作

- **作用**：查看或删除（如果与 `-d` 一起使用）远程跟踪的分支。 可与`--list`结合使用，以匹配可选的模式（s）。

### 增强查看分支信息选项

#### `-v,--verbose,-vv`: 显示分支更多信息

- **作用**：
  - `-v, --verbose`: 显示分支最后一次提交的哈希值和提交信息
  - `-vv`: 显示分支关联的远程跟踪分支（若已关联）+ 最后一次提交信息

#### `--abbrev=<n>`: 提交哈希值的显示长度

- **作用**：自定义提交哈希值的显示长度（默认 7 位）

#### `--no-abbrev`: 显示完整的提交哈希值

- **作用**：在输出列表中显示完整的 sha1，而不是缩写它们。

### 查看分支筛选与搜索选项

#### `--contains [<commit>]`: 包含指定提交的分支

- **作用**：只查看包含指定提交的分支（如果没有指定则为 HEAD）。意味着 `--list`。

#### `--no-contains [<commit>]`: 不包含指定提交的分支

- **作用**：只查看不包含指定提交的分支（如果没有指定则为 HEAD）。意味着 `--list`。
