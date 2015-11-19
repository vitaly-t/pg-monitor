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
            mon.log = null;
        });
    });

    describe("finish", function () {
        var options = {}, text;
        var e = {
            ctx: {
                start: new Date(),
                finish: new Date(),
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
            expect(text).toBe('task(test)/end; duration: .000, success: false');
        });
        afterEach(function () {
            mon.log = null;
        });
    });
});

describe("Task - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        mon.attach(options, ['task']);
        it("must report event correctly", function () {
            expect(function () {
                options.task();
            }).toThrow("Invalid event 'task' redirect parameters.");
        });
    });
});
