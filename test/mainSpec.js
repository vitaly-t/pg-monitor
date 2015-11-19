'use strict';

var mon = require("../lib");

describe("Entry - positive", function () {


});

describe("Entry - negative", function () {

    it("must reject empty options", function () {
        expect(function () {
            mon.attach();
        }).toThrow("Initialization object 'options' must be specified.");
    });
});
