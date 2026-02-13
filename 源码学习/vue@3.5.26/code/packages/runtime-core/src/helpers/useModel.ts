import { type Ref, customRef, ref } from '@vue/reactivity'
import { EMPTY_OBJ, camelize, hasChanged, hyphenate } from '@vue/shared'
import type { DefineModelOptions, ModelRef } from '../apiSetupHelpers'
import { getCurrentInstance } from '../component'
import { warn } from '../warning'
import type { NormalizedProps } from '../componentProps'
import { watchSyncEffect } from '../apiWatch'

export function useModel<
  M extends PropertyKey,
  T extends Record<string, any>,
  K extends keyof T,
  G = T[K],
  S = T[K],
>(
  props: T,
  name: K,
  options?: DefineModelOptions<T[K], G, S>,
): ModelRef<T[K], M, G, S>
/**
 * Vue3 defineModel 宏的底层实现 --> https://cn.vuejs.org/api/composition-api-helpers.html#usemodel
 *
 * 核心作用：
 * 1. 创建与 props 双向绑定的响应式 Ref：同步父组件传入的 v-model 值 ↔ 子组件本地值；
 * 2. 自动处理事件触发：子组件修改 Ref 时，自动 emit `update:${name}` 事件通知父组件；
 * 3. 支持修饰符解析：获取 v-model 修饰符（如 v-model.trim）并暴露；
 * 4. 自定义值转换：通过 options.get/set 实现 props 值 ↔ 本地值的转换（如类型转换、格式化）；
 * 5. 容错处理：开发环境校验实例/prop 合法性，边界场景（无父组件 v-model）支持本地更新；
 *
 * @param props 组件的 props 对象（包含父组件传入的 v-model 值）；
 * @param name v-model 绑定的 prop 名称（如 "modelValue"、"value"）；
 * @param options 自定义转换选项（可选）：
 *   - get: (value) => any：从 props 读取值时的转换逻辑；
 *   - set: (value) => any：修改值后发送给父组件前的转换逻辑；
 *
 * @returns Ref 双向绑定的响应式 Ref，扩展了迭代器支持解构（[ref, modifiers] = useModel(...)）；
 */
export function useModel(
  props: Record<string, any>,
  name: string,
  options: DefineModelOptions = EMPTY_OBJ,
): Ref {
  // 1. 获取当前组件实例（非空断言：正常场景下 useModel 仅在 setup/render 中调用，实例必存在）
  const i = getCurrentInstance()!
  if (__DEV__ && !i) {
    warn(`useModel() called without active instance.`) // 在没有活动实例的情况下调用 useModel()
    return ref() as any
  }

  // 2. 名称格式化：将传入的名称转为驼峰式（兼容短横线命名，如 "model-value" → "modelValue"）
  const camelizedName = camelize(name)
  // 开发环境校验：校验该 prop 是否在组件 propsOptions 中声明（避免使用未声明的 prop）
  if (__DEV__ && !(i.propsOptions[0] as NormalizedProps)[camelizedName]) {
    warn(`useModel() called with prop "${name}" which is not declared.`) // 使用未声明的 prop“${name}”调用 useModel()
    return ref() as any
  }

  // 3. 名称格式化：转为连字符式（用于校验父组件传入的 props/事件名，如 "modelValue" → "model-value"）
  const hyphenatedName = hyphenate(name)
  // 4. 获取 v-model 修饰符（如 v-model.trim → modifiers = { trim: true }）
  const modifiers = getModelModifiers(props, camelizedName)

  // 5. 创建自定义 Ref（customRef）：核心双向绑定逻辑
  // customRef 作用：手动控制依赖收集（track）和更新触发（trigger），实现精准的响应式控制
  const res = customRef((track, trigger) => {
    let localValue: any // 本地值缓存：存储子组件本地的最新值（与 props 同步）
    let prevSetValue: any = EMPTY_OBJ // 上一次设置的本地值：用于判断值是否真的变化，避免重复触发
    let prevEmittedValue: any // 上一次发送给父组件的值：用于判断是否需要强制触发更新

    // 6. 同步 props 到本地值：watchSyncEffect 同步执行，无延迟
    // 作用：父组件更新 v-model 值时，同步更新子组件本地值，并触发 Ref 更新
    watchSyncEffect(() => {
      const propValue = props[camelizedName]
      // hasChanged：Vue 内部工具函数，判断值是否真的变化（处理 NaN/引用类型等边界）
      if (hasChanged(localValue, propValue)) {
        localValue = propValue // 同步 props 值到本地
        trigger() // 触发 Ref 更新，通知依赖该 Ref 的视图/逻辑
      }
    })

    // 7. 自定义 Ref 的 get/set 实现：核心双向绑定逻辑
    return {
      /**
       * Ref 取值逻辑：
       * 1. 触发依赖收集（track）：让使用该 Ref 的地方（如模板）感知值变化；
       * 2. 支持自定义 get 转换：如将数字转为字符串、格式化日期等；
       */
      get() {
        track() // 依赖收集：标记该 Ref 被使用，后续值变化时触发更新
        // 有自定义 get 则执行转换，否则返回原始本地值
        return options.get ? options.get(localValue) : localValue
      },
      /**
       * Ref 赋值逻辑：
       *  1. 自定义 set 转换：修改值后先执行转换，再准备发送给父组件；
       *  2. 防抖判断：值未变化时直接返回，避免重复触发；
       *  3. 父组件 v-model 存在性判断：区分“本地更新”和“emit 通知父组件”；
       *  4. 事件触发：emit `update:${name}` 通知父组件更新 v-model；
       *  5. 特殊场景处理：转换后值不同导致父组件未更新时，强制触发本地更新；
       */
      set(value) {
        // 步骤1：执行自定义 set 转换（如将字符串转为数字、去除空格等）
        const emittedValue = options.set ? options.set(value) : value

        // 步骤2：防抖判断：值未真正变化则返回，避免无效操作
        // 条件：
        // - 转换后的值与本地值无变化；
        // - 且不是“上一次设置值不同但转换后值相同”的场景；
        if (
          !hasChanged(emittedValue, localValue) &&
          !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))
        ) {
          return
        }

        // 步骤3：获取组件 VNode 的原始 props（父组件传入的 props）
        const rawProps = i.vnode!.props

        // 步骤4：无父组件 v-model → 仅更新本地值（如子组件内部临时使用）
        // 判断父组件是否传入了 v-model（核心：区分本地更新 vs emit 通知）
        if (
          !(
            rawProps &&
            // 父组件传入了该 prop（支持原名称/驼峰/连字符）
            // check if parent has passed v-model 检查父级是否已通过 v-model
            (name in rawProps ||
              camelizedName in rawProps ||
              hyphenatedName in rawProps) &&
            // 父组件监听了 update:xxx 事件（v-model 的底层事件）
            (`onUpdate:${name}` in rawProps ||
              `onUpdate:${camelizedName}` in rawProps ||
              `onUpdate:${hyphenatedName}` in rawProps)
          )
        ) {
          // no v-model, local update 无 v-model，本地更新
          localValue = value
          trigger() // 触发本地 Ref 更新
        }

        // 步骤5：有父组件 v-model → emit 事件通知父组件更新
        i.emit(`update:${name}`, emittedValue)

        // #10279: if the local value is converted via a setter but the value 如果本地值是通过setter方法转换的，但该值
        // emitted to parent was the same, the parent will not trigger any 如果发射到父节点的信号与父节点接收到的信号相同，则父节点不会触发任何响应
        // updates and there will be no prop sync. However the local input state 没有更新，且不会有道具同步。但是本地输入状态
        // may be out of sync, so we need to force an update here. 可能已经不同步，因此我们需要在此强制更新
        if (
          hasChanged(value, emittedValue) && // 本地设置值 ≠ 转换后的值
          hasChanged(value, prevSetValue) && // 本地设置值 ≠ 上一次设置值
          !hasChanged(emittedValue, prevEmittedValue) // 转换后的值 === 上一次发送的值
        ) {
          trigger() // 强制触发更新，保证本地状态同步
        }

        // 步骤7：更新历史值，用于下一次防抖判断
        prevSetValue = value
        prevEmittedValue = emittedValue
      },
    }
  })

  // 8. 扩展 Ref 的迭代器：支持解构赋值（如 const [model, modifiers] = useModel(...)）
  // @ts-expect-error
  res[Symbol.iterator] = () => {
    let i = 0
    return {
      next() {
        if (i < 2) {
          return { value: i++ ? modifiers || EMPTY_OBJ : res, done: false }
        } else {
          return { done: true }
        }
      },
    }
  }

  return res
}

/**
 * 获取指定模型的修饰符对象
 *
 * @param props - 包含组件属性的对象
 * @param modelName - 模型名称，用于查找对应的修饰符
 * @returns 返回与模型名称匹配的修饰符对象，如果未找到则返回undefined
 */
export const getModelModifiers = (
  props: Record<string, any>,
  modelName: string,
): Record<string, boolean> | undefined => {
  // 特殊处理 modelValue 和 model-value 的情况，直接返回 props.modelModifiers
  // 对于其他模型名称，按以下顺序尝试获取修饰符：{modelName}Modifiers -> 驼峰化名称Modifiers -> 连字符名称Modifiers
  return modelName === 'modelValue' || modelName === 'model-value'
    ? props.modelModifiers
    : props[`${modelName}Modifiers`] ||
        props[`${camelize(modelName)}Modifiers`] ||
        props[`${hyphenate(modelName)}Modifiers`]
}
