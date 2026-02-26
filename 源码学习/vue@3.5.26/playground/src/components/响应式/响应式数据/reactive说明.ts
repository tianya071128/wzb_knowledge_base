import { reactive } from 'vue';

/**
 * 1. reactive 和 readonly 的实现原理
 *
 *     - 使用 Proxy 代理, 在创建时, 主要通过 Proxy 处理器来进行相关操作的拦截
 *
 *     - 在创建时, 逻辑比较清晰, **最主要的处理逻辑在对应的 Proxy 处理器中** --> packages/reactivity/src/baseHandlers.ts
 *
 *     - 注意: 在创建时, 并不会直接递归处理嵌套对象, 而是在处理器的 get 拦截器中, 会根据需要来处理嵌套对象的响应式, 也就是调用对应的 reactive 或 readonly
 */

/**
 * 2. 数组的特殊处理
 */

/**
 * 3. Map、Set、WeakMap、WeakSet 的特殊处理
 */
