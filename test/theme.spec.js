const mon = require('../lib');

const dummy = () => {
};

describe('Theme - Positive', () => {
    describe('valid customization', () => {
        it('must be successful', () => {
            expect(
                mon.setTheme({
                    time: dummy,
                    value: dummy,
                    cn: dummy,
                    tx: dummy,
                    paramTitle: dummy,
                    errorTitle: dummy,
                    query: dummy,
                    special: dummy,
                    error: dummy
                })
            ).toBeUndefined();
        });
    });
    describe('valid theme name', () => {
        it('must be successful', () => {
            expect(mon.setTheme('matrix')).toBeUndefined();
        });
    });
});

describe('Theme - Negative', () => {
    describe('invalid parameters', () => {
        const error = 'Invalid theme parameter specified.';
        it('must throw an error', () => {
            expect(() => {
                mon.setTheme();
            }).toThrow(error);
            expect(() => {
                mon.setTheme(123);
            }).toThrow(error);
        });
    });
    describe('non-existing theme', () => {
        it('must throw an error', () => {
            expect(() => {
                mon.setTheme('unknown');
            }).toThrow('Theme \'unknown\' does not exist.');
        });
    });
    describe('missing attributes', () => {
        it('must throw an error', () => {
            expect(() => {
                mon.setTheme({});
            }).toThrow('Invalid theme: property \'time\' is missing.');
        });
    });
    describe('invalid attribute value', () => {
        it('must throw an error', () => {
            expect(() => {
                mon.setTheme({
                    time: null
                });
            }).toThrow('Theme property \'time\' is invalid.');
        });
    });

});
