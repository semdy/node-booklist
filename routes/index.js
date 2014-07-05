var router = require('express').Router();
var log = require("../lib/log").logger("index");

router.get('/', function(req, res) {
    res.render('index', {user: req.session.user});
});

module.exports = router;
