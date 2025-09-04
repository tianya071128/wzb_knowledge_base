# git clone

## 作用

克隆一个仓库到新目录

## 概述

```bash
git clone <远程仓库地址> <本地目录名> [--template=<template-directory>]
	  [-l] [-s] [--no-hardlinks] [-q] [-n] [--bare] [--mirror]
	  [-o <name>] [-b <name>] [-u <upload-pack>] [--reference <repository>]
	  [--dissociate] [--separate-git-dir <git-dir>]
	  [--depth <depth>] [--[no-]single-branch] [--[no-]tags]
	  [--recurse-submodules[=<pathspec>]] [--[no-]shallow-submodules]
	  [--[no-]remote-submodules] [--jobs <n>] [--sparse] [--[no-]reject-shallow]
	  [--filter=<filter-spec>] [--also-filter-submodules]] [--] <repository>
	  [<directory>]
```

## 描述

- 将仓库克隆到新创建的目录中，为克隆仓库中的每个分支创建远程跟踪分支（使用 `git` `branch` `--remotes` 可见），并创建、签出从克隆仓库当前活动的分支派生的初始分支。
- **自动关联远程仓库**：默认将远程仓库命名为 `origin`，方便后续 `git pull/push` 操作。

## GIT 地址

通常，地址包含有关传输协议，远程服务器的地址以及仓库路径的信息。对于某些传输协议，一些信息可能会缺失。

Git 支持 ssh，git，http 和 https 协议（此外，可以使用 ftp 和 ftps 进行抓取，但这效率低下且不建议使用；请勿使用）。

本地传输（即 `git://` 地址）不进行身份验证，在不安全的网络上应谨慎使用。

以下是上述几个传输协议的格式：

- ssh://[\<user>@]\<host>[:\<port>]/\<path-to-git-repo>

- git://<主机地址>[:<端口>]/<Git 仓库路径>

- http[s]\://<主机地址>[:<端口>]/<Git 仓库路径>

- ftp[s]\://<主机地址>[:<端口>]/<Git 仓库路径>

### HTTPS 协议地址

* **格式:**

  ```text
  https://<主机名>/<用户名>/<仓库名>.git
  # 示例（GitHub）
  https://github.com/username/repo.git
  # 示例（GitLab）
  https://gitlab.com/username/repo.git
  ```

* **特点**：

  - **通用性强**：几乎所有网络环境都支持（通过 443 端口，不易被防火墙拦截）。
  - **认证方式**：首次操作(提交相关操作, 克隆一般不需要)需输入用户名和密码（或个人访问令牌 PAT），可通过凭证助手保存。
  - **适用场景**：公开仓库克隆、没有 SSH 密钥配置的环境、临时访问远程仓库。

* **优势与不足**：

  * ✅ 无需配置密钥，即开即用。
  * ❌ 每次操作可能需要输入凭证（未配置凭证助手时）。

### SSH 协议地址

* **格式**:

  ```text
  git@<主机名>:<用户名>/<仓库名>.git
  # 示例（GitHub）
  git@github.com:username/repo.git
  # 示例（GitLab）
  git@gitlab.com:username/repo.git
  ```

* **特点**：

  - **基于 SSH 密钥认证**：需提前在本地生成 SSH 密钥，并将公钥添加到远程平台（如 GitHub 的「SSH and GPG keys」设置）。
  - **认证方式**：通过密钥对认证，无需输入密码（配置成功后）。
  - **适用场景**：频繁访问私有仓库、团队协作环境（一次配置，长期使用）。

* **优势与不足**：

  - ✅ 无需反复输入密码，安全性高（密钥权限可控）。
  - ❌ 需提前配置 SSH 密钥，部分网络环境可能屏蔽 SSH 端口（默认 22 端口）。

### SSH 协议的另一种格式（SSH URL）

部分平台支持标准 SSH URL 格式（较少见，与 `git@` 格式功能相同）：

```text
ssh://git@<主机名>/<用户名>/<仓库名>.git
# 示例
ssh://git@github.com/username/repo.git
```

### 本地文件协议地址

* **格式**:

  ```text
  # 绝对路径（Linux/macOS）
  /file/path/to/repo.git
  # 绝对路径（Windows）
  C:/path/to/repo.git
  # 相对路径（相对于当前目录）
  ../local-repo.git
  ```

*  **特点**：

  - **通过本地文件系统访问**：适用于同一台机器上的仓库克隆（如本地裸仓库作为远程仓库）。
  - **认证方式**：依赖文件系统权限（如 Linux 的 `chmod` 权限设置）。
  - **适用场景**：本地测试、单机多仓库同步、局域网内共享仓库（通过共享目录）

## 选项

### `<repository>`:地址

- **作用**：远程仓库地址（如 HTTPS/SSH 地址、本地路径），是 `git clone` 的核心参数。

- **示例**：

  ```bash
  git clone https://github.com/user/repo.git  # HTTPS 地址
  git clone git@github.com:user/repo.git      # SSH 地址
  ```

### `<directory>`: 目录名称

- **作用**：指定本地目录名称，**默认使用仓库名作为目录名**。

- **示例**：

  ```bash
  # 克隆到名为 my-project 的目录（而非默认 repo 目录）
  git clone https://github.com/user/repo.git my-project
  ```

### `--quiet, -q`: 静默模式

- **作用**：减少输出信息，仅打印错误和警告消息；所有其他输出将不会显示。

- **示例**：

  ```
  # 创建一个名为 myrepo.git 的裸仓库
  git init --bare myrepo.git
  ```

### `-b <分支名> / --branch <分支名>`: 指定检出分支

* **作用**: 指定克隆后默认检出的分支（默认检出远程仓库的默认分支，如 `main`）。

### `--single-branch`: 仅克隆指定分支

* **作用**: 仅克隆指定分支或主分支远程 `HEAD` 指定的分支历史（配合 `-b` 使用），减少下载量。

### `--depth <深度>`: 浅克隆

* **作用**: 浅克隆：只获取最近 `n` 次提交的历史，不下载完整历史（适合大型仓库，节省时间和空间）。**暗含 `--single-branch` 选项，除非给出 `--no-single-branch` 来获取所有分支顶端附近的历史记录**。如果要浅层克隆子模块，还可以使用 `--shallow-submodules` 选项。