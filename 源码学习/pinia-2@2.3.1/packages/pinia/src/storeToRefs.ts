import {
  computed,
  ComputedRef,
  isReactive,
  isRef,
  isVue2,
  toRaw,
  ToRef,
  toRef,
  ToRefs,
  toRefs,
  WritableComputedRef,
} from 'vue-demi'
import { StoreGetters, StoreState } from './store'
import type {
  _ActionsTree,
  _GettersTree,
  _UnwrapAll,
  PiniaCustomStateProperties,
  StateTree,
  Store,
  StoreGeneric,
} from './types'

/**
 * Internal utility type
 */
type _IfEquals<X, Y, A = true, B = false> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B

/**
 * Internal utility type
 */
type _IsReadonly<T, K extends keyof T> = _IfEquals<
  { [P in K]: T[P] },
  { -readonly [P in K]: T[P] },
  false, // Property is not readonly if they are the same
  true // Property is readonly if they differ
>

/**
 * Extracts the getters of a store while keeping writable and readonly properties. **Internal type DO NOT USE**.
 */
type _ToComputedRefs<SS> = {
  [K in keyof SS]: true extends _IsReadonly<SS, K>
    ? ComputedRef<SS[K]>
    : WritableComputedRef<SS[K]>
}

/**
 * Extracts the refs of a state object from a store. If the state value is a Ref or type that extends ref, it will be kept as is.
 * Otherwise, it will be converted into a Ref. **Internal type DO NOT USE**.
 */
type _ToStateRefs<SS> =
  SS extends Store<
    string,
    infer UnwrappedState,
    _GettersTree<StateTree>,
    _ActionsTree
  >
    ? UnwrappedState extends _UnwrapAll<Pick<infer State, infer Key>>
      ? {
          [K in Key]: ToRef<State[K]>
        }
      : ToRefs<UnwrappedState>
    : ToRefs<StoreState<SS>>

/**
 * Extracts the return type for `storeToRefs`.
 * Will convert any `getters` into `ComputedRef`.
 */
export type StoreToRefs<SS extends StoreGeneric> =
  // NOTE: always trues but the conditional makes the type distributive
  // https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
  SS extends unknown
    ? _ToStateRefs<SS> &
        ToRefs<PiniaCustomStateProperties<StoreState<SS>>> &
        _ToComputedRefs<StoreGetters<SS>>
    : never

/**
 * Creates an object of references with all the state, getters, and plugin-added 创建一个引用对象，包含 store 的所有 state、 getter 和 plugin 添加的 state 属性。
 * state properties of the store. Similar to `toRefs()` but specifically 类似于`toRefs（）`，
 * designed for Pinia stores so methods and non reactive properties are 但专为 Pinia store 设计，所以 method 和非响应式属性会被完全忽略。
 * completely ignored.
 *  https://pinia.vuejs.org/zh/api/modules/pinia.html#storetorefs
 * @param store - store to extract the refs from
 */
export function storeToRefs<SS extends StoreGeneric>(
  store: SS
): StoreToRefs<SS> {
  // See https://github.com/vuejs/pinia/issues/852
  // It's easier to just use toRefs() even if it includes more stuff 即使 toRefs（）包含更多内容，也更容易使用
  if (isVue2) {
    // @ts-expect-error: toRefs include methods and others
    return toRefs(store)
  } else {
    // 获取存储的原始对象，避免响应式代理带来的影响
    const rawStore = toRaw(store)

    const refs = {} as StoreToRefs<SS>
    for (const key in rawStore) {
      const value = rawStore[key]
      // There is no native method to check for a computed 没有本机方法可以检查计算的
      // https://github.com/vuejs/core/pull/4165

      // 由于没有原生方法来检查一个属性是否为计算属性
      // 通过检查属性是否有 effect 来判断它是否为计算属性
      if (value.effect) {
        // @ts-expect-error: too hard to type correctly
        refs[key] =
          // ...
          computed({
            get: () => store[key],
            set(value) {
              store[key] = value
            },
          })
      } else if (isRef(value) || isReactive(value)) {
        // 建立链接
        // @ts-expect-error: the key is state or getter
        refs[key] =
          // ---
          toRef(store, key)
      }
    }

    return refs
  }
}
