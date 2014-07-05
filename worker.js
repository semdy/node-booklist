/**
 * 工作进程
 */

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var log4js = require("./lib/log");
var environment = require("./lib/env").config();
var session = require("./lib/session");
var router = require('./routes/router');

var app = express();
log4js.configure("worker");

/* 模板引擎 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* 中间件 */
app.use(favicon());
app.use(log4js.useLog());
app.use(express.static(path.join(__dirname, environment["static"])));
// 该项默认解析application/json和application/x-www-form-urlencoded
app.use(bodyParser());
app.use(cookieParser());
app.use(session.use());
/* 路由 */
router(app);

/* 捕获中间件抛出的异常 */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


/* 启动工作进程 */
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get("port"), function() {
    var log = log4js.logger("worker");
    log.info("start worker, pid is " + process.pid);
});

/* 捕获全局异常，如果最终调入到了这里，要非常注意 */
process.on("uncaughtException", function(err) {
    var log = log4js.logger("worker_" + process.pid);
    log.error("Error caught in uncaughtException event:", err);
});


