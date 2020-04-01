import { ITheme, ThemeName } from './themes';
import { EventName, IClient, IEventContext, IInitOptions } from './types';
export declare class Monitor {
    /**
     * Attachment state.
     */
    private state;
    /**
     * Attached Initialization Options object.
     */
    private initOptions;
    /**
     * Current Color Theme.
     */
    cct: ITheme;
    /**
     * Detailed output flag.
     */
    detailed: boolean;
    constructor();
    connect(client: IClient, dc: any, useCount: number): void;
    disconnect(client: IClient, dc: any): void;
    query(e: IEventContext): void;
    task(e: IEventContext): void;
    transact(e: IEventContext): void;
    error(err: any, e: IEventContext): void;
    attach(initOptions: IInitOptions, options?: {
        events?: EventName[];
        override?: boolean;
    }): void;
    isAttached(): boolean;
    detach(): void;
    setTheme(t: ITheme | ThemeName): void;
    setLog(log: any): void;
    private print;
}
