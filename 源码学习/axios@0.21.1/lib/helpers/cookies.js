/*
 * @Descripttion: 
 * @Author: sueRimn
 * @Date: 2019-12-27 12:17:22
 * @LastEditTime: 2019-12-30 15:40:00
 */
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

    // 标准浏览器环境支持document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

    // 非标准浏览器env（web workers，react native）缺少所需的支持.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() { },
        read: function read() { return null; },
        remove: function remove() { }
      };
    })()
);
