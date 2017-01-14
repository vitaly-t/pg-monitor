'use strict';

var mon = require("../../lib");

describe("Connect - Positive", function () {
    var client = {
        connectionParameters: {
            user: 'guest',
            database: 'test'
        }
    };
    describe("direct call", function () {
        var options, text;
        beforeEach(function () {
            options = {}, text = null;
            mon.attach(options, ['connect']);

            var log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);
        });
        it("must log detailed message", function () {
            mon.connect(client, 123, true);
            expect(text).toBe('connect(guest@test)');
        });
        it("must log short message", function () {
            mon.connect(client, 123, true, false);
            expect(text).toBe('connect');
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe("indirect call", function () {
        var options, text, ctx;
        beforeEach(function () {
            options = {
                connect: function (c) {
                    ctx = c;
                }
            };
            text = null;
            mon.attach(options, ['connect']);
            var log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.connect(client, 123, false);
        });
        it("must log detailed message", function () {
            expect(text).toBe('connect(guest@test)');
        });
        it("must call the old method", function () {
            expect(ctx).toEqual(client);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });
});

describe("Connect - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        beforeEach(function () {
            mon.attach(options, ['connect']);
            mon.setDetailed(true);
        });
        it("must report event correctly", function () {
            expect(function () {
                options.connect();
            }).toThrow("Invalid event 'connect' redirect parameters.");
        });
        afterEach(function () {
            mon.detach();
        });
    });
});
