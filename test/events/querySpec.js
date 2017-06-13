'use strict';

const mon = require('../../lib');

describe('Query - Positive', function () {
    describe('within transaction', function () {
        const options = {}, text = [], params = [1, 2, 3];
        const e = {
            query: 'begin',
            params: params,
            ctx: {
                start: new Date(),
                tag: 'test'
            }
        };
        beforeEach(function () {
            mon.attach(options, ['query']);

            const log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);

            options.query(e);
        });
        it('must be successful', function () {
            expect(text && text.length === 2).toBeTruthy();
            expect(text[0]).toBe('task(test): begin');
            expect(text[1]).toBe('params: [1,2,3]');
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('prepared statement', function () {
        let cb, text;
        const params = [1, 2, 3], options = {
            query: function (e) {
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
                start: new Date()
            }
        };
        beforeEach(function () {
            mon.attach(options, ['query']);

            const log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.query(e);
        });
        it('must be successful', function () {
            expect(text).toEqual('task: name="queryName", text="queryText", values=1,2,3');
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

describe('Query - Negative', function () {
    describe('invalid parameters', function () {
        const options = {};
        beforeEach(function () {
            mon.attach(options, ['query']);
        });
        it('must report event correctly', function () {
            expect(function () {
                options.query();
            }).toThrow('Invalid event \'query\' redirect parameters.');
        });
        afterEach(function () {
            mon.detach();
        });
    });
});
