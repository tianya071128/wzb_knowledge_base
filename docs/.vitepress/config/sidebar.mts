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
    {
      text: '开发者工具',
      collapsed: false, // 如果为“false”，则组是可折叠的，但默认情况下是展开的
      base: '/browser/',
      items: [
        {
          text: '元素(Element)',
          link: 'element',
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
  ],
};

export default sidebar;
