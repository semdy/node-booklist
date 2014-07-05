/**
 * 本地文件操作
 */

var path = require("path");
var fs = require("fs");

var data = module.exports;

/**
 * 初始化数据存储目录
 */
data.initDataDirectory = function() {
    var logoDir = path.join(__dirname, "../data/logo");
    var bookDir = path.join(__dirname, "../data/book");

    data.mkdirsSync(logoDir);
    data.mkdirsSync(bookDir);
}

/**
 * 同步创建多层文件夹
 * @param dirpath {String}
 * @param mode {String}
 */
data.mkdirsSync = function(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            } else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
}






