"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const color = __importStar(require("cli-color"));
exports.themeAttrs = ['time', 'value', 'cn', 'tx', 'paramTitle', 'errorTitle', 'query', 'special', 'error'];
class Themes {
    constructor() {
        /**
         * dimmed palette (the default theme);
         */
        this.dimmed = {
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
        this.bright = {
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
        this.monochrome = {
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
        this.minimalist = {
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
        this.matrix = {
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
        this.invertedMonochrome = {
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
        this.invertedContrast = {
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
    }
}
exports.Themes = Themes;
