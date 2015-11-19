'use strict';

var mon = require("../../lib");

describe("Transact - Positive", function () {

});

describe("Transact - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        mon.attach(options, ['transact']);
        it("must report event correctly", function () {
            expect(function () {
                options.transact();
            }).toThrow("Invalid event 'transact' redirect parameters.");
        });
    });
});
