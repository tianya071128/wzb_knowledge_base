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


## 远程仓库

远程仓库是指托管在因特网或其他网络中的你的项目的版本库。**有些仓库只读，有些则可以读写**。

**“远程”未必表示仓库在网络或互联网上的其它位置，而只是表示它在别处**。

### 添加远程仓库

1. 使用 `git clone` 命令时, 会自行添加远程仓库，默认名称为 `origin`
2. `git remote add <仓库名称> <仓库地址>`

### 查看远程仓库

使用 `git remote` 命令，指定选项 -v，会显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL

```bash
$ git remote
origin
```

### 从远程仓库中抓取与拉取

从远程仓库中获得数据，可以执行：

```bash
$ git fetch <remote>
```

`git fetch` 用于从远程仓库（如 GitHub、GitLab）下载最新的提交、分支和标签，但**不会自动合并到本地分支**。它只是将远程仓库的更新拉取到本地的 `origin/*` 分支（远程分支的副本），让你可以查看和选择如何集成这些更新。

### 推送到远程仓库

将本地仓库的提交推送到远程仓库，可以执行：

```bash
$ git push origin master
```

当和其他人在同一时间克隆，他们先推送到上游然后你再推送到上游，你的推送就会毫无疑问地被拒绝。 **你必须先抓取他们的工作并将其合并进你的工作后才能推送**。

### 查看某个远程仓库

如果想要查看某一个远程仓库的更多信息，可以使用 `git remote show <remote>` 命令

### 远程仓库的重命名与移除

1. 使用 `git remote rename` 来修改一个远程仓库的简写名，这同样也会修改你所有远程跟踪的分支名字。 那些过去引用 `pb/master` 的现在会引用 `paul/master`。

   ```bash
   $ git remote rename pb paul
   ```

2. 使用 `git remote remove` 或 `git remote rm`，所有和这个远程仓库相关的远程跟踪分支以及配置信息也会一起被删除

   ```bash
   $ git remote remove paul
   ```


## 标签(标记、tag)

Git 可以给仓库历史中的某一个提交打上标签，以示重要。

标记类似于分支，但**不会随新提交移动**，而是永久指向某个历史提交。

### 创建标签

Git 支持两种标签：轻量标签（lightweight）与附注标签（annotated）。

#### 轻量标签（lightweight）

轻量标记只是一个指向提交的名称，不包含额外信息

使用 `git tag` 命令:

```bash
git tag <tagName>          # 在当前提交创建轻量标签
```

#### 附注标签（annotated）

附注标签是存储在 Git 数据库中的一个完整对象， 它们是可以被校验的，其中包含打标签者的名字、电子邮件 地址、日期时间， 此外还有一个标签信息，并且可以使用 GNU Privacy Guard （GPG）签名并验证

推荐使用附注标记，包含标签作者、日期、注释等信息：

```bash
git tag -a <tagName> -m "发布版本 1.0"          # 当前提交
```

#### 指定提交创建标签

要在那个提交上打标签，你需要在命令的末尾指定提交的校验和（或部分校验和）：

```bash
$ git tag -a <tagName> 9fceb02
```

### 列出全部标签

```bash
git tag               # 简单列表
git tag -l "v1.*"     # 按模式筛选（如 v1. 开头的标签）
```

### 查看标签详情

```bash
git show v1.0         # 显示标签和对应提交的详细信息
```

### 推送标记到远程仓库

默认情况下，git push 命令并不会传送标签到远程仓库服务器上。 **在创建完标签后必须显式地推送标签到共享服务器上**。 这个过程就像共享远程分支一样

```bash
git push origin v1.0          # 推送单个标签
git push origin --tags        # 推送所有未推送的标签
```

使用 `git push <remote> --tags` 推送标签并不会区分轻量标签和附注标签， **没有简单的选项能够让你只选择推送一种标签**。

### 删除标签

1. 删除本地标签

   ```bash
   git tag -d <tagname>
   ```

2. 删除远程标签

   * 使用 `git push <remote> :refs/tags/<tagname>` 变体删除，上面这种操作的含义是，**将冒号前面的空值推送到远程标签名，从而高效地删除它**。

   * 更直观的删除远程标签的方式是：

     ```bash
     $ git push origin --delete <tagname>
     ```

### 检出标签

如果你想查看某个标签所指向的文件版本，可以使用 `git checkout` 命令， 虽然这会使你的仓库处于“分离头指针（detached HEAD）”的状态——这个状态有些不好的副作用：**在“分离头指针”状态下，如果你做了某些更改然后提交它们，标签不会发生变化， 但你的新提交将不属于任何分支，并且将无法访问，除非通过确切的提交哈希才能访问**。

```bash
git checkout v1.0             # 切换到标签（处于"分离HEAD"状态）
git checkout -b version1 v1.0 # 基于标签创建新分支
```

