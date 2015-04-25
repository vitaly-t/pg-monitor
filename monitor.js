var colors = require("colors");

module.exports = {

    connect: function (client) {
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new Error(errors.redirectParams('connect'));
        }
        print("CONNECT: ".cyan + cp.database.white);
    },

    disconnect: function (client) {
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new Error(errors.redirectParams('disconnect'));
        }
        print("DISCONNECT: ".cyan + cp.database.white);
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
        print(q.white);
        if (e.params) {
            var p = e.params;
            if (typeof(p) !== 'string') {
                p = JSON.stringify(p);
            }
            print("Params: ".cyan + p.white, true);
        }
    },

    transact: function (e) {
        if (!e || !e.ctx) {
            throw new Error(errors.redirectParams('transact'));
        }
        var msg;
        if (e.ctx.finish) {
            msg = "TX-FINISH".cyan;
        } else {
            msg = "TX-START".cyan;
        }
        if (typeof(e.ctx.tag) === 'string') {
            msg += "(".cyan + e.ctx.tag.white + ")".cyan;
        }
        print(msg);
    },

    error: function (err, e) {
        if (typeof(err) !== 'string' || typeof(e) !== 'object') {
            throw new Error(errors.redirectParams('error'));
        }

        print("ERROR: ".cyan + err.red);
        var q = e.query;
        if (typeof(q) !== 'string') {
            q = JSON.stringify(q);
        }
        print("Query: ".cyan + q.white, true);
        if (e.params) {
            print("Params: ".cyan + JSON.stringify(e.params), true);
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
    }
};

function print(text, isExtraLine) {
    if (!isExtraLine) {
        text = getTime().bgWhite.black + ' ' + text;
    }
    console.log(text);

    // notify the client of a new log line;
    var nf = module.exports.notify;
    if (typeof(nf) === 'function') {
        nf(removeColors(text));
    }
}

function getTime() {
    var t = new Date();
    return pad(t.getHours()) + ':' + pad(t.getMinutes()) + ':' + pad(t.getSeconds());
}

function pad(d) {
    return d < 10 ? '0' + d : d;
}

function removeColors(text) {
    return text.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
}

// reusable error messages;
var errors = {
    redirectParams: function (event) {
        return "Invalid event '" + event + "' redirect parameters.";
    }
};
