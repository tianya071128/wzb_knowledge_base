# git restore

## 作用

`git restore` 是 **Git 2.23+** 引入的新命令，用于恢复文件的状态（从暂存区或仓库中恢复），与 `git checkout` 相比，功能更专一且语义更清晰。

主要用于撤销工作区或暂存区的修改

## 概述

```text
git restore [<options>] [--source=<tree>] [--staged] [--worktree] [--] <pathspec>…​
git restore [<options>] [--source=<tree>] [--staged] [--worktree] --pathspec-from-file=<file> [--pathspec-file-nul]
git restore (-p|--patch) [<options>] [--source=<tree>] [--staged] [--worktree] [--] [<pathspec>…​]
```

## 描述

* 恢复工作区文件到指定状态（如暂存区状态或某次提交的状态）。
* 从暂存区移除修改（取消 `git add` 的效果）。
* **不可逆操作**：`git restore` 会直接覆盖工作区或暂存区的修改，未提交的修改可能永久丢失，执行前建议用 `git status` 确认。
* **未跟踪文件**：`git restore` 无法恢复未跟踪的新文件（需手动删除，如 `rm `）。

## 常用场景

### 撤销工作区的修改

当对文件进行修改但未暂存（`git add`），想丢弃工作区的修改：

```bash
# 恢复单个文件
git restore src/index.js

# 恢复多个文件
git restore src/index.js css/style.css

# 恢复目录下所有文件
git restore src/
```

- **效果**：工作区文件会恢复到与**暂存区一致的状态**（若暂存区无该文件，则恢复到最近一次提交的状态）。

### 撤销暂存区的修改（从暂存区移除）

若已执行 `git add` 将修改加入暂存区，想撤销暂存（保留工作区修改）：

```bash
# 取消单个文件的暂存
git restore --staged src/index.js

# 取消多个文件的暂存
git restore --staged *.js
```

- **等价于**：旧版本的 `git reset HEAD <文件>`。
- **效果**：暂存区的修改被移除，文件状态回到 “已修改未暂存”（**工作区修改保留**）。

### 同时撤销工作区和暂存区

将文件同时恢复到 HEAD 状态（覆盖工作区和暂存区现有内容）：

```bash
git restore --staged --worktree src/app.js
```

- `--staged --worktree`：同时操作暂存区和工作区（可简写为 `-SW`）。

### 撤销到指定提交

将文件恢复到历史某次提交的状态（丢弃工作区和暂存区的现有修改）:

```bash
# 从最近一次提交（HEAD）恢复
git restore --source=HEAD src/config.js

# 从指定提交（如 a1b2c3d）恢复
git restore --source=a1b2c3d src/config.js

# 从上个提交（HEAD~1）恢复
git restore --source=HEAD~1 docs/README.md
```

* **`--source`**：指定恢复的源头（提交哈希、分支名、`HEAD~n` 等）。

## 与其他命令的区别

| 命令                    | 功能               | 区别                                         |
| ----------------------- | ------------------ | -------------------------------------------- |
| `git restore `          | 恢复工作区文件     | 仅操作工作区，不涉及分支                     |
| `git restore --staged ` | 取消暂存           | 替代 `git reset HEAD `                       |
| `git checkout `         | 恢复文件（旧语法） | 同时承担分支切换功能，语义模糊               |
| `git reset --hard`      | 重置分支和工作区   | 影响整个分支，`git restore` 更精确（仅文件） |

## 选项

### `<路径规范>…`: 要恢复的文件路径

- **作用**：符合路径规范的文件。**注意必须是已跟踪文件**

### `-W, --worktree 和 -S, --staged`: 指定恢复的位置

* **作用**：指定**恢复的位置**。
* **效果**: 丢弃指定位置的修改，文件内容回到指定状态。
  * 如果两个选项都没有指定，默认情况下会还原**工作区**。
  * 指定`--staged`将只恢复**暂存区**。
  * 指定两个选项将同时还原。

### `-s <commit>, --source=<commit>`: 指定提交恢复

* **作用**: 从指定的提交、分支或引用中恢复文件。`\<commit>` 可以是：
  - 提交哈希（如 `a1b2c3d`）
  - 分支名（如 `dev`，表示该分支的最新提交）
  - 相对引用（如 `HEAD~2`，表示上上个提交）