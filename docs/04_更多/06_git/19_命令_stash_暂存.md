# git stash

## 作用

临时存储工作区和暂存区。当需要切换分支或拉取最新代码，但当前工作区的修改尚未完成（不想提交）时，可通过 `git stash` 将这些修改暂存起来，待后续恢复继续工作。

## 概述

```bash
# 查看暂存（stash）列表
git stash list [<log-options>]
# 查看暂存（stash）的具体修改内容
git stash show [-u | --include-untracked | --only-untracked] [<diff-options>] [暂存标识]
# 删除暂存（stash）栈中指定的暂存（stash）记录
git stash drop [-q | --quiet] [暂存标识]
# 恢复暂存（stash）的修改并同时删除该暂存记录
git stash pop [--index] [-q | --quiet] [暂存标识]
# 将暂存（stash）栈中指定的暂存（stash）修改恢复到当前工作区，但保留该暂存记录
git stash apply [--index] [-q | --quiet] [暂存标识]
# 从暂存（stash）创建新分支并自动恢复暂存修改
git stash branch <branchname> [暂存标识]
# 创建暂存（stash）
git stash [push [-p | --patch] [-S | --staged] [-k | --[no-]keep-index] [-q | --quiet]
	     [-u | --include-untracked] [-a | --all] [(-m | --message) <message>]
	     [--pathspec-from-file=<file> [--pathspec-file-nul]]
	     [--] [<pathspec>…]]
# 清空所有暂存（stash）记录
git stash clear

# 创建暂存（stash） --> 这是为了对脚本有用
git stash save [-p | --patch] [-S | --staged] [-k | --[no-]keep-index] [-q | --quiet]
	     [-u | --include-untracked] [-a | --all] [<message>]

### 以下都是底层命令
# 用于创建一个暂存（stash）对象并返回其哈希值，但不会将该暂存添加到暂存栈（stash list）
git stash create [<message>]
# 将通过 git stash create 生成的暂存对象（stash object）手动添加到暂存栈（stash list）
git stash store [(-m | --message) <message>] [-q | --quiet] <commit>
git stash export (--print | --to-ref <ref>) [<stash>…]
git stash import <commit>
```

## 基础原理

Git 暂存（`git stash`）的工作原理本质是通过创建**特殊的提交对象**临时存储工作区和暂存区的修改，并将这些对象组织成 “暂存栈”，同时恢复工作区到干净状态。

Git 会在本地仓库中创建**3 个关联的提交对象**（commit object），分别存储不同状态的修改：

1. **基础提交（base commit）**
   - 指向当前分支的最新提交（`HEAD`），作为暂存修改的 “基准版本”。
   - 作用：标记暂存修改是基于哪个提交创建的，后续恢复时用于计算差异。
2. **索引提交（index commit）**
   - 存储**暂存区（`git add` 后）** 的修改状态，即 “已暂存但未提交” 的内容。
   - 父提交：指向 “基础提交”，表示基于基准版本的暂存区变更。
3. **工作区提交（worktree commit）**
   - 存储**工作区（未 `git add`）** 的修改状态，即 “未暂存的修改”。
   - 父提交：同时指向 “基础提交” 和 “索引提交”，表示包含暂存区和工作区的所有变更。

## 创建暂存

```bash
git stash [push [-p | --patch] [-S | --staged] [-k | --[no-]keep-index] [-q | --quiet]
	     [-u | --include-untracked] [-a | --all] [(-m | --message) <message>]
	     [--pathspec-from-file=<file> [--pathspec-file-nul]]
	     [--] [<pathspec>…]]
```

- **基础暂存（仅跟踪文件）**:`git stash`，创建暂存的基础命令，暂存**已跟踪文件**（即之前被 `git add` 过的文件）的修改
- **暂存未跟踪文件（-u/--include-untracked）**：暂存**已跟踪文件**和**未跟踪文件**（新建的、未被 `git add` 的文件）
- **暂存所有文件（包括忽略文件，-a/--all）**：暂存**已跟踪文件 + 未跟踪文件 + 忽略文件**（覆盖所有文件变更）。**慎用，可能暂存大量不必要的文件（如日志、缓存），导致暂存体积过大**。
- **带说明的暂存（-m/--message）**：为暂存添加自定义描述，默认情况下会自动生成“WIP on <分支名>...”描述信息

```bash
# 基础暂存（仅跟踪文件）
git stash  # 等价于 git stash save

# 暂存已跟踪文件和未跟踪文件
git stash -u  # 或 git stash save -u

# 暂存所有文件（包括忽略文件，-a/--all）
git stash -a  # 或 git stash save -a

# 带说明的暂存
git stash -m "xxx"
```

## 查看暂存列表

```bash
git stash list [<log-options>]
```

列出所有暂存记录，显示暂存的标识、创建时的分支及说明信息。该命令采用适用于 _git log_ 命令的选项来控制显示的内容和方式。参见 [git-log](https://git-scm.com/docs/git-log/zh_HANS-CN)

```bash
$ git stash list

stash@{0}: On <分支名>: 描述信息
```

- `stash@{n}`：暂存的唯一标识（`n` 为序号，0 表示最新创建的暂存，数字越大越旧）。

## 查看指定暂存的详细信息

```bash
git stash show [-u | --include-untracked | --only-untracked] [<diff-options>] [暂存标识]
```

- **显示暂存中修改的文件列表及变更行数**: `git stash show [暂存标识]`，默认为最新暂存 stash@\{0\}
- **显示暂存的详细代码变更（-p, --patch）**: 显示暂存中每个文件的具体代码修改（类似 `git diff` 的输出），包括新增、删除的内容及位置。

```bash
# 显示暂存中修改的文件列表及变更行数
git stash show [暂存标识]  # 默认为最新暂存 stash@{0}

# 显示暂存的详细代码变更
git stash show -p [暂存标识]
```

## 使用暂存

暂存的使用有多重方式：

### 应用暂存: 恢复暂存的修改，但保留该暂存

```bash
git stash apply [--index] [-q | --quiet] [暂存标识]
```

* 将暂存栈中指定暂存的内容（工作区和暂存区的修改）恢复到当前工作区，恢复完成后，该暂存记录仍保留在暂存栈中（不会删除），可重复恢复。
* **精确还原暂存时工作区和暂存区的原始状态（--index）**：与 `git stash pop --index` 作用一致

### 弹出暂存: 恢复暂存的修改并同时删除该暂存记录

```bash
git stash pop [--index] [-q | --quiet] [暂存标识]
```

- `git stash pop` 用于**恢复暂存（stash）的修改并自动删除该暂存记录**的命令，相当于 `git stash apply`（恢复修改）和 `git stash drop`（删除暂存）的组合操作
- **精确还原暂存时工作区和暂存区的原始状态（--index）**: 默认情况下，`git stash pop` 会将暂存中的所有修改（包括原暂存区和工作区的内容）恢复到**工作区**（未 `git add` 状态），丢失原暂存区的跟踪信息。而 `--index` 参数的作用在恢复暂存修改时**同时恢复暂存区（index）的状态**，即精确还原暂存时工作区和暂存区的原始状态（哪些文件被 `git add` 暂存，哪些仅在工作区修改）
- **冲突处理**：若暂存的修改与当前工作区内容冲突（如同一文件的同一行被修改），`git stash pop` 会提示冲突，且**不会删除暂存记录**（需手动处理）。需要手动解决冲突，并在之后调用 `git stash drop`。

```bash
# 恢复最新暂存并删除它
git stash pop

# 恢复 stash@{1} 并删除它
git stash pop stash@{1}
```

### 从暂存（stash）创建新分支并自动恢复暂存修改

```bash
git stash branch <branchname> [暂存标识]
```

* 执行后会完成三个操作：
  * 创建新分支: 基于暂存创建时的原分支提交（即暂存的 “基准提交”）创建新分支；
  * 恢复暂存：在新分支中自动恢复暂存的所有修改（工作区 + 暂存区）
  * 删除暂存：恢复成功后，自动删除该暂存记录（类似 `git stash pop`）; 若恢复失败（如暂存本身有冲突），暂存会保留，需手动处理。

## 删除暂存

### 删除单个暂存

```bash
git stash drop [-q | --quiet] [暂存标识]
```

* 从暂存栈中移除指定的暂存记录(默认为第一个暂存)，不影响其他暂存。
* **不可逆操作**：删除后暂存内容无法通过常规命令恢复（除非通过 Git 底层对象库找回，操作复杂），需谨慎使用。

### 清空所有暂存

```bash
git stash clear
```

* 删除暂存栈中所有暂存记录（无论新旧）
* **彻底移除**：删除后，所有暂存的修改无法通过常规 Git 命令直接恢复，仅能通过底层技术从 Git 对象库中尝试找回（成功率低且复杂）。

## 选项

### 创建暂存

#### `-m <message>, --message=<message>`: 添加描述信息

- **作用**：为暂存添加自定义说明，方便后续识别（替代默认的 `WIP` 描述）。

#### `-u,--include-untracked, --no-include-untracked`: 是否包含未跟踪文件

- **作用**：
  - 默认下不包含**未跟踪文件**（新建未 `git add` 的文件）
  - `-u,--include-untracked`: 暂存时包含**未跟踪文件**（新建未 `git add` 的文件）
  - `--no-include-untracked`: 明确**不储藏未跟踪文件**，通常用于覆盖其他选项（如 `--all`）隐含的包含行为。

#### `-a,--all`: 包含所有文件

- **作用**：暂存时包含**所有文件**（已跟踪 + 未跟踪 + 忽略文件），慎用（可能包含冗余）。

#### `-k, --keep-index, --no-keep-index`: 是否不包含暂存区

- **作用**：
  - `-k,--keep-index`: 暂存不包含暂存区的文件。
  - `--no-keep-index`: 暂存包含暂存区的文件。

#### `-S,--staged `: 只暂存暂存区

- **作用**：
  - 专门存储已经 `git add` 的更改，而将未暂存的修改保留在工作目录中。
  - 类似于基本的`git commit`，只不过是将状态提交到暂存中而不是当前分支。

### 查看暂存

#### `-u,--include-untracked, --no-include-untracked`: 查看未跟踪文件详情

- **作用**：
  - 与 `show` 命令一起使用时，显示暂存条目中未被追踪的文件作为差异的一部分。

#### `--only-untracked`: 只查看未跟踪文件详情

- **作用**：
  - 只对`show`命令有效。
  - 只显示暂存条目中未被追踪的文件作为差异的一部分。

### 使用暂存

#### `--index`: 恢复时精确还原暂存区状态

- **作用**：
  - 只对`pop`和`apply`命令有效。
  - 精确还原暂存时工作区和暂存区的原始状态
  - 可能会在出现冲突时失败
