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

  