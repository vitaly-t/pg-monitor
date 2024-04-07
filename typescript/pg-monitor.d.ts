////////////////////////////////////////
// Requires pg-monitor v2.1.0 or later.
////////////////////////////////////////

// Event context extension for tasks + transactions;
// See: http://vitaly-t.github.io/pg-promise/global.html#TaskContext
interface ITaskContext {

    // these are set in the beginning of each task/transaction:
    readonly context: any
    readonly parent: ITaskContext | null
    readonly connected: boolean
    readonly inTransaction: boolean
    readonly level: number
    readonly useCount: number
    readonly isTX: boolean
    readonly start: Date
    readonly tag: any
    readonly dc: any

    // these are set at the end of each task/transaction:
    readonly finish?: Date
    readonly duration?: number
    readonly success?: boolean
    readonly result?: any

    // this exists only inside transactions (isTX = true):
    readonly txLevel?: number
}

type ColorFunction = (...values: any[]) => string;

interface IColorTheme {
    time: ColorFunction
    value: ColorFunction
    cn: ColorFunction
    tx: ColorFunction
    paramTitle: ColorFunction
    errorTitle: ColorFunction
    query: ColorFunction
    special: ColorFunction
    error: ColorFunction
}

type LogEvent = 'connect' | 'disconnect' | 'query' | 'task' | 'transact' | 'error';

type ThemeName =
    'dimmed'
    | 'bright'
    | 'monochrome'
    | 'minimalist'
    | 'matrix'
    | 'invertedMonochrome'
    | 'invertedContrast';

interface IEventInfo {
    time: Date | null
    colorText: string
    text: string
    event: LogEvent
    display: boolean
    ctx?: ITaskContext
}

export function attach(options: object, events?: Array<LogEvent>, override?: boolean): void

export function detach(): void;

export function isAttached(): boolean;

export function setTheme(theme: ThemeName | IColorTheme): void

export function setLog(log: (msg: string, info: IEventInfo) => void): void

export var detailed: boolean;

export function setDetailed(value: boolean): void

export function connect(client: object, dc: any, useCount: number, detailed?: boolean): void

export function disconnect(client: object, dc: any, detailed?: boolean): void

export function query(e: object, detailed?: boolean): void

export function task(e: object): void

export function transact(e: object): void

export function error(err: any, e: object, detailed?: boolean): void
