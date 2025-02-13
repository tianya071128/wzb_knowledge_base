import { expectType, defineStore, storeToRefs } from './'
import { computed, ComputedRef, ref, Ref, shallowRef } from 'vue'

const useOptionsStore = defineStore('main', {
  state: () => ({
    n: 0,
    ref: ref({
      n: 0,
      ref: ref(0),
    }),
    shallowRef: shallowRef({
      n: 0,
      ref: ref(0),
    }),
  }),
})

const optionsStore = useOptionsStore()
const optionsRefs = storeToRefs(optionsStore)

expectType<Ref<number>>(optionsRefs.n)
expectType<Ref<{ n: number; ref: number }>>(optionsRefs.ref)
expectType<Ref<{ n: number; ref: Ref<number> }>>(optionsRefs.shallowRef)

const useSetupStore = defineStore('main', () => {
  return {
    n: ref(0),
    ref: ref({
      n: 0,
      ref: ref(0),
    }),
    shallowRef: shallowRef({
      n: 0,
      ref: ref(0),
    }),
    // https://github.com/vuejs/pinia/issues/2658
    accidentallyNestedComputed: computed(() => computed(() => 'a')),
    computedRef: computed(() => ref(0)),
  }
})

const setupStore = useSetupStore()
const setupRefs = storeToRefs(setupStore)

expectType<Ref<number>>(setupRefs.n)
expectType<Ref<{ n: number; ref: number }>>(setupRefs.ref)
expectType<Ref<{ n: number; ref: Ref<number> }>>(setupRefs.shallowRef)
expectType<ComputedRef<string>>(setupRefs.accidentallyNestedComputed.value)
expectType<Ref<number>>(setupRefs.computedRef.value)
