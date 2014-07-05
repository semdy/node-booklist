/**
 * 书籍详细
 */

var router = require("express").Router();
var log = require("../lib/log").logger("book");

router.get("/", function(req, res) {
    res.render("book", {});
});

module.exports = router;