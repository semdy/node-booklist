/**
 * 行为驱动开发(BDD)
 * mocha默认的模式是BDD
 */

var assert = require("assert");

/**
 * 同步测试
 */
describe("Array", function() {
    describe("#indexOf()", function() {
        it("should return -1 when the value is not found", function() {
            assert.equal(-1, [1, 2, 3].indexOf(4));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        })
    })
});

/**
 * 模拟异步测试
 */
describe("setTimeout", function() {
    it("should execute without error", function(done) {
        setTimeout(done, 100);
    });

    it("should execute without error", function(done) {
        process.nextTick(done);
    });

    it.skip("skip this test case", function() {
    });
});
