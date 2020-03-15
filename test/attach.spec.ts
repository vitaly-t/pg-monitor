import {expect} from './';
import {Monitor} from '../src/monitor';
import {IInitOptions} from '../src/types';

describe('Attach - Positive', () => {

    describe('without override', () => {
        const mon = new Monitor();
        const options: IInitOptions = {};
        beforeEach(() => {
            mon.attach(options);
        });
        it('must add new handlers without overriding', () => {
            expect(options.connect).to.be.instanceOf(Function);
            expect(options.disconnect).to.be.instanceOf(Function);
            expect(options.query).to.be.instanceOf(Function);
            expect(options.error).to.be.instanceOf(Function);
            expect(options.transact).to.be.instanceOf(Function);
            expect(options.task).to.be.instanceOf(Function);
        });
        it('must be attached', () => {
            expect(mon.isAttached()).to.be.true;
        });
        afterEach(() => {
            mon.detach();
        });
    });

    describe('select events', () => {
        const options: IInitOptions = {};
        beforeEach(() => {
            mon.attach(options, {events: ['query', 'task']});
        });
        it('must set only the events specified', () => {
            expect(options.connect).to.be.undefined;
            expect(options.disconnect).to.be.undefined;
            expect(options.query).to.be.instanceOf(Function);
            expect(options.error).to.be.undefined;
            expect(options.transact).to.be.undefined;
            expect(options.task).to.be.instanceOf(Function);
        });
        afterEach(() => {
            mon.detach();
        });
    });

    describe('restoring all options', () => {
        const opt1: IInitOptions = {
            connect: 123 as any,
            disconnect: undefined
        };
        const opt2 = {
            connect: 123,
            disconnect: undefined
        };
        it('must restore all properties', () => {
            mon.attach(opt1);
            mon.detach();
            expect(opt1).to.equal(opt2);
        });
    });

    describe('restoring one option', () => {
        const opt1: IInitOptions = {
            connect: 123 as any,
            disconnect: undefined
        };
        const opt2 = {
            connect: 123,
            disconnect: undefined
        };
        it('must restore all properties', () => {
            mon.attach(opt1, {events: ['query']});
            mon.detach();
            expect(opt1).to.equal(opt2);
        });
    });

});

describe('Attach - Negative', () => {

    it('must reject invalid options', () => {
        expect(() => {
            mon.attach();
        }).to.throw(`Initialization object 'options' must be specified.`);
        expect(() => {
            mon.attach({
                options: {},
                events: 123
            } as any);
        }).to.throw(`Invalid parameter 'events' passed.`);
    });

    describe('repeated attachment', () => {
        const options = {};
        beforeEach(() => {
            mon.attach(options);
        });
        it('must throw an error', () => {
            expect(() => {
                mon.attach(options);
            }).to.throw('Repeated attachments not supported, must call detach first.');
        });
        afterEach(() => {
            mon.detach();
        });
    });

    describe('invalid detachment', () => {
        it('must throw an error', () => {
            expect(() => {
                mon.detach();
            }).to.throw('Event monitor not attached.');
        });
    });
});
