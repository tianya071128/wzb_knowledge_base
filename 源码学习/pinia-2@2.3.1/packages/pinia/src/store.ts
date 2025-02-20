import {
  watch,
  computed,
  inject,
  hasInjectionContext,
  getCurrentInstance,
  reactive,
  DebuggerEvent,
  WatchOptions,
  UnwrapRef,
  markRaw,
  isRef,
  isReactive,
  effectScope,
  EffectScope,
  ComputedRef,
  toRaw,
  toRef,
  toRefs,
  Ref,
  ref,
  set,
  del,
  nextTick,
  isVue2,
} from 'vue-demi'
import {
  StateTree,
  SubscriptionCallback,
  _DeepPartial,
  isPlainObject,
  Store,
  _Method,
  DefineStoreOptions,
  StoreDefinition,
  _GettersTree,
  MutationType,
  StoreOnActionListener,
  _ActionsTree,
  SubscriptionCallbackMutation,
  DefineSetupStoreOptions,
  DefineStoreOptionsInPlugin,
  StoreGeneric,
  _StoreWithGetters,
  _StoreWithGetters_Readonly,
  _StoreWithGetters_Writable,
  _ExtractActionsFromSetupStore,
  _ExtractGettersFromSetupStore,
  _ExtractStateFromSetupStore,
  _StoreWithState,
} from './types'
import { setActivePinia, piniaSymbol, Pinia, activePinia } from './rootStore'
import { IS_CLIENT } from './env'
import { patchObject } from './hmr'
import { addSubscription, triggerSubscriptions, noop } from './subscriptions'

const fallbackRunWithContext = (fn: () => unknown) => fn()

type _ArrayType<AT> = AT extends Array<infer T> ? T : never

/**
 * Marks a function as an action for `$onAction`
 * @internal
 */
const ACTION_MARKER = Symbol()
/**
 * Action name symbol. Allows to add a name to an action after defining it
 * @internal
 */
const ACTION_NAME = Symbol()
/**
 * Function type extended with action markers
 * @internal
 */
interface MarkedAction<Fn extends _Method = _Method> {
  (...args: Parameters<Fn>): ReturnType<Fn>
  [ACTION_MARKER]: boolean
  [ACTION_NAME]: string
}

/**
 * 合并两个响应式对象，将 patchToApply 合并到 target 中。
 * 支持合并普通对象、Map 和 Set 类型。
 *
 * @param {T} target - 目标对象，类型可以是普通对象、Map 或 Set。
 * @param {_DeepPartial<T>} patchToApply - 要应用的补丁对象，类型与目标对象对应且为深度可选。
 * @returns {T} - 合并后的目标对象。
 */
function mergeReactiveObjects<
  T extends Record<any, unknown> | Map<unknown, unknown> | Set<unknown>,
>(target: T, patchToApply: _DeepPartial<T>): T {
  // Handle Map instances 处理 Map 实例
  if (target instanceof Map && patchToApply instanceof Map) {
    // 遍历 patchToApply 中的每个键值对，并将其设置到 target 中
    patchToApply.forEach((value, key) => target.set(key, value))
  } else if (target instanceof Set && patchToApply instanceof Set) {
    // Handle Set instances 处理 Set 实例
    // 遍历 patchToApply 中的每个值，并将其添加到 target 中
    patchToApply.forEach(target.add, target)
  }

  // no need to go through symbols because they cannot be serialized anyway 无需浏览 symbols，因为它们无论如何都不能序列化
  // 不需要处理 Symbol 类型的属性，因为它们无法被序列化
  // 遍历 patchToApply 中的每个可枚举属性
  for (const key in patchToApply) {
    // 检查该属性是否是 patchToApply 对象自身的属性（不是原型链上的属性)
    if (!patchToApply.hasOwnProperty(key)) continue
    const subPatch = patchToApply[key]
    const targetValue = target[key]

    // 如果是对象的话
    if (
      isPlainObject(targetValue) &&
      isPlainObject(subPatch) &&
      target.hasOwnProperty(key) &&
      !isRef(subPatch) &&
      !isReactive(subPatch)
    ) {
      // NOTE: here I wanted to warn about inconsistent types but it's not possible because in setup stores one might   注意：在这里，我想警告不一致的类型，但这是不可能的，因为在安装存储中，可能会出现不一致的情况
      // start the value of a property as a certain type e.g. a Map, and then for some reason, during SSR, change that 将属性的值设置为特定类型，例如Map，然后出于某种原因，在SSR期间更改该值
      // to `undefined`. When trying to hydrate, we want to override the Map with `undefined`. 变为“未定义”。当试图水合时，我们想用“undefined”覆盖Map。

      // 递归调用 mergeReactiveObjects 合并子对象
      target[key] = mergeReactiveObjects(targetValue, subPatch)
    } else {
      // @ts-expect-error: subPatch is a valid value
      target[key] = subPatch
    }
  }

  return target
}

const skipHydrateSymbol = __DEV__
  ? Symbol('pinia:skipHydration')
  : /* istanbul ignore next */ Symbol()

/**
 * Tells Pinia to skip the hydration process of a given object. This is useful in setup stores (only) when you return a
 * stateful object in the store but it isn't really state. e.g. returning a router instance in a setup store.
 *
 * @param obj - target object
 * @returns obj
 */
export function skipHydrate<T = any>(obj: T): T {
  return Object.defineProperty(obj, skipHydrateSymbol, {})
}

/**
 * Returns whether a value should be hydrated 返回值是否应水合
 *
 * @param obj - target variable
 * @returns true if `obj` should be hydrated
 */
export function shouldHydrate(obj: any) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol)
}

const { assign } = Object

/** 检测是否为一个 Computed */
function isComputed<T>(value: ComputedRef<T> | unknown): value is ComputedRef<T>
function isComputed(o: any): o is ComputedRef {
  return !!(isRef(o) && (o as any).effect)
}

function createOptionsStore<
  Id extends string,
  S extends StateTree,
  G extends _GettersTree<S>,
  A extends _ActionsTree,
>(
  id: Id,
  options: DefineStoreOptions<Id, S, G, A>,
  pinia: Pinia,
  hot?: boolean
): Store<Id, S, G, A> {
  // 从选项中提取出选项
  // state: 数据
  // actions: 相当于组件中的 method。
  // getters: 等同于 store 的 state 的计算值。
  const { state, actions, getters } = options

  // 获取初始状态，如果存在则从 Pinia 的状态中读取
  const initialState: StateTree | undefined = pinia.state.value[id]

  let store: Store<Id, S, G, A>

  // 封装一个 setup 函数, 之后就可以走 setup state 的逻辑
  function setup() {
    // 处理初始化的值, 后续可根据初始化的值重置
    if (!initialState && (!__DEV__ || !hot)) {
      /* istanbul ignore if */
      if (isVue2) {
        set(pinia.state.value, id, state ? state() : {})
      } else {
        pinia.state.value[id] = state ? state() : {}
      }
    }

    // avoid creating a state in pinia.state.value 避免在 pinia.state.value 中创建状态
    // 将 选项式 State 的 state 选项的值响应式
    const localState =
      __DEV__ && hot
        ? // use ref() to unwrap refs inside state 使用ref（）打开状态内的ref
          //  TODO: check if this is still necessary 检查这是否仍然必要
          toRefs(ref(state ? state() : {}).value)
        : toRefs(pinia.state.value[id])

    return assign(
      // 定义的 state 值
      localState,
      // Action 相当于组件中的 method。
      actions,
      // 计算属性, 使用 computed 封装一层
      Object.keys(getters || {}).reduce(
        (computedGetters, name) => {
          // 属性冲突
          if (__DEV__ && name in localState) {
            // getter不能与另一个状态属性同名。重命名其中一个。在存储“${id}”中找到带有“${name}”的内容。
            console.warn(
              `[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`
            )
          }

          computedGetters[name] = markRaw(
            computed(() => {
              setActivePinia(pinia) // 设置当前 pinia
              // it was created just before 它是在刚刚创建的
              const store = pinia._s.get(id)!

              // allow cross using stores 允许交叉使用 stores
              /* istanbul ignore if */
              // 在 vue 中, 还未准备就绪不允许使用
              if (isVue2 && !store._r) return

              // @ts-expect-error
              // return getters![name].call(context, context)
              // TODO: avoid reading the getter while assigning with a global variable
              return getters![name].call(store, store)
            })
          )
          return computedGetters
        },
        {} as Record<string, ComputedRef>
      )
    )
  }

  // 创建并返回 store 实例
  store = createSetupStore(id, setup, options, pinia, hot, true)

  return store as any
}

/**
 * 创建一个带有状态、操作和获取器的 setup store
 */
function createSetupStore<
  Id extends string,
  SS extends Record<any, unknown>,
  S extends StateTree,
  G extends Record<string, _Method>,
  A extends _ActionsTree,
>(
  $id: Id,
  setup: (helpers: SetupStoreHelpers) => SS,
  options:
    | DefineSetupStoreOptions<Id, S, G, A>
    | DefineStoreOptions<Id, S, G, A> = {},
  pinia: Pinia,
  hot?: boolean,
  // 是否为 选项式 store
  isOptionsStore?: boolean
): Store<Id, S, G, A> {
  // 通过 effectScope() 创建的 effect 作用域
  let scope!: EffectScope

  // 合并默认的 actions 和传入的 options
  const optionsForPlugin: DefineStoreOptionsInPlugin<Id, S, G, A> = assign(
    { actions: {} as A },
    options
  )

  // 在开发模式下检查 Pinia 实例是否已销毁
  /* istanbul ignore if */
  if (__DEV__ && !pinia._e.active) {
    throw new Error('Pinia destroyed')
  }

  // watcher options for $subscribe 观察者的选项
  const $subscribeOptions: WatchOptions = { deep: true }
  /* istanbul ignore else */
  if (__DEV__ && !isVue2) {
    // 侦听器的调试器: https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#watcher-debugging
    // onTrigger: 将在侦听器回调被依赖项的变更触发时被调用。
    $subscribeOptions.onTrigger = (event) => {
      /* istanbul ignore else */
      if (isListening) {
        debuggerEvents = event
        // avoid triggering this while the store is being built and the state is being set in pinia 避免在 store 建造时触发此触发，并在PINIA中设置状态
      } else if (isListening == false && !store._hotUpdating) {
        // let patch send all the events together later 请稍后将所有事件发送在一起
        /* istanbul ignore else */
        if (Array.isArray(debuggerEvents)) {
          debuggerEvents.push(event)
        } else {
          console.error(
            '🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.' // debuggerevents 应该是一个数组。这很可能是一个内部Pinia错误
          )
        }
      }
    }
  }

  // internal state 内部状态变量
  let isListening: boolean // set to true at the end 最后设置为true - 用于控制变更状态时是直接变更 $patch 变更
  let isSyncListening: boolean // set to true at the end 最后设置为true - 用于控制变更状态时是直接变更 $patch 变更
  let subscriptions: SubscriptionCallback<S>[] = []
  // 当一个 action 即将被调用时之前执行的回调集合
  let actionSubscriptions: StoreOnActionListener<Id, S, G, A>[] = []
  let debuggerEvents: DebuggerEvent[] | DebuggerEvent

  // 初始状态值
  const initialState = pinia.state.value[$id] as UnwrapRef<S> | undefined

  // avoid setting the state for option stores if it is set 如果设置了选项商店的状态，请避免设置状态
  // by the setup 通过设置
  // 如果 store 不是选项式 API 且没有初始状态，则初始化状态
  if (!isOptionsStore && !initialState && (!__DEV__ || !hot)) {
    /* istanbul ignore if */
    if (isVue2) {
      set(pinia.state.value, $id, {})
    } else {
      pinia.state.value[$id] = {}
    }
  }

  const hotState = ref({} as S)

  // $patch: 将一个 state 补丁应用于当前状态。允许传递嵌套值 | 将多个变更分组到一个函数中。
  // https://pinia.vuejs.org/zh/api/interfaces/pinia._StoreWithState.html#patch
  // avoid triggering too many listeners 避免触发过多的监听器
  // https://github.com/vuejs/pinia/issues/1129
  let activeListener: Symbol | undefined
  function $patch(stateMutation: (state: UnwrapRef<S>) => void): void
  function $patch(partialState: _DeepPartial<UnwrapRef<S>>): void
  function $patch(
    partialStateOrMutator:
      | _DeepPartial<UnwrapRef<S>>
      | ((state: UnwrapRef<S>) => void)
  ): void {
    let subscriptionMutation: SubscriptionCallbackMutation<S>
    isListening = isSyncListening = false
    // reset the debugger events since patches are sync 重置调试器事件，因为补丁是同步的
    /* istanbul ignore else */
    if (__DEV__) {
      debuggerEvents = []
    }
    // 如果是函数形式
    if (typeof partialStateOrMutator === 'function') {
      partialStateOrMutator(pinia.state.value[$id] as UnwrapRef<S>)
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents as DebuggerEvent[],
      }
    }
    // 传入值为对象形式
    else {
      // 将传入对象合并到 state 中
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator)

      // 构建订阅回调所需的变更信息对象，类型为 patchObject
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents as DebuggerEvent[],
      }
    }
    // 生成一个唯一的监听器 ID，用于确保在异步操作中正确恢复监听
    const myListenerId = (activeListener = Symbol())
    nextTick().then(() => {
      // 检查当前的活动监听器 ID 是否与之前生成的 ID 相同
      if (activeListener === myListenerId) {
        isListening = true
      }
    })

    // 恢复同步监听
    isSyncListening = true

    // because we paused the watcher, we need to manually call the subscriptions 因为我们暂停了观察者，所以我们需要手动致电订阅
    // 手动触发订阅回调，通知所有订阅者状态已发生变更
    triggerSubscriptions(
      subscriptions,
      subscriptionMutation,
      pinia.state.value[$id] as UnwrapRef<S>
    )
  }

  const $reset = isOptionsStore
    ? function $reset(this: _StoreWithState<Id, S, G, A>) {
        const { state } = options as DefineStoreOptions<Id, S, G, A>
        const newState: _DeepPartial<UnwrapRef<S>> = state ? state() : {}
        // we use a patch to group all changes into one single subscription
        this.$patch(($state) => {
          // @ts-expect-error: FIXME: shouldn't error?
          assign($state, newState)
        })
      }
    : /* istanbul ignore next */
      __DEV__
      ? () => {
          throw new Error(
            `🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().` // Store "{id}" 是使用组合式语法构建的，未实现 $reset() 方法。
          )
        }
      : noop

  /**
   * 停止 store 的相关作用域，并从 store 注册表中删除它。
   *  https://pinia.vuejs.org/zh/api/interfaces/pinia._StoreWithState.html#dispose
   */
  function $dispose() {
    // 停止 watch 等的副作用
    scope.stop()
    subscriptions = []
    actionSubscriptions = []
    pinia._s.delete($id) // 从 store 注册表中删除它
  }

  /**
   * 对 action 选项的函数进行封装处理
   * Helper that wraps function so it can be tracked with $onAction 该包裹功能的助手，因此可以通过$ ONATICA进行跟踪
   * @param fn - action to wrap 包裹的 action
   * @param name - name of the action 动作的名称
   */
  const action = <Fn extends _Method>(fn: Fn, name: string = ''): Fn => {
    // 检测是否处理过, 无需重复处理
    if (ACTION_MARKER in fn) {
      // we ensure the name is set from the returned function 我们确保从返回的函数设置名称
      ;(fn as unknown as MarkedAction<Fn>)[ACTION_NAME] = name
      return fn
    }

    // 对 action 进行封装一层
    // 主要在 action 执行之前, 执行失败, 执行之后执行相关回调
    const wrappedAction = function (this: any) {
      setActivePinia(pinia) // 设置活跃 Pinia
      const args = Array.from(arguments)

      const afterCallbackList: Array<(resolvedReturn: any) => any> = []
      const onErrorCallbackList: Array<(error: unknown) => unknown> = []
      // 添加 after 执行之后的回调
      function after(callback: _ArrayType<typeof afterCallbackList>) {
        afterCallbackList.push(callback)
      }
      // 添加当 action 执行失败之后的回调
      function onError(callback: _ArrayType<typeof onErrorCallbackList>) {
        onErrorCallbackList.push(callback)
      }

      // 执行 action 之前的回调，通常为插件执行
      // @ts-expect-error
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError,
      })

      // 执行 action
      let ret: unknown
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args)
        // handle sync errors
      } catch (error) {
        // action 失败之后执行的回调
        triggerSubscriptions(onErrorCallbackList, error)
        throw error
      }

      // 如果 ret 结果值 为 Promise, 等待结果之后执行成功和失败之后的回调
      if (ret instanceof Promise) {
        return ret
          .then((value) => {
            triggerSubscriptions(afterCallbackList, value)
            return value
          })
          .catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error)
            return Promise.reject(error)
          })
      }

      // trigger after callbacks
      triggerSubscriptions(afterCallbackList, ret)
      return ret
    } as MarkedAction<Fn>

    wrappedAction[ACTION_MARKER] = true
    wrappedAction[ACTION_NAME] = name // will be set later 将稍后设置

    // @ts-expect-error: we are intentionally limiting the returned type to just Fn 我们故意将返回的类型限制为仅 FN
    // because all the added properties are internals that are exposed through `$onAction()` only 因为所有添加的属性都是通过 `$onAction()` 暴露的内部属性
    return wrappedAction
  }

  const _hmrPayload = /*#__PURE__*/ markRaw({
    actions: {} as Record<string, any>,
    getters: {} as Record<string, Ref>,
    state: [] as string[],
    hotState,
  })

  // 部分响应式的值,主要是一些操作方法
  const partialStore = {
    // 会被 markRaw 标记为不可代理
    _p: pinia,
    // _s: scope,
    $id,
    // 通过调用此方法，可以在一个 action 即将被调用时，添加回调
    // https://pinia.vuejs.org/zh/api/interfaces/pinia._StoreWithState.html#onaction
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    /**
     * 设置一个回调，当状态发生变化时被调用:
     *  - 直接修改状态, store.count++ 时, 会在下面执行 watch
     *  - 通过 $patch 方法时, 会在 $patch 方法中触发, 此时会根据 isSyncListening 或 isListening 来控制
     */
    $subscribe(callback, options = {}) {
      const removeSubscription = addSubscription(
        subscriptions,
        callback,
        options.detached,
        () => stopWatcher()
      )
      const stopWatcher = scope.run(() =>
        watch(
          () => pinia.state.value[$id] as UnwrapRef<S>,
          (state) => {
            if (options.flush === 'sync' ? isSyncListening : isListening) {
              callback(
                {
                  storeId: $id,
                  type: MutationType.direct,
                  events: debuggerEvents as DebuggerEvent,
                },
                state
              )
            }
          },
          assign({}, $subscribeOptions, options)
        )
      )!

      return removeSubscription
    },
    $dispose,
  } as _StoreWithState<Id, S, G, A>

  /* istanbul ignore if */
  if (isVue2) {
    // start as non ready 从准备就绪开始
    partialStore._r = false
  }

  // store 值, 使用 reactive 响应式
  const store: Store<Id, S, G, A> = reactive(
    __DEV__ || (__USE_DEVTOOLS__ && IS_CLIENT)
      ? assign(
          {
            _hmrPayload,
            _customProperties: markRaw(new Set<string>()), // devtools custom properties DevTools自定义属性
          },
          partialStore
          // must be added later 必须稍后添加
          // setupStore
        )
      : partialStore
  ) as unknown as Store<Id, S, G, A>

  // store the partial store now so the setup of stores can instantiate each other before they are finished without 现在存储部分存储，这样存储的设置就可以在完成之前相互实例化，而无需
  // creating infinite loops. 创建无限循环。
  pinia._s.set($id, store as Store)

  // 对应 vue3 中的 runWithContext 方法 -- 使用当前应用作为注入上下文执行回调函数。
  // https://cn.vuejs.org/api/application.html#app-runwithcontext
  const runWithContext =
    (pinia._a && pinia._a.runWithContext) || fallbackRunWithContext

  // TODO: idea create skipSerialize that marks properties as non serializable and they are skipped 创意创建skipSerialize，将属性标记为不可序列化，并跳过它们
  /**
   * 调用 setup 获取到其中的 state 值以及其他, 并且收集到其中的响应式副作用
   *  - 对于 选项式 Store, 会封装一个 setup 函数, 将其中的 state、getter、action 封装一层
   *  - 对于 组合式 store, 直接调用客户传入的 setup 函数
   */
  const setupStore = runWithContext(() =>
    pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))!)
  )!

  // overwrite existing actions to support $onAction 覆盖现有的措施以支持 $onAction
  // 遍历 setupStore 属性, 对于值进行额外操作
  for (const key in setupStore) {
    const prop = setupStore[key]

    // 该属性是一个 Ref, 但不是一个 Computed  或者 是一个 reactive 响应式对象
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      // mark it as a piece of state to be serialized 将其标记为要序列化的状态
      if (__DEV__ && hot) {
        // 如果是 hot 下, 在值添加到 hotState 中
        set(hotState.value, key, toRef(setupStore, key))
        // createOptionStore directly sets the state in pinia.state.value so we createOptionStore 直接在 pinia.state.value 中设置状态，因此我们
        // can just skip that 可以跳过这个
      }
      // 当是 组合式state 时
      else if (!isOptionsStore) {
        // in setup stores we must hydrate the state and sync pinia state tree with the refs the user just created 在设置存储中，我们必须对状态进行水合处理，并将pinia状态树与用户刚刚创建的ref同步
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key as keyof UnwrapRef<S>]
          } else {
            // probably a reactive object, lets recursively assign
            // @ts-expect-error: prop is unknown
            mergeReactiveObjects(prop, initialState[key])
          }
        }
        // transfer the ref to the pinia state to keep everything in sync 将ref转换为pinia状态，以保持一切同步
        /* istanbul ignore if */
        if (isVue2) {
          set(pinia.state.value[$id], key, prop)
        } else {
          pinia.state.value[$id][key] = prop
        }
      }

      /* istanbul ignore else */
      if (__DEV__) {
        _hmrPayload.state.push(key)
      }
    }
    // 处理 action 选项
    else if (typeof prop === 'function') {
      // 对 action 方法进行封装一层
      const actionValue = __DEV__ && hot ? prop : action(prop as _Method, key)
      // this a hot module replacement store because the hotUpdate method needs 这是一个热模块替换商店，因为Hotupdate方法需要
      // to do it with the right context 在正确的环境中做到这一点
      /* istanbul ignore if */
      // 在 vue2 和 vue3 赋值方式不同
      if (isVue2) {
        set(setupStore, key, actionValue)
      } else {
        // @ts-expect-error
        setupStore[key] = actionValue
      }

      /* istanbul ignore else */
      if (__DEV__) {
        _hmrPayload.actions[key] = prop
      }

      // list actions so they can be used in plugins
      // @ts-expect-error
      optionsForPlugin.actions[key] = prop
    }
    // 主要处理 Computed 属性, 在开发模式下处理一些内容
    else if (__DEV__) {
      // add getters for devtools 为DevTool添加Getters
      if (isComputed(prop)) {
        _hmrPayload.getters[key] = isOptionsStore
          ? // @ts-expect-error
            options.getters[key]
          : prop
        if (IS_CLIENT) {
          const getters: string[] =
            (setupStore._getters as string[]) ||
            // @ts-expect-error: same
            ((setupStore._getters = markRaw([])) as string[])
          getters.push(key)
        }
      }
    }
  }

  // add the state, getters, and action properties 添加 state, getters和 action 属性
  /* istanbul ignore if */
  if (isVue2) {
    Object.keys(setupStore).forEach((key) => {
      set(store, key, setupStore[key])
    })
  } else {
    // 在 vue3 中, 直接添加进 store 对象中, 会自动进行响应式关联
    // 因为 store 是一个 reactive, 会自动链接 setupStore 中的 ref 值
    assign(store, setupStore)
    // allows retrieving reactive objects with `storeToRefs()`. Must be called after assigning to the reactive object. 允许使用`storeTorefs（）`检索反应性对象。分配给反应对象后必须调用
    // Make `storeToRefs()` work with `reactive()` #799
    assign(toRaw(store), setupStore)
  }

  // use this instead of a computed with setter to be able to create it anywhere 使用this而不是使用setter计算，以便能够在任何地方创建它
  // without linking the computed lifespan to wherever the store is first 而不将计算出的寿命与商店的第一个位置联系起来
  // created. 创建
  // 建立一个 $state 属性:Store 的 State。给它赋值可替换整个 state。
  // https://pinia.vuejs.org/zh/api/interfaces/pinia._StoreWithState.html#state
  Object.defineProperty(store, '$state', {
    get: () => (__DEV__ && hot ? hotState.value : pinia.state.value[$id]),
    set: (state) => {
      /* istanbul ignore if */
      if (__DEV__ && hot) {
        throw new Error('cannot set hotState')
      }
      $patch(($state) => {
        // @ts-expect-error: FIXME: shouldn't error?
        assign($state, state)
      })
    },
  })

  // add the hotUpdate before plugins to allow them to override it 在插件之前添加hotupdate，以允许它们覆盖它
  /* istanbul ignore else */
  if (__DEV__) {
    /**
     * hot 更新方法
     *  调用者 store 为旧的 store, 但是里面的数据是最新的
     *  newStore: 最新的 store, 但是里面的数据是初始值, 因为是根据新模块重新创建的 store
     */
    store._hotUpdate = markRaw((newStore) => {
      store._hotUpdating = true // 标识正在 hot 更新

      // 类似于 ['n', 'incrementedTimes', 'decrementedTimes', 'numbers']
      // 只对数据进行处理，计算属性以及action在这里不做处理
      newStore._hmrPayload.state.forEach((stateKey) => {
        if (stateKey in store.$state) {
          const newStateTarget = newStore.$state[stateKey] // 新的 state 对应 key 的值
          const oldStateSource = store.$state[stateKey as keyof UnwrapRef<S>] // 旧的

          // 如果是对象的话, 则比对对象处理
          if (
            typeof newStateTarget === 'object' &&
            isPlainObject(newStateTarget) &&
            isPlainObject(oldStateSource)
          ) {
            patchObject(newStateTarget, oldStateSource)
          } else {
            // transfer the ref
            newStore.$state[stateKey] = oldStateSource
          }
        }
        // patch direct access properties to allow store.stateProperty to work as 补丁直接访问属性允许 Store.StateProperty 作为工作
        // store.$state.stateProperty
        set(store, stateKey, toRef(newStore.$state, stateKey))
      })

      // remove deleted state properties 删除已删除的状态属性
      Object.keys(store.$state).forEach((stateKey) => {
        if (!(stateKey in newStore.$state)) {
          del(store, stateKey)
        }
      })

      // avoid devtools logging this as a mutation 避免将其记录为突变
      // 将 isListening、isSyncListening 置为 false, 这样的话, 即使更新 state, 也不会触发更新回调
      isListening = false
      isSyncListening = false
      pinia.state.value[$id] = toRef(newStore._hmrPayload, 'hotState')
      isSyncListening = true
      nextTick().then(() => {
        isListening = true
      })

      // 处理 action
      for (const actionName in newStore._hmrPayload.actions) {
        const actionFn: _Method = newStore[actionName]

        set(store, actionName, action(actionFn, actionName))
      }

      // TODO: does this work in both setup and option store? 这在设置和选项商店中是否有效?
      // 处理  Getter 选项
      for (const getterName in newStore._hmrPayload.getters) {
        const getter: _Method = newStore._hmrPayload.getters[getterName]
        const getterValue = isOptionsStore
          ? // special handling of options api
            computed(() => {
              setActivePinia(pinia)
              return getter.call(store, store)
            })
          : getter

        set(store, getterName, getterValue)
      }

      // remove deleted getters 删除已删除的Getters
      Object.keys(store._hmrPayload.getters).forEach((key) => {
        if (!(key in newStore._hmrPayload.getters)) {
          del(store, key)
        }
      })

      // remove old actions 删除已删除的 actions
      Object.keys(store._hmrPayload.actions).forEach((key) => {
        if (!(key in newStore._hmrPayload.actions)) {
          del(store, key)
        }
      })

      // update the values used in devtools and to allow deleting new properties later on 更新DevTools中使用的值，并允许以后删除新属性
      store._hmrPayload = newStore._hmrPayload
      store._getters = newStore._getters
      store._hotUpdating = false
    })
  }

  // 避免在Devtools中列出内部属性
  if (__USE_DEVTOOLS__ && IS_CLIENT) {
    const nonEnumerable = {
      writable: true,
      configurable: true,
      // avoid warning on devtools trying to display this property 避免在试图显示此属性的DevTools上警告
      enumerable: false,
    }

    // avoid listing internal properties in devtools 避免在Devtools中列出内部属性
    ;(['_p', '_hmrPayload', '_getters', '_customProperties'] as const).forEach(
      (p) => {
        Object.defineProperty(
          store,
          p,
          assign({ value: store[p] }, nonEnumerable)
        )
      }
    )
  }

  /* istanbul ignore if */
  if (isVue2) {
    // mark the store as ready before plugins 在插件之前将store标记为准备就绪
    store._r = true
  }

  // apply all plugins 应用所有插件
  pinia._p.forEach((extender) => {
    /* istanbul ignore else */
    if (__USE_DEVTOOLS__ && IS_CLIENT) {
      const extensions = scope.run(() =>
        extender({
          store: store as Store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin,
        })
      )!
      Object.keys(extensions || {}).forEach((key) =>
        store._customProperties.add(key)
      )
      assign(store, extensions)
    } else {
      assign(
        store,
        scope.run(() =>
          extender({
            store: store as Store,
            app: pinia._a,
            pinia,
            options: optionsForPlugin,
          })
        )!
      )
    }
  })

  if (
    __DEV__ &&
    store.$state &&
    typeof store.$state === 'object' &&
    typeof store.$state.constructor === 'function' &&
    !store.$state.constructor.toString().includes('[native code]')
  ) {
    console.warn(
      `[🍍]: The "state" must be a plain object. It cannot be\n` + //  “状态”必须是一个普通对象。不可能
        `\tstate: () => new MyClass()\n` + // state: () => new MyClass()
        `Found in store "${store.$id}".` // Found in store
    )
  }

  // only apply hydrate to option stores with an initial state in pinia 仅将 hydrate应用于 PINIA 初始状态的初始存储
  // 处理 hydrate 选项
  // https://pinia.vuejs.org/zh/api/interfaces/pinia.DefineStoreOptionsInPlugin.html#hydrate
  if (
    initialState &&
    isOptionsStore &&
    (options as DefineStoreOptions<Id, S, G, A>).hydrate
  ) {
    ;(options as DefineStoreOptions<Id, S, G, A>).hydrate!(
      store.$state,
      initialState
    )
  }

  isListening = true
  isSyncListening = true
  return store
}

/**
 * Extract the actions of a store type. Works with both a Setup Store or an
 * Options Store.
 */
export type StoreActions<SS> =
  SS extends Store<string, StateTree, _GettersTree<StateTree>, infer A>
    ? A
    : _ExtractActionsFromSetupStore<SS>

/**
 * Extract the getters of a store type. Works with both a Setup Store or an
 * Options Store.
 */
export type StoreGetters<SS> =
  SS extends Store<string, StateTree, infer G, _ActionsTree>
    ? _StoreWithGetters<G>
    : _ExtractGettersFromSetupStore<SS>

/**
 * Extract the state of a store type. Works with both a Setup Store or an
 * Options Store. Note this unwraps refs.
 */
export type StoreState<SS> =
  SS extends Store<string, infer S, _GettersTree<StateTree>, _ActionsTree>
    ? UnwrapRef<S>
    : _ExtractStateFromSetupStore<SS>

export interface SetupStoreHelpers {
  action: <Fn extends _Method>(fn: Fn) => Fn
}

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param id - id of the store (must be unique)
 * @param options - options to define the store
 */
export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends _GettersTree<S> = {},
  // cannot extends ActionsTree because we loose the typings
  A /* extends ActionsTree */ = {},
>(
  id: Id,
  options: Omit<DefineStoreOptions<Id, S, G, A>, 'id'>
): StoreDefinition<Id, S, G, A>

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param options - options to define the store
 *
 * @deprecated use `defineStore(id, options)` instead
 */
export function defineStore<
  Id extends string,
  S extends StateTree = {},
  G extends _GettersTree<S> = {},
  // cannot extends ActionsTree because we loose the typings
  A /* extends ActionsTree */ = {},
>(options: DefineStoreOptions<Id, S, G, A>): StoreDefinition<Id, S, G, A>

/**
 * Creates a `useStore` function that retrieves the store instance
 *
 * @param id - id of the store (must be unique)
 * @param storeSetup - function that defines the store
 * @param options - extra options
 */
export function defineStore<Id extends string, SS>(
  id: Id,
  storeSetup: (helpers: SetupStoreHelpers) => SS,
  options?: DefineSetupStoreOptions<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
  >
): StoreDefinition<
  Id,
  _ExtractStateFromSetupStore<SS>,
  _ExtractGettersFromSetupStore<SS>,
  _ExtractActionsFromSetupStore<SS>
>
// allows unused stores to be tree shaken 允许未使用的商店被树摇
/*! #__NO_SIDE_EFFECTS__ */
export function defineStore(
  // TODO: add proper types from above 从上面添加适当的类型
  idOrOptions: any,
  setup?: any,
  setupOptions?: any
): StoreDefinition {
  let id: string
  let options:
    | DefineStoreOptions<
        string,
        StateTree,
        _GettersTree<StateTree>,
        _ActionsTree
      >
    | DefineSetupStoreOptions<
        string,
        StateTree,
        _GettersTree<StateTree>,
        _ActionsTree
      >

  // 与 Vue 组合式 API 的 setup 函数 相似，我们可以传入一个函数，该函数定义了一些响应式属性和方法，并且返回一个带有我们想暴露出去的属性和方法的对象。
  // https://pinia.vuejs.org/zh/core-concepts/#setup-stores
  const isSetupStore = typeof setup === 'function'

  /**
   * 规范参数 id 和 options
   */

  // 第一个参数为 id, 大多数情况
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    // the option store setup will contain the actual options in this case 在这种情况下，选项存储的设置将包含实际选项
    options = isSetupStore ? setupOptions : setup
  } else {
    options = idOrOptions
    id = idOrOptions.id // 取出 id

    if (__DEV__ && typeof id !== 'string') {
      throw new Error(
        `[🍍]: "defineStore()" must be passed a store id as its first argument.` // [🍍]：“ defenestore（）”必须通过商店ID作为其第一个参数
      )
    }
  }

  /**
   * 创建并返回一个store实例
   *
   * 该函数负责根据提供的ID和配置选项创建并返回一个store实例
   * 它会检查是否已经存在具有相同ID的store，如果不存在，则创建一个新的store实例
   *
   * @param pinia - (可选)Pinia实例
   * @param hot - (可选)用于热模块替换的store泛型
   * @returns 返回创建的store实例
   */
  function useStore(pinia?: Pinia | null, hot?: StoreGeneric): StoreGeneric {
    // 如果 inject() 可以在错误的地方 (例如 setup() 之外) 被调用而不触发警告，则返回 true。此方法适用于希望在内部使用 inject() 而不向用户发出警告的库。
    // https://cn.vuejs.org/api/composition-api-dependency-injection.html#has-injection-context
    const hasContext = hasInjectionContext()

    // 取出对应的 Pinia 实例
    pinia =
      // in test mode, ignore the argument provided as we can always retrieve a 在测试模式下，忽略提供的参数，因为我们总是可以检索
      // pinia instance with getActivePinia() 带有getActivePinia（）的pinia实例

      // __TEST__: 正式打包成库文件时会被替换成 process.env.NODE_ENV === 'test'
      (__TEST__ && activePinia && activePinia._testing ? null : pinia) ||
      (hasContext ? inject(piniaSymbol, null) : null)

    // 设置活跃的 Pinia 实例
    if (pinia) setActivePinia(pinia)

    if (__DEV__ && !activePinia) {
      /**
       * [🍍]：“ getActivepinia（）”，但没有活跃的pinia。您是否在调用“ app.use（pinia）”之前要使用商店？
       * 请参阅https://pinia.vuejs.s.org/core-concepts/outside-component-usage.html提供帮助。
       * 这将失败。
       */
      throw new Error(
        `[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?\n` +
          `See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.\n` +
          `This will fail in production.`
      )
    }

    pinia = activePinia!

    // 如果还没有创建具有相同ID的store，则创建一个新的store实例。
    // 相同 id 只会创建一次
    if (!pinia._s.has(id)) {
      // creating the store registers it in `pinia._s` 创建 store 会将其注册到 pinia._s

      if (isSetupStore) {
        // setup store 语法
        createSetupStore(id, setup, options, pinia)
      } else {
        // Option Store 语法
        createOptionsStore(id, options as any, pinia)
      }

      /* istanbul ignore else */
      // 如果是开发环境, 则引用 Pinia
      if (__DEV__) {
        // @ts-expect-error: not the right inferred type
        useStore._pinia = pinia
      }
    }

    const store: StoreGeneric = pinia._s.get(id)!
    // 开发环境下, 如果是 HMR 的, 走这个逻辑
    if (__DEV__ && hot) {
      // 重建一个 Store, id标识加上特殊标识
      const hotId = '__hot:' + id
      const newStore = isSetupStore
        ? createSetupStore(hotId, setup, options, pinia, true)
        : createOptionsStore(hotId, assign({}, options) as any, pinia, true)

      // 调用 _hotUpdate 方法更新旧的 store
      hot._hotUpdate(newStore)

      // 使用完后将其销毁
      // cleanup the state properties and the store from the cache 清理状态属性和从缓存中的商店
      delete pinia.state.value[hotId]
      pinia._s.delete(hotId)
    }

    if (__DEV__ && IS_CLIENT) {
      // 获取当前活跃组件
      const currentInstance = getCurrentInstance()
      // save stores in instances to access them devtools 在实例中保存商店，以访问它们
      if (
        currentInstance &&
        currentInstance.proxy &&
        // avoid adding stores that are just built for hot module replacement 避免添加仅用于热模块更换的商店
        !hot
      ) {
        const vm = currentInstance.proxy
        const cache = '_pStores' in vm ? vm._pStores! : (vm._pStores = {})
        cache[id] = store
      }
    }

    // StoreGeneric cannot be casted towards Store StoreGeneric 不能转换为 Store
    return store as any
  }

  useStore.$id = id // 绑定 id

  // 返回 store 实例供给外部调用
  return useStore
}

/**
 * Return type of `defineStore()` with a setup function.
 * - `Id` is a string literal of the store's name
 * - `SS` is the return type of the setup function
 * @see {@link StoreDefinition}
 */
export interface SetupStoreDefinition<Id extends string, SS>
  extends StoreDefinition<
    Id,
    _ExtractStateFromSetupStore<SS>,
    _ExtractGettersFromSetupStore<SS>,
    _ExtractActionsFromSetupStore<SS>
  > {}
