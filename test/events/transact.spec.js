"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const monitor_1 = require("../../src/monitor");
describe('Transact - Positive', () => {
    const mon = new monitor_1.Monitor();
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
            mon.attach(options, { events: ['transact'] });
            const log = (msg, i) => {
                info = i;
                i.display = false;
            };
            mon.setLog(log);
            options.transact(e);
        });
        it('must be successful', () => {
            __1.expect(info.text).to.equal('tx(test)/start');
            __1.expect('ctx' in info).to.be.true;
            __1.expect(info.ctx.isTX).to.be.true;
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
                tag: 123
            }
        };
        beforeEach(() => {
            mon.attach(options, { events: ['transact'] });
            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);
            options.transact(e);
        });
        it('must be successful', () => {
            __1.expect(text).toContain('tx(123)/end; duration:');
        });
        it('must call the old method', () => {
            __1.expect(cb).to.equal(e);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
});
describe('Transact - Negative', () => {
    const mon = new monitor_1.Monitor();
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, { events: ['transact'] });
        });
        it('must report event correctly', () => {
            __1.expect(() => {
                options.transact();
            }).to.throw(`Invalid event 'transact' redirect parameters.`);
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
