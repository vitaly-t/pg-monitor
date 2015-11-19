'use strict';

var mon = require("../lib");

describe("Theme - Positive", function () {

});

describe("Theme - Negative", function () {
    describe("invalid parameters", function () {
        it("must throw an error", function () {
            expect(function () {
                mon.setTheme();
            }).toThrow('Invalid theme parameter specified.');
        });
    });
    describe("non-existing theme", function () {
        it("must throw an error", function () {
            expect(function () {
                mon.setTheme('unknown');
            }).toThrow("Theme 'unknown' does not exist.");
        });
    });
});
