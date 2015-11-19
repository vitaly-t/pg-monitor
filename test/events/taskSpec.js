'use strict';

var mon = require("../../lib");

describe("Task - Positive", function () {

});

describe("Task - Negative", function () {
    describe("invalid parameters", function () {
        var options = {};
        mon.attach(options, ['task']);
        it("must report event correctly", function () {
            expect(function () {
                options.task();
            }).toThrow("Invalid event 'task' redirect parameters.");
        });
    });
});
