'use strict';

var color = require("cli-color");

///////////////////////////////////////////////////////////
// Supported color attributes:
//
// time - timestamp color;
// value - color for any value;
// cn - connect/disconnect color;
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
        time: color.bgWhite.black,
        value: color.whiteBright,
        cn: color.white,
        tx: color.white,
        paramVerb: color.white,
        errorVerb: color.white,
        query: color.whiteBright,
        special: color.whiteBright,
        error: color.whiteBright
    },

    // all bright colors;
    dimmed: {
        time: color.bgBlue.white,
        value: color.white,
        cn: color.yellow,
        tx: color.cyan,
        paramVerb: color.magenta,
        errorVerb: color.redBright,
        query: color.whiteBright,
        special: color.green,
        error: color.red
    },

    // all colors dimmed;
    bright: {
        time: color.bgBlue.whiteBright,
        value: color.white,
        cn: color.yellowBright,
        tx: color.cyanBright,
        paramVerb: color.magentaBright,
        errorVerb: color.redBright,
        query: color.whiteBright,
        special: color.greenBright,
        error: color.redBright
    },

    // only errors are shown in red;
    minimalist: {
        time: color.bgWhite.black,
        value: color.whiteBright,
        cn: color.white,
        tx: color.white,
        paramVerb: color.white,
        errorVerb: color.white,
        query: color.yellow,
        special: color.green,
        error: color.red
    },

    matrix: {
        time: color.bgGreen.black,
        value: color.white,
        cn: color.green,
        tx: color.green,
        paramVerb: color.green,
        errorVerb: color.green,
        query: color.whiteBright,
        special: color.whiteBright,
        error: color.greenBright
    }

};

module.exports = themes;
