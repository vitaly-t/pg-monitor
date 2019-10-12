export type EventName = 'connect' | 'disconnect' | 'query' | 'error' | 'task' | 'transact';

export interface IInitOptions {
    connect?: (client: any, dc: any, useCount: number) => void
    disconnect?: (client: any, dc: any) => void
    query?: (e: IEventContext) => void
    task?: (e: IEventContext) => void
    transact?: (e: IEventContext) => void
    error?: (err: any, e: IEventContext) => void
}

export interface IEventContext {
    cn?: any; // Events: error
    query?: any; //  Events: query, receive and error
    ctx?: ITaskContext;
}

export interface ITaskContext {
    tag: any;
}
