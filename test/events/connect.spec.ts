const mon = require('../../lib');

describe('Connect - Positive', () => {
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
            mon.attach(options, ['connect']);

            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);
        });
        it('must log detailed message', () => {
            mon.connect(client, 123, true);
            expect(text).toBe('connect(guest@test)');
        });
        it('must log short message', () => {
            mon.connect(client, 123, true, false);
            expect(text).toBe('connect');
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
                connect: c => {
                    ctx = c;
                }
            };
            text = null;
            mon.attach(options, ['connect']);
            const log = (msg, info) => {
                text = info.text;
                info.display = false;
            };
            mon.setLog(log);

            options.connect(client, 123, false);
        });
        it('must log detailed message', () => {
            expect(text).toBe('connect(guest@test)');
        });
        it('must call the old method', () => {
            expect(ctx).toEqual(client);
        });
        afterEach(() => {
            mon.detach();
            mon.setLog(null);
        });
    });
});

describe('Connect - Negative', () => {
    describe('invalid parameters', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, ['connect']);
            mon.setDetailed(true);
        });
        it('must report event correctly', () => {
            expect(() => {
                options.connect();
            }).toThrow('Invalid event \'connect\' redirect parameters.');
        });
        afterEach(() => {
            mon.detach();
        });
    });
});
