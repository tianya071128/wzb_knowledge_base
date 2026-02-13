import {
  type ComponentInternalInstance,
  getCurrentInstance,
} from '../component'
import { warn } from '../warning'

export function useId(): string {
  const i = getCurrentInstance()
  if (i) {
    return (i.appContext.config.idPrefix || 'v') + '-' + i.ids[0] + i.ids[1]++
  } else if (__DEV__) {
    warn(
      `useId() is called when there is no active component ` +
        `instance to be associated with.`,
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
