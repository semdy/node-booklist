/**
 * 主进程
 */

var cluster = require("cluster");
var cpus = require("os").cpus();
var data = require("./lib/data");
var log4js = require("./lib/log");
log4js.configure("master");

// 同步生成存放数据的目录
data.initDataDirectory();

cluster.setupMaster({
    exec: "worker.js"
});

for (var i = 0, size = cpus.length; i < size; i++) {
    cluster.fork();
}

