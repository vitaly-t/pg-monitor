'use strict';

const mon = require('../../lib');

describe('Query - Positive', () => {
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
            mon.attach(options, ['query']);

            const log = (msg, info) => {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);

            options.query(e);
        });
        it('must be successful', () => {
            expect(text && text.length === 2).toBeTruthy();
            expect(text[0]).toBe('task(test): begin');
            expect(text[1]).toBe('params: [1,2,3]');
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
            mon.attach(options, ['query']);

            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.query(e);
        });
        it('must be successful', () => {
            expect(text).toEqual('task(123): name="queryName", text="queryText", values=1,2,3');
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

describe('Query - Negative', () => {
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, ['query']);
        });
        it('must report event correctly', () => {
            expect(() => {
                options.query();
            }).toThrow('Invalid event \'query\' redirect parameters.');
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
