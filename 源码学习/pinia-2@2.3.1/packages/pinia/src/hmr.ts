import { isRef, isReactive, isVue2, set } from 'vue-demi'
import { Pinia } from './rootStore'
import {
  isPlainObject,
  StateTree,
  StoreDefinition,
  StoreGeneric,
  _GettersTree,
  _Method,
  _ActionsTree,
} from './types'

/**
 * Checks if a function is a `StoreDefinition`. 检查函数是否是一个 StoreDefinition
 *
 * @param fn - object to test
 * @returns true if `fn` is a StoreDefinition
 */
export const isUseStore = (fn: any): fn is StoreDefinition => {
  return typeof fn === 'function' && typeof fn.$id === 'string'
}

/**
 * Mutates in place `newState` with `oldState` to _hot update_ it. It will
 * remove any key not existing in `newState` and recursively merge plain
 * objects.
 *
 * @param newState - new state object to be patched
 * @param oldState - old state that should be used to patch newState
 * @returns - newState
 */
export function patchObject(
  newState: Record<string, any>,
  oldState: Record<string, any>
): Record<string, any> {
  // no need to go through symbols because they cannot be serialized anyway
  for (const key in oldState) {
    const subPatch = oldState[key]

    // skip the whole sub tree
    if (!(key in newState)) {
      continue
    }

    const targetValue = newState[key]
    if (
      isPlainObject(targetValue) &&
      isPlainObject(subPatch) &&
      !isRef(subPatch) &&
      !isReactive(subPatch)
    ) {
      newState[key] = patchObject(targetValue, subPatch)
    } else {
      // objects are either a bit more complex (e.g. refs) or primitives, so we
      // just set the whole thing
      if (isVue2) {
        set(newState, key, subPatch)
      } else {
        newState[key] = subPatch
      }
    }
  }

  return newState
}

/**
 * Creates an _accept_ function to pass to `import.meta.hot` in Vite applications.
 *
 * @example
 * ```js
 * const useUser = defineStore(...)
 * if (import.meta.hot) {
 *   import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
 * }
 * ```
 *
 * @param initialUseStore - return of the defineStore to hot update
 * @param hot - `import.meta.hot`
 */
export function acceptHMRUpdate<
  Id extends string = string,
  S extends StateTree = StateTree,
  G extends _GettersTree<S> = _GettersTree<S>,
  A = _ActionsTree,
>(initialUseStore: StoreDefinition<Id, S, G, A>, hot: any) {
  // strip as much as possible from iife.prod 尽可能脱离iife.prod
  // 在生产环境下不执行任何操作，直接返回一个空函数
  if (!__DEV__) {
    return () => {}
  }

  // 返回一个函数，该函数用于处理新的模块定义
  return (newModule: any) => {
    // 尝试从hot.data中获取pinia实例，如果获取不到，则使用initialUseStore._pinia
    const pinia: Pinia | undefined = hot.data.pinia || initialUseStore._pinia

    // 如果pinia实例不存在，说明该store尚未被使用，直接返回
    if (!pinia) {
      // this store is still not used 这家商店仍然不使用
      return
    }

    // 在 hot.data 中保存 pinia 实例，以确保在多次更新中保留相同的 pinia 实例
    hot.data.pinia = pinia

    // 遍历新模块的导出，检查是否有符合要求的store定义
    // console.log('got data', newStore)
    for (const exportName in newModule) {
      const useStore = newModule[exportName]
      // console.log('checking for', exportName)
      // 如果是有效的store定义且pinia中已存在该store，则进行更新
      if (isUseStore(useStore) && pinia._s.has(useStore.$id)) {
        // console.log('Accepting update for', useStore.$id)
        const id = useStore.$id

        // 如果store的id发生变化，输出警告并触发模块重载
        if (id !== initialUseStore.$id) {
          // 商店的ID从"${initialUseStore.$id}" 到 "${id}" 重新加载
          console.warn(
            `The id of the store changed from "${initialUseStore.$id}" to "${id}". Reloading.`
          )
          // return import.meta.hot.invalidate()
          return hot.invalidate()
        }

        // 已存在的 store, 可以理解为旧的 store
        const existingStore: StoreGeneric = pinia._s.get(id)!
        if (!existingStore) {
          // 跳过HMR，因为商店还不存在
          console.log(`[Pinia]: skipping hmr because store doesn't exist yet`)
          return
        }

        /**
         * 在这里会根据新的模块创建一个 store, 之后使用 newStore 的值更新旧的 store
         * 具体更新操作可见 _hotUpdate 方法
         * 之后清除 newStore 即可
         */
        useStore(pinia, existingStore)
      }
    }
  }
}
