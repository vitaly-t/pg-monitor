'use strict';

var mon = require('../../lib');

describe('Disconnect - Positive', function () {
    var client = {
        connectionParameters: {
            user: 'guest',
            database: 'test'
        }
    };
    describe('direct call', function () {
        var options, text;
        beforeEach(function () {
            options = {}, text = null;
            mon.attach(options, ['disconnect']);

            var log = function (msg, info) {
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
        var options, text, ctx;
        beforeEach(function () {
            options = {
                disconnect: function (c) {
                    ctx = c;
                }
            };
            text = null;
            mon.attach(options, ['disconnect']);

            var log = function (msg, info) {
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
        var options = {};
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
