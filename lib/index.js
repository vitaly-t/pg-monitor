'use strict';

var themes = require("./themes");

var cct = themes.dimmed; // current/default color theme;

// monitor state;
var $state = {};

// supported events;
var $events = ['connect', 'disconnect', 'query', 'error', 'task', 'transact'];

var monitor = {

    ///////////////////////////////////////////////
    // 'connect' event handler;
    // parameters:
    // - client - the only parameter for the event;
    // - detailed - optional, indicates that user@database is to be reported;
    connect: function (client, dc, fresh, detailed) {
        var event = 'connect';
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new TypeError(errors.redirectParams(event));
        }
        var d = (detailed === undefined) ? monitor.detailed : !!detailed;
        if (d) {
            print(event, cct.cn("connect(") + cct.value(cp.user + "@" + cp.database) + cct.cn(")"));
        } else {
            print(event, cct.cn("connect"));
        }
    },

    ///////////////////////////////////////////////
    // 'connect' event handler;
    // parameters:
    // - client - the only parameter for the event;
    // - detailed - optional, indicates that user@database is to be reported;
    disconnect: function (client, dc, detailed) {
        var event = 'disconnect';
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new TypeError(errors.redirectParams(event));
        }
        var d = (detailed === undefined) ? monitor.detailed : !!detailed;
        if (d) {
            // report user@database details;
            print(event, cct.cn("disconnect(") + cct.value(cp.user + "@" + cp.database) + cct.cn(")"));
        } else {
            print(event, cct.cn("disconnect"));
        }
    },

    ///////////////////////////////////////////////
    // 'query' event handler;
    // parameters:
    // - e - the only parameter for the event;
    // - detailed - optional, indicates that both task and transaction context are to be reported;
    query: function (e, detailed) {
        var event = 'query';
        if (!e || !('query' in e)) {
            throw new TypeError(errors.redirectParams(event));
        }
        var q = e.query;
        var special, prepared;
        if (typeof q === 'string') {
            var qSmall = q.toLowerCase();
            var verbs = ['begin', 'commit', 'rollback', 'savepoint', 'release'];
            for (var i = 0; i < verbs.length; i++) {
                if (qSmall.indexOf(verbs[i]) === 0) {
                    special = true;
                    break;
                }
            }
        } else {
            if (typeof q === 'object' && ('name' in q || 'text' in q)) {
                // Either a Prepared Statement or a Parameterized Query;
                prepared = true;
                var msg = [];
                if ('name' in q) {
                    msg.push(cct.query('name=') + '"' + cct.value(q.name) + '"');
                }
                if ('text' in q) {
                    msg.push(cct.query('text=') + '"' + cct.value(q.text) + '"');
                }
                if (Array.isArray(q.values) && q.values.length) {
                    msg.push(cct.query('values=') + cct.value(q.values));
                }
                q = msg.join(', ');
            }
        }
        var qText = q;
        if (!prepared) {
            qText = special ? cct.special(q) : cct.query(q);
        }
        var d = (detailed === undefined) ? monitor.detailed : !!detailed;
        if (d && e.ctx) {
            // task/transaction details are to be reported;
            var sTag = getTagName(e), prefix = e.ctx.isTX ? "tx" : "task";
            if (sTag) {
                qText = cct.tx(prefix + "(") + cct.value(sTag) + cct.tx("): ") + qText;
            } else {
                qText = cct.tx(prefix + ": ") + qText;
            }
        }
        print(event, qText);
        if (e.params) {
            var p = e.params;
            if (typeof p !== 'string') {
                p = JSON.stringify(p);
            }
            print(event, timeGap + cct.paramTitle("params: ") + cct.value(p), true);
        }
    },

    ///////////////////////////////////////////////
    // 'task' event handler;
    // parameters:
    // - e - the only parameter for the event;
    task: function (e) {
        var event = 'task';
        if (!e || !e.ctx) {
            throw new TypeError(errors.redirectParams(event));
        }
        var msg = cct.tx("task");
        var sTag = getTagName(e);
        if (sTag) {
            msg += cct.tx("(") + cct.value(sTag) + cct.tx(")");
        }
        if (e.ctx.finish) {
            msg += cct.tx("/end");
        } else {
            msg += cct.tx("/start");
        }
        if (e.ctx.finish) {
            var duration = formatDuration(e.ctx.finish - e.ctx.start);
            msg += cct.tx("; duration: ") + cct.value(duration) + cct.tx(", success: ") + cct.value(!!e.ctx.success);
        }
        print(event, msg);
    },

    ///////////////////////////////////////////////
    // 'transact' event handler;
    // parameters:
    // - e - the only parameter for the event;
    transact: function (e) {
        var event = 'transact';
        if (!e || !e.ctx) {
            throw new TypeError(errors.redirectParams(event));
        }
        var msg = cct.tx("tx");
        var sTag = getTagName(e);
        if (sTag) {
            msg += cct.tx("(") + cct.value(sTag) + cct.tx(")");
        }
        if (e.ctx.finish) {
            msg += cct.tx("/end");
        } else {
            msg += cct.tx("/start");
        }
        if (e.ctx.finish) {
            var duration = formatDuration(e.ctx.finish - e.ctx.start);
            msg += cct.tx("; duration: ") + cct.value(duration) + cct.tx(", success: ") + cct.value(!!e.ctx.success);
        }
        print(event, msg);
    },

    ///////////////////////////////////////////////
    // 'error' event handler;
    // parameters:
    // - err - error-text parameter for the original event;
    // - e - error context object for the original event;
    // - detailed - optional, indicates that transaction context is to be reported;
    error: function (err, e, detailed) {
        var event = 'error';
        var errMsg = err ? (err.message || err) : null;
        if (!e || typeof e !== 'object') {
            throw new TypeError(errors.redirectParams(event));
        }
        print(event, cct.errorTitle("error: ") + cct.error(errMsg));
        var q = e.query;
        if (q !== undefined && typeof q !== 'string') {
            if (typeof q === 'object' && ('name' in q || 'text' in q)) {
                var tmp = {};
                var names = ['name', 'text', 'values'];
                names.forEach(function (n) {
                    if (n in q) {
                        tmp[n] = q[n];
                    }
                });
                q = tmp;
            }
            q = JSON.stringify(q);
        }
        if (e.cn) {
            // a connection issue;
            print(event, timeGap + cct.paramTitle("connection: ") + cct.value(JSON.stringify(e.cn)), true);
        } else {
            if (q !== undefined) {
                var d = (detailed === undefined) ? monitor.detailed : !!detailed;
                if (d && e.ctx) {
                    // transaction details are to be reported;
                    var sTag = getTagName(e), prefix = e.ctx.isTX ? "tx" : "task";
                    if (sTag) {
                        print(event, timeGap + cct.paramTitle(prefix + "(") + cct.value(sTag) + cct.paramTitle("): ") + cct.value(q), true);
                    } else {
                        print(event, timeGap + cct.paramTitle(prefix + ": ") + cct.value(q), true);
                    }
                } else {
                    print(event, timeGap + cct.paramTitle("query: ") + cct.value(q), true);
                }
            }
        }
        if (e.params) {
            print(event, timeGap + cct.paramTitle("params: ") + cct.value(JSON.stringify(e.params)), true);
        }
    },

    /////////////////////////////////////////////////////////
    // attaches to pg-promise initialization options object:
    // - options - the options object;
    // - events - optional, list of events to attach to;
    // - override - optional, overrides the existing event handlers;
    attach: function (options, events, override) {

        if (options && options.options && typeof options.options === 'object') {
            events = options.events;
            override = options.override;
            options = options.options;
        }

        if ($state.options) {
            throw new Error("Repeated attachments not supported, must call detach first.");
        }

        if (!options || typeof options !== 'object') {
            throw new TypeError("Initialization object 'options' must be specified.");
        }

        var hasFilter = Array.isArray(events);

        if (!isNull(events) && !hasFilter) {
            throw new TypeError("Invalid parameter 'events' passed.");
        }

        $state.options = options;

        var self = this;

        // attaching to 'connect' event:
        if (!hasFilter || events.indexOf('connect') !== -1) {
            $state.connect = {
                value: options.connect,
                exists: 'connect' in options
            };
            if (typeof options.connect === 'function' && !override) {
                options.connect = function (client, dc, fresh) {
                    $state.connect.value(client, dc, fresh); // call the original handler;
                    self.connect(client, dc, fresh);
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
    },

    /////////////////////////////////////////////////////////
    // detaches from all events to which was attached during
    // the last `attach` call.
    detach: function () {
        if (!$state.options) {
            throw new Error("Event monitor not attached.");
        }
        $events.forEach(function (e) {
            if (e in $state) {
                if ($state[e].exists) {
                    $state.options[e] = $state[e].value;
                } else {
                    delete $state.options[e];
                }
                delete $state[e];
            }
        });
        $state.options = null;
    },

    //////////////////////////////////////////////////////////////////
    // sets a new theme either by its name (from the predefined ones),
    // or as a new object with all colors specified.
    setTheme: function (t) {
        var err = "Invalid theme parameter specified.";
        if (!t) {
            throw new TypeError(err);
        }
        if (typeof t === 'string') {
            if (t in themes) {
                cct = themes[t];
            } else {
                throw new TypeError("Theme '" + t + "' does not exist.");
            }
        } else {
            if (typeof t === 'object') {
                for (var p in themes.monochrome) {
                    if (!t.hasOwnProperty(p)) {
                        throw new TypeError("Invalid theme: property '" + p + "' is missing.");
                    }
                    if (typeof t[p] !== 'function') {
                        throw new TypeError("Theme property '" + p + "' is invalid.");
                    }
                }
                cct = t;
            } else {
                throw new Error(err);
            }
        }
    },

    ////////////////////////////////////////////////////
    // global 'detailed' flag override, to report all
    // of the optional details that are supported;
    detailed: true,

    //////////////////////////////////////////////////////////////////
    // sets a new value to the detailed var. This function is needed
    // to support the value attribution in Typescript.
    setDetailed: function (value) {
        this.detailed = !!value;
    },

    //////////////////////////////////////////////////////////////////
    // sets a custom log function to support the function attribution
    // in Typescript.
    setLog: function (log) {
        module.exports.log = typeof log === 'function' ? log : null;
    }
};

// prints the text on screen, optionally
// notifying the client of the log events;
function print(event, text, isExtraLine) {
    var t = null, s = text;
    if (!isExtraLine) {
        t = new Date();
        s = cct.time(formatTime(t)) + ' ' + text;
    }
    var display = true, log = module.exports.log;
    if (typeof log === 'function') {
        // the client expects log notifications;
        var info = {
            event: event,
            time: t,
            text: removeColors(text).trim()
        };
        log(removeColors(s), info);
        display = info.display === undefined || !!info.display;
    }
    // istanbul ignore next: cannot test the next
    // block without writing things into the console;
    if (display) {
        if (!process.stdout.isTTY) {
            s = removeColors(s);
        }
        console.log(s);
    }
}

// formats time as '00:00:00';
function formatTime(t) {
    return t.getHours().padZeros(2) + ':' + t.getMinutes().padZeros(2) + ':' + t.getSeconds().padZeros(2);
}

// formats duration value (in milliseconds) as '00:00:00.000',
// shortened to just the values that are applicable.
function formatDuration(d) {
    var hours = Math.floor(d / 3600000);
    var minutes = Math.floor((d - hours * 3600000) / 60000);
    var seconds = Math.floor((d - hours * 3600000 - minutes * 60000) / 1000);
    var ms = d - hours * 3600000 - minutes * 60000 - seconds * 1000;
    var s = "." + ms.padZeros(3); // milliseconds are shown always;
    if (d >= 1000) {
        // seconds are to be shown;
        s = seconds.padZeros(2) + s;
        if (d >= 60000) {
            // minutes are to be shown;
            s = minutes.padZeros(2) + ':' + s;
            if (d >= 3600000) {
                // hours are to be shown;
                s = hours.padZeros(2) + ':' + s;
            }
        }
    }
    return s;
}

// removes color elements from the text;
function removeColors(text) {
    return text.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
}

// pads numbers with zeroes;
if (!Number.prototype.padZeros) {
    Number.prototype.padZeros = function (n) {
        var str = this.toString();
        while (str.length < n)
            str = '0' + str;
        return str;
    };
}

// extracts tag name from a tag object/value;
function getTagName(event) {
    var sTag, tag = event.ctx.tag;
    if (tag) {
        if (typeof tag === 'string') {
            sTag = tag;
        } else {
            // if the tag is an object, it must have its own method toString(),
            // in order to be converted automatically;
            if (typeof tag === 'object' && tag.hasOwnProperty('toString') && typeof tag.toString === 'function') {
                sTag = tag.toString();
            }
        }
    }
    return sTag;
}

////////////////////////////////////////////
// Simpler check for null/undefined;
function isNull(value) {
    return value === null || value === undefined;
}

// reusable error messages;
var errors = {
    redirectParams: function (event) {
        return "Invalid event '" + event + "' redirect parameters.";
    }
};

// 9 spaces for the time offset;
var timeGap = '         ';

module.exports = monitor;
