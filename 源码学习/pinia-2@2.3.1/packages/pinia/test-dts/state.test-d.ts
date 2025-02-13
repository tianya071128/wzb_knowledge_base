import { computed, type Ref, ref, shallowRef } from 'vue'
import { defineStore, expectType } from './'

const name = ref('Eduardo')
const counter = ref(0)
const double = computed({
  get: () => counter.value * 2,
  set(val) {
    counter.value = val / 2
  },
})
const nestedRef = ref({ a: ref(0) })

const useStore = defineStore('name', {
  state: () => ({
    n: 0,
    name,
    double,
    counter,
    aRef: ref(0),
    aShallowRef: shallowRef({ msg: 'hi' }),
    anotherShallowRef: shallowRef({ aRef: ref('hello') }),
    nestedRef,
  }),

  getters: {
    myDouble: (state) => {
      expectType<number>(state.double)
      expectType<number>(state.counter)
      expectType<number>(state.nestedRef.a)
      return state.n * 2
    },
    other(): undefined {
      expectType<number>(this.double)
      expectType<number>(this.counter)
      return undefined
    },

    fromARef: (state) => state.aRef,
  },

  actions: {
    some() {
      expectType<number>(this.$state.double)
      expectType<number>(this.$state.counter)
      expectType<number>(this.double)
      expectType<number>(this.counter)

      this.$patch({ counter: 2 })
      this.$patch((state) => {
        expectType<number>(state.counter)
      })
    },
  },
})

const store = useStore()

store.$patch({ counter: 2 })
store.$patch((state) => {
  expectType<number>(state.counter)
})

expectType<number>(store.$state.counter)
expectType<number>(store.$state.double)

expectType<number>(store.aRef)
expectType<number>(store.$state.aRef)
expectType<number>(store.fromARef)

expectType<{ msg: string }>(store.aShallowRef)
expectType<{ msg: string }>(store.$state.aShallowRef)
expectType<{ aRef: Ref<string> }>(store.anotherShallowRef)
expectType<{ aRef: Ref<string> }>(store.$state.anotherShallowRef)

const onlyState = defineStore('main', {
  state: () => ({
    // counter: 0,
    // TODO: having only name fails...
    name: 'hey',
    some: 'hello',
  }),
})()

onlyState.$patch({ some: 'other' })
onlyState.$patch((state) => {
  expectType<string>(state.some)
  expectType<string>(state.name)
})

const useSetupStore = defineStore('composition', () => ({
  anotherShallowRef: shallowRef({ aRef: ref('hello') }),
}))

const setupStore = useSetupStore()
expectType<{ aRef: Ref<string> }>(setupStore.anotherShallowRef)
expectType<{ aRef: Ref<string> }>(setupStore.$state.anotherShallowRef)
