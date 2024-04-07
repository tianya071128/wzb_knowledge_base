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
};

export default sidebar;
