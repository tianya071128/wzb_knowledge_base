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
  /** 通过在 setup 中挂载在 instance.ctx 中, 用于在外部调用 activate 钩子 */
  activate: (
    vnode: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    namespace: ElementNamespace,
    optimized: boolean,
  ) => void
  /** 通过在 setup 中挂载在 instance.ctx 中, 用于在外部调用 deactivate 钩子 */
  deactivate: (vnode: VNode) => void
}

export const isKeepAlive = (vnode: VNode): boolean =>
  (vnode.type as any).__isKeepAlive

/**
 * KeepAlive 内部组件:
 *  - 0. 注意:
 *        -- 1. 最重要的会给需要缓存的组件添加标记, 这样在首次挂载和卸载时执行 sharedContext.activate 和 sharedContext.deactivate 方法走自定义逻辑
 *        -- 2. 如果不是缓存组件, 那么就会走普通组件的渲染和卸载逻辑, 与默认逻辑一致
 *        -- 3. 失活组件的卸载(不在需要缓存)会手动调用直接调用注入的 unmount 方法, 也就是vnode卸载的统一方法
 *        -- 4. 操作层面是操作组件VNode, 当激活或失活时, 不执行 VNode 的卸载逻辑, 所以 VNode 的状态还是保持不变的
 *
 *  - 1. KeepAlive 组件本身的渲染和卸载都比较遵循一般的卸载, 通过注册声明周期来完成其他工作
 *  - 2. 在 KeepAlive 的渲染函数中(通过 steup 返回的函数)
 *        -- 2.1 如果生成 slots.default() 默认插槽的第一个子节点 --> 必须为状态组件
 *        -- 2.2 通过组件name来匹配是否需要缓存
 *        -- 2.3 如果不需要缓存
 *               - 清理相关标记, 直接返回组件VNode, 后续这个组件VNode, 按照组件的正常流程渲染和卸载即可
 *        -- 2.4 缓存key
 *                --- 1. vnode.key（用户自定义）
 *                --- 2. 组件定义comp
 *        -- 2.5 从缓存Map中提取缓存
 *            --- 命中缓存: 复用 DOM, 兼容transition
 *                         添加 **vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE**
 *            --- 未命中缓存: 处理缓存数量是否受限
 *            --- 统一添加标记**vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE**
 *                标记需要缓存, 卸载时根据该标记不会走卸载逻辑
 *        -- 2.6 返回组件VNode, 后续会根据标记来执行组件的挂载和卸载
 *        -- 注意: 最重要的是在给组件VNode添加标记，从而在组件的挂载和卸载中执行相应的逻辑
 *  - 3. 需要缓存的组件的渲染
 *        -- 3.1 在上述会给组件VNode添加标记, 之后渲染组件的时候, 会调用 KeepAlive 注入的 sharedContext.activate 方法挂载
 *               在 ../renderer.ts 的 processComponent 方法中
 *        -- 3.2 调用注入的 patch 方法执行 vnode 渲染
 *               会从 vnode.component 中提取组件实例, 继而从 instance.vnode 中提取缓存的旧VNode --> 初始挂载没有就是新增
 *        -- 3.3 在异步队列中, 标记组件为「非失活状态」并执行 onActivated 钩子
 *  - 4. 需要缓存的组件的失活
 *        -- 4.1 在给组件VNode添加标记, 之后在卸载组件的方法时, 会调用 KeepAlive 注入的 sharedContext.deactivate 方法失活
 *               在 ../renderer.ts 的 unmount 函数中
 *        -- 4.2 将 DOM 移动到缓存容器中
 *        -- 4.3 在异步队列中, 标记组件为「失活状态」并执行 onDeactivated 钩子
 *  - 5. 子孙组件注册 onActivated 和 onDeactivated 声明周期
 *        -- 5.1 通过下面的 onActivated 和 onDeactivated 方法注册
 *        -- 5.2 核心设计是将子孙组件的这两个声明周期也同时注册到缓存组件(KeepAlive组件下的缓存组件, 注意区分与KeepAlive组件本省的区别)
 *                这样设计也避免每次执行的时候动态查找
 *        -- 5.3 这样在上面的缓存组件渲染和失活调用声明周期钩子的时候, 子孙组件的声明周期钩子也会被调用
 *  - 6. include、exclude、max 控件缓存行为
 *        -- 6.1 当检测到不需要缓存时(通过组件name匹配), 会将缓存的组件执行组件卸载逻辑
 *        -- 6.2 pruneCacheEntry 方法执行
 *                --- 如果不是当前激活组件, 那么直接调用注入的 unmount 方法卸载组件
 *                --- 如果是当前激活组件, 那么修正标记即可, 这样就会转化为普通组件, 走普通组件的卸载
 *                --- 从缓存中清除
 *  - 7. KeepAlive 组件本身卸载
 *        -- 会通过注册 onBeforeUnmount 钩子来执行卸载前的清理工作
 *        -- 遍历所有被缓存组件
 *            --- 如果是当前激活的组件, 重置标记, 并且调用失活的钩子, 之后走普通的组件卸载逻辑
 *            --- 如果不是当前激活的组件, 直接调用注入的 unmount 方法卸载组件
 */
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
      // 获取缓存组件的内部实例，非空断言：能被激活的一定是有组件实例的状态组件
      const instance = vnode.component!
      // 1. 移动DOM：将缓存组件的VNode从「缓存容器storageContainer」移到**页面目标容器**
      // MoveType.ENTER：标记为“进入”移动类型，渲染器会做对应的过渡处理
      move(vnode, container, anchor, MoveType.ENTER, parentSuspense)
      // in case props have changed 如果道具发生变化
      // 2. 执行patch更新：防止组件激活时，props/属性已发生变化，同步最新的属性到缓存组件
      patch(
        instance.vnode, // 组件缓存时的旧VNode
        vnode, // 组件激活时的新VNode
        container,
        anchor,
        instance,
        parentSuspense,
        namespace,
        vnode.slotScopeIds,
        optimized,
      )

      // 3. 队列化后置渲染副作用 → 确保DOM更新完成后再执行激活相关钩子（符合Vue生命周期顺序）
      queuePostRenderEffect(() => {
        // 标记组件为「非失活状态」
        instance.isDeactivated = false
        // 执行组件的onActivated钩子（用户定义的激活钩子）
        if (instance.a) {
          invokeArrayFns(instance.a) // invokeArrayFns：Vue内部工具，执行数组中的所有函数
        }

        // 执行VNode的onVnodeMounted钩子（自定义VNode挂载钩子）
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }
      }, parentSuspense) // 关联父级Suspense，遵循Suspense的副作用执行时机

      // 开发环境/开发者工具：更新组件树，让devtools显示组件已激活
      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        // Update components tree 更新组件树
        devtoolsComponentAdded(instance)
      }
    }

    // ********** 暴露deactivate方法给渲染器 → 核心：失活当前组件（加入缓存） **********
    // 渲染器在检测到VNode有COMPONENT_SHOULD_KEEP_ALIVE标记时，会调用此方法
    // 入参：要失活的组件VNode
    sharedContext.deactivate = (vnode: VNode) => {
      const instance = vnode.component! // 获取失活组件的内部实例
      // 失效组件的mounted/activated钩子 → 避免重复执行
      // 停止执行这些钩子
      invalidateMount(instance.m)
      invalidateMount(instance.a)

      // 1. 移动DOM：将失活组件的VNode从**页面容器**移到「缓存容器storageContainer」暂存
      // MoveType.LEAVE：标记为“离开”移动类型，渲染器会做对应的过渡处理
      move(vnode, storageContainer, null, MoveType.LEAVE, parentSuspense)

      // 2. 队列化后置渲染副作用 → DOM移动完成后执行失活相关钩子
      queuePostRenderEffect(() => {
        // 执行组件的onDeactivated钩子（用户定义的失活钩子）
        if (instance.da) {
          invokeArrayFns(instance.da)
        }

        // 执行VNode的onVnodeUnmounted钩子（自定义VNode卸载钩子）
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }

        // 标记组件为「失活状态」，用户可通过this.isDeactivated判断组件是否在缓存中
        instance.isDeactivated = true
      }, parentSuspense)

      // 开发环境/开发者工具：更新组件树，让devtools显示组件已失活（缓存中）
      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        // Update components tree
        devtoolsComponentAdded(instance) // 更新组件树
      }

      // for e2e test
      // 端到端(e2e)测试兼容：将缓存容器暴露到组件实例，方便测试工具校验缓存状态
      if (__DEV__ && __BROWSER__) {
        ;(instance as any).__keepAliveStorageContainer = storageContainer
      }
    }

    // ********** 封装缓存组件的**真正卸载方法** **********
    // 区别于deactivate（失活是加入缓存），此方法用于**缓存修剪/KeepAlive卸载**时彻底销毁组件
    function unmount(vnode: VNode) {
      // reset the shapeFlag so it can be properly unmounted 重置 shapeFlag，以便可以正确卸载它
      resetShapeFlag(vnode)
      // 调用渲染器原生卸载方法，彻底销毁组件（执行unmounted钩子、移除DOM、销毁事件/指令等）
      // 最后一个参数true：表示强制移除DOM节点
      _unmount(vnode, instance, parentSuspense, true)
    }

    // ********** 缓存修剪核心方法 → 根据过滤函数筛选缓存，删除不匹配的缓存项 **********
    // 入参filter：过滤函数，返回true保留缓存，返回false删除缓存
    function pruneCache(filter: (name: string) => boolean) {
      // 遍历所有缓存项，逐个校验是否符合过滤规则
      cache.forEach((vnode, key) => {
        // for async components, name check should be based in its loaded 对于异步组件，名称检查应基于其加载的
        // inner component if available 内部组件（如果有）
        // 获取组件的**真实名称**，用于匹配include/exclude
        // 兼容异步组件：异步组件加载完成后，取__asyncResolved的内部组件名
        // 非异步组件：直接取组件类型的名称
        const name = getComponentName(
          isAsyncWrapper(vnode)
            ? (vnode.type as ComponentOptions).__asyncResolved || {}
            : (vnode.type as ConcreteComponent),
        )

        // 若组件有名称且不满足过滤规则 → 修剪该缓存项
        if (name && !filter(name)) {
          pruneCacheEntry(key)
        }
      })
    }

    // ********** 修剪单个缓存项 → 彻底卸载并删除指定key的缓存组件 **********
    // 入参key：要修剪的缓存键
    function pruneCacheEntry(key: CacheKey) {
      // 获取该key对应的缓存VNode
      const cached = cache.get(key) as VNode
      // 修剪条件：缓存项存在 且 （无当前激活组件 OR 缓存组件与当前组件不是同一个）
      // 避免修剪**当前正在激活**的组件
      if (cached && (!current || !isSameVNodeType(cached, current))) {
        unmount(cached) // 彻底卸载缓存组件（销毁实例、移除DOM）
      } else if (current) {
        // current active instance should no longer be kept-alive. 当前活动实例不应再保持活动状态
        // we can't unmount it now but it might be later, so reset its flag now. 我们现在无法卸载它，但可能会稍后，所以现在重置它的标志
        resetShapeFlag(current)
      }

      // 从缓存容器和key集合中删除该缓存项，完成修剪
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
      // fix #1621, the pendingCacheKey could be 0 修复 #1621，pendingCacheKey 可能为 0
      if (pendingCacheKey != null) {
        // if KeepAlive child is a Suspense, it needs to be cached after Suspense resolves 如果 KeepAlive 子级是 Suspense，则需要在 Suspense 解析后缓存
        // avoid caching vnode that not been mounted 避免缓存未挂载的vnode

        // 校验待缓存key存在（注意：key可能为0，所以用!=null而非!==null）
        if (isSuspense(instance.subTree.type)) {
          //  兼容Suspense子组件：Suspense需要在解析完成后再缓存，避免缓存未解析的注释节点
          queuePostRenderEffect(() => {
            cache.set(pendingCacheKey!, getInnerChild(instance.subTree))
          }, instance.subTree.suspense)
        } else {
          // 非Suspense组件：直接缓存标准化后的子VNode
          cache.set(pendingCacheKey, getInnerChild(instance.subTree))
        }
      }
    }
    onMounted(cacheSubtree) // KeepAlive挂载完成后，缓存首次渲染的子组件
    onUpdated(cacheSubtree) // KeepAlive更新（子组件切换）后，缓存新的子组件

    // ********** KeepAlive卸载前的清理逻辑 → 避免内存泄漏 **********
    onBeforeUnmount(() => {
      // 遍历所有缓存项，逐个彻底卸载
      cache.forEach(cached => {
        const { subTree, suspense } = instance
        const vnode = getInnerChild(subTree)
        // 特殊情况：缓存项是当前激活的组件 → 无需立即卸载（KeepAlive卸载时会自动处理）
        if (cached.type === vnode.type && cached.key === vnode.key) {
          // current instance will be unmounted as part of keep-alive's unmount 当前实例将作为 keep-alive 卸载的一部分被卸载
          // 重置标记，让渲染器后续正确卸载
          resetShapeFlag(vnode)
          // but invoke its deactivated hook here 但在这里调用其已停用的钩子
          const da = vnode.component!.da
          da && queuePostRenderEffect(da, suspense)
          return
        }
        /**
         * 非当前组件：直接彻底卸载
         *  - 非当前缓存组件的话, keepAlive 卸载时不会随之自动卸载
         *  - 所以需要手动卸载一下
         */
        unmount(cached)
      })
    })

    // ********** KeepAlive的**核心渲染函数** → 所有缓存逻辑的入口 **********
    // KeepAlive作为函数式组件，setup返回渲染函数，决定最终渲染的内容
    // 在渲染函数中使用的到的响应式数据, 也会触发重渲染
    return () => {
      // 初始化待缓存key为null，避免上次渲染的key残留
      pendingCacheKey = null

      // 无默认插槽 → 渲染null，无内容
      if (!slots.default) {
        return (current = null)
      }

      // 1. 获取默认插槽的子节点
      const children = slots.default()
      // 2. 取插槽第一个子节点（KeepAlive要求仅包裹一个组件子节点）
      const rawVNode = children[0]

      // 校验子节点格式：若插槽有多个子节点 → 开发环境报警告，不做缓存，直接渲染所有子节点
      if (children.length > 1) {
        if (__DEV__) {
          warn(`KeepAlive should contain exactly one component child.`) // KeepAlive 应该只包含一个子组件
        }
        current = null
        return children
      }
      // 校验子节点类型：若不是VNode，或不是「状态组件/ Suspense」→ 不做缓存，直接渲染
      // KeepAlive仅缓存**有状态组件(STATEFUL_COMPONENT)** 和Suspense（内部包裹状态组件）
      else if (
        !isVNode(rawVNode) ||
        (!(rawVNode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) &&
          !(rawVNode.shapeFlag & ShapeFlags.SUSPENSE))
      ) {
        current = null
        return rawVNode
      }

      // 3. 获取**真实要缓存的子VNode** → 跳过Suspense/异步组件的包裹层
      let vnode = getInnerChild(rawVNode)
      // 兼容Suspense服务端渲染：ssContent可能是注释节点，注释节点不缓存
      // #6028 Suspense ssContent maybe a comment VNode, should avoid caching it Suspense ssContent 可能是一个注释 VNode，应该避免缓存它
      if (vnode.type === Comment) {
        current = null
        return vnode
      }

      // 4. 获取组件类型，用于后续生成缓存key和匹配include/exclude
      const comp = vnode.type as ConcreteComponent

      // for async components, name check should be based in its loaded 对于异步组件，名称检查应基于其加载的
      // inner component if available 内部组件（如果有）
      // 5. 获取组件**真实名称** → 兼容异步组件（取加载完成后的内部组件名）
      const name = getComponentName(
        isAsyncWrapper(vnode)
          ? (vnode.type as ComponentOptions).__asyncResolved || {}
          : comp,
      )

      // 6. 根据 include/exclude/max 过滤 → 不满足缓存规则的组件，直接渲染，不做缓存
      const { include, exclude, max } = props
      if (
        (include && (!name || !matches(include, name))) || // 有include但组件名不匹配
        (exclude && name && matches(exclude, name)) // 有exclude且组件名匹配
      ) {
        // #11717
        // 清除「需要缓存」标记 → 告诉渲染器：该组件无需缓存，卸载时直接销毁
        vnode.shapeFlag &= ~ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
        current = vnode
        return rawVNode
      }

      // 7. 生成组件的**唯一缓存key** → 缓存的核心标识
      // 优先级：vnode.key（用户自定义） > 组件类型comp（默认）
      const key = vnode.key == null ? comp : vnode.key
      const cachedVNode = cache.get(key) // 从缓存中获取该key对应的已缓存VNode

      // clone vnode if it's reused because we are going to mutate it 克隆 vnode（如果它被重用），因为我们要改变它
      if (vnode.el) {
        vnode = cloneVNode(vnode)
        // 兼容Suspense：更新Suspense的服务端渲染内容为克隆后的VNode
        if (rawVNode.shapeFlag & ShapeFlags.SUSPENSE) {
          rawVNode.ssContent = vnode
        }
      }
      // #1511 it's possible for the returned vnode to be cloned due to attr 由于 attr，返回的 vnode 可能被克隆
      // fallthrough or scopeId, so the vnode here may not be the final vnode fallthrough或者scopeId，所以这里的vnode可能不是最终的vnode
      // that is mounted. Instead of caching it directly, we store the pending 即已安装。我们不是直接缓存它，而是存储待处理的
      // key and cache `instance.subTree` (the normalized vnode) in key 并缓存 `instance.subTree` （标准化 vnode）
      // mounted/updated hooks. 安装/更新的挂钩
      // 标记待缓存key → 后续在mounted/updated的cacheSubtree中真正缓存（因为当前VNode可能还会被克隆）
      pendingCacheKey = key

      // 9. **缓存命中** → 组件已在缓存中，激活该组件
      if (cachedVNode) {
        // copy over mounted state 复制安装状态
        // 复用缓存的DOM节点和组件实例 → 核心缓存逻辑，避免重新创建
        vnode.el = cachedVNode.el
        vnode.component = cachedVNode.component
        // 兼容过渡动画：递归更新子树的过渡钩子，让激活/失活时有过渡效果
        if (vnode.transition) {
          // recursively update transition hooks on subTree 递归更新子树上的转换钩子
          setTransitionHooks(vnode, vnode.transition!)
        }
        // 添加「已被缓存」标记 → 告诉渲染器：该组件是缓存的，需要调用activate方法激活
        // avoid vnode being mounted as fresh 避免 vnode 被挂载为新的
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
        // make this key the freshest 使这把钥匙成为最新鲜的
        // LRU策略：将当前key移到最前面（删除后重新添加），标记为「最近使用」
        keys.delete(key)
        keys.add(key)
      }
      // 10. **缓存未命中** → 组件首次渲染，加入缓存
      else {
        // 将key加入key集合，维护缓存顺序
        keys.add(key)
        // prune oldest entry 修剪最旧的条目
        // LRU缓存淘汰：若设置了max（最大缓存数），且缓存数量超过max → 删除**最久未使用**的缓存项
        if (max && keys.size > parseInt(max as string, 10)) {
          // keys是Set，按插入顺序存储，第一个元素就是最久未使用的key
          pruneCacheEntry(keys.values().next().value!)
        }
      }

      // 11. 添加「需要缓存」标记 → 告诉渲染器：该组件卸载时不要销毁，调用deactivate方法失活并加入缓存
      // avoid vnode being unmounted 避免 vnode 被卸载
      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE

      // 更新当前激活的组件VNode
      current = vnode
      // 最终渲染：若原始节点是Suspense，返回Suspense（保留其结构）；否则返回缓存的VNode
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

/**
 * KeepAlive 组件的匹配规则校验核心函数
 * 核心作用：判断组件名称是否符合 KeepAlive 的 include/exclude 匹配规则，支持多类型匹配模式
 *
 *
 * @param pattern 匹配规则，可以是以下三种类型：
 *                1. 数组 (MatchPattern[])：包含字符串/正则的数组，如 ['CompA', /CompB/]
 *                2. 字符串 (string)：逗号分隔的组件名，如 'CompA,CompB'
 *                3. 正则表达式 (RegExp)：匹配组件名的正则，如 /^Comp/
 * @param name 待校验的组件名称（由 getComponentName 函数获取的组件真实名称）
 * @returns boolean - true 表示匹配成功（符合规则），false 表示不匹配
 */
function matches(pattern: MatchPattern, name: string): boolean {
  // 分支1：匹配规则为数组 → 递归校验数组中的每一项，只要有一项匹配成功则整体匹配成功
  if (isArray(pattern)) {
    // 对数组中的每个子规则 p，递归调用 matches 函数校验（支持数组嵌套）
    return pattern.some((p: string | RegExp) => matches(p, name))
  }
  // 分支2：匹配规则为字符串 → 按逗号分割成组件名列表，判断目标名称是否在列表中
  else if (isString(pattern)) {
    return pattern.split(',').includes(name)
  }
  // 分支3：匹配规则为正则表达式 → 校验组件名是否符合正则规则
  else if (isRegExp(pattern)) {
    // 重置正则的 lastIndex 为 0
    // 原因：若正则开启全局匹配 (g)，lastIndex 会记录上一次匹配的结束位置，导致后续匹配从该位置开始，出现匹配异常
    // 例如：/Comp/g 第一次匹配 'CompA' 后 lastIndex=4，第二次匹配 'CompB' 时会从索引4开始，返回 false
    pattern.lastIndex = 0
    return pattern.test(name)
  }

  // 注释 "v8 ignore next"：告诉 V8 引擎忽略这一行的代码覆盖率统计（因为是兜底逻辑，测试用例难覆盖）
  /* v8 ignore next */
  return false
}

/**
 * 注册一个在组件被激活时调用的生命周期钩子函数
 * 当使用KeepAlive组件缓存的组件被重新激活时会执行此钩子
 *
 * @param hook - 要注册的生命周期钩子函数
 * @param target - 可选的目标组件实例，默认为当前活动的组件实例
 */
export function onActivated(
  hook: Function,
  target?: ComponentInternalInstance | null,
): void {
  registerKeepAliveHook(hook, LifecycleHooks.ACTIVATED, target)
}

/**
 * 注册一个在组件被停用时调用的生命周期钩子函数
 * 当组件被 KeepAlive 缓存且从 DOM 中移除但保持状态时触发此钩子
 *
 * @param hook - 在组件被停用时要执行的回调函数
 * @param target - 可选的目标组件实例，默认为当前活跃的组件实例
 */
export function onDeactivated(
  hook: Function,
  target?: ComponentInternalInstance | null,
): void {
  registerKeepAliveHook(hook, LifecycleHooks.DEACTIVATED, target)
}

/**
 * KeepAlive 组件专属的生命周期钩子注册函数
 * 核心作用：
 *    1. 包装原始钩子，添加「失活分支检查」—— 组件在KeepAlive失活分支时，钩子不执行；
 *    2. 将包装后的钩子注入目标组件实例，并向上注册到所有祖先KeepAlive根实例，优化钩子执行效率。
 *
 * @param hook 要注册的原始生命周期钩子函数，附带__wdc属性（缓存包装后的钩子，避免重复包装）
 * @param type 生命周期钩子类型（如LifecycleHooks.MOUNTED/LifecycleHooks.UPDATED等）
 * @param target 要注册钩子的目标组件内部实例，默认值为当前激活的组件实例（currentInstance）
 * @returns void
 *
 */
function registerKeepAliveHook(
  hook: Function & { __wdc?: Function },
  type: LifecycleHooks,
  target: ComponentInternalInstance | null = currentInstance,
) {
  // cache the deactivate branch check wrapper for injected hooks so the same 为注入的钩子缓存停用分支检查包装器，以便重复使用
  // hook can be properly deduped by the scheduler. "__wdc" stands for "with 调度器可以正确地去重钩子。 '__wdc' 代表 'with'
  // deactivation check". 停用检查

  // ********** 第一步：包装原始钩子，添加「失活分支检查」逻辑 **********
  // 缓存包装后的钩子到hook.__wdc，避免重复包装（保证同一个钩子只被包装一次）
  // 原因：调度器（scheduler）会根据钩子引用去重，重复包装会导致去重失效，钩子多次执行
  const wrappedHook =
    hook.__wdc ||
    (hook.__wdc = () => {
      // only fire the hook if the target instance is NOT in a deactivated branch. 仅当目标实例不在停用分支中时，才触发挂钩
      let current: ComponentInternalInstance | null = target
      while (current) {
        // 若当前组件实例标记为「失活」（isDeactivated=true），直接返回，不执行原始钩子
        if (current.isDeactivated) {
          return
        }
        current = current.parent
      }
      return hook()
    })

  // ********** 第二步：将包装后的钩子注入目标组件实例 **********
  // injectHook：Vue内部核心方法，将生命周期钩子注册到组件实例的对应钩子队列中
  injectHook(type, wrappedHook, target)

  // In addition to registering it on the target instance, we walk up the parent 除了在目标实例上注册它之外，我们还会沿着父级进行遍历
  // chain and register it on all ancestor instances that are keep-alive roots. 将该链式结构注册到所有作为存活根的祖先实例上
  // This avoids the need to walk the entire component tree when invoking these 这避免了在调用这些功能时遍历整个组件树的需要
  // hooks, and more importantly, avoids the need to track child components in 钩子，更重要的是，避免了跟踪子组件的需要
  // arrays. 数组

  // ********** 第三步：向上遍历父组件链，注册钩子到所有祖先KeepAlive根实例 **********
  // 设计目的：
  // 1. 避免执行钩子时遍历整个组件树，只需遍历KeepAlive根实例的钩子队列；
  // 2. 无需维护子组件数组，减少内存占用和维护成本。
  if (target) {
    let current = target.parent // 从目标实例的父组件开始遍历
    while (current && current.parent) {
      // 检查当前父组件的父组件是否是KeepAlive组件（isKeepAlive：Vue内部判断方法）
      if (isKeepAlive(current.parent.vnode)) {
        // 将包装后的钩子注入到该KeepAlive根实例
        // injectToKeepAliveRoot：Vue内部方法，专门为KeepAlive根注册子组件的生命周期钩子
        injectToKeepAliveRoot(wrappedHook, type, target, current)
      }
      // 继续向上遍历下一个父组件
      current = current.parent
    }
  }
}

/**
 * 将子组件的生命周期钩子注入到 KeepAlive 根实例，并注册卸载清理逻辑
 * 核心作用：
 *    1. 把包装后的生命周期钩子注入到 KeepAlive 根实例的对应钩子队列（如mountedHooks）；
 *    2. 注册卸载钩子，当目标组件卸载时，自动从 KeepAlive 根的钩子队列中移除该钩子，避免内存泄漏。
 *
 *
 * @param hook 要注入的「带失活检查的包装钩子」（来自registerKeepAliveHook的wrappedHook）
 * @param type 生命周期钩子类型（如LifecycleHooks.MOUNTED/LifecycleHooks.UPDATED等）
 * @param target 钩子所属的目标子组件实例（需要被缓存/激活的子组件）
 * @param keepAliveRoot 目标子组件的祖先 KeepAlive 根组件实例（钩子要注入的目标）
 * @returns void
 */
function injectToKeepAliveRoot(
  hook: Function & { __weh?: Function },
  type: LifecycleHooks,
  target: ComponentInternalInstance,
  keepAliveRoot: ComponentInternalInstance,
) {
  // injectHook wraps the original for error handling, so make sure to remove injectHook 包装了原始文件以进行错误处理，因此请务必删除
  // the wrapped version. 包装版本。

  // ********** 核心逻辑：将钩子注入到 KeepAlive 根实例的钩子队列 **********
  const injected = injectHook(type, hook, keepAliveRoot, true /* prepend */)

  // ********** 关键：注册卸载钩子，确保组件卸载时清理 KeepAlive 根的钩子队列 **********
  // onUnmounted 绑定到 target（子组件实例），当子组件卸载时执行回调：
  // - 从 keepAliveRoot 的对应钩子队列（如keepAliveRoot.mounted）中移除注入的钩子
  // - 避免 KeepAlive 根实例残留无效钩子，导致内存泄漏/钩子异常执行
  onUnmounted(() => {
    // remove: Vue内部数组移除工具，从 keepAliveRoot[type] 队列中删除 injected 钩子
    // keepAliveRoot[type]!：非空断言，KeepAlive根实例的对应钩子队列一定存在
    remove(keepAliveRoot[type]!, injected)
  }, target) // 第二个参数target：指定卸载钩子挂载到「子组件实例」，子组件卸载时触发
}

/**
 * 重置VNode的shape标志，移除与KeepAlive相关的标志位
 *
 * 此函数通过位运算操作清除VNode上的COMPONENT_SHOULD_KEEP_ALIVE和COMPONENT_KEPT_ALIVE标志，
 * 用于在KeepAlive组件中更新组件状态。
 *
 * @param vnode - 需要重置形状标志的虚拟节点对象
 * @returns 无返回值
 */
function resetShapeFlag(vnode: VNode) {
  // bitwise operations to remove keep alive flags 按位运算删除保持活动标志
  vnode.shapeFlag &= ~ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
  vnode.shapeFlag &= ~ShapeFlags.COMPONENT_KEPT_ALIVE
}

/**
 * 获取vnode内部的子节点
 * 如果vnode是Suspense类型，则返回其ssContent属性；否则直接返回原vnode
 *
 * @param vnode - 虚拟节点，可能是Suspense类型的节点或其他类型的节点
 * @returns 返回Suspense的内容节点或原始虚拟节点
 */
function getInnerChild(vnode: VNode) {
  return vnode.shapeFlag & ShapeFlags.SUSPENSE ? vnode.ssContent! : vnode
}
