"use strict";
exports.__esModule = true;
var bignumber_js_1 = require("bignumber.js");
bignumber_js_1.BigNumber.config({
    EXPONENTIAL_AT: [-100, 100],
    ROUNDING_MODE: bignumber_js_1.BigNumber.ROUND_DOWN,
    DECIMAL_PLACES: 18
});
exports["default"] = bignumber_js_1.BigNumber;
