'use strict';

var mon = require('../../lib');

describe('Transact - Positive', function () {
    describe('start', function () {
        var options = {}, info;
        var e = {
            ctx: {
                start: new Date(),
                tag: 'test',
                isTX: true
            }
        };
        beforeEach(function () {
            mon.attach(options, ['transact']);

            var log = function (msg, i) {
                info = i;
                i.display = false;
            };
            mon.setLog(log);

            options.transact(e);
        });
        it('must be successful', function () {
            expect(info.text).toBe('tx(test)/start');
            expect('ctx' in info).toBe(true);
            expect(info.ctx.isTX).toBe(true);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('finish', function () {
        var text, cb, options = {
            transact: function (e) {
                cb = e;
            }
        };
        var e = {
            ctx: {
                start: new Date(),
                finish: new Date(),
                tag: 'test'
            }
        };
        beforeEach(function () {
            mon.attach(options, ['transact']);

            var log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.transact(e);
        });
        it('must be successful', function () {
            expect(text).toContain('tx(test)/end; duration:');
        });
        it('must call the old method', function () {
            expect(cb).toEqual(e);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });
});

describe('Transact - Negative', function () {
    describe('invalid parameters', function () {
        var options = {};
        beforeEach(function () {
            mon.attach(options, ['transact']);
        });
        it('must report event correctly', function () {
            expect(function () {
                options.transact();
            }).toThrow('Invalid event \'transact\' redirect parameters.');
        });
        afterEach(function () {
            mon.detach();
        });
    });
});
