import{V as o,fU as p,fV as u,fW as f,fX as l,fY as c,fZ as d,f_ as m,f$ as g,g0 as h,g1 as A,Y as _,d as P,u as v,k as y,y as E,g2 as R,g3 as w,g4 as C,aE as T}from"./chunks/framework.DLAwTCsc.js";import{R as b}from"./chunks/theme.DrqSJPy6.js";function i(e){if(e.extends){const t=i(e.extends);return{...t,...e,async enhanceApp(a){t.enhanceApp&&await t.enhanceApp(a),e.enhanceApp&&await e.enhanceApp(a)}}}return e}const s=i(b),S=P({name:"VitePressApp",setup(){const{site:e,lang:t,dir:a}=v();return y(()=>{E(()=>{document.documentElement.lang=t.value,document.documentElement.dir=a.value})}),e.value.router.prefetchLinks&&R(),w(),C(),s.setup&&s.setup(),()=>T(s.Layout)}});async function V(){globalThis.__VITEPRESS__=!0;const e=L(),t=D();t.provide(u,e);const a=f(e.route);return t.provide(l,a),t.component("Content",c),t.component("ClientOnly",d),Object.defineProperties(t.config.globalProperties,{$frontmatter:{get(){return a.frontmatter.value}},$params:{get(){return a.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:t,router:e,siteData:m}),{app:t,router:e,data:a}}function D(){return g(S)}function L(){let e=o,t;return h(a=>{let n=A(a),r=null;return n&&(e&&(t=n),(e||t===n)&&(n=n.replace(/\.js$/,".lean.js")),r=_(()=>import(n),[])),o&&(e=!1),r},s.NotFound)}o&&V().then(({app:e,router:t,data:a})=>{t.go().then(()=>{p(t.route,a.site),e.mount("#app")})});export{V as createApp};
