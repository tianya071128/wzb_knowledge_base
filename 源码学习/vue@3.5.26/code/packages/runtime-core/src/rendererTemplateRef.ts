import type { SuspenseBoundary } from './components/Suspense'
import type {
  VNode,
  VNodeNormalizedRef,
  VNodeNormalizedRefAtom,
  VNodeRef,
} from './vnode'
import {
  EMPTY_OBJ,
  NO,
  ShapeFlags,
  hasOwn,
  isArray,
  isFunction,
  isString,
  remove,
} from '@vue/shared'
import { isAsyncWrapper } from './apiAsyncComponent'
import { warn } from './warning'
import { isRef, toRaw } from '@vue/reactivity'
import { ErrorCodes, callWithErrorHandling } from './errorHandling'
import { type SchedulerJob, SchedulerJobFlags } from './scheduler'
import { queuePostRenderEffect } from './renderer'
import { type ComponentOptions, getComponentPublicInstance } from './component'
import { knownTemplateRefs } from './helpers/useTemplateRef'

const pendingSetRefMap = new WeakMap<VNodeNormalizedRef, SchedulerJob>()
/**
 * Function for handling a template ref 处理模板引用的函数
 */
/**
 * Vue3 内部核心函数 - 模板Ref（template ref）的【绑定/更新/解绑总入口】
 * 核心使命：处理所有场景下的Ref逻辑
 * 核心关联：在VNode挂载/更新/卸载阶段调用，是Ref与DOM/组件实例关联的核心逻辑
 *
 *  - ref 会在生成 VNode 时标准化成统一格式, 在挂载和卸载时会调用该函数
 *  - Ref 的具体值计算: 都绑定到了 vnode 中
 *     -- 组件类型取公共实例 --> vnode.component
 *          ---> 如果组件使用了 steup 调用 defineExpose() 或者使用了 expose 选项的话, 就只会暴露对应的属性
 *     -- 元素类型取真实DOM  --> vnode.el
 *  - 不同场景下的处理:
 *      -- 函数形式 --> :ref="Function"
 *          --- 初始化时, 直接调用函数, 将 Ref 的具体值作为参数即可
 *          --- 卸载时, 同时直接调用函数，将 null 作为参数即可
 *      -- 字符串形式 --> ref="foo"
 *          --- 初始化时, 追加到组件实例的 $refs 对象中, 以及 steup 中的 ref 变量中
 *          --- 卸载时, 同样从组件实例的 $refs 对象中和 setup 中的 ref 变量中删除
 *      -- 响应式对象形式 --> ref={fooRef}（setup 中声明的 const fooRef = ref()）
 *          --- 初始化时, 追加到组件实例的 $refs 对象中, 以及 Ref 的具体值响应式对象
 *          --- 卸载时, 删除对应值
 *      -- v-for 的 ref
 *          --- 在生成 vnode 时, 会自动标记为 v-for 生成, 即 rawRef.f = true
 *          --- 之后在碰到这个标记时, 会自动将 ref 具体值包装为数组或者追加到已经存在的数组中
 *
 *
 *  - 注意:
 *     -- ref 不关心更新, 因为 ref 绑定的是原生元素或者组件实例，都是通过对象引用的, 都是同一个对象
 *     -- ref 的处理都是在 vnode 的具体渲染之后执行, 也就是已经生成了 vnode 和 组件实例, 也就直接从 vnode 取到具体的值即可
 *     -- 但是 vnode 渲染了, 不代表真实 DOM 已经挂载到 DOM 树中(因为父元素还没有挂载), 所以在这里是延迟到渲染后执行（避免DOM未挂载完成）
 *
 * @param {VNodeNormalizedRef} rawRef 新的标准化Ref（单个原子/数组）
 * @param {VNodeNormalizedRef | null} oldRawRef 旧的标准化Ref（用于清理旧值）
 * @param {SuspenseBoundary | null} parentSuspense 父级Suspense边界（用于调度后置任务）
 * @param {VNode} vnode 绑定Ref的VNode节点（来源：DOM/组件实例）
 * @param {boolean} [isUnmount=false] 是否是卸载阶段（true=解绑Ref置空，false=绑定Ref赋值）
 * @returns {void} 无返回值，完成Ref的绑定/更新/解绑
 */
export function setRef(
  rawRef: VNodeNormalizedRef,
  oldRawRef: VNodeNormalizedRef | null,
  parentSuspense: SuspenseBoundary | null,
  vnode: VNode,
  isUnmount = false,
): void {
  // ========== 分支1：处理数组类型的Ref → 递归调用setRef ==========
  // 场景：ref绑定了数组（如ref=[ref1, ref2]），逐个处理每个子Ref
  //       - 或者在 cloneVNode 时, 会合并 ref 为一个数组
  if (isArray(rawRef)) {
    rawRef.forEach((r, i) =>
      setRef(
        r,
        // 旧Ref是数组则取对应索引，否则复用旧Ref（兼容边界场景）
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount,
      ),
    )
    return
  }

  // ========== 分支2：处理异步组件包装器的Ref → 转发到内部组件 ==========
  // 非卸载阶段 + VNode是异步组件包装器
  if (isAsyncWrapper(vnode) && !isUnmount) {
    // #4999 if an async component already resolved and cached by KeepAlive, 如果异步组件已被 KeepAlive 解析并缓存
    // we need to set the ref to inner component 我们需要将 ref 设置为内部组件
    if (
      vnode.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE &&
      (vnode.type as ComponentOptions).__asyncResolved &&
      vnode.component!.subTree.component
    ) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component!.subTree)
    }

    // otherwise, nothing needs to be done because the template ref
    // is forwarded to inner component
    return
  }

  // ========== 步骤1：计算Ref要绑定的实际值（refValue） ==========
  const refValue =
    // 有状态组件 → 取组件的公共实例（对外暴露的实例，非内部instance）
    vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
      ? getComponentPublicInstance(vnode.component!)
      : vnode.el
  // 最终赋值：卸载阶段置null，绑定阶段赋值refValue
  const value = isUnmount ? null : refValue

  // ========== 步骤2：解构Ref原子的核心属性 + 开发环境校验 ==========
  const {
    i: owner, // Ref所属的组件实例
    r: ref, // ref：实际的Ref值（字符串/函数/响应式对象）
  } = rawRef
  // 开发环境校验：Ref必须有所属组件实例（避免在hoisted vnode上使用ref）
  if (__DEV__ && !owner) {
    warn(
      `Missing ref owner context. ref cannot be used on hoisted vnodes. ` + // 缺少引用所有者上下文。 ref 不能在提升的 vnode 上使用
        `A vnode with ref must be created inside the render function.`, // 必须在渲染函数内创建带有 ref 的 vnode
    )
    return
  }

  // ========== 步骤3：准备Ref赋值的上下文（组件的refs/setupState） ==========
  const oldRef = oldRawRef && (oldRawRef as VNodeNormalizedRefAtom).r // 旧的Ref值
  const refs = owner.refs === EMPTY_OBJ ? (owner.refs = {}) : owner.refs // 组件的$refs对象：为空则初始化为空对象，否则复用
  const setupState = owner.setupState // 组件的setup状态（setup返回的对象）
  const rawSetupState = toRaw(setupState) // 解响应式：避免触发依赖收集

  // ========== 步骤4：定义Setup Ref的合法性校验函数 ==========
  // 校验setup中声明的Ref是否合法（用于字符串Ref映射到setupState） --> 是否支持赋值到 setup 上
  const canSetSetupRef =
    setupState === EMPTY_OBJ
      ? NO // setupState为空 → 不允许设置
      : (key: string) => {
          if (__DEV__) {
            if (hasOwn(rawSetupState, key) && !isRef(rawSetupState[key])) {
              warn(
                `Template ref "${key}" used on a non-ref value. ` + // 模板引用“${key}”用于非引用值
                  `It will not work in the production build.`, // 它在生产版本中不起作用
              )
            }

            // 校验2：该Ref已被标记为已知模板Ref → 不允许重复设置
            if (knownTemplateRefs.has(rawSetupState[key] as any)) {
              return false
            }
          }
          // 核心校验：setupState中存在该key → 允许设置
          return hasOwn(rawSetupState, key)
        }

  // ========== 步骤5：定义Ref对象的合法性校验函数 ==========
  // 校验响应式Ref对象是否允许赋值（避免重复设置）
  const canSetRef = (ref: VNodeRef) => {
    return !__DEV__ || !knownTemplateRefs.has(ref as any)
  }

  // ========== 步骤6：处理Ref变更 → 清理旧Ref值 ==========
  // 旧Ref存在 且 新旧Ref值不同 → 清理旧Ref的绑定值
  // dynamic ref changed. unset old ref 动态参考已更改。取消设置旧参考
  if (oldRef != null && oldRef !== ref) {
    invalidatePendingSetRef(oldRawRef!) // 失效待执行的旧Ref设置任务
    // 场景6.1：旧Ref是字符串 → 清空$refs和setupState中的对应值
    if (isString(oldRef)) {
      refs[oldRef] = null
      // 设置为 setup 的 ref 变量 -- 将旧的置为 null
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null
      }
    }
    // 场景6.2：旧Ref是响应式对象 → 清空Ref.value，且清理$refs中的key
    else if (isRef(oldRef)) {
      if (canSetRef(oldRef)) {
        oldRef.value = null
      }

      // this type assertion is valid since `oldRef` has already been asserted to be non-null 由于`oldRef`已经被断言为非空，因此这种类型断言是有效的
      const oldRawRefAtom = oldRawRef as VNodeNormalizedRefAtom
      if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null
    }
  }

  // ========== 分支3：处理函数类型的Ref → 执行函数并传递参数 ==========
  if (isFunction(ref)) {
    // 调用函数Ref，带错误处理（捕获函数执行异常并上报）
    callWithErrorHandling(ref, owner, ErrorCodes.FUNCTION_REF, [value, refs])
  }
  // ========== 分支4：处理字符串/响应式对象类型的Ref ==========
  else {
    const _isString = isString(ref) // 是否是字符串Ref
    const _isRef = isRef(ref) // 是否是响应式Ref对象

    if (_isString || _isRef) {
      // 定义Ref赋值的核心逻辑函数（抽离复用）
      const doSet = () => {
        // 子场景4.1：Ref在v-for中（rawRef.f=true）→ 收集为数组
        if (rawRef.f) {
          // 获取已存在的Ref值（优先取setupState，其次取$refs）
          const existing = _isString
            ? canSetSetupRef(ref)
              ? setupState[ref]
              : refs[ref]
            : canSetRef(ref) || !rawRef.k
              ? ref.value
              : refs[rawRef.k]

          // 卸载阶段 → 从数组中移除当前refValue
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue)
          }
          // 绑定阶段 → 收集为数组
          else {
            // 不存在或非数组 → 初始化为数组
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref] = [refValue]
                if (canSetSetupRef(ref)) {
                  setupState[ref] = refs[ref]
                }
              } else {
                const newVal = [refValue]
                if (canSetRef(ref)) {
                  ref.value = newVal
                }
                if (rawRef.k) refs[rawRef.k] = newVal
              }
            }
            // 已存在数组 → 追加值（避免重复）
            else if (!existing.includes(refValue)) {
              existing.push(refValue)
            }
          }
        }
        // 子场景4.2：普通Ref（非v-for）→ 直接赋值
        else if (_isString) {
          refs[ref] = value // 赋值到$refs
          if (canSetSetupRef(ref)) {
            setupState[ref] = value // 同步到setupState
          }
        }
        // 子场景4.3：响应式Ref对象
        else if (_isRef) {
          if (canSetRef(ref)) {
            ref.value = value
          }
          if (rawRef.k) refs[rawRef.k] = value
        }
        // 开发环境：无效的Ref类型警告
        else if (__DEV__) {
          warn('Invalid template ref type:', ref, `(${typeof ref})`) // 模板引用类型无效
        }
      }

      // ========== 步骤7：调度Ref赋值时机 ==========
      if (value) {
        // #1789: for non-null values, set them after render 对于非空值，在渲染后设置它们
        // null values means this is unmount and it should not overwrite another 空值意味着这是卸载的并且它不应该覆盖另一个
        // ref with the same key 引用相同的键

        // 非空值（绑定阶段）→ 延迟到渲染后执行（避免DOM未挂载完成）
        const job: SchedulerJob = () => {
          doSet()
          pendingSetRefMap.delete(rawRef)
        }
        job.id = -1 // 标记为内部任务（不参与优先级排序）
        pendingSetRefMap.set(rawRef, job) // 存入待执行任务映射
        queuePostRenderEffect(job, parentSuspense) // 加入后置渲染队列（DOM更新完成后执行）
      } else {
        // 空值（卸载阶段）→ 立即执行，先失效待执行任务
        invalidatePendingSetRef(rawRef)
        doSet()
      }
    }
    // 开发环境：无效的Ref类型警告
    else if (__DEV__) {
      warn('Invalid template ref type:', ref, `(${typeof ref})`) // 模板引用类型无效
    }
  }
}

/**
 * 使待处理的模板引用设置失效
 * 当组件卸载或模板引用更改时，取消之前计划但尚未执行的引用设置操作
 *
 * @param rawRef - 原始标准化的VNode引用对象，用于从待处理映射表中查找对应的引用设置任务
 */
function invalidatePendingSetRef(rawRef: VNodeNormalizedRef) {
  const pendingSetRef = pendingSetRefMap.get(rawRef)
  if (pendingSetRef) {
    // 标记待处理的引用设置任务为已销毁状态，防止其被执行
    pendingSetRef.flags! |= SchedulerJobFlags.DISPOSED
    // 从待处理映射表中删除该引用，避免内存泄漏
    pendingSetRefMap.delete(rawRef)
  }
}
