# git remote

## 作用

**管理远程仓库**，用于查看、添加、修改、删除本地仓库与远程仓库（如 GitHub、GitLab 等）的关联关系。

## 概述

```bash
# 查看远程仓库
git remote [-v | --verbose]

# 查看远程仓库的详细信息
git remote [-v | --verbose] show [-n] <名称>…

# 添加远程仓库
git remote add [-t <分支>] [-m <master>] [-f] [--[no-]tags] [--mirror=(fetch|push)] <远程标识> <远程仓库URL>

# 重命名远程仓库标识名称
git remote rename [--[no-]progress] <旧名> <新名>

# 删除本地仓库与指定远程仓库关联
git remote remove <名称>

# 管理远程仓库默认分支（HEAD 指向的分支）
git remote set-head <名称> (-a | --auto | -d | --delete | <分支>)

# 配置本地仓库跟踪的远程分支列表
git remote set-branches [--add] <名称> <分支>…

# 获取远程仓库连接地址
git remote get-url [--push] [--all] <名称>

# 管理远程仓库连接地址
git remote set-url [--push] <名称> <新地址> [<旧地址>]
git remote set-url --add [--push] <名称> <新地址>
git remote set-url --delete [--push] <名称> <地址>

# 清理本地仓库中那些在远程仓库已经不存在了的远程跟踪分支
git remote prune [-n | --dry-run] <名称>…

# 批量同步多个远程仓库（或指定远程 / 组）的最新分支和提交信息
git remote [-v | --verbose] update [-p | --prune] [(<组> | <远程仓库>)…]
```

## 添加远程仓库

```bash
git remote add [-t <分支>] [-m <master>] [-f] [--[no-]tags] [--mirror=(fetch|push)] <远程标识> <远程仓库URL>
```

- 建立本地仓库与远程仓库的连接，支持添加多个远程仓库（如同时关联个人仓库和官方上游仓库），满足多源协作需求。
- `-t <分支>`:  仅跟踪远程仓库的**指定分支**（默认跟踪所有分支）。后续 `git fetch origin` 只会拉取跟踪分支的更新
- `-m <分支>（--master <分支>）`: 指定远程仓库的 “默认主分支”（替代默认的 `master` 或 `main`），用于 `git remote show <名称>` 等命令显示默认分支信息。
- `-f`: 添加远程仓库后，立即执行一次 `git fetch <名称>`，拉取该远程仓库的所有跟踪分支信息
- `--tags / --no-tags`:
  - **`--tags`**：添加远程仓库时，自动跟踪该远程的所有标签（`tags`），后续 `git fetch` 会拉取所有标签。
  - **`--no-tags`**：添加远程仓库时，不跟踪任何标签（即使远程有标签，`git fetch` 也不会拉取）。
  - **默认行为**：不自动跟踪所有标签（仅拉取与跟踪分支相关的标签）。

```bash
# SSH 格式
git remote add origin git@github.com:yourname/my-project.git

# 添加远程仓库 "origin"，但仅跟踪其 "dev" 分支
git remote add -t dev origin git@github.com:yourname/myrepo.git
```

## 查看远程仓库

```bash
git remote [-v | --verbose]
```

* **`git remote`**：列出本地仓库中所有已配置的**远程仓库标识名称**（如 `origin`、`upstream`）
* **`git remote -v`**：在列出远程标识的同时，显示每个标识对应的**拉取（fetch）URL** 和**推送（push）URL**，明确本地与远程仓库的实际连接地址。

### 查看远程仓库的详细信息

```bash
git remote [-v | --verbose] show [-n] <名称>…
```

* 用于**查看指定远程仓库详细信息**
* `-n`: 不实时查询远程仓库的最新状态，显示本地缓存的信息，速度更快
* `-v`: **增加输出的详细程度**，显示更多关于远程仓库的底层信息，尤其是与引用（refs）相关的细节（如分支、标签的具体哈希值等）。

## 删除远程仓库关联

```bash
git remote remove <名称>
```

* 用于**删除本地仓库与指定远程仓库关联**，该远程的所有远程跟踪分支和配置设置都被删除。仅移除本地对远程仓库的配置记录，不会影响远程仓库本身

## 重命名远程仓库标识

```bash
git remote rename [--[no-]progress] <旧名> <新名>
```

* **重命名远程标识**：将本地仓库中已配置的远程仓库标识（`<旧名>`）改为新名称（`<新名>`）。
* **自动更新跟踪关系**：重命名会自动更新所有本地分支与该远程的跟踪配置（存储在 `.git/config` 中），无需手动修改 `git branch --set-upstream-to`。

## 获取远程仓库连接地址

```bash
git remote get-url [--push] [--all] <名称>
```

* **查询指定远程仓库关联的 URL 地址**的命令，相比 `git remote -v` 更专注于提取 URL 信息，支持精确获取拉取地址、推送地址或所有关联地址，适合脚本自动化或快速提取 URL 的场景。
* `--push`：可选，仅返回该远程的**推送地址**（默认返回拉取地址）。
* `--all`：可选，返回该远程的**所有关联 URL**（包括拉取地址和所有推送地址，每行一个）。

## 管理远程仓库连接地址

```bash
git remote set-url [--push] <名称> <新地址> [<旧地址>]
git remote set-url --add [--push] <名称> <新地址>
git remote set-url --delete [--push] <名称> <地址>
```

* 用于**管理远程仓库的 URL 配置**，包括修改、添加、删除远程仓库的拉取（fetch）或推送（push）地址
* `--push`：仅管理**推送（push）地址**，拉取（fetch）地址不变；不指定则同时修改拉取和推送地址。
* `git remote set-url [--push] <名称> <新地址> [<旧地址>]`

  * 默认修改远程仓库的默认拉取（fetch）或推送（push）地址，**直接覆盖原地址**。
  * `<旧地址>`（可选）：当远程有多个地址时，指定旧地址精确匹配要替换的 URL（避免误改）。
* `git remote set-url --add [--push] <名称> <新地址>`

  * 为远程仓库**添加额外的拉取或推送地址**（而非覆盖），使一个远程标识可关联多个 URL（如推送代码到多个仓库）。
* `git remote set-url --delete [--push] <名称> <地址>`
  * 从远程仓库的关联地址中**删除指定的拉取或推送地址**，适用于清理无效或冗余的 URL。
* **多地址的优先级**：
  - 拉取时，若有多个拉取地址，Git 会从所有地址拉取并合并信息（罕见场景，易冲突）。
  - 推送时，若有多个推送地址，Git 会依次推送到所有地址，任一失败则整体失败。

## 配置本地仓库跟踪的远程分支列表

```bash
git remote set-branches [--add] <名称> <分支>…
```

* **设置远程跟踪分支列表**：为指定远程仓库（`<名称>`）设置需要跟踪的分支（`<分支>…`），后续 `git fetch` 该远程时，仅拉取这些分支的信息。

* `--add`：可选，用于 “追加” 分支到跟踪列表，而非覆盖原有配置。

* 配置后, 每个远程仓库的跟踪分支配置存储在 `.git/config` 文件中，格式如下：

  ```ini
  [remote "origin"]
      url = git@github.com:yourname/repo.git
      fetch = +refs/heads/main:refs/remotes/origin/main  # 仅跟踪 main 分支
      fetch = +refs/heads/dev:refs/remotes/origin/dev    # 同时跟踪 dev 分支
      
  # 默认情况下, 跟踪规则为 fetch = +refs/heads/*:refs/remotes/origin/*（跟踪所有远程分支）
  ```

* **恢复跟踪所有分支**: 

  * 手动编辑 `.git/config`，将 `origin` 的 `fetch` 规则修改为：`fetch = +refs/heads/*:refs/remotes/origin/*`
  * 通过命令替换: `git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"`

## 清理本地仓库中那些在远程仓库已经不存在了的远程跟踪分支

```bash
git remote prune [-n | --dry-run] <名称>…
```

* **删除无效远程跟踪分支**：清理本地缓存中 “远程仓库已删除，但本地仍保留” 的远程跟踪分支（格式为 `<远程标识>/<分支名>`，如 `origin/old-feature`）。
* `-n` / `--dry-run`：可选，“试运行” 模式，仅输出会被删除的无效分支列表，不实际删除。
* **与 git fetch --prune 的区别**：两者最终清理效果一致，但 `git fetch --prune` 额外包含拉取最新代码的步骤

## 批量同步多个远程仓库

```bash
git remote [-v | --verbose] update [-p | --prune] [(<组> | <远程仓库>)…]
```

* **批量拉取远程信息**：同步指定远程仓库（或所有远程仓库、远程组）的最新分支、标签及提交记录，更新本地缓存的远程分支引用（如 `origin/main`、`upstream/dev`）。
* 不指定远程仓库时，默认对所有远程更新。
* `-p`（`--prune`）: **清理无效分支**，在同步的同时自动删除本地缓存中 “远程已删除但本地仍存在” 的远程分支引用（如远程删除 `feature/old` 后，本地 `origin/feature/old` 会被清理）
* `-v`（`--verbose`）：**详细日志输出**。
* **与 git fetch 的对比**：
  * `git remote update` 本质是对**指定范围的远程仓库**批量执行 `git fetch` 操作
  * `git remote update` 是拉取多个（或所有）远程的最新信息

## 选项

各选项参数参考上述各功能详细信息