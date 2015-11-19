'use strict';

var mon = require("../../lib");

describe("Connect - Positive", function () {
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
