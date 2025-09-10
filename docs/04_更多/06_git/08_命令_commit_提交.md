# git commit

## 作用

将暂存区的修改提交到本地仓库

## 概述

```text
git commit [-a | --interactive | --patch] [-s] [-v] [-u<mode>] [--amend]
	   [--dry-run] [(-c | -C | --squash) <commit> | --fixup [(amend|reword):]<commit>]
	   [-F <file> | -m <msg>] [--reset-author] [--allow-empty]
	   [--allow-empty-message] [--no-verify] [-e] [--author=<author>]
	   [--date=<date>] [--cleanup=<mode>] [--[no-]status]
	   [-i | -o] [--pathspec-from-file=<file> [--pathspec-file-nul]]
	   [(--trailer <token>[(=|:)<value>])…​] [-S[<keyid>]]
	   [--] [<pathspec>…​]

```

## 描述

* 创建一个新的提交，包含暂存区的当前内容和描述变化的给定日志信息。
* 新的提交是 HEAD 的直接子节点，通常是当前分支的顶端，分支会被更新以指向它（除非工作树上没有分支，在这种情况下 HEAD 会被 "分离"）。
* 如果做了一个提交，然后紧接着发现了一个错误，可以用 `git reset`来恢复它。

## 提交的内容

* 暂存区中的文件

  * 通过使用 [git-add](https://git-scm.com/docs/git-add/zh_HANS-CN)，在使用 `commit` 命令之前，将文件 "添加"到暂存区中
  * 通过使用 [git-rm](https://git-scm.com/docs/git-rm/zh_HANS-CN) ，在使用  `commit`  命令之前，从工作树删除文件并添加到暂存区；

* 通过将文件列为 `commit`命令的参数(不带 `—interactive` 或 `—patch switch`)，在这种情况下，提交将忽略索引中的更改，而是记录所列文件的当前内容(**必须是已跟踪文件**)

  ```bash
  # 提交 src 目录下所有 .js 文件
  git commit src/*.js -m "refactor: 优化 src 目录下的 JS 代码"
  ```

* 通过在`commit` 命令中使用 `-a` 开关，自动 "添加 "所有已知文件的修改（**即所有已跟踪文件**），并自动 "清除 "索引中已经从工作树中删除的文件，然后执行实际的提交

  ```bash
  git commit -a -m "refactor: 优化用户信息模块代码"
  ```

* 交互式模式: 通过在 `commit` 命令中使用 `--interactive `或 `--patch `开关，在最终完成操作之前，逐一决定哪些文件或块应该成为提交的一部分，而不是暂存区中的内容。

## 提交对象

### 作者信息（姓名 + 邮箱）

提交中的作者信息（`Author: Name `）用于标识谁编写了该代码，其来源按优先级从高到低为：

* **环境变量**（临时覆盖或系统配置）: 通过 `GIT_AUTHOR_NAME` 和 `GIT_AUTHOR_EMAIL` 环境变量配置
* **仓库级配置**（当前项目）: 通过 `git config user.name` 和 `git config user.email` 配置，仅对当前仓库有效
* **全局配置**（当前用户）: 通过 `git config --global user.name` 和 `git config --global user.email` 配置，对当前用户的所有仓库有效
* **系统级配置**(不推荐使用): 通过 `git config --system` 配置，对系统所有用户生效（需管理员权限），通常不推荐修改

### 提交者信息

提交记录中还包含 `Committer` 信息（默认与 `Author` 一致），**表示谁执行了提交操作**。

其来源与作者信息类似，但对应环境变量为 `GIT_COMMITTER_NAME` 和 `GIT_COMMITTER_EMAIL`。

- 通常情况下，`Author` 和 `Committer` 相同。
- 特殊场景（如代提交）会不同（例如代码作者是 Alice，由 Bob 代为提交到仓库）。

### 提交说明

1. 通过 `-m` 参数直接指定（`git commit -m "描述"`）
2. 不使用 `-m` 时在自动打开的编辑器中输入

## 选项

### `<路径规范>…`: 路径

- **作用**：直接提交符合路径规范的文件。**注意必须是已跟踪文件**

### `-m <提交说明>, --message=<提交说明>`: 直接指定提交说明

- **作用**: 直接在命令行中指定提交描述信息，无需打开编辑器。如果给定了多个`-m`选项，它们的值会作为单独的段落串联起来。

### `-a, --all`: 自动暂存并提交已跟踪文件

- **作用**: 跳过 `git add` 步骤，自动将**所有已跟踪文件的修改和删除**暂存并提交（不包括未跟踪的新文件）
- **等价操作**：`git add -u`（暂存已跟踪文件的修改 / 删除） + `git commit`。

```bash
git commit -a -m "refactor: 优化订单处理逻辑"
```

### `-p, --patch`：交互模式选择提交内容

* **作用**: 使用交互式补丁选择界面来选择要提交的修改。[详情见](https://git-scm.com/docs/git-add/zh_HANS-CN#_%e4%ba%a4%e4%ba%92%e6%a8%a1%e5%bc%8f)。

### `--amend`: 替换最近一次提交

* **作用**: 

  * 通过创建一个新的提交来替换当前分支的顶端
  * 将当前暂存区或者通过 `-a` 等方式将修改 **合并到最近一次提交**中
  * **会生成新的提交哈希值**

* **与其他参数一起使用**

  ```bash
  # 打开默认编辑器, 显示最近一次提交的说明
  git commit --amend
  
  # 直接指定新的提交说明（-m）
  git commit --amend -m "新的提交说明"
  
  # 自动暂存并提交已跟踪文件到最近一次提交
  git commit -a --amend -m "新的提交说明"
  
  # 合并暂存区的修改到最近一次提交，但不修改原提交说明（无需编辑说明）
  git add 补充的文件.txt
  git commit --amend --no-edit
  
  # 修改作者信息（--author）
  git commit --amend --author="新作者 <new@example.com>"
  ```

* **历史修改的风险**：

  * `--amend` 会**替换最近一次提交**（生成新的哈希值），若该提交已推送到远程仓库，会导致本地与远程历史不一致。
  * 解决方案：若必须推送，需强制推送 `git push -f`，但**强烈建议仅在个人分支或未被他人使用的分支上执行**

### `--allow-empty`：创建空提交

* **作用**: 允许提交不包含任何文件修改的记录（仅含作者、时间和说明）。
* **用途**：标记版本节点、触发 CI/CD 流程、测试提交钩子等。

### `-C <提交>, --reuse-message=<提交>`: 复用提交说明

- **作用**: 
  - 用于复用指定历史提交的说明信息，避免重复输入相同或相似的提交描述
  - **注意**:  并不是修改历史提交信息, 而是拿到历史的提交信息用于当次提交

### `-c <提交>, --reedit-message=<提交>`: 复用提交说明

- **作用**: 和 `-C <提交>, --reuse-message=<提交>`一样，但用 `-c` 会调用编辑器，这样用户可以进一步编辑提交信息。

