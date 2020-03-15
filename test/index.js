"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
exports.chai = chai_1.default;
const chai_spies_1 = __importDefault(require("chai-spies"));
const mocha_1 = require("mocha");
exports.describe = mocha_1.describe;
chai_1.default.use(chai_spies_1.default);
const expect = chai_1.default.expect;
exports.expect = expect;
const should = chai_1.default.should();
exports.should = should;
const dummy = () => {
};
exports.dummy = dummy;
