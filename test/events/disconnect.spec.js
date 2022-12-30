const mon = require('../../lib');

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
            mon.disconnect({client});
            expect(text).toBe('disconnect(guest@test)');
        });
        it('must log short message', () => {
            mon.disconnect({client, dc: 123}, false);
            expect(text).toBe('disconnect');
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });

    describe('indirect call', () => {
        let options, text, param;
        beforeEach(() => {
            options = {
                disconnect: e => {
                    param = e;
                }
            };
            text = null;
            mon.attach(options, ['disconnect']);

            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.disconnect({client, dc: 123});
        });
        it('must log detailed message', () => {
            expect(text).toBe('disconnect(guest@test)');
        });
        it('must call the old method', () => {
            expect(param.client).toEqual(client);
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
            expect(() => {
                options.disconnect();
            }).toThrow('Invalid event \'disconnect\' redirect parameters.');
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
