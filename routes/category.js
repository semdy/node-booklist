/**
 * 分类目录
 */
var router = require('express').Router();
var log = require("../lib/log").logger("category");

router.get('/', function(req, res) {
    res.render('category', {});
});

module.exports = router;
