const color = require('picocolors');

///////////////////////////////////////////////////////////
// Supported color attributes:
//
// time - timestamp color;
// value - color for any value;
// cn - connect/disconnect color;
// tx - transaction start/finish color;
// paramTitle - color for parameter titles: params/query/tx;
// errorTitle - color for error title: 'error';
// query - color for regular queries;
// special - color for special queries: begin/commit/rollback;
// error - error message color;
///////////////////////////////////////////////////////////

const bgWhiteBlack = text => color.bgWhite(color.black(text));
const bgWhiteBrightBlack = text => color.bgWhiteBright(color.black(text));

const themes = {

    /////////////////////////////////////////
    // Themes for black or dark backgrounds
    /////////////////////////////////////////

    // dimmed palette (the default theme);
    dimmed: {
        time: bgWhiteBlack,
        value: color.white,
        cn: color.yellow,
        tx: color.cyan,
        paramTitle: color.magenta,
        errorTitle: color.redBright,
        query: color.whiteBright,
        special: color.green,
        error: color.red
    },

    // bright palette;
    bright: {
        time: text => color.bgBlue(color.whiteBright(text)),
        value: color.white,
        cn: color.yellowBright,
        tx: color.cyanBright,
        paramTitle: color.magentaBright,
        errorTitle: color.redBright,
        query: color.whiteBright,
        special: color.greenBright,
        error: color.redBright
    },

    // black + white + grey;
    monochrome: {
        time: bgWhiteBlack,
        value: color.whiteBright,
        cn: color.white,
        tx: color.white,
        paramTitle: color.white,
        errorTitle: color.white,
        query: color.whiteBright,
        special: color.whiteBright,
        error: color.whiteBright
    },

    // colors without distraction;
    minimalist: {
        time: bgWhiteBlack,
        value: color.white,
        cn: color.yellow,
        tx: color.yellow,
        paramTitle: color.cyan,
        errorTitle: color.redBright,
        query: color.whiteBright,
        special: color.whiteBright,
        error: color.red
    },

    // classy green;
    matrix: {
        time: text => color.bgGreen(color.black(text)),
        value: color.white,
        cn: color.green,
        tx: color.green,
        paramTitle: color.green,
        errorTitle: color.green,
        query: color.whiteBright,
        special: color.whiteBright,
        error: color.greenBright
    },

    ///////////////////////////////////////////
    // Themes for white or bright backgrounds
    ///////////////////////////////////////////

    // black + white + grey;
    invertedMonochrome: {
        time: bgWhiteBlack,
        value: color.blackBright,
        cn: color.black,
        tx: color.black,
        paramTitle: color.black,
        errorTitle: color.black,
        query: color.blackBright,
        special: color.blackBright,
        error: color.blackBright
    },

    // colorful contrast, with enforced white background
    invertedContrast: {
        time: text => color.bgBlue(color.white(text)),
        value: text => color.bgWhiteBright(color.blueBright(text)),
        cn: bgWhiteBrightBlack,
        tx: bgWhiteBrightBlack,
        paramTitle: text => color.bgWhiteBright(color.magenta(text)),
        errorTitle: text => color.bgWhiteBright(color.red(text)),
        query: text => color.bgWhiteBright(color.green(text)),
        special: text => color.bgWhiteBright(color.cyan(text)),
        error: text => color.bgWhiteBright(color.redBright(text))
    }
};

module.exports = themes;
