'use strict';

const mon = require('../../lib');

describe('Transact - Positive', function () {
    describe('start', function () {
        let info;
        const options = {}, e = {
            ctx: {
                start: new Date(),
                tag: 'test',
                isTX: true
            }
        };
        beforeEach(function () {
            mon.attach(options, ['transact']);

            const log = function (msg, i) {
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
        let text, cb;
        const options = {
            transact: function (e) {
                cb = e;
            }
        };
        const e = {
            ctx: {
                start: new Date(),
                finish: new Date(),
                tag: 'test'
            }
        };
        beforeEach(function () {
            mon.attach(options, ['transact']);

            const log = function (msg, info) {
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
        const options = {};
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
