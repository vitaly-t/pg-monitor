'use strict';

var mon = require("../../lib");

describe("Disconnect - Positive", function () {

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
