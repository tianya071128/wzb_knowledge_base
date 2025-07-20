import { DefaultTheme } from 'vitepress';

const sidebar: DefaultTheme.Sidebar = {
  '/html/': [
    {
      text: '基础元素', // 分组标题
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/html/',
      items: [
        {
          text: 'HTML 介绍',
          link: 'home',
        },
        {
          text: '全局属性',
          link: 'global',
        },
        {
          text: 'Head 元素',
          link: 'head',
        },
        {
          text: 'Meta 元素',
          link: 'meta',
        },
        {
          text: 'img 元素',
          link: 'img',
        },
        {
          text: 'a 元素',
          link: 'a',
        },
        {
          text: '其他主题',
          link: 'other',
        },
      ],
    },
    {
      text: '表单', // 分组标题
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/html/',
      items: [
        {
          text: '表单元素',
          link: 'form',
        },
        {
          text: '获取表单元素数据',
          link: 'form_data',
        },
        {
          text: 'js 表单操作',
          link: 'form_js',
        },
      ],
    },
  ],
  '/css/': [
    {
      text: 'CSS概念', // 分组标题
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/css/',
      items: [
        {
          text: 'css 基础概念',
          link: 'home',
        },
        {
          text: '层叠、优先级和继承',
          link: 'cascade_and_inheritance',
        },
        {
          text: '盒模型',
          link: 'the_box_model',
        },
        {
          text: '层叠上下文',
          link: 'the_stacking_context',
        },
        {
          text: '格式化上下文',
          link: 'formatting_context',
        },
        {
          text: '可替换元素',
          link: 'replaced_element',
        },
      ],
    },
    {
      text: 'CSS模块', // 分组标题
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/css/',
      items: [
        {
          text: 'CSS 选择器',
          link: 'selector',
        },
        {
          text: 'CSS 伪元素',
          link: 'pseudoElements',
        },
        {
          text: 'CSS 伪类',
          link: 'pseudoClasses',
        },
        {
          text: '值和单位',
          link: 'values_units',
        },
      ],
    },
    {
      text: 'CSS布局', // 分组标题
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/css/',
      items: [
        {
          text: 'CSS 布局',
          link: 'layout',
        },
        {
          text: 'CSS 正常布局流',
          link: 'normal_flow',
        },
        {
          text: '浮动和定位布局',
          link: 'flatandposition',
        },
        {
          text: '弹性布局',
          link: 'flexBox',
        },
        {
          text: '网格布局',
          link: 'grid',
        },
      ],
    },
    {
      text: '其他', // 分组标题
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/css/',
      items: [
        {
          text: 'CSS 属性',
          link: 'property',
        },
        {
          text: 'CSS 函数',
          link: 'function',
        },
        {
          text: 'CSS 文本',
          link: 'text',
        },
        {
          text: '问题',
          link: 'issues',
        },
      ],
    },
  ],
  '/js/': [
    {
      text: 'ES',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/js/',
      items: [
        {
          text: 'ES 基础概念',
          link: 'home',
        },
        {
          text: '内存机制-数据是如何存储的',
          link: 'memory',
        },
        {
          text: '内存机制-垃圾回收',
          link: 'recovery',
        },
        {
          text: '内存机制-内存检测和内存泄露',
          link: 'check',
        },
        {
          text: '执行机制-执行上下文、调用栈',
          link: 'executionContext',
        },
        {
          text: '执行机制-作用域、作用域链',
          link: 'scope',
        },
        {
          text: '执行机制-事件循环(evnet loop)',
          link: 'eventloop',
        },
        {
          text: 'V8编译 - 运行时环境',
          link: 'environment',
        },
        {
          text: '数据类型 - 函数和闭包',
          link: 'function',
        },
      ],
    },
    {
      text: 'DOM',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/js/',
      items: [
        {
          text: 'DOM',
          link: 'DOM',
        },
        {
          text: '节点操作',
          link: 'DOMAPI',
        },
        {
          text: '几何位置',
          link: 'geometry',
        },
        {
          text: '事件',
          link: 'event',
        },
        {
          text: '事件类型',
          link: 'eventType',
        },
      ],
    },
    {
      text: 'web API',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/js/',
      items: [
        {
          text: '数据存储',
          items: [
            {
              text: 'cookie',
              link: 'cookie',
            },
            {
              text: 'Web Storage',
              link: 'WebStorage',
            },
            {
              text: 'IndexedDB',
              link: 'IndexedDB',
            },
          ],
        },
        {
          text: '二进制数据，文件',
          items: [
            {
              text: 'ArrayBuffer',
              link: 'ArrayBuffer',
            },
            {
              text: 'Blob、File、FileReader',
              link: 'File',
            },
            {
              text: '文件操作',
              link: 'operation',
            },
          ],
        },
        {
          text: '网络请求',
          items: [
            {
              text: 'XMLHttpRequest',
              link: 'xhr',
            },
            {
              text: '轮询',
              link: 'polling',
            },
            {
              text: 'WebSocket',
              link: 'webSocket',
            },
          ],
        },
      ],
    },
  ],
  '/browser/': [
    {
      text: '浏览器渲染',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/browser/',
      items: [
        {
          text: 'Chrome 基础架构',
          link: 'home',
        },
        {
          text: '导航流程：输入 URL 到页面展示',
          link: 'navigation',
        },
        {
          text: '渲染流程',
          link: 'render',
        },
        {
          text: '渲染流程 - 相关概念',
          link: 'concept',
        },
      ],
    },
    {
      text: '浏览器安全',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/browser/',
      items: [
        {
          text: '跨站脚本攻击（XSS）',
          link: 'xss',
        },
        {
          text: '跨站请求伪造（CSRF）',
          link: 'csrf',
        },
      ],
    },
  ],
  '/babel/': [
    {
      base: '/babel/',
      items: [
        {
          text: 'babel 介绍',
          link: 'home',
        },
        {
          text: '配置文件',
          link: 'configFile',
        },
        {
          text: '配置选项',
          link: 'configOptions',
        },
        {
          text: '预设',
          link: 'presets',
        },
        {
          text: '官方预设：@babel/preset-env',
          link: 'presetsEnv',
        },
        {
          text: '插件',
          link: 'plugins',
        },
        {
          text: 'babel 架构',
          link: 'framework',
        },
      ],
    },
  ],
  '/sass/': [
    {
      base: '/sass/',
      items: [
        {
          text: 'Sass(Scss) 介绍',
          link: 'home',
        },
        {
          text: 'CSS 功能扩展',
          link: 'extensions',
        },
        {
          text: 'SassScript',
          link: 'sassScript',
        },
        {
          text: '基础规则',
          link: 'rules',
        },
        {
          text: '流控制规则',
          link: 'flowControl',
        },
        {
          text: '混入(Mixins)',
          link: 'mixin',
        },
        {
          text: '函数(Function)',
          link: 'function',
        },
        {
          text: '扩展(Extend)',
          link: 'extend',
        },
        {
          text: '导入(Import)',
          link: 'import',
        },
        {
          text: '模块系统(Use)',
          link: 'use',
        },
      ],
    },
  ],
  '/eslint/': [
    {
      base: '/eslint/',
      items: [
        {
          text: 'ESLint 介绍',
          link: 'home',
        },
        {
          text: 'ESLint 配置',
          link: 'config',
        },
        {
          text: 'ESLint 格式化程序',
          link: 'formatters',
        },
        {
          text: 'ESLint 插件',
          link: 'plugins',
        },
      ],
    },
  ],
  '/vscode/': [
    {
      base: '/vscode/',
      items: [
        {
          text: '设置',
          link: 'home',
        },
        {
          text: '概述',
          link: 'summary',
        },
        {
          text: '调试',
          link: 'debug',
        },
        {
          text: '快捷键',
          base: '/',
          link: 'wzb_knowledge_base/other/vscode快捷键.pdf',
          target: '_blank',
        },
      ],
    },
  ],
  '/pnpm/': [
    {
      base: '/pnpm/',
      items: [
        {
          text: '介绍',
          link: 'home',
        },
        {
          text: '工作空间（Workspace）',
          link: 'workspaces',
        },
      ],
    },
  ],
  '/npm/': [
    {
      base: '/npm/',
      text: 'npm 基础',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      items: [
        {
          text: 'npm',
          link: 'home',
        },
        {
          text: '配置',
          link: 'config',
        },
        {
          text: '文件夹结构',
          link: 'folders',
        },
        {
          text: '脚本',
          link: 'scripts',
        },
        {
          text: '发布包',
          link: 'publishPackage',
        },
      ],
    },
    {
      base: '/npm/',
      text: '命令',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      items: [
        {
          text: '管理依赖',
          items: [
            {
              text: 'install 安装包',
              link: 'npm-install',
            },
            {
              text: 'update 更新包',
              link: 'npm-update',
            },
            {
              text: 'uninstall 卸载包',
              link: 'npm-uninstall',
            },
            {
              text: 'dedupe 去除重复包',
              link: 'npm-dedupe',
            },
          ],
        },
        {
          text: '查看依赖',
          items: [
            {
              text: 'ls 查看已安装包',
              link: 'npm-ls',
            },
            {
              text: 'outdated 检查过时包',
              link: 'npm-outdated',
            },
            {
              text: 'docs 打开包主页',
              link: 'npm-docs',
            },
            {
              text: 'bugs 打开包 bugs 地址',
              link: 'npm-bugs',
            },
            {
              text: 'view 远程查看包信息',
              link: 'npm-view',
            },
            {
              text: 'search 搜索远程包',
              link: 'npm-search',
            },
          ],
        },
        {
          text: '运行脚本',
          items: [
            {
              text: 'run-script 运行脚本',
              link: 'npm-run-script',
            },
            {
              text: 'test 运行 test 脚本',
              link: 'npm-test',
            },
            {
              text: 'start 运行 start 脚本',
              link: 'npm-start',
            },
            {
              text: 'stop 运行 stop 脚本',
              link: 'npm-stop',
            },
          ],
        },
        {
          text: '发布包',
          items: [
            {
              text: 'publish 发布包',
              link: 'npm-publish',
            },
            {
              text: 'deprecate 弃用包的某个版本',
              link: 'npm-deprecate',
            },
            {
              text: 'dist-tag 包标签',
              link: 'npm-dist-tag',
            },
          ],
        },
        {
          text: '账户操作',
          items: [
            {
              text: 'login 登录',
              link: 'npm-login',
            },
            {
              text: 'logout 登出',
              link: 'npm-logout',
            },
            {
              text: 'token 令牌',
              link: 'npm-token',
            },
          ],
        },
        {
          text: '其他',
          items: [
            {
              text: 'init 初始化工程',
              link: 'npm-init',
            },
            {
              text: 'config 配置',
              link: 'npm-config',
            },
            {
              text: 'help 帮助',
              link: 'npm-help',
            },
            {
              text: 'ping',
              link: 'npm-ping',
            },
            {
              text: 'root 根目录',
              link: 'npm-root',
            },
          ],
        },
      ],
    },
    {
      base: '/npm/',
      text: 'npm 概念',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      items: [
        {
          text: '包名称',
          link: 'spec',
        },
        {
          text: '范围包',
          link: 'scope',
        },
        {
          text: '依赖分类',
          link: 'depend',
        },
        {
          text: '版本规范',
          link: 'version',
        },
        {
          text: '包入口',
          link: 'entrance',
        },
        {
          text: '包安装机制',
          link: 'install',
        },
        {
          text: 'package 文件',
          link: 'packageFile',
        },
      ],
    },
  ],
  '/http/': [
    {
      base: '/http/',
      items: [
        {
          text: 'HTTP 介绍',
          link: 'home',
        },
        {
          text: 'HTTP 请求方法',
          link: 'method',
        },
        {
          text: 'HTTP 状态码',
          link: 'status',
        },
        {
          text: 'HTTP 内容协商',
          link: 'content',
        },
        {
          text: 'HTTP 连接管理',
          link: 'connection',
        },
        {
          text: 'HTTP cookie',
          link: 'cookie',
        },
        {
          text: 'HTTP 缓存',
          link: 'cache',
        },
        {
          text: 'HTTP 传输大文件',
          link: 'bigFile',
        },
        {
          text: 'HTTP 跨域资源共享（CORS）',
          link: 'cors',
        },
        {
          text: 'HTTP 抓包分析',
          link: 'capture',
        },
        {
          text: 'HTTP 问题',
          link: 'issue',
        },
      ],
    },
  ],
  '/https/': [
    {
      base: '/https/',
      items: [
        {
          text: 'HTTPS 基本概念',
          link: 'home',
        },
        {
          text: 'HTTPS 如何解决安全性？',
          link: 'security',
        },
        {
          text: 'TLS',
          link: 'tls',
          items: [
            {
              text: 'TLS1.2 连接过程',
              link: 'tls_handshake',
            },
            {
              text: '证书',
              link: 'tls_certificate',
            },
            {
              text: 'TLS 相关概念',
              link: 'tls_concept',
            },
          ],
        },
        {
          text: '抓包分析',
          link: 'capture',
        },
        {
          text: 'HTTPS 问题',
          link: 'issue',
        },
      ],
    },
  ],
  '/h2/': [
    {
      base: '/h2/',
      items: [
        {
          text: 'HTTP2 基本概念',
          link: 'home',
        },
        {
          text: 'HTTP2 内核剖析',
          link: 'analyze',
        },
      ],
    },
  ],
  '/node/': [
    {
      text: 'Node.js 基础概念',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/node/',
      items: [
        {
          text: 'Node.js',
          link: 'home',
        },
        {
          text: '模块系统',
          link: 'module',
        },
      ],
    },
    {
      text: 'Node.js 模块',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/node/',
      items: [
        {
          text: 'Path 路径',
          link: 'path',
        },
        {
          text: 'Url 网址',
          link: 'url',
          items: [
            {
              text: 'URL 类',
              link: 'url_class',
            },
            {
              text: 'URLSearchParams 类',
              link: 'URLSearchParams',
            },
          ],
        },
        {
          text: 'Buffer 缓冲区',
          link: 'buffer',
          items: [
            {
              text: 'Blob 和 File',
              link: 'blobAndFile',
            },
          ],
        },
        {
          text: 'Events 事件触发器',
          link: 'events',
          items: [
            {
              text: 'EventEmitter 类',
              link: 'eventEmitter',
            },
            {
              text: 'EventTarget 和 Event',
              link: 'eventTargetAndEvent',
            },
          ],
        },
        {
          text: 'Stream 流',
          link: 'Stream',
          items: [
            {
              text: '可读流（Readable）',
              link: 'StreamReadable',
            },
          ],
        },
      ],
    },
  ],
  '/devtools/': [
    {
      base: '/devtools/',
      items: [
        {
          text: 'Chrome 开发者工具',
          link: 'home',
        },

        {
          text: '元素(Element)',
          link: 'element',
          items: [
            {
              text: '样式窗格(Style)',
              link: 'style',
            },
          ],
        },
        {
          text: '控制台(Console)',
          link: 'console',
        },
        {
          text: '网络(Network)',
          link: 'network',
        },
        {
          text: '应用(Application)',
          link: 'application',
          items: [
            {
              text: '应用部分',
              link: 'application/pwa',
            },
            {
              text: '存储部分',
              link: 'application/storage',
            },
            {
              text: '后台服务',
              link: 'application/backgroundServices',
            },
            {
              text: '框架',
              link: 'application/frame',
            },
          ],
        },
        {
          text: '源代码(Sources)',
          link: 'sources',
          items: [
            {
              text: '查看文件',
              link: 'sources/viewFile',
            },
            {
              text: '代码段',
              link: 'sources/snippets',
            },
            {
              text: '编辑文件',
              link: 'sources/editFile',
            },
            {
              text: '本地替换',
              link: 'sources/replace',
            },
            {
              text: '断点',
              link: 'sources/break',
            },
            {
              text: '调试',
              link: 'sources/debug',
            },
          ],
        },
        {
          text: '性能(Performance)',
          link: 'performance',
        },
        {
          text: '内存(Memory)',
          link: 'memory',
          items: [{ text: '内存术语', link: 'memory/term' }],
        },
        {
          text: '其他面板',
          collapsed: false,
          items: [
            {
              text: '记录器(Recorder)',
              link: 'recorder',
            },
            {
              text: '渲染(Rendering)',
              link: 'rendering',
              items: [
                {
                  text: '渲染性能问题',
                  link: 'rendering/performance',
                },
                {
                  text: '应用渲染效果',
                  link: 'rendering/effects',
                },
                {
                  text: '模拟 CSS 媒体功能',
                  link: 'rendering/emulate',
                },
              ],
            },
            {
              text: '动画(Animations)',
              link: 'animations',
            },
            {
              text: '覆盖率(Coverage)',
              link: 'coverage',
            },
            {
              text: '开发者资源(Developer Resources)',
              link: 'developer-resources',
            },
            {
              text: '网络状况(Netword conditions)',
              link: 'netword-conditions',
            },
          ],
        },
        {
          text: '其他',
          collapsed: false,
          items: [
            {
              text: '键盘快捷键',
              link: 'shortcuts',
            },
          ],
        },
      ],
    },
  ],
  '/reg/': [
    {
      base: '/reg/',
      items: [
        {
          text: '正则表达式',
          link: 'home',
        },
        {
          text: '元字符',
          link: 'metachar',
        },
        {
          text: '使用正则表达式',
          link: 'use',
        },
      ],
    },
  ],
  '/ts/': [
    {
      base: '/ts/',
      items: [
        {
          text: '介绍',
          link: 'home',
        },
        {
          text: '模块',
          link: 'modules',
        },
        {
          text: '@types',
          link: 'types',
        },
        {
          text: 'lib:内置声明文件',
          link: 'lib',
        },
        {
          text: '声明文件:.d.ts',
          link: 'declaration',
        },
      ],
    },
  ],
};

export default sidebar;
