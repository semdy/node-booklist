var assert = require("assert");
var utils = require("../../lib/utils");

describe("utils", function() {
    describe("#extend", function() {
        it("it should be empty", function() {
            var target = utils.extend({});
            console.log(target);
        });
        it("it should be something", function() {
            var target = utils.extend({}, {
                "one": "1",
                "two": 2,
                "date": new Date(),
                "array": ["1", 2]
            });
            console.log(target);
        });
        it("it should not change", function() {
            var target = utils.extend({
                "one": "one"
            }, undefined, {
                "two": "two",
                "one": "three"
            });
            assert.equal("three", target["one"]);
        })
    });

    describe("#date", function() {
        it("it should be yyyy-MM-dd hh:mm:ss", function() {
            var date = new Date("2014", "5", "2", "11", "20", "10");
            var format = utils.dateformat(date, "yyyy-MM-dd hh:mm:ss");
            assert.equal("2014-06-02 11:20:10", format);
        })
    })
})