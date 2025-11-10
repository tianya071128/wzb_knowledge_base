# git pull

## 作用

用于**从远程仓库拉取最新代码并自动合并到当前本地工作分支**的命令，本质是 `git fetch`（拉取远程更新） + `git merge`（合并到本地分支）的组合操作。

- **拉取远程更新**：首先执行 `git fetch`，获取远程仓库的最新分支、提交等信息，更新本地远程跟踪分支（如 `origin/main`）。
- **自动合并到本地分支**：紧接着执行 `git merge`，将远程跟踪分支（如 `origin/main`）的更新合并到当前本地工作分支（如 `main`）。

## 概述

```bash
git pull [<选项>] [<仓库> [<引用规范>…]]
```

* 如果任何远程修改与本地未提交的修改重叠，合并将被自动取消，工作目录树不会被改动。 一般来说，最好是在拉取之前把任何本地的修改弄到工作状态，或者用 [git-stash](https://git-scm.com/docs/git-stash/zh_HANS-CN)把它们贮藏起来。

## 基础原理

`git pull` 不是一个独立的 “原生” 命令，而是 **`git fetch` + `git merge` 的组合封装**。

若使用 `--rebase` 参数，则等价于 `git fetch + git rebase`：

## 快速合并和三方合并

与 `git merge` 合并相同：

* 如果当前分支落后于远程分支，那么默认情况下，它将快速合并当前分支以匹配远程分支。

* [三方合并](.//branch.html#三方合并-three-way-merge)：Git 找到两个分支的 “最近共同祖先”，**创建一个新的 “合并提交”（有两个父节点）**

  ```tex
  	  A---B---C origin/master
  	 /         \
      D---E---F---G---H master
  ```

## 核心配置：默认行为的决定因素

当执行 `git pull` 未指定远程或分支时（如 `git pull`），Git 会通过以下配置确定默认行为：

1. **`branch.<当前分支>.remote`**：指定默认远程（通常是 `origin`）。
2. **`branch.<当前分支>.merge`**：指定默认合并的远程分支（通常是 `refs/heads/main`，即远程 `main` 分支）。

## 选项

### 与获取有关的选项

[继承了 `git fetch` 命令的参数](./git-fetch.html#选项)

### 与合并有关的选项

[继承了 `git merge` 命令的参数](./git-merge.html#选项)

#### `-r, --rebase[=(false|true|merges|interactive)]`：变基模式

* `-r, --rebase=true`: 使用变基进行分支合并
* `--rebase=false`: 不使用变基合并
* `--rebase=merges`: 使用 `git` `rebase` `--rebase-merges` 进行重建，这样本地的合并提交就会包含在重建中（详见 [git-rebase[1\]](https://git-scm.com/docs/git-rebase/zh_HANS-CN)）。
* `--rebase=interactive`: 启用变基的交互模式