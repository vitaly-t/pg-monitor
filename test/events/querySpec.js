'use strict';

var mon = require("../../lib");

describe("Query - Positive", function () {
    describe("within transaction", function () {
        var options = {}, text;
        var e = {
            query: "hello",
            ctx: {
                start: new Date(),
                tag: "test"
            }
        };
        beforeEach(function () {
            mon.attach(options, ['query']);
            mon.log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            options.query(e);
        });
        it("must be successful", function () {
            expect(text).toBe('task(test): hello');
        });
        afterEach(function () {
            mon.log = null;
        });
    });
});

describe("Query - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        mon.attach(options, ['query']);
        it("must report event correctly", function () {
            expect(function () {
                options.query();
            }).toThrow("Invalid event 'query' redirect parameters.");
        });
    });
});
