'use strict';

var colors = require("cli-color");

///////////////////////////////////////////////////////////
// Supported color attributes:
//
// time - timestamp color;
// value - color for any value;
// cn - connection connect/disconnect color;
// tx - transaction start/finish color;
// paramVerb - parameter verb;
// errorVerb - error verb;
// query - regular query;
// special - special query: begin/commit/rollback;
// error - error message;
///////////////////////////////////////////////////////////

var themes = {

    // black + white + grey;
    mono: {
        time: colors.bgWhite.black,
        value: colors.whiteBright,
        cn: colors.white,
        tx: colors.white,
        paramVerb: colors.white,
        errorVerb: colors.white,
        query: colors.whiteBright,
        special: colors.whiteBright,
        error: colors.whiteBright
    },

    // all bright colors;
    dimmed: {
        time: colors.bgWhite.black,
        value: colors.white,
        cn: colors.yellow,
        tx: colors.cyan,
        paramVerb: colors.magenta,
        errorVerb: colors.redBright,
        query: colors.whiteBright,
        special: colors.green,
        error: colors.red
    },

    // all colors dimmed;
    bright: {
        time: colors.bgWhite.black,
        value: colors.white,
        cn: colors.yellow,
        tx: colors.cyan,
        paramVerb: colors.magenta,
        errorVerb: colors.redBright,
        query: colors.whiteBright,
        special: colors.green,
        error: colors.red
    },

    // only errors are shown in red;
    minimalist: {
        time: colors.bgWhite.black,
        value: colors.whiteBright,
        cn: colors.white,
        tx: colors.white,
        paramVerb: colors.white,
        errorVerb: colors.white,
        query: colors.whiteBright,
        special: colors.whiteBright,
        error: colors.red
    },

    matrix: {
        time: colors.bgGreen.white,
        value: colors.white,
        cn: colors.green,
        tx: colors.green,
        paramVerb: colors.green,
        errorVerb: colors.greenBright,
        query: colors.whiteBright,
        special: colors.white,
        error: colors.red
    }

};

module.exports = themes;
