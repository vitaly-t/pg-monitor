import {expect} from '../';
import {Monitor} from '../../src/monitor';

describe('Task - Positive', () => {

    const mon = new Monitor();
    describe('start', () => {
        const options = {};
        let info;
        const e = {
            ctx: {
                start: new Date(),
                tag: 'test',
                isTX: false
            }
        };
        beforeEach(() => {
            mon.attach(options, {events: ['task']});
            const log = (msg, i) => {
                info = i;
                i.display = false;
            };
            mon.setLog(log);
            options.task(e);
        });
        it('must be successful', () => {
            expect(info.text).to.equal('task(test)/start');
            expect('ctx' in info).to.be.true;
            expect(info.ctx.isTX).to.be.false;
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('finish', () => {
        let text, cb;
        const options = {
            task: e => {
                cb = e;
            }
        };
        const dt = new Date(), e = {
            ctx: {
                start: dt,
                finish: new Date(dt.getTime() + 12345678),
                tag: {
                    toString: () => {
                        return 'test';
                    }
                }
            }
        };
        beforeEach(() => {
            mon.attach(options, {events: ['task']});

            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.task(e);
        });
        it('must be successful', () => {
            expect(text).to.equal('task(test)/end; duration: 03:25:45.678, success: false');
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

describe('Task - Negative', () => {
    const mon = new Monitor();
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, {events: ['task']});
        });
        it('must report event correctly', () => {
            expect(() => {
                options.task();
            }).to.throw(`Invalid event 'task' redirect parameters.`);
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
