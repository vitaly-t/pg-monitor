const mon = require('../lib');

describe('Attach - Positive', () => {

    describe('without override', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options);
        });
        it('must add new handlers without overriding', () => {
            expect(options.connect instanceof Function).toBe(true);
            expect(options.disconnect instanceof Function).toBe(true);
            expect(options.query instanceof Function).toBe(true);
            expect(options.error instanceof Function).toBe(true);
            expect(options.transact instanceof Function).toBe(true);
            expect(options.task instanceof Function).toBe(true);
        });
        it('must be attached', () => {
            expect(mon.isAttached()).toBe(true);
        });
        afterEach(() => {
            mon.detach();
        });
    });

    describe('select events', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options, ['query', 'task']);
        });
        it('must set only the events specified', () => {
            expect(options.connect).toBe(undefined);
            expect(options.disconnect).toBe(undefined);
            expect(options.query instanceof Function).toBe(true);
            expect(options.error).toBe(undefined);
            expect(options.transact).toBe(undefined);
            expect(options.task instanceof Function).toBe(true);
        });
        afterEach(() => {
            mon.detach();
        });
    });

    describe('restoring all options', () => {
        const opt1 = {
            connect: 123,
            disconnect: undefined
        };
        const opt2 = {
            connect: 123,
            disconnect: undefined
        };
        it('must restore all properties', () => {
            mon.attach(opt1);
            mon.detach();
            expect(opt1).toEqual(opt2);
        });
    });

    describe('restoring one option', () => {
        const opt1 = {
            connect: 123,
            disconnect: undefined
        };
        const opt2 = {
            connect: 123,
            disconnect: undefined
        };
        it('must restore all properties', () => {
            mon.attach(opt1, ['query']);
            mon.detach();
            expect(opt1).toEqual(opt2);
        });
    });

});

describe('Attach - Negative', () => {

    it('must reject invalid options', () => {
        expect(() => {
            mon.attach();
        }).toThrow('Initialization object \'options\' must be specified.');
        expect(() => {
            mon.attach({
                options: {},
                events: 123
            });
        }).toThrow('Invalid parameter \'events\' passed.');
    });

    describe('repeated attachment', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options);
        });
        it('must throw an error', () => {
            expect(() => {
                mon.attach(options);
            }).toThrow('Repeated attachments not supported, must call detach first.');
        });
        afterEach(() => {
            mon.detach();
        });
    });

    describe('invalid detachment', () => {
        it('must throw an error', () => {
            expect(() => {
                mon.detach();
            }).toThrow('Event monitor not attached.');
        });
    });
});
