# git 基础

## 获取 git 仓库

通常有两种获取 Git 项目仓库的方式，两种方式都会**在你的本地机器上得到一个工作就绪的 Git 仓库**：

1.  将尚未进行版本控制的本地目录转换为 Git 仓库；
2. 从其它服务器 **克隆** 一个已存在的 Git 仓库。

### 在已存在目录中初始化仓库

1. 如果有一个尚未进行版本控制的项目目录，想要用 Git 来控制它，那么首先需要进入该项目目录中。
2. 执行 `git init` 命令。该命令将创建一个名为 .git 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。

### 克隆现有的仓库

克隆仓库的命令是 `git clone <url> `。**Git 克隆的是该 Git 仓库服务**

**器上的几乎所有数据，而不是仅仅复制完成你的工作所需要文件**。

```powershell
# 可以通过额外的参数指定新的目录名 - mylibgit
$ git clone https://github.com/libgit2/libgit2 mylibgit
```

## 记录更改

工作目录下的每一个文件都不外乎这两种状态：**已跟踪** 或 **未跟踪**：

* 已跟踪的文件是指那些被纳入了版本控制的文件，在上一次快照中有它们的记录，在工作一段时间后， 它们的状态可能是未修改，已修改或已放入暂存区。简而言之，**已跟踪的文件就是 Git 已经知道的文件**。
* 工作目录中除已跟踪文件外的其它所有文件都属于未跟踪文件，它们既不存在于上次快照的记录中，也没有被放入暂存区。

![image-20250721102518613](/img/342.png)

### 未跟踪 -> 已跟踪(同时添加到了暂存区)

使用命令 `git add` 开始跟踪一个文件，并处于暂存状态：

```shell
$ git add README

# 没有输出, 说明没有错误

$ git status
On branch master

No commits yet

# 待提交的更改
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md
```

### 已修改 -> 已暂存

使用命令 `git add` 将文件放到暂存区，这是一个多功能命令：**可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等**。

```shell
$ git add CONTRIBUTING.md # 添加至暂存区
$ git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   COMMIT.md
        new file:   README.md
```

### 已暂存 -> 本地仓库

使用命名 `git commit` 提交到本地仓库：

```shell
$ git commit # 会启用默认编辑器来编辑提交数据

# 或者直接输入提交信息
$ git commit -m 'learn01'
[master (root-commit) 89136d9] learn01
 2 files changed, 1 insertion(+)
 create mode 100644 COMMIT.md
 create mode 100644 README.md
```

**提交时记录的是放在暂存区域的快照**。 任何还未暂存文件的仍然保持已修改状态，可以在下次提交时纳入版本管理。

### 已跟踪并且已修改文件 -> 本地仓库

跳过暂存区域, 直接将已跟踪并且已修改的文件提交到本地仓库

只要在提交的时候，给 `git commit` 加上 `-a` 选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交从而跳过 git add 步骤：

```shell
git commit -a -m 'learn02'
[master 7a3f559] learn02
 1 file changed, 1 insertion(+), 1 deletion(-)
```

## 撤消操作

在任何一个阶段，都可以撤销某些操作。**注意，有些撤消操作是不可逆的**。**这是在使用 Git 的过程中，会因为操作失误而导致之前的工作丢失的少有的几个地方之一**。

### 撤消: 已暂存 -> 已修改

将已经使用 `git add` 添加到暂存区（Stage/Index）的文件移除暂存，使其回到工作区（Working Directory）但未暂存的状态：

1. **使用 git restore --staged（Git 2.23+ 推荐）**

   ```bash
   git restore --staged <file>  # 撤销指定文件的暂存
   # 或撤销所有暂存文件
   git restore --staged .
   ```

2. **使用 git reset HEAD（传统方法）**

   * **原理**：`git reset` 会移动 HEAD 或重置暂存区，但不改变工作区。`HEAD` 表示当前分支的最新提交。

   ```bash
   git reset HEAD <file>  # 撤销指定文件的暂存
   # 或撤销所有暂存文件
   git reset HEAD .
   ```

### 撤消: 已修改 -> 未修改(上一次提交的状态)

丢弃工作区（Working Directory）中尚未暂存的修改：

1. **使用 `git restore`（Git 2.23+ 推荐）**

   ```bash
   git restore <file>  # 撤消指定文件的修改，恢复到最近一次提交的状态
   
   git restore .       # 撤消所有文件的修改，恢复当前目录下所有文件
   ```

2. **使用传统命令 `git checkout`**

   ```bash
   git checkout -- <file>  # 撤消指定文件的修改, 效果同上，Git 2.23 之前的常用命令
   
   git checkout -- .     # 撤消所有文件的修改
   ```

   







