import {
  type ComponentInternalInstance,
  getCurrentInstance,
} from '../component'
import { warn } from '../warning'

/**
 * 生成一个唯一的ID，用于组件实例关联
 * 在服务端渲染时保证ID的一致性
 *
 * @returns 返回一个唯一标识符字符串，格式为"前缀-ids[0]ids[1]++"
 *          如果当前没有活动的组件实例，则在开发模式下发出警告并返回空字符串
 */
export function useId(): string {
  const i = getCurrentInstance()
  if (i) {
    return (i.appContext.config.idPrefix || 'v') + '-' + i.ids[0] + i.ids[1]++
  } else if (__DEV__) {
    warn(
      `useId() is called when there is no active component ` + // 当没有活动组件时调用 useId()
        `instance to be associated with.`, // 要关联的实例
    )
  }
  return ''
}

/**
 * There are 3 types of async boundaries: 异步边界有三种类型
 * - async components 异步组件
 * - components with async setup() 具有异步 setup() 方法的组件
 * - components with serverPrefetch 带有 serverPrefetch 的组件
 */
export function markAsyncBoundary(instance: ComponentInternalInstance): void {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + '-', 0, 0]
}
