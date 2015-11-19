'use strict';

var mon = require("../lib");

describe("Attach - Positive", function () {

    describe("without override", function () {
        var options = {};
        it("must add new handlers without overriding", function () {
            mon.attach(options);
            expect(options.connect instanceof Function).toBe(true);
            expect(options.disconnect instanceof Function).toBe(true);
            expect(options.query instanceof Function).toBe(true);
            expect(options.error instanceof Function).toBe(true);
            expect(options.transact instanceof Function).toBe(true);
            expect(options.task instanceof Function).toBe(true);
        });
    });

    describe("select events", function () {
        var options = {};
        it("must set only the events specified", function () {
            mon.attach(options, ['query', 'task']);
            expect(options.connect).toBe(undefined);
            expect(options.disconnect).toBe(undefined);
            expect(options.query instanceof Function).toBe(true);
            expect(options.error).toBe(undefined);
            expect(options.transact).toBe(undefined);
            expect(options.task instanceof Function).toBe(true);
        });
    });
});

describe("Attach - Negative", function () {

    it("must reject empty options", function () {
        expect(function () {
            mon.attach();
        }).toThrow("Initialization object 'options' must be specified.");
    });
});
