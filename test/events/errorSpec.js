'use strict';

var mon = require("../../lib");

describe("Error - Positive", function () {
    describe("within transaction", function () {
        var options = {}, text = [];
        var e = {
            query: "hello",
            ctx: {
                start: new Date(),
                tag: "test"
            }
        };
        beforeEach(function () {
            mon.attach(options, ['error']);
            mon.log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            options.error("errMsg", e);
        });
        it("must be successful", function () {
            expect(text).toEqual(['error: errMsg', 'task(test): hello']);
        });
        afterEach(function () {
            mon.log = null;
        });
    });
});

describe("Error - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        mon.attach(options, ['error']);
        it("must report event correctly", function () {
            expect(function () {
                options.error();
            }).toThrow("Invalid event 'error' redirect parameters.");
        });
    });
});
