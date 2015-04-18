var colors = require("colors");

module.exports = {

    connect: function (client) {

    },

    disconnect: function (client) {

    },

    transact: function (e) {

    },

    query: function (e) {
        print(e.query);
    },

    error: function (err, e) {
        print(err, colors.red);
    },

    log: function (msg, color) {

    }
};

function print(txt, color) {
    var msg = getTime();
    if (color) {
        msg += color(txt);
    } else {
        msg += txt.white;
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
