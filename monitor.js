var themes = require("./themes");

module.exports = {

    connect: function (client) {
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new Error(errors.redirectParams('connect'));
        }
        print(cl.cn("connect(") + cl.value(cp.database) + cl.cn(")"));
    },

    disconnect: function (client) {
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new Error(errors.redirectParams('disconnect'));
        }
        print(cl.cn("disconnect(") + cl.value(cp.database) + cl.cn(")"));
    },

    query: function (e) {

        // add: different color for begin/commit/rollback (yellow perhaps);
        // better idea: green for begin+commit, red for rollback?

        if (!e || !('query' in e)) {
            throw new Error(errors.redirectParams('query'));
        }
        // one below is invalid, because it will never happen:
        // if the query isn't a text string, there will be an error and the event won't be fired;
        var q = e.query;
        if (typeof(q) !== 'string') {
            q = JSON.stringify(q);
        }
        var special, verbs = ['begin', 'commit', 'rollback'];
        for (var i = 0; i < verbs.length; i++) {
            if (q.indexOf(verbs[i]) === 0) {
                special = true;
                break;
            }
        }
        if (special) {
            print(cl.special(q));
        } else {
            print(cl.query(q));
        }
        if (e.params) {
            var p = e.params;
            if (typeof(p) !== 'string') {
                p = JSON.stringify(p);
            }
            print(cl.paramVerb("params: ") + cl.value(p), true);
        }
    },

    transact: function (e) {
        if (!e || !e.ctx) {
            throw new Error(errors.redirectParams('transact'));
        }
        var msg;
        if (e.ctx.finish) {
            msg = cl.tx("tx-end");
        } else {
            msg = cl.tx("tx-start");
        }
        if (typeof(e.ctx.tag) === 'string') {
            msg += cl.tx("(") + cl.value(e.ctx.tag) + cl.tx(")");
        }
        if (e.ctx.finish) {
            var duration = formatDuration(e.ctx.finish - e.ctx.start);
            msg += cl.tx("; duration: ") + cl.value(duration);
        }
        print(msg);
    },

    error: function (err, e) {
        if (typeof(err) !== 'string' || typeof(e) !== 'object') {
            throw new Error(errors.redirectParams('error'));
        }
        print(cl.errorVerb("error: ") + cl.error(err));
        var q = e.query;
        if (typeof(q) !== 'string') {
            q = JSON.stringify(q);
        }
        print(cl.paramVerb(timeGap + "query: ") + cl.value(q), true);
        if (e.params) {
            print(timeGap + cl.paramVerb("params: ") + cl.value(JSON.stringify(e.params)), true);
        }
    },

    attach: function (options, events, override) {

        if (typeof(options) !== 'object') {
            throw new Error("Object 'options' must be specified.");
        }

        var hasFilter = Array.isArray(events);

        if (events && !hasFilter) {
            throw new Error("Invalid parameter 'events' passed.");
        }

        var self = this;

        // attaching to 'connect' event:
        if (!hasFilter || events.indexOf('connect') !== -1) {
            if (typeof(options.connect) === 'function' && !override) {
                var cn = options.connect;
                options.connect = function (client) {
                    self.connect(client);
                    cn(client);
                };
            } else {
                options.connect = self.connect;
            }
        }

        // attaching to 'disconnect' event:
        if (!hasFilter || events.indexOf('disconnect') !== -1) {
            if (typeof(options.disconnect) === 'function' && !override) {
                var dis = options.disconnect;
                options.disconnect = function (client) {
                    self.disconnect(client);
                    dis(client);
                };
            } else {
                options.disconnect = self.disconnect;
            }
        }

        // attaching to 'query' event:
        if (!hasFilter || events.indexOf('query') !== -1) {
            if (typeof(options.query) === 'function' && !override) {
                var q = options.query;
                options.query = function (e) {
                    self.query(e);
                    q(e);
                };
            } else {
                options.query = self.query;
            }
        }

        // attaching to 'transact' event:
        if (!hasFilter || events.indexOf('transact') !== -1) {
            if (typeof(options.transact) === 'function' && !override) {
                var tx = options.transact;
                options.transact = function (e) {
                    self.transact(e);
                    tx(e);
                };
            } else {
                options.transact = self.transact;
            }
        }

        // attaching to 'error' event:
        if (!hasFilter || events.indexOf('error') !== -1) {
            if (typeof(options.error) === 'function' && !override) {
                var er = options.error;
                options.error = function (err, e) {
                    self.error(err, e);
                    er(err, e);
                };
            } else {
                options.error = self.error;
            }
        }
    },
    colors: theme['matrix']
};

function print(text, isExtraLine) {
    var t, s = text;
    if (!isExtraLine) {
        t = new Date();
        s = cl.time(formatTime(t)) + ' ' + text;
    }
    console.log(s);
    // notify the client of a new log line;
    var nf = module.exports.notify;
    if (typeof(nf) === 'function') {
        nf(removeColors(s), {
            time: t,
            text: removeColors(text)
        });
    }
}

function formatTime(t) {
    return t.getHours().padZeros(2) + ':' + t.getMinutes().padZeros(2) + ':' + t.getSeconds().padZeros(2);
}

// converts duration value (in milliseconds) into '00:00:00.000' string,
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

function removeColors(text) {
    return text.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
}

Number.prototype.padZeros = function (n) {
    var str = this.toString();
    while (str.length < n)
        str = '0' + str;
    return str;
};

// reusable error messages;
var errors = {
    redirectParams: function (event) {
        return "Invalid event '" + event + "' redirect parameters.";
    }
};

var timeGap = '         '; // 9 spaces to align event parameters with original message;

var cl = module.exports.theme;
