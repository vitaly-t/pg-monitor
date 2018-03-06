'use strict';

const mon = require('../../lib');

describe('Transact - Positive', () => {
    describe('start', () => {
        let info;
        const options = {}, e = {
            ctx: {
                start: new Date(),
                tag: 'test',
                isTX: true
            }
        };
        beforeEach(() => {
            mon.attach(options, ['transact']);

            const log = (msg, i) => {
                info = i;
                i.display = false;
            };
            mon.setLog(log);

            options.transact(e);
        });
        it('must be successful', () => {
            expect(info.text).toBe('tx(test)/start');
            expect('ctx' in info).toBe(true);
            expect(info.ctx.isTX).toBe(true);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('finish', () => {
        let text, cb;
        const options = {
            transact: e => {
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
        beforeEach(() => {
            mon.attach(options, ['transact']);

            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.transact(e);
        });
        it('must be successful', () => {
            expect(text).toContain('tx(test)/end; duration:');
        });
        it('must call the old method', () => {
            expect(cb).toEqual(e);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
});

describe('Transact - Negative', () => {
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, ['transact']);
        });
        it('must report event correctly', () => {
            expect(() => {
                options.transact();
            }).toThrow('Invalid event \'transact\' redirect parameters.');
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
