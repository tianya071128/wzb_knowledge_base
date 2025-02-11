/*
 * @lc app=leetcode.cn id=912 lang=typescript
 * @lcpr version=30204
 *
 * [912] 排序数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 选择排序: 开启一个循环，每轮从未排序区间选择最小的元素，将其放到已排序区间的末尾。
 */
// function sortArray(nums: number[]): number[] {
//   let min = Infinity,
//     minIndex = 0,
//     n = nums.length,
//     temp;
//   // 只需循环 n - 1 次, 最后一个元素必定是最大元素
//   for (let i = 0; i < n - 1; i++) {
//     min = Infinity;

//     for (let j = i; j < n; j++) {
//       const item = nums[j];
//       if (item < min) {
//         min = item;
//         minIndex = j;
//       }
//     }

//     // 交换元素
//     temp = nums[i];
//     nums[i] = nums[minIndex];
//     nums[minIndex] = temp;
//   }

//   return nums;
// }
/**
 * 冒泡排序: 通过连续地比较与交换相邻元素实现排序。这个过程就像气泡从底部升到顶部一样，因此得名冒泡排序。
 */
// function sortArray(nums: number[]): number[] {
//   // 只需循环 n - 1 次, 最后一个元素必定是最大元素
//   for (let i = 0; i < nums.length - 1; i++) {
//     for (let j = 0; j < nums.length - 1 - i; j++) {
//       // 与相邻进行比较
//       let item = nums[j];
//       let item2 = nums[j + 1];
//       if (item > item2) {
//         nums[j] = item2;
//         nums[j + 1] = item;
//       }
//     }
//   }

//   return nums;
// }

/**
 * 插入排序: 工作原理与手动整理一副牌的过程非常相似。我们在未排序区间选择一个基准元素，将该元素与其左侧已排序区间的元素逐一比较大小，并将该元素插入到正确的位置。
 */
// function sortArray(nums: number[]): number[] {
//   /**
//    * 1. 初始状态下，数组的第 1 个元素已完成排序。
//    * 2. 选取数组的第 2 个元素作为 base ，将其插入到正确位置后，数组的前 2 个元素已排序。
//    * 3. 选取第 3 个元素作为 base ，将其插入到正确位置后，数组的前 3 个元素已排序。
//    * 4. 以此类推，在最后一轮中，选取最后一个元素作为 base ，将其插入到正确位置后，所有元素均已排序。
//    */
//   for (let i = 1; i < nums.length; i++) {
//     let j = i - 1,
//       base = nums[i];

//     // 内循环: 找到应该插入的位置, 并且将 j 位置的往后移动一位
//     while (j > -1 && nums[j] > base) {
//       nums[j + 1] = nums[j];
//       j--;
//     }

//     nums[j + 1] = base;
//   }

//   return nums;
// }

/**
 * 快速排序: 基于分治策略的排序算法。选择数组中的某个元素作为“基准数”，将所有小于基准数的元素移到其左侧，而大于基准数的元素移到其右侧。
 */
function sortArray(nums: number[]): number[] {
  /**
   * 1. 选取数组最左端元素作为基准数，初始化两个指针 i 和 j 分别指向数组的两端。
   * 2. 设置一个循环，在每轮中使用 i（j）分别寻找第一个比基准数大（小）的元素，然后交换这两个元素。
   * 3. 循环执行步骤 2. ，直到 i 和 j 相遇时停止，最后将基准数交换至两个子数组的分界线。
   * 4. 得到未排序的左子数组和右子数组。
   * 5. 然后，对左子数组和右子数组分别递归执行“哨兵划分”。
   * 6. 持续递归，直至子数组长度为 1 时终止，从而完成整个数组的排序。
   */

  /** 哨兵划分: 执行一轮 */
  function partition(left, right) {
    let base = nums[left];

    while (right > left) {
      // 从 [left + 1, right] 两端分别寻找第一个比基准数大（小）的元素，然后交换这两个元素。
      // 先从右边开始找到第一个比基准数小的元素
      while (right >= left) {}
    }
  }

  /** 排序: 递归执行 */
  function quickSort(left, right) {
    // 结束条件
    if (left >= right) return;

    // 找到基准数的位置
    const baseIndex = partition(left, right);
  }

  quickSort(0, nums.length - 1);
  return nums;
}
// @lc code=end

/*
// @lcpr case=start
// [5,2,3,1]\n
// @lcpr case=end

// @lcpr case=start
// [5,1,1,2,0,0]\n
// @lcpr case=end

 */
