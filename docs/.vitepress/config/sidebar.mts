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
};

export default sidebar;
