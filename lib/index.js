'use strict';

var themes = require("./themes");

var cct = themes.matrix; // current color theme;

module.exports = {

    connect: function (client) {
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new Error(errors.redirectParams('connect'));
        }
        print(cct.cn("connect(") + cct.value(cp.user + "@" + cp.database) + cct.cn(")"));
    },

    disconnect: function (client) {
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new Error(errors.redirectParams('disconnect'));
        }
        print(cct.cn("disconnect(") + cct.value(cp.user + "@" + cp.database) + cct.cn(")"));
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
            print(cct.special(q));
        } else {
            print(cct.query(q));
        }
        if (e.params) {
            var p = e.params;
            if (typeof(p) !== 'string') {
                p = JSON.stringify(p);
            }
            print(cct.paramVerb("params: ") + cct.value(p), true);
        }
    },

    transact: function (e) {
        if (!e || !e.ctx) {
            throw new Error(errors.redirectParams('transact'));
        }
        var msg;
        if (e.ctx.finish) {
            msg = cct.tx("tx-end");
        } else {
            msg = cct.tx("tx-start");
        }
        var sTag, tag = e.ctx.tag;
        if (tag) {
            if (typeof(tag) === 'string') {
                sTag = tag;
            } else {
                if (typeof(tag) === 'object' && tag.hasOwnProperty('toString') && typeof(tag.toString) === 'function') {
                    sTag = tag.toString();
                }
            }
        }
        if (sTag) {
            msg += cct.tx("(") + cct.value(sTag) + cct.tx(")");
        }
        if (e.ctx.finish) {
            var duration = formatDuration(e.ctx.finish - e.ctx.start);
            msg += cct.tx("; duration: ") + cct.value(duration) + cct.tx(", success: ") + cct.value(e.ctx.success);
        }
        print(msg);
    },

    error: function (err, e) {
        if (typeof(err) !== 'string' || !e || typeof(e) !== 'object') {
            throw new Error(errors.redirectParams('error'));
        }
        print(cct.errorVerb("error: ") + cct.error(err));
        var q = e.query;
        if (typeof(q) !== 'string') {
            q = JSON.stringify(q);
        }
        print(cct.paramVerb(timeGap + "query: ") + cct.value(q), true);
        if (e.params) {
            print(timeGap + cct.paramVerb("params: ") + cct.value(JSON.stringify(e.params)), true);
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

    setTheme: function (t) {
        selectTheme(t);
    }
};

function print(text, isExtraLine) {
    var t, s = text;
    if (!isExtraLine) {
        t = new Date();
        s = cct.time(formatTime(t)) + ' ' + text;
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

if (!Number.prototype.padZeros) {
    Number.prototype.padZeros = function (n) {
        var str = this.toString();
        while (str.length < n)
            str = '0' + str;
        return str;
    };
}

// reusable error messages;
var errors = {
    redirectParams: function (event) {
        return "Invalid event '" + event + "' redirect parameters.";
    }
};

function selectTheme(t) {
    var err = "Invalid theme parameter specified.";
    if (!t) {
        throw new Error(err);
    }
    if (typeof(t) === 'string') {
        if (t in themes) {
            cct = themes[t];
        } else {
            throw new Error("Theme '" + t + "' doesn't exist.");
        }
    } else {
        if (typeof(t) === 'object') {
            if (t && typeof(t) === 'object') {
                for (var p in themes.mono) {
                    if (!t.hasOwnProperty(p)) {
                        throw new Error("Invalid theme: property '" + p + "' is missing.");
                    }
                    if (typeof(t[p]) !== 'function') {
                        throw new Error("Theme property '" + p + "' is invalid.");
                    }
                }
                cct = t;
            }
        } else {
            throw new Error(err);
        }
    }
}

var timeGap = '         '; // 9 spaces for time offset;
