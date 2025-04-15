const rewrites: Record<string, string> = {
  '01_前端/01_html/01_index.md': 'html/home.md',
  '01_前端/01_html/02_全局属性.md': 'html/global.md',
  '01_前端/01_html/03_head.md': 'html/head.md',
  '01_前端/01_html/04_meta.md': 'html/meta.md',
  '01_前端/01_html/05_img.md': 'html/img.md',
  '01_前端/01_html/06_a.md': 'html/a.md',
  '01_前端/01_html/07_form.md': 'html/form.md',
  '01_前端/01_html/08_form_data.md': 'html/form_data.md',
  '01_前端/01_html/09_form_js.md': 'html/form_js.md',
  '01_前端/01_html/10_other.md': 'html/other.md',
  '01_前端/02_css/01_index.md': 'css/home.md',
  '01_前端/02_css/02_选择器.md': 'css/selector.md',
  '01_前端/02_css/03_伪元素.md': 'css/pseudoElements.md',
  '01_前端/02_css/04_伪类.md': 'css/pseudoClasses.md',
  '01_前端/02_css/05_层叠、优先级和继承.md': 'css/cascade_and_inheritance.md',
  '01_前端/02_css/06_盒模型.md': 'css/the_box_model.md',
  '01_前端/02_css/07_层叠上下文.md': 'css/the_stacking_context.md',
  '01_前端/02_css/08_格式化上下文.md': 'css/formatting_context.md',
  '01_前端/02_css/09_值和单位.md': 'css/values_units.md',
  '01_前端/02_css/11_布局概述.md': 'css/layout.md',
  '01_前端/02_css/12.正常布局流.md': 'css/normal_flow.md',
  '01_前端/02_css/13_浮动和定位布局.md': 'css/flatandposition.md',
  '01_前端/02_css/14_弹性布局.md': 'css/flexBox.md',
  '01_前端/02_css/15_网格布局.md': 'css/grid.md',
  '01_前端/02_css/16_样式问题.md': 'css/issues.md',
  '01_前端/02_css/17_css属性.md': 'css/property.md',
  '01_前端/02_css/18_css函数.md': 'css/function.md',
  '01_前端/02_css/19_可替换元素.md': 'css/replaced_element.md',
  '01_前端/02_css/20_文本.md': 'css/text.md',
  '01_前端/03_js/01_ES基本概念.md': 'js/home.md',
  '01_前端/03_js/02_内存机制-数据存储.md': 'js/memory.md',
  '01_前端/03_js/03_内存机制-垃圾回收.md': 'js/recovery.md',
  '01_前端/03_js/04_内存机制-内存检测和内存泄露.md': 'js/check.md',
  '01_前端/03_js/05_JS执行机制-事件循环.md': 'js/eventloop.md',
  '01_前端/03_js/06_V8编译-运行时环境.md': 'js/environment.md',
  '01_前端/03_js/07_JS执行机制-执行上下文.md': 'js/executionContext.md',
  '01_前端/03_js/08_JS执行机制-作用域、作用域链.md': 'js/scope.md',
  '01_前端/03_js/09_JS数据类型-函数和闭包.md': 'js/function.md',
  '01_前端/03_js/10_DOM.md': 'js/DOM.md',
  '01_前端/03_js/11_DOM_节点操作.md': 'js/DOMAPI.md',
  '01_前端/03_js/12_DOM_几何位置.md': 'js/geometry.md',
  '01_前端/03_js/13_DOM_事件.md': 'js/event.md',
  '01_前端/03_js/14_DOM_事件类型.md': 'js/eventType.md',
  '01_前端/03_js/15_cookie.md': 'js/cookie.md',
  '01_前端/03_js/16_WebStorage.md': 'js/WebStorage.md',
  '01_前端/03_js/17_IndexedDB.md': 'js/IndexedDB.md',
  '01_前端/03_js/18_ArrayBuffer.md': 'js/ArrayBuffer.md',
  '01_前端/03_js/19_Blob、File和FileReader.md': 'js/File.md',
  '01_前端/03_js/20_文件操作.md': 'js/operation.md',
  '01_前端/03_js/21_XHR.md': 'js/xhr.md',
  '01_前端/03_js/22_轮询.md': 'js/polling.md',
  '01_前端/03_js/23_webSocket.md': 'js/webSocket.md',
  '01_前端/04_浏览器/01_Chrome基础架构.md': 'browser/home.md',
  '01_前端/04_浏览器/02_导航流程.md': 'browser/navigation.md',
  '01_前端/04_浏览器/03_渲染流程.md': 'browser/render.md',
  '01_前端/04_浏览器/04_渲染相关概念.md': 'browser/concept.md',
  '01_前端/04_浏览器/05_跨站脚本攻击_XSS.md': 'browser/xss.md',
  '01_前端/04_浏览器/06_跨站请求伪造_CSRF.md': 'browser/csrf.md',
  '02_工程化/05_babel/01_index.md': 'babel/home.md',
  '02_工程化/05_babel/02_配置文件.md': 'babel/configFile.md',
  '02_工程化/05_babel/03_配置选项.md': 'babel/configOptions.md',
  '02_工程化/05_babel/04_预设.md': 'babel/presets.md',
  '02_工程化/05_babel/05_preset-env预设.md': 'babel/presetsEnv.md',
  '02_工程化/05_babel/06_插件.md': 'babel/plugins.md',
  '02_工程化/05_babel/07_babal架构.md': 'babel/framework.md',
  '02_工程化/07_scss/01_index.md': 'sass/home.md',
  '02_工程化/07_scss/02_CSS 功能扩展.md': 'sass/extensions.md',
  '02_工程化/07_scss/03_SassScript.md': 'sass/sassScript.md',
  '02_工程化/07_scss/04_规则.md': 'sass/rules.md',
  '02_工程化/07_scss/05_流控制规则.md': 'sass/flowControl.md',
  '02_工程化/07_scss/06_混入.md': 'sass/mixin.md',
  '02_工程化/07_scss/07_函数.md': 'sass/function.md',
  '02_工程化/07_scss/08_扩展.md': 'sass/extend.md',
  '02_工程化/07_scss/09_导入.md': 'sass/import.md',
  '02_工程化/07_scss/10.模块系统.md': 'sass/use.md',
  '02_工程化/02_eslint/01_eslint.md': 'eslint/home.md',
  '02_工程化/02_eslint/02_eslint配置.md': 'eslint/config.md',
  '02_工程化/02_eslint/03_格式化程序.md': 'eslint/formatters.md',
  '02_工程化/02_eslint/04_插件.md': 'eslint/plugins.md',
  '02_工程化/06_npm/01_npm.md': 'npm/home.md',
  '02_工程化/06_npm/02_文件夹结构.md': 'npm/folders.md',
  '02_工程化/06_npm/03_发布包.md': 'npm/publishPackage.md',
  '02_工程化/06_npm/04_package文件.md': 'npm/packageFile.md',
  '02_工程化/06_npm/05_包入口.md': 'npm/entrance.md',
  '02_工程化/06_npm/06_脚本.md': 'npm/scripts.md',
  '02_工程化/06_npm/07_包安装机制.md': 'npm/install.md',
  '02_工程化/06_npm/08_配置.md': 'npm/config.md',
  '02_工程化/06_npm/09_命令_init_初始化工程.md': 'npm/npm-init.md',
  '02_工程化/06_npm/10_命令_install_安装包.md': 'npm/npm-install.md',
  '02_工程化/06_npm/11_命令_update_更新包.md': 'npm/npm-update.md',
  '02_工程化/06_npm/12_命令_uninstall_卸载包.md': 'npm/npm-uninstall.md',
  '02_工程化/06_npm/13_命令_outdated_过时包.md': 'npm/npm-outdated.md',
  '02_工程化/06_npm/14_命令_ls_查看已安装包.md': 'npm/npm-ls.md',
  '02_工程化/06_npm/15_命令_dedupe_去除重复包.md': 'npm/npm-dedupe.md',
  '02_工程化/06_npm/16_命令_docs_打开包主页.md': 'npm/npm-docs.md',
  '02_工程化/06_npm/17_命令_search_搜索远程包.md': 'npm/npm-search.md',
  '02_工程化/06_npm/18_命令_view_查看包信息.md': 'npm/npm-view.md',
  '02_工程化/06_npm/19_命令_config_配置.md': 'npm/npm-config.md',
  '02_工程化/06_npm/20_包命名规范.md': 'npm/spec.md',
  '02_工程化/06_npm/21_范围包.md': 'npm/scope.md',
  '02_工程化/06_npm/22_依赖分类.md': 'npm/depend.md',
  '02_工程化/06_npm/23_版本规范.md': 'npm/version.md',
  '02_工程化/06_npm/24_命令_login_登录.md': 'npm/npm-login.md',
  '02_工程化/06_npm/25_命令_logout_登出.md': 'npm/npm-logout.md',
  '02_工程化/06_npm/26_命令_token_令牌.md': 'npm/npm-token.md',
  '02_工程化/06_npm/27_命令_bugs_打开包bugs地址.md': 'npm/npm-bugs.md',
  '02_工程化/06_npm/28_命令_deprecate_弃用包的某个版本.md':
    'npm/npm-deprecate.md',
  '02_工程化/06_npm/29_命令_dist_tag_包标签.md': 'npm/npm-dist-tag.md',
  '02_工程化/06_npm/30_命令_help_帮助.md': 'npm/npm-help.md',
  '02_工程化/06_npm/31_命令_ping.md': 'npm/npm-ping.md',
  '02_工程化/06_npm/32_命令_publish_发布包.md': 'npm/npm-publish.md',
  '02_工程化/06_npm/33_命令_root_根目录.md': 'npm/npm-root.md',
  '02_工程化/06_npm/34_命令_runSrciprt_运行脚本.md': 'npm/npm-run-script.md',
  '02_工程化/06_npm/35_命令_test_运行test脚本.md': 'npm/npm-test.md',
  '02_工程化/06_npm/36_命令_start_运行start脚本.md': 'npm/npm-start.md',
  '02_工程化/06_npm/37_命令_stop_运行stop脚本.md': 'npm/npm-stop.md',
  '02_工程化/01_vscode/01_设置.md': 'vscode/home.md',
  '02_工程化/01_vscode/02_概述.md': 'vscode/summary.md',
  '02_工程化/01_vscode/03_调试.md': 'vscode/debug.md',
  '02_工程化/08_Prettier/01_home.md': 'prettier/home.md',
  '02_工程化/09_Browserslist/01_home.md': 'browserslist/home.md',
  '03_网络协议/01_http/01_index.md': 'http/home.md',
  '03_网络协议/01_http/02_请求方法.md': 'http/method.md',
  '03_网络协议/01_http/03_状态码.md': 'http/status.md',
  '03_网络协议/01_http/04_内容协商.md': 'http/content.md',
  '03_网络协议/01_http/05_连接管理.md': 'http/connection.md',
  '03_网络协议/01_http/06_cookie.md': 'http/cookie.md',
  '03_网络协议/01_http/07_缓存.md': 'http/cache.md',
  '03_网络协议/01_http/08_传输大文件.md': 'http/bigFile.md',
  '03_网络协议/01_http/09_cors.md': 'http/cors.md',
  '03_网络协议/01_http/10_抓包分析.md': 'http/capture.md',
  '03_网络协议/01_http/11_问题.md': 'http/issue.md',
  '03_网络协议/02_https/01_https.md': 'https/home.md',
  '03_网络协议/02_https/02_https安全性.md': 'https/security.md',
  '03_网络协议/02_https/03_TLS.md': 'https/tls.md',
  '03_网络协议/02_https/04_抓包分析.md': 'https/capture.md',
  '03_网络协议/02_https/05_问题.md': 'https/issue.md',
  '03_网络协议/03_http2/01_h2.md': 'h2/home.md',
  '03_网络协议/03_http2/02_h2内核剖析.md': 'h2/analyze.md',
  '04_更多/01_node/01_index.md': 'node/home.md',
  '04_更多/01_node/02_模块系统.md': 'node/module.md',
  '04_更多/02_开发者工具/01_index.md': 'devtools/home.md',
  '04_更多/02_开发者工具/07_元素.md': 'devtools/element.md',
  '04_更多/02_开发者工具/08_样式.md': 'devtools/style.md',
  '04_更多/02_开发者工具/09_键盘快捷键.md': 'devtools/shortcuts.md',
  '04_更多/02_开发者工具/10_控制台.md': 'devtools/console.md',
  '04_更多/02_开发者工具/11_网络.md': 'devtools/network.md',
  '04_更多/02_开发者工具/12_应用.md': 'devtools/application.md',
  '04_更多/02_开发者工具/13_应用_PWA.md': 'devtools/application/pwa.md',
  '04_更多/02_开发者工具/14_应用_存储.md': 'devtools/application/storage.md',
  '04_更多/02_开发者工具/15_应用_后台服务.md':
    'devtools/application/backgroundServices.md',
  '04_更多/02_开发者工具/16_应用_框架.md': 'devtools/application/frame.md',
  '04_更多/02_开发者工具/17_源代码.md': 'devtools/sources.md',
  '04_更多/02_开发者工具/18_源代码_查看文件.md': 'devtools/sources/viewFile.md',
  '04_更多/02_开发者工具/19_源代码_代码段.md': 'devtools/sources/snippets.md',
  '04_更多/02_开发者工具/20_源代码_编辑文件.md': 'devtools/sources/editFile.md',
  '04_更多/02_开发者工具/21_源代码_本地替换.md': 'devtools/sources/replace.md',
  '04_更多/02_开发者工具/22_源代码_断点.md': 'devtools/sources/break.md',
  '04_更多/02_开发者工具/23_源代码_调试.md': 'devtools/sources/debug.md',
  '04_更多/02_开发者工具/24_性能.md': 'devtools/performance.md',
  '04_更多/02_开发者工具/25_渲染.md': 'devtools/rendering.md',
  '04_更多/02_开发者工具/26_渲染性能问题.md':
    'devtools/rendering/performance.md',
  '04_更多/02_开发者工具/27_应用渲染效果.md': 'devtools/rendering/effects.md',
  '04_更多/02_开发者工具/28_模拟css媒体功能.md':
    'devtools/rendering/emulate.md',
  '04_更多/02_开发者工具/29_覆盖率.md': 'devtools/coverage.md',
  '04_更多/02_开发者工具/30_开发者资源.md': 'devtools/developer-resources.md',
  '04_更多/02_开发者工具/31_网络状况.md': 'devtools/netword-conditions.md',
  '04_更多/02_开发者工具/32_内存.md': 'devtools/memory.md',
  '04_更多/02_开发者工具/33_内存_内存术语.md': 'devtools/memory/term.md',
  '04_更多/02_开发者工具/37_记录器.md': 'devtools/recorder.md',
  '04_更多/02_开发者工具/38_动画.md': 'devtools/animations.md',
  '04_更多/03_正则/01_index.md': 'reg/home.md',
  '04_更多/03_正则/02_元字符.md': 'reg/metachar.md',
  '04_更多/03_正则/03_使用正则.md': 'reg/use.md',
  '04_更多/04_算法/01_index.md': 'algo/home.md',
};
export default rewrites;
