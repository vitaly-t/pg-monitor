"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// formats time as '00:00:00';
function formatTime(t) {
    return padZeros(t.getHours(), 2) + ':' + padZeros(t.getMinutes(), 2) + ':' + padZeros(t.getSeconds(), 2);
}
exports.formatTime = formatTime;
// formats duration value (in milliseconds) as '00:00:00.000',
// shortened to just the values that are applicable.
function formatDuration(d) {
    const hours = Math.floor(d / 3600000);
    const minutes = Math.floor((d - hours * 3600000) / 60000);
    const seconds = Math.floor((d - hours * 3600000 - minutes * 60000) / 1000);
    const ms = d - hours * 3600000 - minutes * 60000 - seconds * 1000;
    let s = '.' + padZeros(ms, 3); // milliseconds are shown always;
    if (d >= 1000) {
        // seconds are to be shown;
        s = padZeros(seconds, 2) + s;
        if (d >= 60000) {
            // minutes are to be shown;
            s = padZeros(minutes, 2) + ':' + s;
            if (d >= 3600000) {
                // hours are to be shown;
                s = padZeros(hours, 2) + ':' + s;
            }
        }
    }
    return s;
}
exports.formatDuration = formatDuration;
// removes color elements from the text;
function removeColors(text) {
    /*eslint no-control-regex: 0*/
    return text.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
}
exports.removeColors = removeColors;
function padZeros(value, n) {
    let str = value.toString();
    while (str.length < n)
        str = '0' + str;
    return str;
}
exports.padZeros = padZeros;
function hasOwnProperty(obj, propName) {
    return Object.prototype.hasOwnProperty.call(obj, propName);
}
exports.hasOwnProperty = hasOwnProperty;
function getTagName(e) {
    let sTag;
    const tag = e.ctx && e.ctx.tag;
    if (tag) {
        switch (typeof tag) {
            case 'string':
                sTag = tag;
                break;
            case 'number':
                if (Number.isFinite(tag)) {
                    sTag = tag.toString();
                }
                break;
            case 'object':
                // A tag-object must have its own method toString(), in order to be converted automatically;
                if (hasOwnProperty(tag, 'toString') && typeof tag.toString === 'function') {
                    sTag = tag.toString();
                }
                break;
            default:
                break;
        }
    }
    return sTag;
}
exports.getTagName = getTagName;
////////////////////////////////////////////
// Simpler check for null/undefined;
function isNull(value) {
    return value === null || value === undefined;
}
exports.isNull = isNull;
///////////////////////////////////////////////////////////////
// Adds support for BigInt, to be rendered like in JavaScript,
// as an open value, with 'n' in the end.
function toJson(data) {
    if (data !== undefined) {
        return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}#bigint` : v)
            .replace(/"(-?\d+)#bigint"/g, (_, a) => a + 'n');
    }
}
exports.toJson = toJson;
