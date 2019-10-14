export type EventName = 'connect' | 'disconnect' | 'query' | 'task' | 'transact' | 'error';

export const allEvents: EventName[] = ['connect', 'disconnect', 'query', 'task', 'transact', 'error'];

export interface IInitOptions {
    connect?(client: IClient, dc: any, useCount: number): void

    disconnect?(client: IClient, dc: any): void

    query?(e: IEventContext): void

    task?(e: IEventContext): void

    transact?(e: IEventContext): void

    error?(err: any, e: IEventContext): void
}

export interface IClient {
    connectionParameters: {
        database: string;
        user: string;
    };
}

export interface IEventContext {
    cn?: any; // Events: error
    query?: any; //  Events: query, receive and error
    params?: any;
    ctx?: ITaskContext;
}

export interface ITaskContext {
    tag: any;
    isTX: boolean;
    start: Date;
    finish: Date;
    success?: boolean;
}
