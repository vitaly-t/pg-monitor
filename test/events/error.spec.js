"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
describe('Error - Positive', () => {
    describe('within transaction', () => {
        const context = {
            query: 'hello',
            ctx: {
                start: new Date(),
                tag: 'test'
            }
        };
        const options = {}, text = [];
        beforeEach(() => {
            mon.attach(options, ['error']);
            const log = (msg, info) => {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);
            options.error('errMsg', context);
        });
        it('must be successful', () => {
            __1.expect(text && text.length === 2).toBeTruthy();
            __1.expect(text).toEqual(['error: errMsg', 'task(test): hello']);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
    describe('inherited callback', () => {
        const context = {
            query: 'hello',
            params: [1, 2, 3],
            ctx: {
                start: new Date()
            }
        };
        const cb = {}, options = {
            error: function (err, e) {
                cb.err = err;
                cb.e = e;
            }
        };
        beforeEach(() => {
            mon.attach(options, ['error']);
            const log = (msg, info) => {
                info.display = false;
            };
            mon.setLog(log);
            options.error('errMsg', context);
        });
        it('must call the old method', () => {
            __1.expect(cb.err).toBe('errMsg');
            __1.expect(cb.e).toEqual(context);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
    describe('query not a string', () => {
        const context = {
            query: 123
        };
        const options = {}, text = [];
        beforeEach(() => {
            mon.attach(options, ['error']);
            const log = (msg, info) => {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);
            options.error('errMsg', context);
        });
        it('must parse the value', () => {
            __1.expect(text).toEqual(['error: errMsg', 'query: 123']);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
    describe('query is a prepared statement with params', () => {
        const context = {
            query: { name: 'test-name', text: 'text-text', values: [123] }
        };
        const options = {}, text = [];
        beforeEach(() => {
            mon.attach(options, ['error']);
            const log = (msg, info) => {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);
            options.error('errMsg', context);
        });
        it('must parse the value', () => {
            __1.expect(text).toEqual(['error: errMsg', 'query: {"name":"test-name","text":"text-text","values":[123]}']);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
    describe('query is a prepared statement without params', () => {
        const context = {
            query: { name: 'test-name', text: 'text-text' }
        };
        const options = {}, text = [];
        beforeEach(() => {
            mon.attach(options, ['error']);
            const log = (msg, info) => {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);
            options.error('errMsg', context);
        });
        it('must parse the value', () => {
            __1.expect(text).toEqual(['error: errMsg', 'query: {"name":"test-name","text":"text-text"}']);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
    describe('connection', () => {
        const context = {
            cn: 123
        };
        const options = {}, text = [];
        beforeEach(() => {
            mon.attach(options, ['error']);
            const log = (msg, info) => {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);
            options.error('errMsg', context);
        });
        it('must parse the value', () => {
            __1.expect(text).toEqual(['error: errMsg', 'connection: 123']);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
});
describe('Error - Negative', () => {
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, ['error']);
        });
        it('must report event correctly', () => {
            __1.expect(() => {
                options.error();
            }).toThrow('Invalid event \'error\' redirect parameters.');
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
