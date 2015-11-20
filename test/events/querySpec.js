'use strict';

var mon = require("../../lib");

describe("Query - Positive", function () {
    describe("within transaction", function () {
        var options = {}, text = [], params = [1, 2, 3];
        var e = {
            query: "hello",
            params: params,
            ctx: {
                start: new Date(),
                tag: "test"
            }
        };
        beforeEach(function () {
            mon.attach(options, ['query']);
            mon.log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            options.query(e);
        });
        it("must be successful", function () {
            expect(text && text.length === 2).toBeTruthy();
            expect(text[0]).toBe('task(test): hello');
            expect(text[1]).toBe("params: [1,2,3]");
        });
        afterEach(function () {
            mon.log = null;
        });
    });

    describe("prepared statement", function () {
        var options = {}, text, params = [1, 2, 3];
        var e = {
            query: {
                name: "queryName",
                text: "queryText",
                values: params
            },
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
            expect(text).toEqual('task(test): name="queryName", text="queryText", values=1,2,3');
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
