/*
 * @lc app=leetcode.cn id=1337 lang=javascript
 * @lcpr version=30204
 *
 * [1337] 矩阵中战斗力最弱的 K 行
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} mat
 * @param {number} k
 * @return {number[]}
 */
var kWeakestRows = function (mat, k) {
  let heap = new CustomHeap(
    [],
    (i, j) => i[1] < j[1] || (i[1] === j[1] && i[0] < j[0])
  );
  // 优先级队列
  for (let i = 0; i < mat.length; i++) {
    // 得分
    let total = 0;
    for (const n of mat[i]) {
      n === 1 && total++;
    }

    // 元素已满
    if (heap.size() >= k && total >= heap.peek()[1]) continue;

    // 入堆
    heap.push([i, total]);

    // 如果元素满了就出堆
    if (heap.size() > k) {
      heap.pop();
    }
  }

  return heap.getList(true).map((item) => item[0]);
};

class CustomHeap {
  #maxHeap = [];

  /**
   * 比较函数: 默认小顶堆
   *
   *  i - 父
   *  j - 子
   *
   *  返回 true, 则表示交换位置
   */
  #compareFn = (i, j) => i > j;

  /* 构造方法，建立空堆或根据输入列表建堆 */
  constructor(nums, compareFn) {
    // 将列表元素原封不动添加进堆
    this.#maxHeap = nums === undefined ? [] : [...nums];

    if (compareFn) this.#compareFn = compareFn;

    /**
     * 堆化除叶节点以外的其他所有节点(向下堆化)
     *  - 首先从最底部的非子节点元素进行堆化
     *  - 当底部的堆化后, 可以保证满足大顶堆的 当前节点的值 >= 其子节点的值
     *  - 这样继续遍历其他叶子节点时，其子节点的值已经满足堆的特性
     */
    for (let i = this.#parent(this.size() - 1); i >= 0; i--) {
      this.#siftDown(i);
    }
  }

  /* 获取左子节点的索引 */
  #left(i) {
    return 2 * i + 1;
  }

  /* 获取右子节点的索引 */
  #right(i) {
    return 2 * i + 2;
  }

  /* 获取父节点的索引 */
  #parent(i) {
    return Math.floor((i - 1) / 2); // 向下整除
  }

  /** 访问堆顶元素: 就是数组头部元素 */
  peek() {
    return this.#maxHeap[0];
  }

  /** 获取堆的元素数量 */
  size() {
    return this.#maxHeap.length;
  }

  /** 判断堆是否为空 */
  isEmpty() {
    return this.#maxHeap.length === 0;
  }

  /**
   * 元素入堆:
   *  1. 将其添加到堆底
   *  2. 堆化（heapify）: 从底至顶执行堆化，修复从插入节点到根节点的路径上的各个节点
   *      - 比较插入节点与其父节点的值，如果插入节点更大，则将它们交换。
   *      - 继续执行此操作，从底至顶修复堆中的各个节点，直至越过根节点或遇到无须交换的节点时结束
   */
  push(val) {
    // 添加到堆底
    this.#maxHeap.push(val);
    // 从底至顶堆化
    this.#siftUp(this.size() - 1);
  }

  /**
   * 元素出堆:
   *  1. 交换堆顶元素与堆底元素，防止其他节点索引变动
   *  2. 交换完成后，将堆底从列表中删除（由于已经交换，因此实际上删除的是原来的堆顶元素）。
   *  3. 从根节点开始，从顶至底执行堆化。
   */
  pop() {
    // 元素为空则不做处理
    if (this.isEmpty()) return;

    // 交换堆顶元素与堆底元素，防止其他节点索引变动
    this.#swap(0, this.size() - 1);

    // 删除之前的堆顶元素
    const val = this.#maxHeap.pop();

    // 从顶至底堆化
    this.#siftDown(0);

    return val;
  }

  /**
   * 交换节点
   */
  #swap(i, j) {
    [this.#maxHeap[i], this.#maxHeap[j]] = [this.#maxHeap[j], this.#maxHeap[i]];
  }

  /** 从指定节点向上堆化 */
  #siftUp(i) {
    let p = this.#parent(i); // 父节点索引
    while (p >= 0 && this.#compareFn(this.#maxHeap[p], this.#maxHeap[i])) {
      // 交换位置
      this.#swap(p, i);

      i = p;
      p = this.#parent(i);
    }
  }

  /** 从指定节点向下堆化 */
  #siftDown(i) {
    while (true) {
      const l = this.#left(i),
        r = this.#right(i);

      let target = i; // 目标节点
      // 如果左节点比目标节点大, 那么左节点替换成目标节点
      if (
        l < this.size() &&
        this.#compareFn(this.#maxHeap[target], this.#maxHeap[l])
      )
        target = l;
      if (
        r < this.size() &&
        this.#compareFn(this.#maxHeap[target], this.#maxHeap[r])
      )
        target = r;

      // 位置不变, 停止堆化
      if (target === i) break;

      // 否则交换位置后, 继续堆化
      this.#swap(target, i);
      i = target;
    }
  }

  /**
   * 获取堆中元素
   */
  getList(reverse = false) {
    let ans = [];
    while (this.size()) {
      ans[reverse ? 'unshift' : 'push'](this.pop());
    }

    return ans;
  }
}
// @lc code=end

/*
// @lcpr case=start
// [[1,1,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,0,0,0],[1,1,1,1,1]]\n3\n
// @lcpr case=end

// @lcpr case=start
// [[1,0,0,0],[1,1,1,1],[1,0,0,0],[1,0,0,0]]\n2\n
// @lcpr case=end

 */
