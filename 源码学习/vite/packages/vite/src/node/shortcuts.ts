import readline from 'node:readline'
import colors from 'picocolors'
import { restartServerWithUrls } from './server'
import type { ViteDevServer } from './server'
import { isDevServer } from './utils'
import type { PreviewServer } from './preview'
import { openBrowser } from './server/openBrowser'

export type BindCLIShortcutsOptions<Server = ViteDevServer | PreviewServer> = {
  /**
   * Print a one-line shortcuts "help" hint to the terminal
   */
  print?: boolean
  /**
   * Custom shortcuts to run when a key is pressed. These shortcuts take priority
   * over the default shortcuts if they have the same keys (except the `h` key).
   * To disable a default shortcut, define the same key but with `action: undefined`.
   */
  customShortcuts?: CLIShortcut<Server>[]
}

export type CLIShortcut<Server = ViteDevServer | PreviewServer> = {
  key: string
  description: string
  action?(server: Server): void | Promise<void>
}

/**
 * 绑定CLI快捷键到给定的服务器实例：处理 press h + enter to show help(按 h + Enter 显示帮助) 功能
 *
 * @param server 服务器实例，可以是Vite开发服务器或预览服务器。
 * @param opts 可选的绑定快捷键选项。
 * @returns void
 */
export function bindCLIShortcuts<Server extends ViteDevServer | PreviewServer>(
  server: Server,
  opts?: BindCLIShortcutsOptions<Server>,
): void {
  // 如果没有HTTP服务器实例，或者当前是在非TTY模式下运行，或者在CI环境中，则不绑定快捷键
  if (!server.httpServer || !process.stdin.isTTY || process.env.CI) {
    return
  }

  const isDev = isDevServer(server) // 是否为开发环境

  // 在开发服务器中存储快捷键选项
  if (isDev) {
    server._shortcutsOptions = opts as BindCLIShortcutsOptions<ViteDevServer>
  }

  // 打印快捷键帮助信息（如果指定）
  if (opts?.print) {
    server.config.logger.info(
      colors.dim(colors.green('  ➜')) +
        colors.dim('  press ') +
        colors.bold('h + enter') +
        colors.dim(' to show help'),
    )
  }

  // 合并自定义快捷键和基础快捷键
  const shortcuts = (opts?.customShortcuts ?? []).concat(
    (isDev
      ? BASE_DEV_SHORTCUTS
      : BASE_PREVIEW_SHORTCUTS) as CLIShortcut<Server>[],
  )

  let actionRunning = false // 标记是否正在执行快捷键动作

  // 处理输入事件
  const onInput = async (input: string) => {
    if (actionRunning) return // 如果已有动作在执行，则忽略当前输入

    // 显示快捷键帮助
    if (input === 'h') {
      const loggedKeys = new Set<string>()
      server.config.logger.info('\n  Shortcuts')

      for (const shortcut of shortcuts) {
        if (loggedKeys.has(shortcut.key)) continue
        loggedKeys.add(shortcut.key)

        if (shortcut.action == null) continue

        server.config.logger.info(
          colors.dim('  press ') +
            colors.bold(`${shortcut.key} + enter`) +
            colors.dim(` to ${shortcut.description}`),
        )
      }

      return
    }

    // 查找并执行匹配的快捷键动作
    const shortcut = shortcuts.find((shortcut) => shortcut.key === input)
    if (!shortcut || shortcut.action == null) return

    actionRunning = true
    await shortcut.action(server)
    actionRunning = false
  }

  // 创建读取流接口并监听输入，关闭服务器时关闭读取流
  const rl = readline.createInterface({ input: process.stdin })
  rl.on('line', onInput)
  server.httpServer.on('close', () => rl.close())
}

const BASE_DEV_SHORTCUTS: CLIShortcut<ViteDevServer>[] = [
  {
    key: 'r',
    description: 'restart the server',
    async action(server) {
      await restartServerWithUrls(server)
    },
  },
  {
    key: 'u',
    description: 'show server url',
    action(server) {
      server.config.logger.info('')
      server.printUrls()
    },
  },
  {
    key: 'o',
    description: 'open in browser',
    action(server) {
      server.openBrowser()
    },
  },
  {
    key: 'c',
    description: 'clear console',
    action(server) {
      server.config.logger.clearScreen('error')
    },
  },
  {
    key: 'q',
    description: 'quit',
    async action(server) {
      await server.close().finally(() => process.exit())
    },
  },
]

const BASE_PREVIEW_SHORTCUTS: CLIShortcut<PreviewServer>[] = [
  {
    key: 'o',
    description: 'open in browser',
    action(server) {
      const url =
        server.resolvedUrls?.local[0] ?? server.resolvedUrls?.network[0]
      if (url) {
        openBrowser(url, true, server.config.logger)
      } else {
        server.config.logger.warn('No URL available to open in browser')
      }
    },
  },
  {
    key: 'q',
    description: 'quit',
    action(server) {
      try {
        server.httpServer.close()
      } finally {
        process.exit()
      }
    },
  },
]
