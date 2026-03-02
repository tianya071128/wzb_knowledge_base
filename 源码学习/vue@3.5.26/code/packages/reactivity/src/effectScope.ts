import type { ReactiveEffect } from './effect'
import { warn } from './warning'

export let activeEffectScope: EffectScope | undefined

/**
 * Vue3 响应式系统核心类：副作用作用域（EffectScope）
 *
 * 核心作用：
 *    1. 副作用分组管理：将多个 ReactiveEffect 归为一个作用域，支持批量暂停/恢复/停止；
 *    2. 嵌套作用域：支持作用域的父子嵌套，父作用域停止时自动停止所有子作用域；
 *    3. 上下文切换：通过 run()/on()/off() 切换全局活跃作用域，使副作用创建时自动关联当前作用域；
 *    4. 内存安全：停止作用域时自动清理所有副作用、清理函数、子作用域，避免内存泄漏；
 *    5. 分离模式：支持 detached 模式（不关联父作用域），适配独立副作用分组场景；
 *
 * 核心使用场景：
 *    - Vue 组件的 setup 函数：组件实例对应一个 EffectScope，组件卸载时停止作用域；
 *    - 自定义组合式函数：通过 EffectScope 管理组合式函数内的所有副作用；
 *    - 服务端渲染（SSR）：隔离不同请求的副作用，避免交叉污染；
 */
export class EffectScope {
  /**
   * @internal 内部属性：作用域激活状态（true=激活，false=已停止）
   */
  private _active = true
  /**
   * 内部属性：on 调用计数，支持 on 多次调用（需对应次数的 off 才能恢复上下文）
   *
   * @internal track `on` calls, allow `on` call multiple times 跟踪“on”调用，允许多次“on”调用
   */
  private _on = 0
  /**
   * @internal 内部属性：当前作用域管理的所有副作用（ReactiveEffect 实例数组）
   */
  effects: ReactiveEffect[] = []
  /**
   * @internal 内部属性：当前作用域的清理函数数组（停止时批量执行）
   */
  cleanups: (() => void)[] = []

  /**
   * 内部属性：作用域暂停状态（true=已暂停，false=正常）
   */
  private _isPaused = false

  /**
   * 仅非分离模式（detached=false）的作用域会赋值：父作用域引用
   *
   * only assigned by undetached scope 仅由未分离范围分配
   * @internal
   */
  parent: EffectScope | undefined

  /**
   * 记录当前作用域的子作用域（仅非分离模式）
   *
   * record undetached scopes 记录未分离的范围
   * @internal
   */
  scopes: EffectScope[] | undefined

  /**
   * 记录当前作用域在父作用域 scopes 数组中的索引，用于优化移除性能（O(1)）
   *
   * track a child scope's index in its parent's scopes array for optimized 跟踪子作用域在其父作用域数组中的索引以进行优化
   * removal 移除
   * @internal
   */
  private index: number | undefined

  /**
   * 构造函数：创建副作用作用域实例
   *
   * @param detached 分离模式标记（默认 false）：
   *                 - false：关联父作用域（activeEffectScope），加入父作用域的 scopes 数组；
   *                 - true：不关联父作用域，独立存在；
   */
  constructor(public detached = false) {
    // 1. 关联父作用域：默认指向当前全局活跃的作用域（activeEffectScope）
    this.parent = activeEffectScope

    // 2. 非分离模式且存在父作用域 → 将当前作用域加入父作用域的子作用域数组
    if (!detached && activeEffectScope) {
      // 2.1 若父作用域无 scopes 数组 → 初始化
      // 2.2 将当前作用域推入数组，并记录索引（数组长度-1）
      this.index =
        (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this,
        ) - 1
    }
  }

  /**
   * 公共只读属性：获取作用域激活状态（对外暴露 _active，避免直接修改）
   */
  get active(): boolean {
    return this._active
  }

  /**
   * 暂停当前作用域：批量暂停所有子作用域和自身管理的副作用
   * 暂停后副作用不会响应依赖变化，但作用域仍处于激活状态（可 resume 恢复）
   */
  pause(): void {
    // 仅激活状态的作用域可暂停
    if (this._active) {
      // 标记作用域为暂停状态
      this._isPaused = true
      let i, l

      // 1. 递归暂停所有子作用域
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].pause()
        }
      }
      // 2. 暂停当前作用域管理的所有副作用
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].pause()
      }
    }
  }

  /**
   * 恢复当前作用域：批量恢复所有子作用域和自身管理的副作用
   *
   * Resumes the effect scope, including all child scopes and effects. 恢复效果范围，包括所有子范围和效果
   */
  resume(): void {
    // 仅激活状态的作用域可恢复
    if (this._active) {
      // 仅暂停状态的作用域需要恢复
      if (this._isPaused) {
        this._isPaused = false // 取消暂停标记
        let i, l

        // 1. 递归恢复所有子作用域
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].resume()
          }
        }

        // 2. 恢复当前作用域管理的所有副作用
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].resume()
        }
      }
    }
  }

  /**
   * 运行指定函数，并将全局活跃作用域切换为当前作用域
   * 函数执行过程中创建的副作用会自动关联到当前作用域
   *
   * @param fn 待执行的函数
   * @returns 函数执行结果（若作用域未激活则返回 undefined）
   */
  run<T>(fn: () => T): T | undefined {
    // 仅激活状态的作用域可运行函数
    if (this._active) {
      // 暂存当前全局活跃作用域，用于后续恢复
      const currentEffectScope = activeEffectScope
      try {
        // 将全局活跃作用域切换为当前作用域
        activeEffectScope = this
        // 执行目标函数，返回执行结果
        return fn()
      } finally {
        // 无论函数执行是否出错，都恢复全局活跃作用域（避免上下文污染）
        activeEffectScope = currentEffectScope
      }
    } else if (__DEV__) {
      // 开发环境：尝试运行未激活的作用域 → 抛出警告
      warn(`cannot run an inactive effect scope.`) // 无法运行非活动效果范围
    }
  }

  /**
   * 内部属性：暂存 on 调用前的全局活跃作用域（用于 off 时恢复）
   */
  prevScope: EffectScope | undefined

  /**
   * 激活当前作用域为全局活跃作用域（仅非分离模式调用）
   * 支持多次调用 on → 需对应次数的 off 才能恢复原上下文
   *
   * This should only be called on non-detached scopes 这只应在非分离作用域上调用
   * @internal
   */
  on(): void {
    // _on 计数递增，首次调用（_on=1）时切换上下文
    if (++this._on === 1) {
      // 暂存切换前的全局活跃作用域
      this.prevScope = activeEffectScope
      // 将全局活跃作用域切换为当前作用域
      activeEffectScope = this
    }
  }

  /**
   * 恢复原全局活跃作用域（仅非分离模式调用）
   * 需与 on 调用次数匹配（_on 减至 0 时才恢复）
   *
   * This should only be called on non-detached scopes 这只应在非分离作用域上调用
   * @internal
   */
  off(): void {
    // 仅 _on > 0 时执行（避免重复 off）
    if (this._on > 0 && --this._on === 0) {
      // 恢复为 on 调用前的全局活跃作用域
      activeEffectScope = this.prevScope
      // 清空暂存的原作用域，释放内存
      this.prevScope = undefined
    }
  }

  /**
   * 停止当前作用域：批量停止所有副作用、清理函数、子作用域，解除父作用域关联
   *
   * @param fromParent 是否由父作用域触发（内部递归调用时传 true，避免重复解除父关联）
   */
  stop(fromParent?: boolean): void {
    // 仅激活状态的作用域可停止
    if (this._active) {
      // 标记作用域为未激活状态
      this._active = false
      let i, l

      // 1. 停止当前作用域管理的所有副作用
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop()
      }
      this.effects.length = 0 // 清空副作用数组，释放内存

      // 2. 执行当前作用域的所有清理函数
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]()
      }
      this.cleanups.length = 0 // 清空清理函数数组，释放内存

      // 3. 递归停止所有子作用域
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true) // 标记 fromParent = true，避免子作用域重复解除父关联
        }
        this.scopes.length = 0
      }

      // nested scope, dereference from parent to avoid memory leaks 嵌套作用域，从父级取消引用以避免内存泄漏
      // 4. 非分离模式 + 有父作用域 + 非父触发 → 解除与父作用域的关联（避免内存泄漏）
      if (!this.detached && this.parent && !fromParent) {
        // optimized O(1) removal 优化 O(1) 去除
        // 优化的 O(1) 移除：弹出数组最后一个元素，替换到当前作用域的索引位置
        const last = this.parent.scopes!.pop()
        if (last && last !== this) {
          // 将最后一个元素放到当前作用域的索引位置
          this.parent.scopes![this.index!] = last
          // 更新最后一个元素的索引为当前作用域的索引
          last.index = this.index!
        }
      }
      // 清空父作用域引用，释放内存
      this.parent = undefined
    }
  }
}

/**
 * Creates an effect scope object which can capture the reactive effects (i.e. 创建一个可以捕获响应式效应的效果作用域对象（即
 * computed and watchers) created within it so that these effects can be 在其中创建的计算属性和观察者，以便这些效果能够
 * disposed together. For detailed use cases of this API, please consult its 一同处理。有关此API的详细用例，请查阅其
 * corresponding {@link https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md | RFC}. 对应的 RFC：
 *
 * @param detached - Can be used to create a "detached" effect scope. 可用于创建“分离”效果作用域
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#effectscope}
 */
export function effectScope(detached?: boolean): EffectScope {
  return new EffectScope(detached)
}

/**
 * Returns the current active effect scope if there is one. 如果有则返回当前激活的效果范围
 *
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#getcurrentscope}
 */
export function getCurrentScope(): EffectScope | undefined {
  return activeEffectScope
}

/**
 * Registers a dispose callback on the current active effect scope. The 在当前活动效果作用域上注册一个释放回调函数。这
 * callback will be invoked when the associated effect scope is stopped. 当关联的效果作用域停止时，将调用回调函数
 *
 * @param fn - The callback function to attach to the scope's cleanup. 要附加到作用域清理的回调函数
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#onscopedispose}
 */
export function onScopeDispose(fn: () => void, failSilently = false): void {
  if (activeEffectScope) {
    // 将清理回调函数添加到当前活跃的效果作用域的清理队列中
    activeEffectScope.cleanups.push(fn)
  } else if (__DEV__ && !failSilently) {
    warn(
      `onScopeDispose() is called when there is no active effect scope` + // “当没有活动的效果作用域时，会调用`onScopeDispose()`方法”
        ` to be associated with.`, //  “与……相关联”
    )
  }
}
