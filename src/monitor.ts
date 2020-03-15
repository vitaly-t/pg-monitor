import {ITheme, themeAttrs, ThemeName, Themes} from './themes';
import {EventName, eventNames, IClient, IEventContext, IInitOptions} from './types';
import {formatDuration, formatTime, getTagName, hasOwnProperty, isNull, removeColors, toJson} from './utils';

// reusable error messages;
const errors = {
    redirectParams(event: string) {
        return `Invalid event '${event}' redirect parameters.`;
    }
};

// 9 spaces for the time offset:
const timeGap = ' '.repeat(9);

export class Monitor {

    /**
     * Attachment state.
     */
    private state: IInitOptions;

    /**
     * Attached Initialization Options object.
     */
    private initOptions: IInitOptions | null;

    /**
     * Current Color Theme.
     */
    cct: ITheme;

    /**
     * Detailed output flag.
     */
    detailed: boolean;

    constructor() {
        this.state = {};
        this.initOptions = null;
        this.detailed = true;
        this.cct = Themes.dimmed;
    }

    ///////////////////////////////////////////////
    // 'connect' event handler;
    // parameters:
    // - client - the only parameter for the event;
    // - detailed - optional, indicates that user@database is to be reported;
    connect(client: IClient, dc: any, useCount: number): void {
        const event = 'connect';
        const cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new TypeError(errors.redirectParams(event));
        }
        if (this.detailed) {
            const countInfo = typeof useCount === 'number' ? this.cct.cn('; useCount: ') + this.cct.value(useCount) : '';
            this.print(null, event, this.cct.cn('connect(') + this.cct.value(cp.user + '@' + cp.database) + this.cct.cn(')') + countInfo);
        } else {
            this.print(null, event, this.cct.cn('connect'));
        }
    }

    ///////////////////////////////////////////////
    // 'connect' event handler;
    // parameters:
    // - client - the only parameter for the event;
    // - detailed - optional, indicates that user@database is to be reported;
    disconnect(client: IClient, dc: any): void {
        const event = 'disconnect';
        const cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new TypeError(errors.redirectParams(event));
        }
        if (this.detailed) {
            // report user@database details;
            this.print(null, event, this.cct.cn('disconnect(') + this.cct.value(cp.user + '@' + cp.database) + this.cct.cn(')'));
        } else {
            this.print(null, event, this.cct.cn('disconnect'));
        }
    }

    ///////////////////////////////////////////////
    // 'query' event handler;
    // parameters:
    // - e - the only parameter for the event;
    // - detailed - optional, indicates that both task and transaction context are to be reported;
    query(e: IEventContext): void {
        const event = 'query';
        if (!e || !('query' in e)) {
            throw new TypeError(errors.redirectParams(event));
        }
        let q = e.query;
        let special, prepared;
        if (typeof q === 'string') {
            const qSmall = q.toLowerCase();
            const verbs = ['begin', 'commit', 'rollback', 'savepoint', 'release'];
            for (let i = 0; i < verbs.length; i++) {
                if (qSmall.indexOf(verbs[i]) === 0) {
                    special = true;
                    break;
                }
            }
        } else {
            if (typeof q === 'object' && ('name' in q || 'text' in q)) {
                // Either a Prepared Statement or a Parameterized Query;
                prepared = true;
                const msg = [];
                if ('name' in q) {
                    msg.push(this.cct.query('name=') + '"' + this.cct.value(q.name) + '"');
                }
                if ('text' in q) {
                    msg.push(this.cct.query('text=') + '"' + this.cct.value(q.text) + '"');
                }
                if (Array.isArray(q.values) && q.values.length) {
                    msg.push(this.cct.query('values=') + this.cct.value(toJson(q.values)));
                }
                q = msg.join(', ');
            }
        }
        let qText = q;
        if (!prepared) {
            qText = special ? this.cct.special(q) : this.cct.query(q);
        }
        if (this.detailed && e.ctx) {
            // task/transaction details are to be reported;
            const sTag = getTagName(e), prefix = e.ctx.isTX ? 'tx' : 'task';
            if (sTag) {
                qText = this.cct.tx(prefix + '(') + this.cct.value(sTag) + this.cct.tx('): ') + qText;
            } else {
                qText = this.cct.tx(prefix + ': ') + qText;
            }
        }
        this.print(e, event, qText);
        if (e.params) {
            let p = e.params;
            if (typeof p !== 'string') {
                p = toJson(p);
            }
            this.print(e, event, timeGap + this.cct.paramTitle('params: ') + this.cct.value(p), true);
        }
    }

    ///////////////////////////////////////////////
    // 'task' event handler;
    // parameters:
    // - e - the only parameter for the event;
    task(e: IEventContext): void {
        const event = 'task';
        if (!e || !e.ctx) {
            throw new TypeError(errors.redirectParams(event));
        }
        let msg = this.cct.tx('task');
        const sTag = getTagName(e);
        if (sTag) {
            msg += this.cct.tx('(') + this.cct.value(sTag) + this.cct.tx(')');
        }
        if (e.ctx.finish) {
            msg += this.cct.tx('/end');
        } else {
            msg += this.cct.tx('/start');
        }
        if (e.ctx.finish) {
            const duration = formatDuration(e.ctx.finish.getDate() - e.ctx.start.getDate());
            msg += this.cct.tx('; duration: ') + this.cct.value(duration) + this.cct.tx(', success: ') + this.cct.value(!!e.ctx.success);
        }
        this.print(e, event, msg);
    }

    ///////////////////////////////////////////////
    // 'transact' event handler;
    // parameters:
    // - e - the only parameter for the event;
    transact(e: IEventContext): void {
        const event = 'transact';
        if (!e || !e.ctx) {
            throw new TypeError(errors.redirectParams(event));
        }
        let msg = this.cct.tx('tx');
        const sTag = getTagName(e);
        if (sTag) {
            msg += this.cct.tx('(') + this.cct.value(sTag) + this.cct.tx(')');
        }
        if (e.ctx.finish) {
            msg += this.cct.tx('/end');
        } else {
            msg += this.cct.tx('/start');
        }
        if (e.ctx.finish) {
            const duration = formatDuration(e.ctx.finish.getDate() - e.ctx.start.getDate());
            msg += this.cct.tx('; duration: ') + this.cct.value(duration) + this.cct.tx(', success: ') + this.cct.value(!!e.ctx.success);
        }
        this.print(e, event, msg);
    }

    ///////////////////////////////////////////////
    // 'error' event handler;
    // parameters:
    // - err - error-text parameter for the original event;
    // - e - error context object for the original event;
    // - detailed - optional, indicates that transaction context is to be reported;
    error(err: any, e: IEventContext): void {
        const event = 'error';
        const errMsg = err ? (err.message || err) : null;
        if (!e || typeof e !== 'object') {
            throw new TypeError(errors.redirectParams(event));
        }
        this.print(e, event, this.cct.errorTitle('error: ') + this.cct.error(errMsg));
        let q = e.query;
        if (q !== undefined && typeof q !== 'string') {
            if (typeof q === 'object' && ('name' in q || 'text' in q)) {
                const tmp: { [name: string]: any } = {};
                const names = ['name', 'text', 'values'];
                names.forEach(n => {
                    if (n in q) {
                        tmp[n] = q[n];
                    }
                });
                q = tmp;
            }
            q = toJson(q);
        }
        if (e.cn) {
            // a connection issue;
            this.print(e, event, timeGap + this.cct.paramTitle('connection: ') + this.cct.value(toJson(e.cn)), true);
        } else {
            if (q !== undefined) {
                if (this.detailed && e.ctx) {
                    // transaction details are to be reported;
                    const sTag = getTagName(e), prefix = e.ctx.isTX ? 'tx' : 'task';
                    if (sTag) {
                        this.print(e, event, timeGap + this.cct.paramTitle(prefix + '(') + this.cct.value(sTag) + this.cct.paramTitle('): ') + this.cct.value(q), true);
                    } else {
                        this.print(e, event, timeGap + this.cct.paramTitle(prefix + ': ') + this.cct.value(q), true);
                    }
                } else {
                    this.print(e, event, timeGap + this.cct.paramTitle('query: ') + this.cct.value(q), true);
                }
            }
        }
        if (e.params) {
            this.print(e, event, timeGap + this.cct.paramTitle('params: ') + this.cct.value(toJson(e.params)), true);
        }
    }

    /////////////////////////////////////////////////////////
    // attaches to pg-promise initialization options object:
    // - options - the options object;
    // - events - optional, list of events to attach to;
    // - override - optional, overrides the existing event handlers;
    attach(initOptions: IInitOptions, options?: { events?: EventName[], override?: boolean }): void {

        if (this.initOptions) {
            throw new Error('Repeated attachments not supported, must call detach first.');
        }

        if (!options || typeof options !== 'object') {
            throw new TypeError(`Initialization object 'options' must be specified.`);
        }

        let events: EventName[] = options && options.events || [];
        const override = options && options.override;
        const hasFilter = Array.isArray(events);

        if (!isNull(events) && !hasFilter) {
            throw new TypeError(`Invalid parameter 'events' passed.`);
        }

        events = events || [];
        this.initOptions = initOptions;
        const self = this;

        const attach = (e: EventName) => {
            if (!hasFilter || events.indexOf(e) !== -1) {
                if (typeof initOptions[e] === 'function' && !override) {
                    self.state[e] = initOptions[e] as any;
                    initOptions[e] = function () {
                        if (typeof self.state[e] === 'function') {
                            (self.state[e] as any).apply(null, arguments); // call the original handler;
                        }
                        (self[e] as any).apply(null, arguments);
                    };
                } else {
                    initOptions[e] = self[e] as any;
                }
            }
        };
        eventNames.forEach(e => {
            attach(e);
        });
    }

    isAttached(): boolean {
        return !!this.initOptions;
    }

    /////////////////////////////////////////////////////////
    // detaches from all events to which was attached during
    // the last `attach` call.
    detach(): void {
        if (!this.initOptions) {
            throw new Error('Event monitor not attached.');
        }
        const init: IInitOptions = this.initOptions && this.initOptions;
        // SEE: https://stackoverflow.com/questions/58380515/copying-a-same-key-property-error-in-typescript
        eventNames.forEach(e => {
            if (this.state[e]) {
                init[e] = this.state[e] as any;
                delete this.state[e];
            } else {
                delete init[e];
            }
        });
        this.initOptions = null;
    }

    //////////////////////////////////////////////////////////////////
    // sets a new theme either by its name (from the predefined ones),
    // or as a new object with all colors specified.
    setTheme(t: ITheme | ThemeName): void {
        const err = new TypeError('Invalid theme parameter specified.');
        if (!t) {
            throw err;
        }
        if (typeof t === 'string') {
            if (t in Themes) {
                this.cct = Themes[t];
            } else {
                throw new TypeError(`Theme '${t}' does not exist.`);
            }
        } else {
            if (typeof t === 'object') {
                themeAttrs.forEach(a => {
                    if (!hasOwnProperty(t, a)) {
                        throw new TypeError(`Invalid theme: property ' ${a}' is missing.`);
                    }
                    if (typeof t[a] !== 'function') {
                        throw new TypeError(`Theme property '${a}' is invalid.`);
                    }
                });
                this.cct = t;
            } else {
                throw err;
            }
        }
    }

    //////////////////////////////////////////////////////////////////
    // sets a custom log function to support the function attribution in Typescript.
    setLog(log: any): void {
        module.exports.log = typeof log === 'function' ? log : null;
    }

    private print(e: IEventContext | null, event: EventName, text: string, isExtraLine?: boolean) {
        let t = null, s = text;
        if (!isExtraLine) {
            t = new Date();
            s = this.cct.time(formatTime(t)) + ' ' + text;
        }
        let display = true;
        const log = module.exports.log;
        if (typeof log === 'function') {
            // the client expects log notifications;
            const info = {
                event: event,
                time: t,
                text: removeColors(text).trim(),
                ctx: null,
                display: undefined
            };
            if (e && e.ctx) {
                info.ctx = e.ctx as any;
            }
            log(removeColors(s), info);
            display = info.display === undefined || !!info.display;
        }
        // istanbul ignore next: cannot test the next
        // block without writing things into the console;
        if (display) {
            if (!process.stdout.isTTY) {
                s = removeColors(s);
            }
            // eslint-disable-next-line
            console.log(s);
        }
    }
}
