import * as color from 'cli-color';

export interface ITheme {
    /**
     * timestamp color;
     */
    time: color.Format,

    /**
     * color for any value;
     */
    value: color.Format,

    /**
     * connect/disconnect color;
     */
    cn: color.Format,

    /**
     * transaction start/finish color;
     */
    tx: color.Format,

    /**
     * color for parameter titles: params/query/tx;
     */
    paramTitle: color.Format,

    /**
     * color for error title: 'error';
     */
    errorTitle: color.Format,

    /**
     * color for regular queries;
     */
    query: color.Format,

    /**
     * color for special queries: begin/commit/rollback;
     */
    special: color.Format,

    /**
     * error message color;
     */
    error: color.Format
}

export const themeAttrs: (keyof ITheme)[] = ['time', 'value', 'cn', 'tx', 'paramTitle', 'errorTitle', 'query', 'special', 'error'];

export class Themes {

    /**
     * dimmed palette (the default theme);
     */
    static dimmed: ITheme = {
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
    static bright: ITheme = {
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
    static monochrome: ITheme = {
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
    static minimalist: ITheme = {
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
    static matrix: ITheme = {
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
    static invertedMonochrome: ITheme = {
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
    static invertedContrast: ITheme = {
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

export type ThemeName = keyof Themes;

export function getTheme(name: ThemeName): ITheme {
    return Themes[name];
}
