////////////////////////////////////////
// Requires pg-monitor v0.9.1 or later.
////////////////////////////////////////

// Event context extension for tasks + transactions;
// See: http://vitaly-t.github.io/pg-promise/Task.html#.ctx
interface ITaskContext {

    // these are set in the beginning of each task/transaction:
    context: any
    isFresh: boolean
    isTX: boolean
    start: Date
    tag: any
    dc: any

    // these are set at the end of each task/transaction:
    finish: Date
    success: boolean
    result: any
}

interface IColorTheme {
    time: Function
    value: Function
    cn: Function
    tx: Function
    paramTitle: Function
    errorTitle: Function
    query: Function
    special: Function
    error: Function
}

interface IEventInfo {
    time: Date
    text: string
    event: string
    display: boolean
    ctx?: ITaskContext
}

type ThemeName = 'dimmed' | 'bright' | 'monochrome' | 'minimalist' | 'matrix' | 'invertedMonochrome';

export function attach(options: object, events?: Array<string>, override?: boolean): void

export function attach(options: {
    options: object,
    events?: Array<string>,
    override?: boolean
}): void

export function detach(): void;

export function isAttached(): boolean;

export function setTheme(theme: ThemeName | IColorTheme): void

export function setLog(log: Function): void

export var detailed: boolean;

export function setDetailed(value: boolean): void

export function connect(client: object, dc: any, fresh: boolean, detailed?: boolean): void

export function disconnect(client: object, dc: any, detailed?: boolean): void

export function query(e: object, detailed?: boolean): void

export function task(e: object): void

export function transact(e: object): void

export function error(err: any, e: object, detailed?: boolean): void
