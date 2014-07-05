var assert = require("assert");
var fs = require("fs");
var data = require("../../lib/data");

describe("data", function() {
    it("it should generate booklist/data/logo and booklist/data/book directories", function() {
        data.initDataDirectory();
        assert.equal(true, fs.existsSync(__dirname, "../../data"));
        assert.equal(true, fs.existsSync(__dirname, "../../data/logo"));
        assert.equal(true, fs.existsSync(__dirname, "../../data/book"));
    })
})