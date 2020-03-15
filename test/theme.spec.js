"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const src_1 = require("../src");
describe('Theme - Positive', () => {
    const mon = new src_1.Monitor();
    describe('valid customization', () => {
        it('must be successful', () => {
            const dummyColor = index_1.dummy;
            index_1.expect(mon.setTheme({
                time: dummyColor,
                value: dummyColor,
                cn: dummyColor,
                tx: dummyColor,
                paramTitle: dummyColor,
                errorTitle: dummyColor,
                query: dummyColor,
                special: dummyColor,
                error: dummyColor
            })).to.be.undefined;
        });
    });
    describe('valid theme name', () => {
        it('must be successful', () => {
            index_1.expect(mon.setTheme('matrix')).to.be.undefined;
        });
    });
});
describe('Theme - Negative', () => {
    const mon = new src_1.Monitor();
    describe('invalid parameters', () => {
        const error = 'Invalid theme parameter specified.';
        it('must throw an error', () => {
            index_1.expect(() => {
                mon.setTheme(undefined);
            }).to.throw(error);
            index_1.expect(() => {
                mon.setTheme(123);
            }).to.throw(error);
        });
    });
    describe('non-existing theme', () => {
        it('must throw an error', () => {
            index_1.expect(() => {
                mon.setTheme('unknown');
            }).to.throw(`Theme 'unknown' does not exist.`);
        });
    });
    describe('missing attributes', () => {
        it('must throw an error', () => {
            index_1.expect(() => {
                mon.setTheme({});
            }).to.throw(`Invalid theme: property 'time' is missing.`);
        });
    });
    describe('invalid attribute value', () => {
        it('must throw an error', () => {
            index_1.expect(() => {
                mon.setTheme({
                    time: null
                });
            }).to.throw(`Theme property 'time' is invalid.`);
        });
    });
});
