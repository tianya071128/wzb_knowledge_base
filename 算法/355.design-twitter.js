/*
 * @lc app=leetcode.cn id=355 lang=javascript
 * @lcpr version=30204
 *
 * [355] 设计推特
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var Twitter = function () {
  // 关注列表
  this.followMap = new Map();
  // 推文集合
  this.tweet = [];
};

/**
 * @param {number} userId
 * @param {number} tweetId
 * @return {void}
 */
Twitter.prototype.postTweet = function (userId, tweetId) {
  this.tweet.unshift({
    userId,
    tweetId,
  });
};

/**
 * @param {number} userId
 * @return {number[]}
 */
Twitter.prototype.getNewsFeed = function (userId) {
  let list = [],
    followSet = this.followMap.get(userId) ?? new Set();

  // 添加自己
  followSet.add(userId);

  for (const { userId, tweetId } of this.tweet) {
    if (followSet.has(userId)) {
      list.push(tweetId);
    }

    if (list.length === 10) break;
  }

  return list;
};

/**
 * @param {number} followerId
 * @param {number} followeeId
 * @return {void}
 */
Twitter.prototype.follow = function (followerId, followeeId) {
  this.followMap.set(
    followerId,
    (this.followMap.get(followerId) ?? new Set()).add(followeeId)
  );
};

/**
 * @param {number} followerId
 * @param {number} followeeId
 * @return {void}
 */
Twitter.prototype.unfollow = function (followerId, followeeId) {
  if (this.followMap.has(followerId)) {
    this.followMap.get(followerId).delete(followeeId);
  }
};

/**
 * Your Twitter object will be instantiated and called as such:
 * var obj = new Twitter()
 * obj.postTweet(userId,tweetId)
 * var param_2 = obj.getNewsFeed(userId)
 * obj.follow(followerId,followeeId)
 * obj.unfollow(followerId,followeeId)
 */
// @lc code=end

// var obj = new Twitter();
// obj.postTweet(1, 5);
// obj.postTweet(1, 3);
// obj.getNewsFeed(1);
// obj.follow(1, 2);
// obj.postTweet(2, 6);
// obj.getNewsFeed(1);

// @lcpr-after-debug-begin
module.exports = Twitter;
// @lcpr-after-debug-end
