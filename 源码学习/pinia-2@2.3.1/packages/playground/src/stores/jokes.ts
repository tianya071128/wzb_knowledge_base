import { ref, unref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getRandomJoke, Joke } from '../api/jokes'

export const useJokes = defineStore('jokes', {
  state: () => ({
    current: null as null | Joke,
    jokes: [] as Joke[],
    // hello: true,
  }),
  actions: {
    async fetchJoke() {
      if (
        this.current &&
        // if the request below fails, avoid adding it twice 如果下面的请求失败，请避免添加两次
        !this.jokes.includes(this.current)
      ) {
        this.jokes.push(this.current)
      }

      // NOTE: Avoid patching an object because it's recursive 避免修补对象，因为它是递归的
      // this.$patch({ current: await getRandomJoke() })
      this.current = await getRandomJoke()
    },
  },
})

export const useJokesSetup = defineStore('jokes-setup', () => {
  const current = ref<null | Joke>(null)
  const history = ref<Joke[]>([])

  async function fetchJoke() {
    const cur = unref(current.value)
    if (
      cur &&
      // if the request below fails, avoid adding it twice
      !history.value.find((joke) => joke.id === cur.id)
    ) {
      history.value.push(cur)
    }

    current.value = await getRandomJoke()
    return current.value
  }

  return { current, history, fetchJoke }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJokes, import.meta.hot))
  // import.meta.hot.accept(acceptHMRUpdate(useJokesSetup, import.meta.hot))
}
