'use strict';

var mon = require("../../lib");

describe("Connect - Positive", function () {
    var options = {}, text;
    var client = {
        connectionParameters: {
            user: 'guest',
            database: 'test'
        }
    };
    beforeEach(function () {
        mon.attach(options, ['connect']);
        mon.log = function (msg, info) {
            text = info.text;
            info.display = false;
        };
        options.connect(client);
    });
    it("must be successful", function () {
        expect(text).toBe('connect(guest@test)');
    });
    afterEach(function () {
        mon.log = null;
    });
});

describe("Connect - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        mon.attach(options, ['connect']);
        it("must report event correctly", function () {
            expect(function () {
                options.connect();
            }).toThrow("Invalid event 'connect' redirect parameters.");
        });
    });
});
