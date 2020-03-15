"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const monitor_1 = require("../src/monitor");
describe('Attach - Positive', () => {
    describe('without override', () => {
        const mon = new monitor_1.Monitor();
        const options = {};
        beforeEach(() => {
            mon.attach(options);
        });
        it('must add new handlers without overriding', () => {
            _1.expect(options.connect).to.be.instanceOf(Function);
            _1.expect(options.disconnect).to.be.instanceOf(Function);
            _1.expect(options.query).to.be.instanceOf(Function);
            _1.expect(options.error).to.be.instanceOf(Function);
            _1.expect(options.transact).to.be.instanceOf(Function);
            _1.expect(options.task).to.be.instanceOf(Function);
        });
        it('must be attached', () => {
            _1.expect(mon.isAttached()).to.be.true;
        });
        afterEach(() => {
            mon.detach();
        });
    });
    describe('select events', () => {
        const mon = new monitor_1.Monitor();
        const options = {};
        beforeEach(() => {
            mon.attach(options, { events: ['query', 'task'] });
        });
        it('must set only the events specified', () => {
            _1.expect(options.connect).to.be.undefined;
            _1.expect(options.disconnect).to.be.undefined;
            _1.expect(options.query).to.be.instanceOf(Function);
            _1.expect(options.error).to.be.undefined;
            _1.expect(options.transact).to.be.undefined;
            _1.expect(options.task).to.be.instanceOf(Function);
        });
        afterEach(() => {
            mon.detach();
        });
    });
    describe('restoring all options', () => {
        const mon = new monitor_1.Monitor();
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
            _1.expect(opt1).to.equal(opt2);
        });
    });
    describe('restoring one option', () => {
        const mon = new monitor_1.Monitor();
        const opt1 = {
            connect: 123,
            disconnect: undefined
        };
        const opt2 = {
            connect: 123,
            disconnect: undefined
        };
        it('must restore all properties', () => {
            mon.attach(opt1, { events: ['query'] });
            mon.detach();
            _1.expect(opt1).to.equal(opt2);
        });
    });
});
describe('Attach - Negative', () => {
    const mon = new monitor_1.Monitor();
    it('must reject invalid options', () => {
        _1.expect(() => {
            mon.attach(undefined);
        }).to.throw(`Initialization object 'options' must be specified.`);
        _1.expect(() => {
            mon.attach({
                options: {},
                events: 123
            });
        }).to.throw(`Invalid parameter 'events' passed.`);
    });
    describe('repeated attachment', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options);
        });
        it('must throw an error', () => {
            _1.expect(() => {
                mon.attach(options);
            }).to.throw('Repeated attachments not supported, must call detach first.');
        });
        afterEach(() => {
            mon.detach();
        });
    });
    describe('invalid detachment', () => {
        it('must throw an error', () => {
            _1.expect(() => {
                mon.detach();
            }).to.throw('Event monitor not attached.');
        });
    });
});
