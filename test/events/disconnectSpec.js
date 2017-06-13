'use strict';

const mon = require('../../lib');

describe('Disconnect - Positive', function () {
    const client = {
        connectionParameters: {
            user: 'guest',
            database: 'test'
        }
    };
    describe('direct call', function () {
        let options, text;
        beforeEach(function () {
            options = {};
            text = null;
            mon.attach(options, ['disconnect']);

            const log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

        });
        it('must log detailed message', function () {
            mon.disconnect(client);
            expect(text).toBe('disconnect(guest@test)');
        });
        it('must log short message', function () {
            mon.disconnect(client, 123, false);
            expect(text).toBe('disconnect');
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('indirect call', function () {
        let options, text, ctx;
        beforeEach(function () {
            options = {
                disconnect: function (c) {
                    ctx = c;
                }
            };
            text = null;
            mon.attach(options, ['disconnect']);

            const log = function (msg, info) {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.disconnect(client, 123);
        });
        it('must log detailed message', function () {
            expect(text).toBe('disconnect(guest@test)');
        });
        it('must call the old method', function () {
            expect(ctx).toEqual(client);
        });
        afterEach(function () {
            mon.detach();
            mon.setLog(null);
        });
    });
});

describe('Disconnect - Negative', function () {
    describe('invalid parameters', function () {
        const options = {};
        beforeEach(function () {
            mon.attach(options, ['disconnect']);
        });
        it('must report event correctly', function () {
            expect(function () {
                options.disconnect();
            }).toThrow('Invalid event \'disconnect\' redirect parameters.');
        });
        afterEach(function () {
            mon.detach();
        });
    });
});
