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
            mon.log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
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
            mon.log = null;
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
            mon.log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
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
            mon.log = null;
        });
    });
});

describe("Connect - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        beforeEach(function () {
            mon.attach(options, ['connect']);
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
