"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
describe('Disconnect - Positive', () => {
    const client = {
        connectionParameters: {
            user: 'guest',
            database: 'test'
        }
    };
    describe('direct call', () => {
        let options, text;
        beforeEach(() => {
            options = {};
            text = null;
            mon.attach(options, ['disconnect']);
            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);
        });
        it('must log detailed message', () => {
            mon.disconnect(client);
            __1.expect(text).toBe('disconnect(guest@test)');
        });
        it('must log short message', () => {
            mon.disconnect(client, 123, false);
            __1.expect(text).toBe('disconnect');
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
    describe('indirect call', () => {
        let options, text, ctx;
        beforeEach(() => {
            options = {
                disconnect: c => {
                    ctx = c;
                }
            };
            text = null;
            mon.attach(options, ['disconnect']);
            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);
            options.disconnect(client, 123);
        });
        it('must log detailed message', () => {
            __1.expect(text).toBe('disconnect(guest@test)');
        });
        it('must call the old method', () => {
            __1.expect(ctx).toEqual(client);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
});
describe('Disconnect - Negative', () => {
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, ['disconnect']);
        });
        it('must report event correctly', () => {
            __1.expect(() => {
                options.disconnect();
            }).toThrow('Invalid event \'disconnect\' redirect parameters.');
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
