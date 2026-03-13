import { value } from './child'

if (import.meta.hot) {
  import.meta.hot.accept()
}

console.log('（无效）父级正在执行')

document.querySelector('.invalidation-parent').innerHTML = value
