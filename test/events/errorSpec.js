'use strict';

const mon = require('../../lib');

describe('Error - Positive', function () {
    describe('within transaction', function () {
        const context = {
            query: 'hello',
            ctx: {
                start: new Date(),
                tag: 'test'
            }
        };
        const options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);

            const log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);

            options.error('errMsg', context);
        });
        it('must be successful', function () {
            expect(text && text.length === 2).toBeTruthy();
            expect(text).toEqual(['error: errMsg', 'task(test): hello']);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });
    describe('inherited callback', function () {
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
        beforeEach(function () {
            mon.attach(options, ['error']);

            const log = function (msg, info) {
                info.display = false;
            };
            mon.setLog(log);

            options.error('errMsg', context);
        });
        it('must call the old method', function () {
            expect(cb.err).toBe('errMsg');
            expect(cb.e).toEqual(context);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('query not a string', function () {
        const context = {
            query: 123
        };
        const options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);

            const log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);

            options.error('errMsg', context);
        });
        it('must parse the value', function () {
            expect(text).toEqual(['error: errMsg', 'query: 123']);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('query is a prepared statement with params', function () {
        const context = {
            query: {name: 'test-name', text: 'text-text', values: [123]}
        };
        const options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);

            const log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);

            options.error('errMsg', context);
        });
        it('must parse the value', function () {
            expect(text).toEqual(['error: errMsg', 'query: {"name":"test-name","text":"text-text","values":[123]}']);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('query is a prepared statement without params', function () {
        const context = {
            query: {name: 'test-name', text: 'text-text'}
        };
        const options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);

            const log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);

            options.error('errMsg', context);
        });
        it('must parse the value', function () {
            expect(text).toEqual(['error: errMsg', 'query: {"name":"test-name","text":"text-text"}']);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('connection', function () {
        const context = {
            cn: 123
        };
        const options = {}, text = [];
        beforeEach(function () {
            mon.attach(options, ['error']);

            const log = function (msg, info) {
                text.push(info.text);
                info.display = false;
            };
            mon.setLog(log);

            options.error('errMsg', context);
        });
        it('must parse the value', function () {
            expect(text).toEqual(['error: errMsg', 'connection: 123']);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });
});

describe('Error - Negative', function () {
    describe('invalid parameters', function () {
        const options = {};
        beforeEach(function () {
            mon.attach(options, ['error']);
        });
        it('must report event correctly', function () {
            expect(function () {
                options.error();
            }).toThrow('Invalid event \'error\' redirect parameters.');
        });
        afterEach(function () {
            mon.detach();
        });
    });
});
