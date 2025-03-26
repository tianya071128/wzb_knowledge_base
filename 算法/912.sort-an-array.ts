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
// function sortArray(nums: number[]): number[] {
//   /**
//    * 1. 选取数组最左端元素作为基准数，初始化两个指针 i 和 j 分别指向数组的两端。
//    * 2. 设置一个循环，在每轮中使用 i（j）分别寻找第一个比基准数大（小）的元素，然后交换这两个元素。
//    * 3. 循环执行步骤 2. ，直到 i 和 j 相遇时停止，最后将基准数交换至两个子数组的分界线。
//    * 4. 得到未排序的左子数组和右子数组。
//    * 5. 然后，对左子数组和右子数组分别递归执行“哨兵划分”。
//    * 6. 持续递归，直至子数组长度为 1 时终止，从而完成整个数组的排序。
//    */
//   let temp = 0;
//   /** 交换元素 */
//   function swap(left: number, right: number) {
//     temp = nums[left];
//     nums[left] = nums[right];
//     nums[right] = temp;
//   }

//   /** 哨兵划分: 执行一轮 */
//   function partition(left: number, right: number) {
//     let baseIndex = left;
//     let base = nums[baseIndex];

//     while (right > left) {
//       // 从 [left + 1, right] 两端分别寻找第一个比基准数大（小）的元素，然后交换这两个元素。
//       // 先从右边开始找到第一个比基准数小的元素
//       while (right >= left) {
//         // 找到了比基准数小的元素
//         if (nums[right] <= base) break;
//         right--;
//       }

//       // 从左边开始找第一个比基准数大的元素
//       while (left < right) {
//         if (nums[left] > base) break;

//         left++;
//       }

//       // 交互元素
//       if (left < right) {
//         swap(left, right);
//       }
//     }

//     // 交换基准元素
//     if (left !== baseIndex) {
//       swap(baseIndex, left);
//     }

//     return left;
//   }

//   /** 排序: 递归执行 */
//   function quickSort(left: number, right: number) {
//     // 结束条件
//     if (left >= right) return;

//     // 找到基准数的位置
//     const baseIndex = partition(left, right);

//     // 分治左侧
//     quickSort(left, baseIndex - 1);
//     // 分治右侧
//     quickSort(baseIndex + 1, right);
//   }

//   quickSort(0, nums.length - 1);
//   return nums;
// }

/**
 * 归并排序:
 *  划分阶段：通过递归不断地将数组从中点处分开，将长数组的排序问题转换为短数组的排序问题。
 *  合并阶段：当子数组长度为 1 时终止划分，开始合并，持续地将左右两个较短的有序数组合并为一个较长的有序数组，直至结束。
 */
// function sortArray(nums: number[]): number[] {
//   function merge(nums: number[]) {
//     if (nums.length === 1) return nums;

//     // 划分阶段
//     let mid = Math.floor((nums.length - 1) / 2);
//     let left = merge(nums.slice(0, mid + 1));
//     let right = merge(nums.slice(mid + 1));

//     // 合并阶段
//     let ans: number[] = [],
//       i = 0,
//       j = 0;
//     while (i < left.length || j < right.length) {
//       if ((left[i] ?? Infinity) <= (right[j] ?? Infinity)) {
//         ans.push(left[i]);
//         i++;
//       } else {
//         ans.push(right[j]);
//         j++;
//       }
//     }

//     return ans;
//   }

//   return merge(nums);
// }

/**
 * 桶排序: 分治策略的一个典型应用 --> 排序的关键是如何划分桶, 以及快速定位到桶
 *  1. 通过设置一些具有大小顺序的桶，每个桶对应一个数据范围，将数据平均分配到各个桶中
 *  2. 在每个桶内部分别执行排序
 *  3. 最终按照桶的顺序将所有数据合并
 */
// function sortArray(nums: number[]): number[] {
//   // 找出最大值和最小值
//   const max = Math.max(...nums),
//     min = Math.min(...nums),
//     // 桶的数量
//     bucketCount = Math.max(Math.floor(nums.length / 2), 1),
//     // 桶的大小
//     bucketSize = Math.ceil(((max - min) / bucketCount) * 100) / 100,
//     bucket = new Array(bucketCount).fill(0).map<number[]>((item) => []);

//   // 分配桶
//   for (const item of nums) {
//     bucket[
//       bucketSize === 0 || item === min
//         ? 0
//         : Math.ceil((item - min) / bucketSize) - 1
//     ].push(item);
//   }

//   // 排序桶
//   for (const item of bucket) {
//     item.sort((a, b) => a - b);
//   }

//   // 合并桶
//   return bucket.reduce((total, item) => [...total, ...item]);
// }

/**
 * 计数排序: 只适合整数数组
 *  1. 找出最大值, 然后创建创建一个长度为 max + 1 的辅助数组 counter 。
 *  2. 借助 counter 统计 nums 中各数字的出现次数
 *  3. 由于 counter 的各个索引天然有序，因此相当于所有数字已经排序好了
 *
 * 局限性:
 *  1. 计数排序只适用于非负整数，将负数往辅助数组最后添加
 *  2. 计数排序适用于数据量大但数据范围较小的情况
 */
function sortArray(nums: number[]): number[] {
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  const list = Array<number>(max + (min < 0 ? -min : 0) + 1).fill(0);

  for (const item of nums) {
    list[item < 0 ? max - item : item]++;
  }

  let cur = 0;
  // 先处理负数
  for (let i = list.length - 1; i > max; i--) {
    for (let j = 0; j < list[i]; j++) {
      nums[cur++] = max - i;
    }
  }
  // 处理整数
  for (let i = 0; i <= max; i++) {
    for (let j = 0; j < list[i]; j++) {
      nums[cur++] = i;
    }
  }

  return nums;
}
// @lc code=end

/*
// @lcpr case=start
// [5, 3, 1, 2]\n
// @lcpr case=end

// @lcpr case=start
// [-5, 3, -1, -2]\n
// @lcpr case=end

// @lcpr case=start
// [5,1,1,2,0,0]\n
// @lcpr case=end

 */
