/*
 * @lc app=leetcode.cn id=900 lang=javascript
 * @lcpr version=30204
 *
 * [900] RLE 迭代器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} encoding
 */
var RLEIterator = function (encoding) {
  this.encoding = encoding;
};

/**
 * @param {number} n
 * @return {number}
 */
RLEIterator.prototype.next = function (n) {
  let ans = -1;
  while (n > 0 && this.encoding.length) {
    ans = this.encoding[1]; // 当前数字
    // 如果当钱数字够 n 消费的话
    if (this.encoding[0] >= n) {
      this.encoding[0] -= n;
      n = 0;
    }
    // 否则剔除前两项
    else {
      n -= this.encoding[0];
      this.encoding.splice(0, 2);
    }
  }

  return n === 0 ? ans : -1;
};

/**
 * Your RLEIterator object will be instantiated and called as such:
 * var obj = new RLEIterator(encoding)
 * var param_1 = obj.next(n)
 */
// @lc code=end

/*
// @lcpr case=start
// ["RLEIterator","next","next","next","next"]\n[[[3,8,0,9,2,5]],[2],[1],[1],[2]]\n
// @lcpr case=end

 */

/*
// @lcpr case=start
// ["RLEIterator","next","next","next","next","next","next","next","next","next","next","next","next","next","next","next","next","next","next","next","next"]\n[[[923381016,843,898173122,924,540599925,391,705283400,275,811628709,850,895038968,590,949764874,580,450563107,660,996257840,917,793325084,82]],[612783106],[486444202],[630147341],[845077576],[243035623],[731489221],[117134294],[220460537],[794582972],[332536150],[815913097],[100607521],[146358489],[697670641],[45234068],[573866037],[519323635],[27431940],[16279485],[203970]]\n
// @lcpr case=end

 */
