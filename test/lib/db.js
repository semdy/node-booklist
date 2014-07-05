var assert = require("assert");
var db = require("../../lib/db");

describe("db", function() {
    before(function() {
        db.init();
    });

    describe("query", function() {
        it("it should occur a error", function(done) {
            db.select("select * from user", [], function(err, result) {
                if (err) return done(err);
                done();
            })
        });

        it("it is ok", function(done) {
            db.query("show tables", function(err, result) {
                if (err) return done(err);
                console.log(result);
                done();
            })
        })
    })
})