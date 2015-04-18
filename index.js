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

    transact: function (e) {

    },

    query: function (e) {
        if (!e || !('query' in e)) {
            throw new Error(errorMsg);
        }
        var q = e.query;
        if(typeof(q) !== 'string'){
            q = JSON.stringify(q);
        }
        print(q.white);
        if (e.params) {
            var p = e.params;
            if(typeof(p) !== 'string'){
                p = JSON.stringify(p);
            }
            print("PARAMS: ".cyan + p.white, true);
        }
    },

    error: function (err, e) {
        print(err, colors.red);
        if (e.query) {

        }
    },

    log: function (msg, color) {

    }
};

function print(txt, color, nextLine) {
    var msg = nextLine ? "" : getTime();
    if (color) {
        msg += color(txt);
    }
    console.log(msg);
}

function getTime() {
    var t = new Date();
    var s = t.getHours().padZeros(2) + ':' + t.getMinutes().padZeros(2) + ':' + t.getSeconds().padZeros(2) + ' ';
    return s.bgWhite.black;
}

Number.prototype.padZeros = function (n) {
    var str = this.toString();
    while (str.length < n)
        str = '0' + str;
    return str;
};
