# gitignore

Git 项目中核心的忽略配置文件，用于告诉 Git **哪些文件 / 目录不需要被追踪（提交）**，避免把临时文件、编译产物、敏感信息等提交到仓库，保持代码库的整洁

## 核心作用

1. **排除无需版本控制的文件**：如 IDE 配置文件（`.vscode/`、`.idea/`）、编译产物（`dist/`、`build/`）、依赖包（`node_modules/`）、日志文件（`*.log`）等；
2. **避免敏感信息泄露**：如配置文件中的密码、密钥（`.env`）、本地测试数据等；
3. **减少仓库体积**：排除大文件（如压缩包、数据库文件），加快克隆 / 拉取速度。

## 文件来源

| <div style="width: 70px">优先级</div> | <div style="width: 150px">规则来源</div> | <div style="width: 150px">作用范围</div> | <div style="width: 150px">生效方式</div>           | <div style="width: 150px">核心特点</div>            |
| ------------------------------------- | ---------------------------------------- | ---------------------------------------- | -------------------------------------------------- | --------------------------------------------------- |
| 1（最高）                             | 命令行参数 `--exclude`                   | 仅当前命令                               | 执行 `git add/ls-files` 时手动指定                 | 临时覆盖所有规则，仅单次生效                        |
| 2                                     | 项目内 `.git/info/exclude` 文件          | 仅当前项目（本地私有）                   | 手动编辑该文件，无需提交                           | 不共享给团队，仅自己生效                            |
| 3                                     | 项目内 `.gitignore` 文件（含子目录）     | 项目 / 子目录                            | 项目根目录 / 子目录下的 `.gitignore`，可提交共享   | 团队共享，子目录 `.gitignore` > 根目录 `.gitignore` |
| 4                                     | 全局忽略文件（`core.excludesFile` 配置） | 所有 Git 项目                            | `git config --global core.excludesfile <文件路径>` | 个人所有项目生效，优先级最低                        |

## 语法

语法[详见](https://git-scm.com/docs/gitignore/zh_HANS-CN)

## 注意事项

### 已追踪的文件无法被 gitignore 忽略

如果文件已经被 `git add` 追踪（提交过），后续添加到 `.gitignore` 也不会生效！

**解决方案**：先移除 Git 对该文件的追踪（保留本地文件），再提交忽略规则：

```bash
# 移除单个文件的追踪（本地文件保留）
git rm --cached 文件名  # 如 git rm --cached .env

# 移除整个目录的追踪
git rm --cached -r 目录名  # 如 git rm --cached -r node_modules/

# 提交修改
git commit -m "停止追踪 .env/node_modules"
```

### 忽略规则的优先级

- 「具体规则」优先于「模糊规则」：如 `/src/test.log` 优先于 `*.log`；
- 「排除规则 `!`」必须放在对应忽略规则之后：
- 根目录限定 `/` 只匹配根目录：如 `/test.log` 只忽略根目录的 `test.log`，不忽略 `src/test.log`。

```bash
# 正确写法：先忽略所有 .log，再排除 important.log
*.log
!important.log

# 错误写法：排除规则无效
!important.log
*.log
```

### 强制提交被忽略的文件

如果需要临时提交被 `.gitignore` 忽略的文件，可使用 `-f`（force）参数：

```bash
git add -f 被忽略的文件名  # 如 git add -f .env.local
git commit -m "临时提交环境配置"
```

### 检查 gitignore 规则是否生效

可通过以下命令验证忽略规则是否正确：

```bash
# 查看指定文件是否被忽略
git check-ignore -v 文件名  # 如 git check-ignore -v .env

# 输出示例（表示 .env 被 .gitignore 的第5行规则忽略）：
# .gitignore:5:.env   .env
```

### gitignore 不生效的其他原因

- 规则语法错误：如目录未加 `/`（`dist` 会匹配文件和目录，`dist/` 仅匹配目录）；
- 全局忽略文件覆盖：全局 `.gitignore_global` 的规则优先级低于项目内的 `.gitignore`；
- 拼写错误：如把 `.env` 写成 `.en`，或大小写错误（Git 对大小写敏感）。
