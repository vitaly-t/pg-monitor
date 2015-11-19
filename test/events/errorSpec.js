'use strict';

var mon = require("../../lib");

describe("Error - Positive", function () {

});

describe("Error - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        mon.attach(options, ['error']);
        it("must report event correctly", function () {
            expect(function () {
                options.error();
            }).toThrow("Invalid event 'error' redirect parameters.");
        });
    });
});
