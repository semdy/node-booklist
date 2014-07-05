/**
 * 工具类
 */
var utils = module.exports;

/**
 * 空函数
 */
utils.noop = function() {}

/**
 * 合并对象内容到第一个对象
 * @usage:
 *  utils.extend(target, [object1], [objectN])
 */
utils.extend = function() {
    var src, name,
        i = 1,
        target = arguments[0] || {},
        length = arguments.length;

    for (; i < length; i++) {
        src = arguments[i];
        if (utils.type(src) === "object") {
            for (name in src) {
                target[name] = src[name];
            }
        }
    }
    return target;
}

/**
 * 检测对象的类型
 */
utils.type = function(obj) {
    var toString = Object.prototype.toString;
    var type = {
        "undefined": "undefined",
        "number": "number",
        "boolean": "boolean",
        "string": "string",
        "[object Function]": "function",
        "[object RegExp]": "regexp",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object Error]": "error"
    };

    return type[typeof obj] || type[toString.call(obj)] || (obj ? "object" : "null");
}

/**
 * 格式化时间
 * @param date {Date}
 * @param format {String}
 * @usage
 *  utils.dateformat(date, "yyyy-MM-dd hh:mm:ss.S")
 *
 *  utils.dateformat(date, "yyyy-MM-dd hh:mm:ss")
 */
utils.dateformat = function(date, format) {
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),        // 季度
        "S": date.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var i in o) {
        if (new RegExp("(" + i + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? o[i] :
                ("00" + o[i]).substr(("" + o[i]).length));
        }
    }
    return format;
}

/**
 * 检测是否为合法的邮件地址
 * @param email
 * @returns {boolean}
 */
utils.isEmail = function (email){
    if ((email.length > 128) || (email.length < 6)) {
        return false;
    }

    var format = /^[A-Za-z0-9+]+[A-Za-z0-9_.+-]*@([A-Za-z0-9-]+\.)+[A-Za-z0-9]+$/;
    if (!email.match(format)) {
        return false;
    }
    return true;
}
