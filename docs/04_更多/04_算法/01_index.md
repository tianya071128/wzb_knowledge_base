# 算法

## 摩尔投票法

摩尔投票法（Boyer-Moore Voting Algorithm）是一种用于在数组中查找多数元素的高效算法，多数元素指的是在数组中出现次数大于 ⌊ n/2 ⌋（n 为数组元素个数）的元素。

摩尔投票法分为两个阶段：抵消阶段和计数阶段：

- 抵消阶段：找到**最有可能**是多数的元素

  1. 设定候选元素 candidate 为数组的第一个元素
  2. 设定计数器 count = 0
  3. 遍历数组
     - 与候选元素不同
       - 计数器大于 0, 计数器 -1
       - 计数器等于 0, 更换候选元素,并将计数器设置为 1
     - 与候选元素相同, 计数器 +1

- 计数阶段：判断抵消阶段找到的元素是否出现了多次, 遍历判断

参考文档: [leetcode - 229.多数元素 ii](https://leetcode.cn/problems/majority-element-ii/solutions/123170/liang-fu-dong-hua-yan-shi-mo-er-tou-piao-fa-zui-zh/)

## 前缀和

常被用于高效解决各类区间相关问题

### 一维前缀和

对于一个给定的一维数组 nums，其前缀和数组 prefixSum 定义为：prefixSum[i] 表示从 nums[0] 到 nums[i] 所有元素的和（包含 nums[i]）。

#### 计算前缀和:

```javascript
function calculatePrefixSum(nums) {
    const prefixSum = [];
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
        prefixSum.push(sum);
    }
    return prefixSum;
}
```

#### 应用场景:

* **区间求和问题**：这是一维前缀和最常见的应用，能快速计算数组中某个区间 `[i, j]`（`i <= j`）内元素的和。

### 二维前缀和

在二维数组中也可以构建前缀和矩阵来实现类似的高效计算。

#### 计算二维前缀和:

```js
function calculate2DPrefixSum(matrix) {
  const sum = new Array(matrix.length + 1)
    .fill(0)
    .map((item) => new Array(matrix[0].length + 1).fill(0));
  for (let i = 1; i <= matrix.length; i++) {
    for (let j = 1; j <= matrix[0].length; j++) {
      sum[i][j] =
        sum[i - 1][j] +
        sum[i][j - 1] -
        sum[i - 1][j - 1] +
        matrix[i - 1][j - 1];
    }
  }
  return sum;
};
```

#### 应用场景:

* 利用二维前缀和矩阵，可以快速计算二维区域内元素的和。



参考:  [leetcode - 304.二维区域和检索](https://leetcode.cn/problems/range-sum-query-2d-immutable/description/)

