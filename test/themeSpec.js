'use strict';

const mon = require('../lib');

function dummy() {
}

describe('Theme - Positive', function () {
    describe('valid customization', function () {
        it('must be successful', function () {
            expect(
                mon.setTheme({
                    time: dummy,
                    value: dummy,
                    cn: dummy,
                    tx: dummy,
                    paramTitle: dummy,
                    errorTitle: dummy,
                    query: dummy,
                    special: dummy,
                    error: dummy
                })
            ).toBeUndefined();
        });
    });
    describe('valid theme name', function () {
        it('must be successful', function () {
            expect(mon.setTheme('matrix')).toBeUndefined();
        });
    });
});

describe('Theme - Negative', function () {
    describe('invalid parameters', function () {
        var error = 'Invalid theme parameter specified.';
        it('must throw an error', function () {
            expect(function () {
                mon.setTheme();
            }).toThrow(error);
            expect(function () {
                mon.setTheme(123);
            }).toThrow(error);
        });
    });
    describe('non-existing theme', function () {
        it('must throw an error', function () {
            expect(function () {
                mon.setTheme('unknown');
            }).toThrow('Theme \'unknown\' does not exist.');
        });
    });
    describe('missing attributes', function () {
        it('must throw an error', function () {
            expect(function () {
                mon.setTheme({});
            }).toThrow('Invalid theme: property \'time\' is missing.');
        });
    });
    describe('invalid attribute value', function () {
        it('must throw an error', function () {
            expect(function () {
                mon.setTheme({
                    time: null
                });
            }).toThrow('Theme property \'time\' is invalid.');
        });
    });

});
