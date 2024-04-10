import { defineConfig } from 'vitepress';
import rewrites from './config/rewrites.mts';
import sidebar from './config/sidebar.mts';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '知识库',
  base: '/wzb_knowledge_base',
  // description: '个人学习知识库',
  markdown: {
    lineNumbers: true, // 代码行号
    image: {
      lazyLoading: true, // 启用图片懒加载
    },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
  },
  // <head> 标签中呈现的其他元素
  head: [['link', { rel: 'icon', href: './img/favicon.ico' }]],
  rewrites,
  themeConfig: {
    logo: './img/logo.png',
    // 自定义上次更新的文本和日期格式
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
    // 上下页链接
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到深色主题',
    outline: {
      label: '页面导航',
      level: [2, 3],
    },
    // 启用搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                displayDetails: '显示详情',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: '基础',
        activeMatch: `/html|css/`,
        items: [
          { text: 'html', link: '/html/home.html', activeMatch: '/html/' },
          { text: 'css', link: '/css/home.html', activeMatch: '/css/' },
          { text: 'js', link: '/js/' },
          { text: '浏览器', link: '/browser/' },
        ],
      },
      {
        text: '工程化',
        items: [
          { text: 'babel', link: '/babel/' },
          { text: 'sass', link: '/sass/' },
          { text: 'eslint', link: '/eslint/' },
          { text: 'vscode', link: '/vscode/' },
          { text: 'npm', link: '/npm/' },
          { text: 'webpack', link: '/webpack/' },
          // { text: '其他', link: '/otherEngineering/' },
        ],
      },
      {
        text: '网络协议',
        items: [
          { text: 'http', link: '/http/' },
          { text: 'https', link: '/https/' },
          { text: 'http2', link: '/h2/' },
        ],
      },
    ],

    sidebar,
  },
});
