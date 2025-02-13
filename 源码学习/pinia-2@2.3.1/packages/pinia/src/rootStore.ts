import {
  App,
  EffectScope,
  inject,
  hasInjectionContext,
  InjectionKey,
  Ref,
} from 'vue-demi'
import {
  StateTree,
  PiniaCustomProperties,
  _Method,
  Store,
  _GettersTree,
  _ActionsTree,
  PiniaCustomStateProperties,
  DefineStoreOptionsInPlugin,
  StoreGeneric,
} from './types'

/**
 * setActivePinia must be called to handle SSR at the top of functions like 必须调用setActivePinia来处理函数顶部的SSR，例如
 * `fetch`, `setup`, `serverPrefetch` and others `fetch、setup、serverPrefetch等
 */
export let activePinia: Pinia | undefined // 活跃的 pinia -- 全局唯一

/**
 * Sets or unsets the active pinia. Used in SSR and internally when calling 设置或取消设置活动小齿轮。用于SSR和内部通话
 * actions and getters 动作和getter
 *
 * @param pinia - Pinia instance
 */
// @ts-expect-error: cannot constrain the type of the return
export const setActivePinia: _SetActivePinia = (pinia) => (activePinia = pinia)

interface _SetActivePinia {
  (pinia: Pinia): Pinia
  (pinia: undefined): undefined
  (pinia: Pinia | undefined): Pinia | undefined
}

/**
 * Get the currently active pinia if there is any.
 */
export const getActivePinia = () =>
  (hasInjectionContext() && inject(piniaSymbol)) || activePinia

/**
 * Every application must own its own pinia to be able to create stores
 */
export interface Pinia {
  install: (app: App) => void

  /**
   * root state 根状态
   */
  state: Ref<Record<string, StateTree>>

  /**
   * Adds a store plugin to extend every store
   *
   * @param plugin - store plugin to add
   */
  use(plugin: PiniaPlugin): Pinia

  /**
   * Installed store plugins 安装的插件
   *
   * @internal
   */
  _p: PiniaPlugin[]

  /**
   * App linked to this Pinia instance 链接到此 PINIA 实例的应用程序
   *
   * @internal
   */
  _a: App

  /**
   * Effect scope the pinia is attached to Effect scope 附加到 Pinia 属性上
   *
   * @internal
   */
  _e: EffectScope

  /**
   * Registry of stores used by this pinia. 该 Pinia 实例注册的 store 集合
   *
   * @internal
   */
  _s: Map<string, StoreGeneric>

  /**
   * Added by `createTestingPinia()` to bypass `useStore(pinia)`.
   *
   * @internal
   */
  _testing?: boolean
}

export const piniaSymbol = (
  __DEV__ ? Symbol('pinia') : /* istanbul ignore next */ Symbol()
) as InjectionKey<Pinia>

/**
 * Context argument passed to Pinia plugins.
 */
export interface PiniaPluginContext<
  Id extends string = string,
  S extends StateTree = StateTree,
  G /* extends _GettersTree<S> */ = _GettersTree<S>,
  A /* extends _ActionsTree */ = _ActionsTree,
> {
  /**
   * pinia instance.
   */
  pinia: Pinia

  /**
   * Current app created with `Vue.createApp()`.
   */
  app: App

  /**
   * Current store being extended.
   */
  store: Store<Id, S, G, A>

  /**
   * Initial options defining the store when calling `defineStore()`.
   */
  options: DefineStoreOptionsInPlugin<Id, S, G, A>
}

/**
 * Plugin to extend every store. 插件以扩展每个商店
 */
export interface PiniaPlugin {
  /**
   * Plugin to extend every store. Returns an object to extend the store or 插件以扩展每个商店。返回一个对象扩展商店或
   * nothing.
   *
   * @param context - Context
   */
  (
    context: PiniaPluginContext
  ): Partial<PiniaCustomProperties & PiniaCustomStateProperties> | void
}

/**
 * Plugin to extend every store.
 * @deprecated use PiniaPlugin instead
 */
export type PiniaStorePlugin = PiniaPlugin
