/**
 * 操作用户信息
 */

var crypto = require("crypto");
var sqlClient = require("../lib/db").init();
var log = require("../lib/log").logger("user");
var utils = require("../lib/utils");

var User = module.exports = function(options) {
    var that = this;
    utils.extend(that, {
        "name": "",
        "password": "",
        "email": "",
        "logo": "data/logo/default.png",
        "create_time": "",
        "update_time": utils.dateformat(new Date(), "yyyy-MM-dd hh:mm:ss")
    }, options);
}

/**
 * 新建一个用户
 */
User.prototype.save = function(callback) {
    callback = callback || utils.noop;
    var that = this;
    var args = {
        "name": that.name,
        "password": crypto.createHash("md5").update(that.password).digest("hex"),
        "email": that.email,
        "logo": that.logo,
        "create_time": utils.dateformat(new Date(), "yyyy-MM-dd hh:mm:ss"),
        "update_time": that.update_time
    };
    sqlClient.insert("INSERT INTO user SET ?", args, function(err, result) {
        if (err) {
            log.error("create user:" + args.name + " failed.", err);
            callback(-1);
            return;
        }
        callback({
            "name": args.name,
            "email": args.email,
            "logo": args.logo,
            "insertId": result.insertId
        });
    })
}

/**
 * 根据条件检索用户
 * @param column {Array}  返回的字段，默认返回name, email, logo
 * @param condition {Object} 条件
 * @param callback {Function}
 */
User.get = function(column, condition, callback) {
    callback = callback || utils.noop();

    if (utils.type(column) !== "array" || column.length === 0) {
        column = ["name", "email", "logo"];
    }
    condition = condition || {};
    if (!!condition.password) {
        condition.password = crypto.createHash("md5").update(condition.password).digest("hex");
    }
    var sql = "SELECT ?? FROM user";
    var hasWhere = false;
    for (var key in condition) {
        if (!hasWhere) {
            sql += " WHERE";
            hasWhere = true;
        }
        sql += " " + key + "=" + sqlClient.escape(condition[key]) + " and";
    }
    if (hasWhere) {
        sql = sql.substr(0, sql.length - " and".length);
    }

    sqlClient.select(sql, [column], function(err, result) {
        if (err) {
            log.error("select user failed.", err);
            callback([]);
            return;
        }
        callback(result);
    });
}

/**
 * 根据用户名来检索用户
 * @param name {String}
 * @param callback {Function}
 */
User.getByName = function(name, callback) {
    name = name || "";

    User.get([], {"name": name}, callback);
}





