import {dummy, expect} from './index';
import {Monitor} from '../src/monitor';

describe('Theme - Positive', () => {
    const mon = new Monitor();
    describe('valid customization', () => {
        it('must be successful', () => {
            const dummyColor = dummy as any;
            expect(
                mon.setTheme({
                    time: dummyColor,
                    value: dummyColor,
                    cn: dummyColor,
                    tx: dummyColor,
                    paramTitle: dummyColor,
                    errorTitle: dummyColor,
                    query: dummyColor,
                    special: dummyColor,
                    error: dummyColor
                })
            ).to.be.undefined;
        });
    });
    describe('valid theme name', () => {
        it('must be successful', () => {
            expect(mon.setTheme('matrix')).to.be.undefined;
        });
    });
});

describe('Theme - Negative', () => {
    describe('invalid parameters', () => {
        const error = 'Invalid theme parameter specified.';
        it('must throw an error', () => {
            expect(() => {
                mon.setTheme();
            }).to.throw(error);
            expect(() => {
                mon.setTheme(123 as any);
            }).to.throw(error);
        });
    });
    describe('non-existing theme', () => {
        it('must throw an error', () => {
            expect(() => {
                mon.setTheme('unknown' as any);
            }).to.throw(`Theme 'unknown' does not exist.`);
        });
    });
    describe('missing attributes', () => {
        it('must throw an error', () => {
            expect(() => {
                mon.setTheme({} as any);
            }).to.throw(`Invalid theme: property 'time' is missing.`);
        });
    });
    describe('invalid attribute value', () => {
        it('must throw an error', () => {
            expect(() => {
                mon.setTheme({
                    time: null
                } as any);
            }).to.throw(`Theme property 'time' is invalid.`);
        });
    });

});
