import {ITheme, Themes} from './themes';
import {EventName, IClient, IEventContext, IInitOptions} from './types';
import {formatDuration, getTagName, isNull, print, toJson} from './utils';

// monitor state;
const $state = {};

// supported events;
const $events = ['connect', 'disconnect', 'query', 'error', 'task', 'transact'];

// reusable error messages;
const errors = {
    redirectParams(event) {
        return 'Invalid event \'' + event + '\' redirect parameters.';
    }
};

// 9 spaces for the time offset:
const timeGap = ' '.repeat(9);

export class Monitor {

    /**
     * Current Color Theme.
     */
    cct: ITheme;

    private initOptions: IInitOptions | void;

    detailed: boolean;

    constructor() {
        this.detailed = true;
        this.cct = Themes.dimmed;
    }

    ///////////////////////////////////////////////
    // 'connect' event handler;
    // parameters:
    // - client - the only parameter for the event;
    // - detailed - optional, indicates that user@database is to be reported;
    connect(client: IClient, dc: any, useCount: number) {
        const event = 'connect';
        const cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new TypeError(errors.redirectParams(event));
        }
        if (this.detailed) {
            const countInfo = typeof useCount === 'number' ? this.cct.cn('; useCount: ') + this.cct.value(useCount) : '';
            print(null, event, this.cct.cn('connect(') + this.cct.value(cp.user + '@' + cp.database) + this.cct.cn(')') + countInfo);
        } else {
            print(null, event, this.cct.cn('connect'));
        }
    }

    ///////////////////////////////////////////////
    // 'connect' event handler;
    // parameters:
    // - client - the only parameter for the event;
    // - detailed - optional, indicates that user@database is to be reported;
    disconnect(client: any, dc: any) {
        const event = 'disconnect';
        const cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new TypeError(errors.redirectParams(event));
        }
        if (this.detailed) {
            // report user@database details;
            print(null, event, this.cct.cn('disconnect(') + this.cct.value(cp.user + '@' + cp.database) + this.cct.cn(')'));
        } else {
            print(null, event, this.cct.cn('disconnect'));
        }
    }

    ///////////////////////////////////////////////
    // 'query' event handler;
    // parameters:
    // - e - the only parameter for the event;
    // - detailed - optional, indicates that both task and transaction context are to be reported;
    query(e: IEventContext) {
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
        print(e, event, qText);
        if (e.params) {
            let p = e.params;
            if (typeof p !== 'string') {
                p = toJson(p);
            }
            print(e, event, timeGap + this.cct.paramTitle('params: ') + this.cct.value(p), true);
        }
    }

    ///////////////////////////////////////////////
    // 'task' event handler;
    // parameters:
    // - e - the only parameter for the event;
    task(e: IEventContext) {
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
        print(e, event, msg);
    }

    ///////////////////////////////////////////////
    // 'transact' event handler;
    // parameters:
    // - e - the only parameter for the event;
    transact(e: IEventContext) {
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
        print(e, event, msg);
    }

    ///////////////////////////////////////////////
    // 'error' event handler;
    // parameters:
    // - err - error-text parameter for the original event;
    // - e - error context object for the original event;
    // - detailed - optional, indicates that transaction context is to be reported;
    error(err: any, e: IEventContext) {
        const event = 'error';
        const errMsg = err ? (err.message || err) : null;
        if (!e || typeof e !== 'object') {
            throw new TypeError(errors.redirectParams(event));
        }
        print(e, event, this.cct.errorTitle('error: ') + this.cct.error(errMsg));
        let q = e.query;
        if (q !== undefined && typeof q !== 'string') {
            if (typeof q === 'object' && ('name' in q || 'text' in q)) {
                const tmp = {};
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
            print(e, event, timeGap + this.cct.paramTitle('connection: ') + this.cct.value(toJson(e.cn)), true);
        } else {
            if (q !== undefined) {
                if (this.detailed && e.ctx) {
                    // transaction details are to be reported;
                    const sTag = getTagName(e), prefix = e.ctx.isTX ? 'tx' : 'task';
                    if (sTag) {
                        print(e, event, timeGap + this.cct.paramTitle(prefix + '(') + this.cct.value(sTag) + this.cct.paramTitle('): ') + this.cct.value(q), true);
                    } else {
                        print(e, event, timeGap + this.cct.paramTitle(prefix + ': ') + this.cct.value(q), true);
                    }
                } else {
                    print(e, event, timeGap + this.cct.paramTitle('query: ') + this.cct.value(q), true);
                }
            }
        }
        if (e.params) {
            print(e, event, timeGap + this.cct.paramTitle('params: ') + this.cct.value(toJson(e.params)), true);
        }
    }

    /////////////////////////////////////////////////////////
    // attaches to pg-promise initialization options object:
    // - options - the options object;
    // - events - optional, list of events to attach to;
    // - override - optional, overrides the existing event handlers;
    attach(initOptions: IInitOptions, options?: { events?: EventName[], override?: boolean }) {

        /*
        if (options && options.options && typeof options.options === 'object') {
            events = options.events;
            override = options.override;
            options = options.options;
        }*/

        if (this.initOptions) {
            throw new Error('Repeated attachments not supported, must call detach first.');
        }

        if (!options || typeof options !== 'object') {
            throw new TypeError('Initialization object \'options\' must be specified.');
        }

        const events = options && options.events;

        const hasFilter = Array.isArray(events);

        if (!isNull(events) && !hasFilter) {
            throw new TypeError('Invalid parameter \'events\' passed.');
        }

        this.initOptions = initOptions;

        const self = this;

        // attaching to 'connect' event:
        if (!hasFilter || events.indexOf('connect') !== -1) {
            $state.connect = {
                value: options.connect,
                exists: 'connect' in options
            };
            if (typeof options.connect === 'function' && !override) {
                options.connect = function (client, dc, useCount) {
                    $state.connect.value(client, dc, useCount); // call the original handler;
                    self.connect(client, dc, useCount);
                };
            } else {
                options.connect = self.connect;
            }
        }

        // attaching to 'disconnect' event:
        if (!hasFilter || events.indexOf('disconnect') !== -1) {
            $state.disconnect = {
                value: options.disconnect,
                exists: 'disconnect' in options
            };
            if (typeof options.disconnect === 'function' && !override) {
                options.disconnect = function (client, dc) {
                    $state.disconnect.value(client, dc); // call the original handler;
                    self.disconnect(client, dc);
                };
            } else {
                options.disconnect = self.disconnect;
            }
        }

        // attaching to 'query' event:
        if (!hasFilter || events.indexOf('query') !== -1) {
            $state.query = {
                value: options.query,
                exists: 'query' in options
            };
            if (typeof options.query === 'function' && !override) {
                options.query = function (e) {
                    $state.query.value(e); // call the original handler;
                    self.query(e);
                };
            } else {
                options.query = self.query;
            }
        }

        // attaching to 'task' event:
        if (!hasFilter || events.indexOf('task') !== -1) {
            $state.task = {
                value: options.task,
                exists: 'task' in options
            };
            if (typeof options.task === 'function' && !override) {
                options.task = function (e) {
                    $state.task.value(e); // call the original handler;
                    self.task(e);
                };
            } else {
                options.task = self.task;
            }
        }

        // attaching to 'transact' event:
        if (!hasFilter || events.indexOf('transact') !== -1) {
            $state.transact = {
                value: options.transact,
                exists: 'transact' in options
            };
            if (typeof options.transact === 'function' && !override) {
                options.transact = function (e) {
                    $state.transact.value(e); // call the original handler;
                    self.transact(e);
                };
            } else {
                options.transact = self.transact;
            }
        }

        // attaching to 'error' event:
        if (!hasFilter || events.indexOf('error') !== -1) {
            $state.error = {
                value: options.error,
                exists: 'error' in options
            };
            if (typeof options.error === 'function' && !override) {
                options.error = function (err, e) {
                    $state.error.value(err, e); // call the original handler;
                    self.error(err, e);
                };
            } else {
                options.error = self.error;
            }
        }
    }

    isAttached() {
        return !!$state.options;
    }

    /////////////////////////////////////////////////////////
    // detaches from all events to which was attached during
    // the last `attach` call.
    detach() {
        if (this.initOptions) {
            throw new Error('Event monitor not attached.');
        }
        $events.forEach(e => {
            if (e in $state) {
                if ($state[e].exists) {
                    $state.options[e] = $state[e].value;
                } else {
                    delete $state.options[e];
                }
                delete $state[e];
            }
        });
        this.initOptions = null;
    }

    //////////////////////////////////////////////////////////////////
    // sets a new theme either by its name (from the predefined ones),
    // or as a new object with all colors specified.
    setTheme(t) {
        const err = 'Invalid theme parameter specified.';
        if (!t) {
            throw new TypeError(err);
        }
        if (typeof t === 'string') {
            if (t in themes) {
                this.cct = themes[t];
            } else {
                throw new TypeError('Theme \'' + t + '\' does not exist.');
            }
        } else {
            if (typeof t === 'object') {
                for (const p in themes.monochrome) {
                    if (!hasOwnProperty(t, p)) {
                        throw new TypeError('Invalid theme: property \'' + p + '\' is missing.');
                    }
                    if (typeof t[p] !== 'function') {
                        throw new TypeError('Theme property \'' + p + '\' is invalid.');
                    }
                }
                this.cct = t;
            } else {
                throw new Error(err);
            }
        }
    }

    //////////////////////////////////////////////////////////////////
    // sets a new value to the detailed var. This function is needed
    // to support the value attribution in Typescript.
    setDetailed(value) {
        this.detailed = !!value;
    }

    //////////////////////////////////////////////////////////////////
    // sets a custom log function to support the function attribution in Typescript.
    setLog(log) {
        module.exports.log = typeof log === 'function' ? log : null;
    }

}
