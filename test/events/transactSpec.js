'use strict';

var mon = require("../../lib");

describe("Transact - Positive", function () {
    describe("start", function () {
        var options = {}, text;
        var e = {
            ctx: {
                start: new Date(),
                tag: "test"
            }
        };
        beforeEach(function () {
            mon.attach(options, ['transact']);
            mon.log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            options.transact(e);
        });
        it("must be successful", function () {
            expect(text).toBe('tx(test)/start');
        });
        afterEach(function () {
            mon.detach();
            mon.log = null;
        });
    });

    describe("finish", function () {
        var text, cb, options = {
            transact: function (e) {
                cb = e;
            }
        };
        var e = {
            ctx: {
                start: new Date(),
                finish: new Date(),
                tag: "test"
            }
        };
        beforeEach(function () {
            mon.attach(options, ['transact']);
            mon.log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            options.transact(e);
        });
        it("must be successful", function () {
            expect(text).toBe('tx(test)/end; duration: .000, success: false');
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

describe("Transact - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        beforeEach(function () {
            mon.attach(options, ['transact']);
        });
        it("must report event correctly", function () {
            expect(function () {
                options.transact();
            }).toThrow("Invalid event 'transact' redirect parameters.");
        });
        afterEach(function () {
            mon.detach();
        });
    });
});
