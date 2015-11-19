'use strict';

var mon = require("../../lib");

describe("Query - Positive", function () {

});

describe("Query - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        mon.attach(options, ['query']);
        it("must report event correctly", function () {
            expect(function () {
                options.query();
            }).toThrow("Invalid event 'query' redirect parameters.");
        });
    });
});
