'use strict';

var mon = require("../../lib");

describe("Disconnect - Positive", function () {
    var options = {}, text;
    var client = {
        connectionParameters: {
            user: 'guest',
            database: 'test'
        }
    };
    beforeEach(function () {
        mon.attach(options, ['disconnect']);
        mon.log = function (msg, info) {
            text = info.text;
            info.display = false;
        };
        options.disconnect(client);
    });
    it("must be successful", function () {
        expect(text).toBe('disconnect(guest@test)');
    });
    afterEach(function () {
        mon.log = null;
    });
});

describe("Disconnect - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        mon.attach(options, ['disconnect']);
        it("must report event correctly", function () {
            expect(function () {
                options.disconnect();
            }).toThrow("Invalid event 'disconnect' redirect parameters.");
        });
    });
});
