/**
 * 搜索
 */

var router = require("express").Router();
var log = require("../lib/log").logger("search");

router.get("/", function(req, res) {
    res.render("search", {});
});

module.exports = router;