import { Pinia, PiniaPlugin, setActivePinia, piniaSymbol } from './rootStore'
import { ref, App, markRaw, effectScope, isVue2, Ref } from 'vue-demi'
import { registerPiniaDevtools, devtoolsPlugin } from './devtools'
import { IS_CLIENT } from './env'
import { StateTree, StoreGeneric } from './types'

/**
 * Creates a Pinia instance to be used by the application 创建一个用于应用程序使用的 Pinia 实例
 */
export function createPinia(): Pinia {
  // 创建一个 effect 作用域，可以捕获其中所创建的响应式副作用 (即计算属性和侦听器)，这样捕获到的副作用可以一起处理。
  const scope = effectScope(true)
  // NOTE: here we could check the window object for a state and directly set it 注意：这里我们可以检查状态的窗口对象并将其直接设置
  // if there is anything like it with Vue 3 SSR 如果有vue 3 ssr有类似的东西
  const state = scope.run<Ref<Record<string, StateTree>>>(() =>
    ref<Record<string, StateTree>>({})
  )!

  // 存储已安装的插件
  let _p: Pinia['_p'] = []
  // plugins added before calling app.use(pinia) 在调用 app.use（pinia）之前添加插件
  let toBeInstalled: PiniaPlugin[] = []

  // 创建并返回 Pinia 实例
  const pinia: Pinia = markRaw({
    // 注册到 vue 实例中, 会通过 app.use(pinia) 调用执行
    install(app: App) {
      // this allows calling useStore() outside of a component setup after 这允许在以下情况下在组件设置之外调用useStore（）
      // installing pinia's plugin 安装pinia插件
      setActivePinia(pinia) // 设置活跃的 Pinia 实例, 这可以在组件之外使用

      // vue3 环境
      if (!isVue2) {
        pinia._a = app // 绑定应用实例
        app.provide(piniaSymbol, pinia) // 注入 Pinia
        app.config.globalProperties.$pinia = pinia // 扩展全局属性的对象
        /* istanbul ignore else */

        // 注册 Pinia Devtools（仅在开发环境和客户端时）
        if (__USE_DEVTOOLS__ && IS_CLIENT) {
          registerPiniaDevtools(app, pinia)
        }

        // 安装之前添加的插件
        toBeInstalled.forEach((plugin) => _p.push(plugin))
        toBeInstalled = []
      }
    },

    // 按照插件
    use(plugin) {
      if (!this._a && !isVue2) {
        // 如果还没有安装到应用中，则将插件添加到待安装列表
        toBeInstalled.push(plugin)
      } else {
        // 否则直接添加到已安装插件列表
        _p.push(plugin)
      }
      return this // 链式调用
    },

    // 已安装的插件列表
    _p,
    // it's actually undefined here 关联的应用实例（默认为 null）
    // @ts-expect-error
    _a: null,
    _e: scope,
    // 注册的 store 集合
    _s: new Map<string, StoreGeneric>(),
    state,
  })

  // pinia devtools rely on dev only features so they cannot be forced unless Pinia DevTools仅依靠Dev功能，因此不能被强制强制
  // the dev build of Vue is used. Avoid old browsers like IE11. 使用VUE的开发构建。避免像IE11这样的旧浏览器。
  if (__USE_DEVTOOLS__ && IS_CLIENT && typeof Proxy !== 'undefined') {
    // 如果启用了 Devtools 并且在客户端环境中运行，则添加 devtoolsPlugin 插件
    pinia.use(devtoolsPlugin)
  }

  return pinia
}

/**
 * Dispose a Pinia instance by stopping its effectScope and removing the state, plugins and stores. This is mostly
 * useful in tests, with both a testing pinia or a regular pinia and in applications that use multiple pinia instances.
 * Once disposed, the pinia instance cannot be used anymore.
 *
 * @param pinia - pinia instance
 */
export function disposePinia(pinia: Pinia) {
  pinia._e.stop()
  pinia._s.clear()
  pinia._p.splice(0)
  pinia.state.value = {}
  // @ts-expect-error: non valid
  pinia._a = null
}
