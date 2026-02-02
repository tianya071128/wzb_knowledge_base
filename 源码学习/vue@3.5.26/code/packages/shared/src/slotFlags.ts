export enum SlotFlags {
  /**
   * Stable slots that only reference slot props or context state. The slot 仅引用插槽道具或上下文状态的稳定插槽。插槽
   * can fully capture its own dependencies so when passed down the parent won't 可以完全捕获自身的依赖关系，这样在向下传递时，父级就不会受到影响
   * need to force the child to update. 需要强制孩子进行更新
   */
  STABLE = 1,
  /**
   * Slots that reference scope variables (v-for or an outer slot prop), or
   * has conditional structure (v-if, v-for). The parent will need to force
   * the child to update because the slot does not fully capture its dependencies.
   */
  DYNAMIC = 2,
  /**
   * `<slot/>` being forwarded into a child component. Whether the parent needs
   * to update the child is dependent on what kind of slots the parent itself
   * received. This has to be refined at runtime, when the child's vnode
   * is being created (in `normalizeChildren`)
   */
  FORWARDED = 3,
}

/**
 * Dev only
 */
export const slotFlagsText: Record<SlotFlags, string> = {
  [SlotFlags.STABLE]: 'STABLE',
  [SlotFlags.DYNAMIC]: 'DYNAMIC',
  [SlotFlags.FORWARDED]: 'FORWARDED',
}
