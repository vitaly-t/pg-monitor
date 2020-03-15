import {expect} from '../';
import {Monitor} from '../../src/monitor';

describe('Transact - Positive', () => {
    const mon = new Monitor();
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
            mon.attach(options, {events: ['transact']});

            const log = (msg, i) => {
                info = i;
                i.display = false;
            };
            mon.setLog(log);

            options.transact(e);
        });
        it('must be successful', () => {
            expect(info.text).to.equal('tx(test)/start');
            expect('ctx' in info).to.be.true;
            expect(info.ctx.isTX).to.be.true;
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
            mon.attach(options, {events: ['transact']});

            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.transact(e);
        });
        it('must be successful', () => {
            expect(text).toContain('tx(123)/end; duration:');
        });
        it('must call the old method', () => {
            expect(cb).to.equal(e);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
});

describe('Transact - Negative', () => {
    const mon = new Monitor();
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, {events: ['transact']});
        });
        it('must report event correctly', () => {
            expect(() => {
                options.transact();
            }).to.throw(`Invalid event 'transact' redirect parameters.`);
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
