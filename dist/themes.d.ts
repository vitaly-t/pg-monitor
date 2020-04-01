import * as color from 'cli-color';
export interface ITheme {
    /**
     * timestamp color;
     */
    time: color.Format;
    /**
     * color for any value;
     */
    value: color.Format;
    /**
     * connect/disconnect color;
     */
    cn: color.Format;
    /**
     * transaction start/finish color;
     */
    tx: color.Format;
    /**
     * color for parameter titles: params/query/tx;
     */
    paramTitle: color.Format;
    /**
     * color for error title: 'error';
     */
    errorTitle: color.Format;
    /**
     * color for regular queries;
     */
    query: color.Format;
    /**
     * color for special queries: begin/commit/rollback;
     */
    special: color.Format;
    /**
     * error message color;
     */
    error: color.Format;
}
export declare const themeAttrs: (keyof ITheme)[];
export declare class Themes {
    /**
     * dimmed palette (the default theme);
     */
    dimmed: ITheme;
    /**
     * bright palette;
     */
    bright: ITheme;
    /**
     * black + white + grey;
     */
    monochrome: ITheme;
    /**
     * colors without distraction;
     */
    minimalist: ITheme;
    /**
     * classy green;
     */
    matrix: ITheme;
    /**
     * black + white + grey;
     */
    invertedMonochrome: ITheme;
    /**
     * colorful contrast, with enforced white background
     */
    invertedContrast: ITheme;
}
export declare type ThemeName = keyof Themes;
