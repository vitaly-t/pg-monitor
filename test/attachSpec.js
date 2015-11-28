'use strict';

var mon = require("../lib");

describe("Attach - Positive", function () {

    describe("without override", function () {
        var options = {};
        beforeEach(function () {
            mon.attach(options);
        });
        it("must add new handlers without overriding", function () {
            expect(options.connect instanceof Function).toBe(true);
            expect(options.disconnect instanceof Function).toBe(true);
            expect(options.query instanceof Function).toBe(true);
            expect(options.error instanceof Function).toBe(true);
            expect(options.transact instanceof Function).toBe(true);
            expect(options.task instanceof Function).toBe(true);
        });
        afterEach(function () {
            mon.detach();
        });
    });

    describe("select events", function () {
        var options = {};
        beforeEach(function () {
            mon.attach(options, ['query', 'task']);
        });
        it("must set only the events specified", function () {
            expect(options.connect).toBe(undefined);
            expect(options.disconnect).toBe(undefined);
            expect(options.query instanceof Function).toBe(true);
            expect(options.error).toBe(undefined);
            expect(options.transact).toBe(undefined);
            expect(options.task instanceof Function).toBe(true);
        });
        afterEach(function () {
            mon.detach();
        });
    });

    describe("restoring all options", function () {
        var opt1 = {
            connect: 123,
            disconnect: undefined
        };
        var opt2 = {
            connect: 123,
            disconnect: undefined
        };
        it("must restore all properties", function () {
            mon.attach(opt1);
            mon.detach();
            expect(opt1).toEqual(opt2);
        });
    });

    describe("restoring one option", function () {
        var opt1 = {
            connect: 123,
            disconnect: undefined
        };
        var opt2 = {
            connect: 123,
            disconnect: undefined
        };
        it("must restore all properties", function () {
            mon.attach(opt1, ['query']);
            mon.detach();
            expect(opt1).toEqual(opt2);
        });
    });

});

describe("Attach - Negative", function () {

    it("must reject invalid options", function () {
        expect(function () {
            mon.attach();
        }).toThrow("Initialization object 'options' must be specified.");
        expect(function () {
            mon.attach({
                options: {},
                events: 123
            });
        }).toThrow("Invalid parameter 'events' passed.");
    });

    describe("repeated attachment", function () {
        var options = {};
        beforeEach(function () {
            mon.attach(options);
        });
        it("must throw an error", function () {
            expect(function () {
                mon.attach(options);
            }).toThrow("Repeated attachments not supported, must call detach first.");
        });
        afterEach(function () {
            mon.detach();
        });
    });

    describe("invalid detachment", function () {
        it("must throw an error", function () {
            expect(function () {
                mon.detach();
            }).toThrow("Event monitor not attached.");
        });
    });
});
