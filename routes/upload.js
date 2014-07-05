/**
 * 上传
 */
var router = require("express").Router();
var log = require("../lib/log").logger("upload");

router.get("/", function(req, res) {
    res.render("upload", {});
});

module.exports = router;
