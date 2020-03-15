"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const monitor_1 = require("../../src/monitor");
describe('Query - Positive', () => {
    const mon = new monitor_1.Monitor();
    describe('within transaction', () => {
        const options = {}, text = [], params = [1, 2, 3];
        const e = {
            query: 'begin',
            params: params,
            ctx: {
                start: new Date(),
                tag: 'test'
            }
        };
        beforeEach(() => {
            mon.attach(options, { events: ['query'] });
            const log = (msg, info) => {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);
            options.query(e);
        });
        it('must be successful', () => {
            __1.expect(text && text.length === 2).to.be.true;
            __1.expect(text[0]).to.equal('task(test): begin');
            __1.expect(text[1]).to.equal('params: [1,2,3]');
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
    describe('prepared statement', () => {
        let cb, text;
        const params = [1, 2, 3], options = {
            query: e => {
                cb = e;
            }
        };
        const e = {
            query: {
                name: 'queryName',
                text: 'queryText',
                values: params
            },
            ctx: {
                tag: 123,
                start: new Date()
            }
        };
        beforeEach(() => {
            mon.attach(options, { events: ['query'] });
            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);
            options.query(e);
        });
        it('must be successful', () => {
            __1.expect(text).to.equal('task(123): name="queryName", text="queryText", values=[1,2,3]');
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
describe('Query - Negative', () => {
    const mon = new monitor_1.Monitor();
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, { events: ['query'] });
        });
        it('must report event correctly', () => {
            __1.expect(() => {
                options.query();
            }).to.throw(`Invalid event 'query' redirect parameters.`);
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
