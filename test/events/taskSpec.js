'use strict';

var mon = require("../../lib");

describe("Task - Positive", function () {

    describe("start", function () {
        var options = {}, text;
        var e = {
            ctx: {
                start: new Date(),
                tag: "test"
            }
        };
        beforeEach(function () {
            mon.attach(options, ['task']);
            mon.log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            options.task(e);
        });
        it("must be successful", function () {
            expect(text).toBe('task(test)/start');
        });
        afterEach(function () {
            mon.detach();
            mon.log = null;
        });
    });

    describe("finish", function () {
        var text, cb, options = {
            task: function (e) {
                cb = e;
            }
        };
        var dt = new Date(), e = {
            ctx: {
                start: dt,
                finish: new Date(dt.getTime() + 12345678),
                tag: {
                    toString: function () {
                        return "test";
                    }
                }
            }
        };
        beforeEach(function () {
            mon.attach(options, ['task']);
            mon.log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            options.task(e);
        });
        it("must be successful", function () {
            expect(text).toBe('task(test)/end; duration: 03:25:45.678, success: false');
        });
        it("must call the old method", function () {
            expect(cb).toEqual(e);
        });
        afterEach(function () {
            mon.detach();
            mon.log = null;
        });
    });

});

describe("Task - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        beforeEach(function () {
            mon.attach(options, ['task']);
        });
        it("must report event correctly", function () {
            expect(function () {
                options.task();
            }).toThrow("Invalid event 'task' redirect parameters.");
        });
        afterEach(function () {
            mon.detach();
        });
    });
});
