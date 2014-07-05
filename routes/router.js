/**
 * 路由入口，在此进行各种路由配置
 */

var index = require("./index");
var login = require("./login");
var users = require("./users");
var category = require("./category");
var search = require("./search");
var book = require("./book");
var upload = require("./upload");

module.exports = function(app) {
    app.use("/", index);
    app.use("/login", login);
    app.use("/users", users);
    app.use("/category", category);
    app.use("/search", search);
    app.use("/book", book);
    app.use("/upload", upload);

    /**
     * 没有匹配的路由，抛出404错误
     */
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
}