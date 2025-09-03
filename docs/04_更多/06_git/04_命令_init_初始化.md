# git init

## 作用

- 创建一个空的 Git 仓库
- 重新初始化一个已经存在的仓库

## 概述

```bash
git init [-q | --quiet] [--bare] [--template=<模板目录>]
	[--separate-git-dir <Git 目录>] [--object-format=<格式>]
	[--ref-format=<引用格式>]
	[-b <分支名> | --initial-branch=<分支名>]
	[--shared[=<许可>]] [<目录>]
```

## 描述

* 该命令创建一个空的 Git 仓库 - 本质上是一个 `.git` 目录，其中包含 `objects` 、`refs/heads` 、`refs/tags` 和模板文件的子目录。**同时将创建一个没有任何提交的初始分支（其名称参见下面的 --initial-branch 选项）**。
* 在现有仓库中运行 `git` `init` 是安全的。它不会覆盖已经存在的内容。重新运行 `git` `init` 的主要原因是选择新添加的模板（如果给定了 `--separate-git-dir` 参数，则将仓库移至另一个位置）。
* 如果设置了 `GIT_DIR` 环境变量，那么它将指定用于仓库基础的路径，而不是 `./.git` 
* 如果通过 `GIT_OBJECT_DIRECTORY` 环境变量指定了对象存储目录，那么将在该目录下创建 sha1 目录，否则将使用默认的 `$GIT_DIR/objects` 目录。
* **与 `git clone` 的区别**
  - `git init`：从零创建新仓库。
  - `git clone`：复制远程已有仓库到本地（会自动初始化并关联远程仓库）。

## 选项

### `--quiet, -q`: 静默模式

- **作用**：减少输出信息，仅打印错误和警告消息；所有其他输出将不会显示。

- **示例**：

  ```bash
  # 创建一个名为 myrepo.git 的裸仓库
  git init --bare myrepo.git
  ```

### `--bare`: 创建裸仓库

* **作用**：初始化一个 “裸仓库”（Bare Repository），仅包含版本控制核心数据（类似普通仓库的 `.git` 目录内容），**没有工作区**。裸仓库通常以 `.git` 结尾（如 `project.git`），便于识别。
* **用途**：作为远程共享仓库（如团队协作的中央仓库），供多人推送 / 拉取代码，避免直接在仓库中修改文件。

### `--initial-branch=<分支名>,-b <分支名> `: 指定初始分支名

* **作用**：设置仓库初始化时的默认分支名称（默认分支名在 Git 2.28+ 可通过 `init.defaultBranch` 全局配置，通常为 `main` 或 `master`）。

* **示例**

  ```bash
  # 初始化仓库，默认分支名为 trunk
  git init --initial-branch=trunk
  ```

