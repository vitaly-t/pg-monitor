'use strict';

var mon = require("../../lib");

describe("Error - Positive", function () {
    describe("within transaction", function () {
        var context = {
            query: "hello",
            ctx: {
                start: new Date(),
                tag: "test"
            }
        };
        var options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);
            mon.log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            options.error("errMsg", context);
        });
        it("must be successful", function () {
            expect(text && text.length === 2).toBeTruthy();
            expect(text).toEqual(['error: errMsg', 'task(test): hello']);
        });
        afterEach(function () {
            mon.detach();
            mon.log = null;
        });
    });
    describe("inherited callback", function () {
        var context = {
            query: "hello",
            params: [1, 2, 3],
            ctx: {
                start: new Date()
            }
        };
        var cb = {}, options = {
            error: function (err, e) {
                cb.err = err;
                cb.e = e;
            }
        };
        beforeEach(function () {
            mon.attach(options, ['error']);
            mon.log = function (msg, info) {
                info.display = false;
            };
            options.error("errMsg", context);
        });
        it("must call the old method", function () {
            expect(cb.err).toBe("errMsg");
            expect(cb.e).toEqual(context);
        });
        afterEach(function () {
            mon.detach();
            mon.log = null;
        });
    });

    describe("query not a string", function () {
        var context = {
            query: 123
        };
        var options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);
            mon.log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            options.error("errMsg", context);
        });
        it("must parse the value", function () {
            expect(text).toEqual(['error: errMsg', 'query: 123']);
        });
        afterEach(function () {
            mon.detach();
            mon.log = null;
        });
    });

    describe("query is a prepared statement with params", function () {
        var context = {
            query: {name: 'test-name', text: 'text-text', values: [123]}
        };
        var options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);
            mon.log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            options.error("errMsg", context);
        });
        it("must parse the value", function () {
            expect(text).toEqual(['error: errMsg', 'query: {"name":"test-name","text":"text-text","values":[123]}']);
        });
        afterEach(function () {
            mon.detach();
            mon.log = null;
        });
    });

    describe("query is a prepared statement without params", function () {
        var context = {
            query: {name: 'test-name', text: 'text-text'}
        };
        var options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);
            mon.log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            options.error("errMsg", context);
        });
        it("must parse the value", function () {
            expect(text).toEqual(['error: errMsg', 'query: {"name":"test-name","text":"text-text"}']);
        });
        afterEach(function () {
            mon.detach();
            mon.log = null;
        });
    });

    describe("connection", function () {
        var context = {
            cn: 123
        };
        var options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);
            mon.log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            options.error("errMsg", context);
        });
        it("must parse the value", function () {
            expect(text).toEqual(['error: errMsg', 'connection: 123']);
        });
        afterEach(function () {
            mon.detach();
            mon.log = null;
        });
    });
});

describe("Error - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        beforeEach(function () {
            mon.attach(options, ['error']);
        });
        it("must report event correctly", function () {
            expect(function () {
                options.error();
            }).toThrow("Invalid event 'error' redirect parameters.");
        });
        afterEach(function () {
            mon.detach();
        });
    });
});
