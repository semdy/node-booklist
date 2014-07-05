/**
 * 登录与注册
 */

var router = require('express').Router();
var log = require("../lib/log").logger("index");
var utils = require("../lib/utils");
var User = require("../model/user");

router.get('/', function(req, res) {
    res.render('login', {});
});

/**
 * url: /login/xxx
 */
router.post("/:action", function(req, res) {
    switch (req.params.action) {
        case "login":
            login(req, res);
            break;
        case "register":
            register(req, res);
            break;
        default:
            res.redirect("/");
    }
});

/**
 * 退出登录
 */
router.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/");
});

/**
 * 用户登录
 */
function login(req, res) {
    var body = req.body;
    if (!body.name || !body.password) {
        res.json({"code": "FA_PARAM_INVALID"});
    } else {
        User.get([], {"name": body.name, "password": body.password}, function(result) {
            if (result.length > 0) {
                if (body.autoLogin === "1") {
                    req.session.setDuration(24 * 60 * 60 * 1000, false);
                } else {
                    req.session.setDuration(2 * 3600 * 1000, true);
                }
                req.session.user = result[0];
                res.json({
                    "code": "S_OK",
                    "user": result[0]
                });
            } else {
                res.json({"code": "FA_USER_NOTEXIST"});
            }
        });
    }
}

/**
 * 用户注册
 * url: /login/register
 */
function register(req, res) {
    var body = req.body;
    validate(body, function(result) {
        // 校验成功，创建用户
        if (result === "S_OK") {
            var user = new User({
                "name": body.name,
                "password": body.password,
                "email": body.email
            });
            user.save(function(user) {
                req.session.user = user;
                res.json({"code": "S_OK"});
            });
        } else {
            res.json({"code": result});
        }
    });
}

/**
 * 校验用户信息
 * @param user {Object}
 * @param callback
 */
function validate(user, callback) {
    user = user || {};
    callback = callback || utils.noop();

    if (!utils.isEmail(user.email)) {
        callback("FA_EMAIL_INVALID");
        return;
    }

    if (user.password !== user.repeatPassword) {
        callback("FA_PASSWORD_NOTMATCH");
        return;
    }

    User.getByName(user.name, function(result) {
        if (result.length > 0) {
            callback("FA_USER_EXIST");
        } else {
            callback("S_OK");
        }
    });
}

module.exports = router;