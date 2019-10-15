"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color = require("cli-color");
exports.themeAttrs = ['time', 'value', 'cn', 'tx', 'paramTitle', 'errorTitle', 'query', 'special', 'error'];
class Themes {
}
exports.Themes = Themes;
/**
 * dimmed palette (the default theme);
 */
Themes.dimmed = {
    time: color.bgWhite.black,
    value: color.white,
    cn: color.yellow,
    tx: color.cyan,
    paramTitle: color.magenta,
    errorTitle: color.redBright,
    query: color.whiteBright,
    special: color.green,
    error: color.red
};
/**
 * bright palette;
 */
Themes.bright = {
    time: color.bgBlue.whiteBright,
    value: color.white,
    cn: color.yellowBright,
    tx: color.cyanBright,
    paramTitle: color.magentaBright,
    errorTitle: color.redBright,
    query: color.whiteBright,
    special: color.greenBright,
    error: color.redBright
};
/**
 * black + white + grey;
 */
Themes.monochrome = {
    time: color.bgWhite.black,
    value: color.whiteBright,
    cn: color.white,
    tx: color.white,
    paramTitle: color.white,
    errorTitle: color.white,
    query: color.whiteBright,
    special: color.whiteBright,
    error: color.whiteBright
};
/**
 * colors without distraction;
 */
Themes.minimalist = {
    time: color.bgWhite.black,
    value: color.white,
    cn: color.yellow,
    tx: color.yellow,
    paramTitle: color.cyan,
    errorTitle: color.redBright,
    query: color.whiteBright,
    special: color.whiteBright,
    error: color.red
};
/**
 * classy green;
 */
Themes.matrix = {
    time: color.bgGreen.black,
    value: color.white,
    cn: color.green,
    tx: color.green,
    paramTitle: color.green,
    errorTitle: color.green,
    query: color.whiteBright,
    special: color.whiteBright,
    error: color.greenBright
};
///////////////////////////////////////////
// Themes for white or bright backgrounds
///////////////////////////////////////////
/**
 * black + white + grey;
 */
Themes.invertedMonochrome = {
    time: color.bgWhite.black,
    value: color.blackBright,
    cn: color.black,
    tx: color.black,
    paramTitle: color.black,
    errorTitle: color.black,
    query: color.blackBright,
    special: color.blackBright,
    error: color.blackBright
};
/**
 * colorful contrast, with enforced white background
 */
Themes.invertedContrast = {
    time: color.bgBlue.white,
    value: color.bgWhiteBright.blueBright,
    cn: color.bgWhiteBright.black,
    tx: color.bgWhiteBright.black,
    paramTitle: color.bgWhiteBright.magenta,
    errorTitle: color.bgWhiteBright.red,
    query: color.bgWhiteBright.green,
    special: color.bgWhiteBright.cyan,
    error: color.bgWhiteBright.redBright
};
function getTheme(name) {
    return Themes[name];
}
exports.getTheme = getTheme;
