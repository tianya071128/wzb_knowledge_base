# git branch

## 作用

是 Git 中用于**查看帮助文档**的核心命令，可快速获取 Git 命令的详细说明、参数用法和示例

## 概述

```bash
git help [-a|--all] [--[no-]verbose] [--[no-]external-commands] [--[no-]aliases]
git help [[-i|--info] [-m|--man] [-w|--web]] [<命令>|<文档>]
git help [-g|--guides]
git help [-c|--config]
git help [--user-interfaces]
git help [--developer-interfaces]
```

## 描述

- 如果没有参数，也没有给出 _<命令>_ 或 _<文档>_，_git_ 命令的概要和最常用的 Git 命令的列表会被打印在标准输出上。
- `git` `--help` ... 与 `git` `help` ... 相同，因为前者在内部被转换为后者。
- 如果给出了一个命令或其他文件，相关的手册页就会被调出来。默认情况下使用 _man_ 程序来实现这一目的，但这可以被其他选项或配置变量所覆盖。

## 主要用法

### 查看指定命令的帮助文档（最常用）

```bash
# 查看 git config 命令的帮助
git help config
```

### 查看 Git 命令列表

```bash
# 列出所有 Git 命令（按类别分组）
git help --all
```

## 选项

### `--local,--global,...`: 配置的范围

- **作用**：指定命令的范围, [详情参考](#配置层级-优先级)

### `--show-origin`: 显示配置项来源文件路径

- **作用**: 用于在查看 Git 配置时**显示每个配置项的来源文件路径**，帮助定位配置的具体出处

- **示例**:

  ```bash
  $ git config list --show-origin

  file:C:/Program Files/Git/etc/gitconfig diff.astextplain.textconv=astextplain
  file:C:/Program Files/Git/etc/gitconfig filter.lfs.clean=git-lfs clean -- %f
  file:C:/Program Files/Git/etc/gitconfig filter.lfs.smudge=git-lfs smudge -- %f
  file:C:/Program Files/Git/etc/gitconfig filter.lfs.process=git-lfs filter-process
  ```

### `--show-scope`: 显示配置项所属的作用域

- **作用**: 类似于 `--show-origin` 选项，用于在查看配置时**显示每个配置项所属的作用域**（局部、全局或系统），帮助快速识别配置的生效范围

- **示例**:

  ```bash
  $ git config list --show-scope

  system  diff.astextplain.textconv=astextplain
  local   core.filemode=false
  ```
