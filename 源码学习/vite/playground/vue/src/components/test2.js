console.log(600)

if (import.meta.hot) {
  // HMR 代码
  import.meta.hot.accept()

  import.meta.hot.dispose((data) => {
    // 清理副作用
    console.log('清理副作用')
  })
}
