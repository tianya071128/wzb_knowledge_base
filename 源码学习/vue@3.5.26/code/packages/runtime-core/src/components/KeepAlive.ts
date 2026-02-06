import {
  type ComponentInternalInstance,
  type ComponentOptions,
  type ConcreteComponent,
  type SetupContext,
  currentInstance,
  getComponentName,
  getCurrentInstance,
} from '../component'
import {
  Comment,
  type VNode,
  type VNodeProps,
  cloneVNode,
  invokeVNodeHook,
  isSameVNodeType,
  isVNode,
} from '../vnode'
import { warn } from '../warning'
import {
  injectHook,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  onUpdated,
} from '../apiLifecycle'
import {
  ShapeFlags,
  invokeArrayFns,
  isArray,
  isRegExp,
  isString,
  remove,
} from '@vue/shared'
import { watch } from '../apiWatch'
import {
  type ElementNamespace,
  MoveType,
  type RendererElement,
  type RendererInternals,
  type RendererNode,
  invalidateMount,
  queuePostRenderEffect,
} from '../renderer'
import { setTransitionHooks } from './BaseTransition'
import type { ComponentRenderContext } from '../componentPublicInstance'
import { devtoolsComponentAdded } from '../devtools'
import { isAsyncWrapper } from '../apiAsyncComponent'
import { isSuspense } from './Suspense'
import { LifecycleHooks } from '../enums'

type MatchPattern = string | RegExp | (string | RegExp)[]

export interface KeepAliveProps {
  include?: MatchPattern
  exclude?: MatchPattern
  max?: number | string
}

type CacheKey = PropertyKey | ConcreteComponent
type Cache = Map<CacheKey, VNode>
type Keys = Set<CacheKey>

export interface KeepAliveContext extends ComponentRenderContext {
  /** 会在 ../renderer.ts 的 mountComponent 方法创建中组件实例后, 会挂载 instance.ctx.renderer 中 */
  renderer: RendererInternals
  activate: (
    vnode: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    namespace: ElementNamespace,
    optimized: boolean,
  ) => void
  deactivate: (vnode: VNode) => void
}

export const isKeepAlive = (vnode: VNode): boolean =>
  (vnode.type as any).__isKeepAlive

const KeepAliveImpl: ComponentOptions = {
  name: `KeepAlive`,

  // Marker for special handling inside the renderer. We are not using a === 用于渲染器内部特殊处理的标记。我们没有使用 ===
  // check directly on KeepAlive in the renderer, because importing it directly 直接在渲染器中检查KeepAlive，因为是直接导入的
  // would prevent it from being tree-shaken. 可以防止它被摇树。
  __isKeepAlive: true,

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number],
  },

  // KeepAlive的setup函数，接收专属Props和setup上下文
  // KeepAliveProps：包含include/exclude/max三个核心属性，用于控制缓存规则
  // SetupContext：解构出slots，因为KeepAlive是包裹子组件的容器，核心渲染默认插槽

  setup(props: KeepAliveProps, { slots }: SetupContext) {
    // 获取当前KeepAlive组件的内部实例，非空断言：KeepAlive作为内置组件，实例一定存在
    const instance = getCurrentInstance()!

    // KeepAlive communicates with the instantiated renderer via the KeepAlive通过（某种方式）与实例化的渲染器进行通信
    // ctx where the renderer passes in its internals, 在ctx中，渲染器传入其内部组件
    // and the KeepAlive instance exposes activate/deactivate implementations. 而KeepAlive实例则公开了激活/停用实现
    // The whole point of this is to avoid importing KeepAlive directly in the 这样做的全部目的就是为了避免直接导入KeepAlive
    // renderer to facilitate tree-shaking. 渲染器以促进树状结构抖动

    // 核心设计：KeepAlive 与 Vue渲染器通过**实例上下文ctx**通信，而非直接导入
    // 目的：避免渲染器直接依赖KeepAlive，让Tree Shaking可以摇掉未使用的KeepAlive代码
    // 将ctx类型断言为KeepAliveContext（渲染器与KeepAlive的共享上下文类型）
    const sharedContext = instance.ctx as KeepAliveContext

    // if the internal renderer is not registered, it indicates that this is server-side rendering, 如果内部渲染器未注册，则表明这是服务器端渲染
    // for KeepAlive, we just need to render its children 对于KeepAlive组件，我们只需渲染其子组件

    // 服务端渲染(SSR)兼容处理：若为SSR且渲染器未注册
    // KeepAlive在服务端无需缓存（服务端无DOM，一次性渲染），仅直接渲染默认插槽的子节点即可
    if (__SSR__ && !sharedContext.renderer) {
      return () => {
        // 获取默认插槽的子节点
        const children = slots.default && slots.default()
        // 插槽规范：若只有一个子节点，直接返回该节点；否则返回整个子节点数组
        return children && children.length === 1 ? children[0] : children
      }
    }

    // ********** 初始化缓存核心数据结构 **********
    // cache：Map结构，缓存核心容器 → 键(CacheKey)：组件唯一标识；值(VNode)：缓存的组件VNode实例
    const cache: Cache = new Map()
    // keys：Set结构，维护缓存key的**插入顺序**，用于实现LRU(最近最少使用)缓存淘汰策略
    const keys: Keys = new Set()
    // current：记录当前**激活状态**的组件VNode，用于区分“当前组件”和“缓存组件”
    let current: VNode | null = null

    // 开发环境/生产环境开发者工具兼容：将缓存容器暴露到实例上，方便devtools调试查看缓存内容
    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      ;(instance as any).__v_cache = cache
    }

    // 获取父级Suspense边界实例，用于联动Suspense的挂起/恢复逻辑（缓存Suspense子组件时用）
    const parentSuspense = instance.suspense

    // 从共享上下文解构渲染器的**核心内部方法**（渲染器注入到ctx中，与KeepAlive联动）
    // p: patch → 核心更新方法，用于激活组件时更新props/属性
    // m: move → 节点移动方法，用于将缓存组件在「页面容器」和「缓存容器」之间移动
    // um: _unmount → 渲染器原生卸载方法，封装后用于真正卸载缓存组件
    // o.createElement → 平台通用的创建DOM元素方法，用于创建缓存失活组件的隐藏容器
    const {
      renderer: {
        p: patch,
        m: move,
        um: _unmount,
        o: { createElement },
      },
    } = sharedContext
    // 创建**缓存容器DOM**：一个隐藏的<div>，用于存放「失活状态」的组件DOM节点
    // 失活组件并非销毁DOM，而是将DOM移动到该容器中暂存，激活时再移回页面容器
    const storageContainer = createElement('div')

    // ********** 暴露activate方法给渲染器 → 核心：激活缓存的组件 **********
    // 渲染器在检测到VNode有COMPONENT_KEPT_ALIVE标记时，会调用此方法
    // 入参与渲染器核心方法一致，包含要激活的vnode、目标容器、锚点、命名空间、是否优化渲染等
    sharedContext.activate = (
      vnode,
      container,
      anchor,
      namespace,
      optimized,
    ) => {
      const instance = vnode.component!
      move(vnode, container, anchor, MoveType.ENTER, parentSuspense)
      // in case props have changed
      patch(
        instance.vnode,
        vnode,
        container,
        anchor,
        instance,
        parentSuspense,
        namespace,
        vnode.slotScopeIds,
        optimized,
      )
      queuePostRenderEffect(() => {
        instance.isDeactivated = false
        if (instance.a) {
          invokeArrayFns(instance.a)
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }
      }, parentSuspense)

      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        // Update components tree
        devtoolsComponentAdded(instance)
      }
    }

    // ********** 暴露deactivate方法给渲染器 → 核心：失活当前组件（加入缓存） **********
    // 渲染器在检测到VNode有COMPONENT_SHOULD_KEEP_ALIVE标记时，会调用此方法
    // 入参：要失活的组件VNode
    sharedContext.deactivate = (vnode: VNode) => {
      const instance = vnode.component!
      invalidateMount(instance.m)
      invalidateMount(instance.a)

      move(vnode, storageContainer, null, MoveType.LEAVE, parentSuspense)
      queuePostRenderEffect(() => {
        if (instance.da) {
          invokeArrayFns(instance.da)
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }
        instance.isDeactivated = true
      }, parentSuspense)

      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        // Update components tree
        devtoolsComponentAdded(instance)
      }

      // for e2e test
      if (__DEV__ && __BROWSER__) {
        ;(instance as any).__keepAliveStorageContainer = storageContainer
      }
    }

    function unmount(vnode: VNode) {
      // reset the shapeFlag so it can be properly unmounted
      resetShapeFlag(vnode)
      _unmount(vnode, instance, parentSuspense, true)
    }

    function pruneCache(filter: (name: string) => boolean) {
      cache.forEach((vnode, key) => {
        // for async components, name check should be based in its loaded
        // inner component if available
        const name = getComponentName(
          isAsyncWrapper(vnode)
            ? (vnode.type as ComponentOptions).__asyncResolved || {}
            : (vnode.type as ConcreteComponent),
        )
        if (name && !filter(name)) {
          pruneCacheEntry(key)
        }
      })
    }

    function pruneCacheEntry(key: CacheKey) {
      const cached = cache.get(key) as VNode
      if (cached && (!current || !isSameVNodeType(cached, current))) {
        unmount(cached)
      } else if (current) {
        // current active instance should no longer be kept-alive.
        // we can't unmount it now but it might be later, so reset its flag now.
        resetShapeFlag(current)
      }
      cache.delete(key)
      keys.delete(key)
    }

    // prune cache on include/exclude prop change 在包含/排除属性更改时修剪缓存
    // ********** 监听include/exclude属性变化 → 动态修剪缓存 **********
    // 当用户修改include/exclude时，自动过滤缓存，只保留符合新规则的组件
    watch(
      () => [props.include, props.exclude], // 监听的依赖：include和exclude数组/正则/字符串
      ([include, exclude]) => {
        include && pruneCache(name => matches(include, name))
        exclude && pruneCache(name => !matches(exclude, name))
      },
      // prune post-render after `current` has been updated 更新“current”后修剪渲染后
      { flush: 'post', deep: true },
    )

    // cache sub tree after render 渲染后缓存子树
    // ********** 缓存子树核心逻辑 → 在mounted/updated时缓存组件VNode **********
    // 为什么不直接在渲染函数中缓存？因为VNode可能因属性透传/scopeId被克隆，最终挂载的是instance.subTree（标准化后的VNode）
    let pendingCacheKey: CacheKey | null = null // 待缓存的key，由渲染函数赋值
    const cacheSubtree = () => {
      // fix #1621, the pendingCacheKey could be 0
      if (pendingCacheKey != null) {
        // if KeepAlive child is a Suspense, it needs to be cached after Suspense resolves
        // avoid caching vnode that not been mounted
        if (isSuspense(instance.subTree.type)) {
          queuePostRenderEffect(() => {
            cache.set(pendingCacheKey!, getInnerChild(instance.subTree))
          }, instance.subTree.suspense)
        } else {
          cache.set(pendingCacheKey, getInnerChild(instance.subTree))
        }
      }
    }
    onMounted(cacheSubtree)
    onUpdated(cacheSubtree)

    onBeforeUnmount(() => {
      cache.forEach(cached => {
        const { subTree, suspense } = instance
        const vnode = getInnerChild(subTree)
        if (cached.type === vnode.type && cached.key === vnode.key) {
          // current instance will be unmounted as part of keep-alive's unmount
          resetShapeFlag(vnode)
          // but invoke its deactivated hook here
          const da = vnode.component!.da
          da && queuePostRenderEffect(da, suspense)
          return
        }
        unmount(cached)
      })
    })

    // ********** KeepAlive的**核心渲染函数** → 所有缓存逻辑的入口 **********
    // KeepAlive作为函数式组件，setup返回渲染函数，决定最终渲染的内容
    return () => {
      pendingCacheKey = null

      if (!slots.default) {
        return (current = null)
      }

      const children = slots.default()
      const rawVNode = children[0]
      if (children.length > 1) {
        if (__DEV__) {
          warn(`KeepAlive should contain exactly one component child.`)
        }
        current = null
        return children
      } else if (
        !isVNode(rawVNode) ||
        (!(rawVNode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) &&
          !(rawVNode.shapeFlag & ShapeFlags.SUSPENSE))
      ) {
        current = null
        return rawVNode
      }

      let vnode = getInnerChild(rawVNode)
      // #6028 Suspense ssContent maybe a comment VNode, should avoid caching it
      if (vnode.type === Comment) {
        current = null
        return vnode
      }

      const comp = vnode.type as ConcreteComponent

      // for async components, name check should be based in its loaded
      // inner component if available
      const name = getComponentName(
        isAsyncWrapper(vnode)
          ? (vnode.type as ComponentOptions).__asyncResolved || {}
          : comp,
      )

      const { include, exclude, max } = props

      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        // #11717
        vnode.shapeFlag &= ~ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
        current = vnode
        return rawVNode
      }

      const key = vnode.key == null ? comp : vnode.key
      const cachedVNode = cache.get(key)

      // clone vnode if it's reused because we are going to mutate it
      if (vnode.el) {
        vnode = cloneVNode(vnode)
        if (rawVNode.shapeFlag & ShapeFlags.SUSPENSE) {
          rawVNode.ssContent = vnode
        }
      }
      // #1511 it's possible for the returned vnode to be cloned due to attr
      // fallthrough or scopeId, so the vnode here may not be the final vnode
      // that is mounted. Instead of caching it directly, we store the pending
      // key and cache `instance.subTree` (the normalized vnode) in
      // mounted/updated hooks.
      pendingCacheKey = key

      if (cachedVNode) {
        // copy over mounted state
        vnode.el = cachedVNode.el
        vnode.component = cachedVNode.component
        if (vnode.transition) {
          // recursively update transition hooks on subTree
          setTransitionHooks(vnode, vnode.transition!)
        }
        // avoid vnode being mounted as fresh
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
        // make this key the freshest
        keys.delete(key)
        keys.add(key)
      } else {
        keys.add(key)
        // prune oldest entry
        if (max && keys.size > parseInt(max as string, 10)) {
          pruneCacheEntry(keys.values().next().value!)
        }
      }
      // avoid vnode being unmounted
      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE

      current = vnode
      return isSuspense(rawVNode.type) ? rawVNode : vnode
    }
  },
}

const decorate = (t: typeof KeepAliveImpl) => {
  t.__isBuiltIn = true
  return t
}

// export the public type for h/tsx inference 导出公共类型以进行h/tsx类型推断
// also to avoid inline import() in generated d.ts files
export const KeepAlive = (__COMPAT__
  ? /*@__PURE__*/ decorate(KeepAliveImpl)
  : KeepAliveImpl) as any as {
  __isKeepAlive: true
  new (): {
    $props: VNodeProps & KeepAliveProps
    $slots: {
      default(): VNode[]
    }
  }
}

function matches(pattern: MatchPattern, name: string): boolean {
  if (isArray(pattern)) {
    return pattern.some((p: string | RegExp) => matches(p, name))
  } else if (isString(pattern)) {
    return pattern.split(',').includes(name)
  } else if (isRegExp(pattern)) {
    pattern.lastIndex = 0
    return pattern.test(name)
  }
  /* v8 ignore next */
  return false
}

export function onActivated(
  hook: Function,
  target?: ComponentInternalInstance | null,
): void {
  registerKeepAliveHook(hook, LifecycleHooks.ACTIVATED, target)
}

export function onDeactivated(
  hook: Function,
  target?: ComponentInternalInstance | null,
): void {
  registerKeepAliveHook(hook, LifecycleHooks.DEACTIVATED, target)
}

function registerKeepAliveHook(
  hook: Function & { __wdc?: Function },
  type: LifecycleHooks,
  target: ComponentInternalInstance | null = currentInstance,
) {
  // cache the deactivate branch check wrapper for injected hooks so the same
  // hook can be properly deduped by the scheduler. "__wdc" stands for "with
  // deactivation check".
  const wrappedHook =
    hook.__wdc ||
    (hook.__wdc = () => {
      // only fire the hook if the target instance is NOT in a deactivated branch.
      let current: ComponentInternalInstance | null = target
      while (current) {
        if (current.isDeactivated) {
          return
        }
        current = current.parent
      }
      return hook()
    })
  injectHook(type, wrappedHook, target)
  // In addition to registering it on the target instance, we walk up the parent
  // chain and register it on all ancestor instances that are keep-alive roots.
  // This avoids the need to walk the entire component tree when invoking these
  // hooks, and more importantly, avoids the need to track child components in
  // arrays.
  if (target) {
    let current = target.parent
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current)
      }
      current = current.parent
    }
  }
}

function injectToKeepAliveRoot(
  hook: Function & { __weh?: Function },
  type: LifecycleHooks,
  target: ComponentInternalInstance,
  keepAliveRoot: ComponentInternalInstance,
) {
  // injectHook wraps the original for error handling, so make sure to remove
  // the wrapped version.
  const injected = injectHook(type, hook, keepAliveRoot, true /* prepend */)
  onUnmounted(() => {
    remove(keepAliveRoot[type]!, injected)
  }, target)
}

function resetShapeFlag(vnode: VNode) {
  // bitwise operations to remove keep alive flags
  vnode.shapeFlag &= ~ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
  vnode.shapeFlag &= ~ShapeFlags.COMPONENT_KEPT_ALIVE
}

function getInnerChild(vnode: VNode) {
  return vnode.shapeFlag & ShapeFlags.SUSPENSE ? vnode.ssContent! : vnode
}
