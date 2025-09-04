# git status

## 作用

用于查看工作区、暂存区与本地仓库之间的文件状态差异，帮助开发者了解当前项目的修改情况。

## 概述

```text
git status [<选项>…​] [--] [<路径规范>…​]
```

## 描述

* 显示暂存区和当前HEAD提交有差异的路径，工作区和暂存区有差异的路径，以及工作区中不被Git追踪的路径（也不被[gitignore[5\]](https://git-scm.com/docs/gitignore/zh_HANS-CN)忽略）。
* `git status` 只显示**工作区与暂存区**、**暂存区与本地仓库**的差异，不显示本地仓库与远程仓库的差异

## 输出内容

`git status` 的输出通常包含以下几个部分：

```bash
$ git status

On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   docs/.vitepress/config/rewrites.mts

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   docs/.vitepress/config/sidebar.mts
        modified:   "docs/test.md"

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        "docs/demo.md"
```

### 当前所在分支

```text
On branch master
Your branch is up to date with 'origin/master'.
```

* 显示当前检出的分支（如 `master`）。
* 提示本地分支与远程对应分支的同步状态（如 “已同步”“超前 N 次提交”“落后 M 次提交”）。

### 暂存区状态（待提交的修改）

```text
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   docs/.vitepress/config/rewrites.mts
```

* 显示已通过 `git add` 加入暂存区的文件，这些文件将在 `git commit` 时被提交。
* 操作提示：可通过 `git restore --staged ` 将文件从暂存区移除（取消暂存）。

### 工作区状态（未暂存的修改）

```text
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   docs/.vitepress/config/sidebar.mts
        modified:   "docs/test.md"
```

- 显示**已修改但未加入暂存区**的文件（需执行 `git add` 暂存）。
- 操作提示：
  - `git add `：将修改加入暂存区。
  - `git restore `：丢弃工作区的修改（恢复到暂存区或仓库的状态）。

### 未跟踪的文件

```text
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        "docs/demo.md"
```

- 显示从未被 `git add` 过的新文件（Git 完全不跟踪这些文件）。
- 操作提示：`git add ` 可将其加入暂存区（开始跟踪）。

### 干净状态（无修改）

```text
On branch release/2.0.0-20250821
Your branch is up to date with 'origin/release/2.0.0-20250821'.

nothing to commit, working tree clean
```

* 表示工作区和暂存区完全一致，且与本地仓库最新提交同步，没有需要提交的修改。

## 简短输出内容

在简短的格式中，每个路径的状态显示为以下形式之一:

```text
XY PATH
XY ORIG_PATH -> PATH
```

* `XY`是一个双字母的状态代码
  * X: 左侧符号，表示文件在暂存区与本地仓库的差异（是否已暂存）。
  * Y: 右侧符号，表示文件在工作区与暂存区的差异（是否有未暂存的修改）。
  * 若文件状态无需两个符号描述，未使用的位置会以空格填充。
* `ORIG_PATH`是重命名/复制的内容的来源，只有在条目被重命名或复制时才会显示
* `PATH`是文件路径

### 符合含义

```text
?? .env               # 未跟踪文件
A  docs/install.md    # 新文件已暂存
 M src/config.js      # 已修改未暂存
M  src/app.js         # 已修改且暂存
MM README.md          # 暂存后又有新修改
D  tests/old.test.js  # 已删除且暂存
 R images/logo.png -> images/new-logo.png  # 已重命名且暂存
```

* *M* = 修改过的
* *A*=添加
* *D* = 删除
* *R* = 重命名
* *T* = 文件类型已更改（常规文件、符号链接或子模块）
* *C* = 已复制（如果配置选项 `status.renames` 设置为 “副本”）
* *U*=更新但未合并
* *??*=未跟踪文件

## 选项

### `--short, -s`: 简短输出

- **作用**：以简短格式显示状态，适合快速浏览。

- **示例**：

  ```bash
  $ git status -s
  
  M  docs/.vitepress/config/rewrites.mts
   M docs/.vitepress/config/sidebar.mts
   M "docs/test.md"
  ?? "docs/demo.md"
  ```

### `--branch, -b`: 显示分支信息

- **作用**：在精简输出（`-s`）中额外显示当前分支及与远程分支的同步状态（默认精简输出不显示分支信息）。

  


  





