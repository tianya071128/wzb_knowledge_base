import './parent.js'

if (import.meta.hot) {
  // Need to accept, to register a callback for HMR 需要接受，为HMR注册回调
  import.meta.hot.accept(() => {
    // Triggers full page reload because no importers 由于没有导入程序而触发整页重新加载
    // 无法处理 HMR 更新, 整页加载2222
    import.meta.hot.invalidate()
  })
}

const root = document.querySelector('.invalidation-root')

// Non HMR-able behaviour
if (!root.innerHTML) {
  root.innerHTML = 'Init'
}
