/**
 * 将sid存放到客户端，服务器端不存放该信息。
 * 客户端的每次请求都要附带该sid，然后服务器端对其进行解码
 */

var sessions = require("client-sessions");

/**
 * 作为中间件
 */
exports.use = function() {
    return sessions({
        cookieName: "session",
        secret: "thisisarandomstringyjfengwenbooklistasdfzxcv",
        duration: 24 * 60 * 60 * 1000,
        activeDuration: 5 * 60 * 1000
    });
}