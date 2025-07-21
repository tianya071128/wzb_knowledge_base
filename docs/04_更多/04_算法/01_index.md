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

## 蓄水池抽样

蓄水池抽样（Reservoir Sampling）是一种随机抽样算法，它能够在给定一个数据流或者一个未知大小的数据集的情况下，从中随机抽取 `k` 个样本，并且保证每个数据被抽取到的概率相等

### 基本原理

假设我们要从包含 `n` 个元素（`n` 可以是未知的，比如数据流源源不断到来，无法预先确定总数）的数据集里随机抽取 `k` 个元素作为样本。

- **初始化阶段**：
  先将数据流中的前 `k` 个元素直接放入 “蓄水池”（可以理解为一个存储样本的容器，这里就是一个长度为 `k` 的数组之类的结构）中，此时这 `k` 个元素就是最初的样本集合。
- **后续处理阶段**：
  从第 `k + 1` 个元素开始，对于每一个新到达的数据元素 `i`（`i > k`），都生成一个随机数 `r`，其范围在 `0` 到 `i - 1` 之间（包含 `0` 和 `i - 1`）。如果 `r` 小于 `k`，那就用这个新元素替换 “蓄水池” 中索引为 `r` 的元素；否则，就跳过该元素，继续处理下一个新到达的数据元素。

### 代码示例

```js
/**
 * 蓄水池抽样算法实现
 * @param {Array} dataSource - 数据源（数组或生成器）
 * @param {number} k - 抽样数量
 * @returns {Array} - 抽样结果
 */
function reservoirSampling(dataSource, k) {
    const reservoir = []; // 初始化蓄水池
    
    // 处理数组类型的数据源
    if (Array.isArray(dataSource)) {
        for (let i = 0; i < dataSource.length; i++) {
            if (i < k) {
                reservoir.push(dataSource[i]); // 前k个元素直接放入蓄水池
            } else {
                const j = Math.floor(Math.random() * (i + 1)); // 生成0到i之间的随机数
                if (j < k) {
                    reservoir[j] = dataSource[i]; // 以k/i的概率替换蓄水池中的元素
                }
            }
        }
        return reservoir;
    }
}

// 示例1：从数组中抽样
const arrayData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const sampleFromArray = reservoirSampling(arrayData, 3);
console.log('从数组中抽样:', sampleFromArray);
```



### 特点与优势

- **对数据规模无要求**：无论是处理大规模的数据文件（其大小甚至超过内存容量，只能逐行读取等情况），还是源源不断的数据流（如实时网络数据采集场景），都可以有效地进行随机抽样，不需要预先知道数据的总量。
- **保证随机性和等概率性**：能严格确保数据集中的每一个元素都有相同的概率被选入最终的抽样样本中，这使得抽样结果能够很好地代表整体数据的分布特征，可用于数据分析、统计推断等诸多应用场景。













