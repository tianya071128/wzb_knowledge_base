import { DefaultTheme } from 'vitepress';

const nav: DefaultTheme.NavItem[] = [
  {
    text: '基础',
    activeMatch: `/html|css|js|browser/`,
    items: [
      { text: 'html', link: '/html/home.html', activeMatch: '/html/' },
      { text: 'css', link: '/css/home.html', activeMatch: '/css/' },
      { text: 'js', link: '/js/home.html', activeMatch: '/js/' },
      {
        text: '浏览器',
        link: '/browser/home.html',
        activeMatch: '/browser/',
      },
    ],
  },
  {
    text: '工程化',
    activeMatch: `/babel|sass|eslint|npm|prettier|browserslist|vscode/`,
    items: [
      { text: 'babel', link: '/babel/home.html', activeMatch: '/babel/' },
      { text: 'sass', link: '/sass/home.html', activeMatch: '/sass/' },
      {
        text: 'eslint',
        link: '/eslint/home.html',
        activeMatch: '/eslint/',
      },
      { text: 'npm', link: '/npm/home.html', activeMatch: '/npm/' },
      {
        text: 'vscode',
        link: '/vscode/home.html',
        activeMatch: '/vscode/',
      },
      { text: 'webpack', link: '/webpack/home.html', activeMatch: '/webpack/' },
      {
        text: 'prettier',
        link: '/prettier/home.html',
        activeMatch: '/prettier/',
      },
      {
        text: 'browserslist',
        link: '/browserslist/home.html',
        activeMatch: '/browserslist/',
      },
      {
        text: 'pnpm',
        link: '/pnpm/home.html',
        activeMatch: '/pnpm/',
      },
      // { text: '其他', link: '/otherEngineering/' },
    ],
  },
  {
    text: '网络协议',
    activeMatch: `/http|https|h2/`,
    items: [
      { text: 'http', link: '/http/home.html', activeMatch: '/http/' },
      { text: 'https', link: '/https/home.html', activeMatch: '/https/' },
      { text: 'http2', link: '/h2/home.html', activeMatch: '/h2/' },
    ],
  },
  {
    text: '更多',
    activeMatch: `/node|devtools|reg/`,
    items: [
      { text: 'Node.js', link: '/node/home.html', activeMatch: '/node/' },
      {
        text: '开发者工具',
        link: '/devtools/home.html',
        activeMatch: '/devtools/',
      },
      { text: '正则表达式', link: '/reg/home.html', activeMatch: '/reg/' },
      { text: '算法', link: '/algo/home.html', activeMatch: '/algo/' },
      { text: 'TypeScript', link: '/ts/home.html', activeMatch: '/ts/' },
      { text: 'Git', link: '/git/home.html', activeMatch: '/git/' },
    ],
  },
];

export default nav;
