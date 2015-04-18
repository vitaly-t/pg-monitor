var colors = require("colors");

var errorMsg = "Invalid event redirect into pg-monitor.";

module.exports = {

    connect: function (client) {
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new Error(errorMsg);
        }
        print(("Connected to: " + cp.database).white);
    },

    disconnect: function (client) {
        var cp = client ? client.connectionParameters : null;
        if (!cp) {
            throw new Error(errorMsg);
        }
        print(("Disconnecting from: " + cp.database).white);
    },

    query: function (e) {
        if (!e || !('query' in e)) {
            throw new Error(errorMsg);
        }
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
            print("PARAMS: ".cyan + p.white, true);
        }
    },

    transact: function (e) {
        if (!e || !e.ctx) {
            throw new Error(errorMsg);
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
        print(err.red);
        if (e.query) {

        }
    },

    log: function (msg, color) {

    },

    attach: function (options, override) {

        if (typeof(options) !== 'object') {
            throw new Error("Object 'options' must be specified.");
        }

        var self = this;

        // attaching to 'connect' event:
        if (typeof(options.connect) === 'function' && !override) {
            var f = options.connect;
            options.connect = function (client) {
                self.connect(client);
                f(client);
            };
        } else {
            options.connect = self.connect;
        }

        // attaching to 'disconnect' event:
        if (typeof(options.disconnect) === 'function' && !override) {
            var f = options.disconnect;
            options.disconnect = function (client) {
                self.disconnect(client);
                f(client);
            };
        } else {
            options.disconnect = self.disconnect;
        }

        // attaching to 'query' event:
        if (typeof(options.query) === 'function' && !override) {
            var f = options.query;
            options.query = function (e) {
                self.query(e);
                f(e);
            };
        } else {
            options.query = self.query;
        }

        // attaching to 'transact' event:
        if (typeof(options.transact) === 'function' && !override) {
            var f = options.transact;
            options.transact = function (e) {
                self.transact(e);
                f(e);
            };
        } else {
            options.transact = self.transact;
        }

        // attaching to 'error' event:
        if (typeof(options.error) === 'function' && !override) {
            var f = options.error;
            options.error = function (err, e) {
                self.error(err, e);
                f(err, e);
            };
        } else {
            options.error = self.error;
        }
    }
};

function print(text, extraLine) {
    if (!extraLine) {
        text = getTime() + text;
    }
    console.log(text);

    // notify the client of a new line;
    var nf = module.exports.notify;
    if (typeof(nf) === 'function') {
        nf(removeColors(text));
    }
}

function getTime() {
    var t = new Date();
    var s = t.getHours().padZeros(2) + ':' + t.getMinutes().padZeros(2) + ':' + t.getSeconds().padZeros(2) + ' ';
    return s.bgWhite.black;
}

if (!Number.prototype.padZeros) {
    Number.prototype.padZeros = function (n) {
        var str = this.toString();
        while (str.length < n)
            str = '0' + str;
        return str;
    };
}

function removeColors(text) {
    return text.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
}
