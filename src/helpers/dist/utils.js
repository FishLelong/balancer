"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.formatNumber = exports.filterObj = exports.blockNumberToTimestamp = exports.formatFilters = exports.logRevertedTx = exports.isTxReverted = exports.isTxRejected = exports.getTokenBySymbol = exports.calcPoolTokensByRatio = exports.trunc = exports.clone = exports.delay = exports.isValidAddress = exports.getMarketChartFromCoinGecko = exports.formatPool = exports.isLocked = exports.normalizeBalance = exports.denormalizeBalance = exports.toWei = exports.scale = exports.bnum = exports.shorten = exports.shortenAddress = exports.jsonParse = exports.poolRights = exports.poolTypes = exports.liquidityToggleOptions = exports.capInputOptions = exports.unknownColors = exports.MAX = exports.GAS_LIMIT_BUFFER = exports.POOL_TOKENS_DECIMALS = exports.MAX_UINT = exports.MAX_GAS = exports.ITEMS_PER_PAGE = void 0;
var numeral_1 = require("numeral");
var address_1 = require("@ethersproject/address");
var constants_1 = require("@ethersproject/constants");
var wallet_1 = require("@ethersproject/wallet");
var bignumber_1 = require("@/helpers/bignumber");
var config_1 = require("@/config");
var i18n_1 = require("@/i18n");
exports.ITEMS_PER_PAGE = 20;
exports.MAX_GAS = new bignumber_1["default"]('0xffffffff');
exports.MAX_UINT = constants_1.MaxUint256;
exports.POOL_TOKENS_DECIMALS = 18;
exports.GAS_LIMIT_BUFFER = 0.1;
exports.MAX = '115792089237316195423570985008687907853269984665640564039457.584007913129639935';
exports.unknownColors = [
    '#5d6872',
    '#7e9e99',
    '#9d9f7f',
    '#68aca9',
    '#a593a5',
    '#387080',
    '#c7bdf4',
    '#c28d75'
];
exports.capInputOptions = {
    NUMERIC: i18n_1["default"].tc('value'),
    UNLIMITED: i18n_1["default"].tc('unlimited')
};
exports.liquidityToggleOptions = {
    MULTI_ASSET: i18n_1["default"].tc('multiAsset'),
    SINGLE_ASSET: i18n_1["default"].tc('singleAsset')
};
exports.poolTypes = {
    SHARED_POOL: i18n_1["default"].tc('shared'),
    SMART_POOL: i18n_1["default"].tc('smart')
};
exports.poolRights = {
    canPauseSwapping: i18n_1["default"].tc('canPauseSwapping'),
    canChangeSwapFee: i18n_1["default"].tc('canChangeSwapFee'),
    canChangeWeights: i18n_1["default"].tc('canChangeWeights'),
    canAddRemoveTokens: i18n_1["default"].tc('canAddRemoveTokens'),
    canWhitelistLPs: i18n_1["default"].tc('canWhitelistLPs'),
    canChangeCap: i18n_1["default"].tc('canChangeCap')
};
function jsonParse(input, fallback) {
    try {
        return JSON.parse(input);
    }
    catch (err) {
        return fallback || undefined;
    }
}
exports.jsonParse = jsonParse;
function shortenAddress(str) {
    if (str === void 0) { str = ''; }
    return str ? str.slice(0, 6) + "..." + str.slice(str.length - 4) : str;
}
exports.shortenAddress = shortenAddress;
function shorten(str, max) {
    if (str === void 0) { str = ''; }
    if (max === void 0) { max = 14; }
    return str.length > max ? str.slice(0, max) + "..." : str;
}
exports.shorten = shorten;
function bnum(val) {
    var number = typeof val === 'string' ? val : val ? val.toString() : '0';
    return new bignumber_1["default"](number);
}
exports.bnum = bnum;
function scale(input, decimalPlaces) {
    var scalePow = new bignumber_1["default"](decimalPlaces.toString());
    var scaleMul = new bignumber_1["default"](10).pow(scalePow);
    return input.times(scaleMul);
}
exports.scale = scale;
function toWei(val) {
    return scale(bnum(val.toString()), 18).integerValue();
}
exports.toWei = toWei;
function denormalizeBalance(amount, tokenDecimals) {
    return scale(bnum(amount), tokenDecimals);
}
exports.denormalizeBalance = denormalizeBalance;
function normalizeBalance(amount, tokenDecimals) {
    return scale(bnum(amount), -tokenDecimals);
}
exports.normalizeBalance = normalizeBalance;
function isLocked(allowances, tokenAddress, spender, rawAmount, decimals) {
    var tokenAllowance = allowances[tokenAddress];
    if (!tokenAllowance || !tokenAllowance[spender]) {
        return true;
    }
    if (!rawAmount) {
        return false;
    }
    var amount = denormalizeBalance(rawAmount, decimals);
    return amount.gt(tokenAllowance[spender]);
}
exports.isLocked = isLocked;
function formatPool(pool) {
    var colorIndex = 0;
    pool.tokens = pool.tokens.map(function (token) {
        token.checksum = address_1.getAddress(token.address);
        token.weightPercent = (100 / pool.totalWeight) * token.denormWeight;
        var configToken = config_1["default"].tokens[token.checksum];
        if (configToken) {
            token.color = configToken.color;
        }
        else {
            token.color = exports.unknownColors[colorIndex];
            colorIndex++;
        }
        return token;
    });
    if (pool.shares)
        pool.holders = pool.shares.length;
    pool.tokensList = pool.tokensList.map(function (token) { return address_1.getAddress(token); });
    pool.lastSwapVolume = 0;
    var poolTotalSwapVolume = pool.swaps && pool.swaps[0] && pool.swaps[0].poolTotalSwapVolume
        ? parseFloat(pool.swaps[0].poolTotalSwapVolume)
        : 0;
    pool.lastSwapVolume = parseFloat(pool.totalSwapVolume) - poolTotalSwapVolume;
    return pool;
}
exports.formatPool = formatPool;
function getMarketChartFromCoinGecko(address) {
    return __awaiter(this, void 0, void 0, function () {
        var ratePerDay, uri, marketChart, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ratePerDay = {};
                    uri = "https://api.coingecko.com/api/v3/coins/ethereum/contract/" + address + "/market_chart?vs_currency=usd&days=60";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(uri).then(function (res) { return res.json(); })];
                case 2:
                    marketChart = _a.sent();
                    marketChart.prices.forEach(function (p) {
                        var date = new Date();
                        date.setTime(p[0]);
                        var day = date.toISOString();
                        ratePerDay[day] = p[1];
                    });
                    return [2 /*return*/, ratePerDay];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, Promise.reject()];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getMarketChartFromCoinGecko = getMarketChartFromCoinGecko;
function isValidAddress(str) {
    try {
        address_1.getAddress(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.isValidAddress = isValidAddress;
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, ms); });
}
exports.delay = delay;
function clone(item) {
    return JSON.parse(JSON.stringify(item));
}
exports.clone = clone;
function trunc(value, decimals) {
    if (decimals === void 0) { decimals = 0; }
    var mutiplier = Math.pow(10, decimals);
    return Math.trunc(value * mutiplier) / mutiplier;
}
exports.trunc = trunc;
function calcPoolTokensByRatio(ratio, totalShares) {
    if (ratio.isNaN()) {
        return '0';
    }
    // @TODO - fix calcs so no buffer is needed
    var buffer = bnum(100);
    return bnum(ratio)
        .times(toWei(totalShares))
        .integerValue(bignumber_1["default"].ROUND_DOWN)
        .minus(buffer)
        .toString();
}
exports.calcPoolTokensByRatio = calcPoolTokensByRatio;
function getTokenBySymbol(symbol) {
    var tokenAddresses = Object.keys(config_1["default"].tokens);
    var tokenAddress = tokenAddresses.find(function (tokenAddress) { return config_1["default"].tokens[tokenAddress].symbol === symbol; });
    return config_1["default"].tokens[tokenAddress];
}
exports.getTokenBySymbol = getTokenBySymbol;
exports.isTxRejected = function (error) {
    if (!error) {
        return false;
    }
    return error.code === 4001 || error.code === -32603;
};
exports.isTxReverted = function (error) {
    if (!error) {
        return false;
    }
    return error.code === -32016;
};
function logRevertedTx(provider, contract, action, params, overrides) {
    // address: 0xfffff6e3a909693c6e4dadbb72214fd6c3e47913
    var dummyPrivateKey = '0x651bd555534625dc2fd85e13369dc61547b2e3f2cfc8b98cee868b449c17a4d6';
    var dummyWallet = new wallet_1.Wallet(dummyPrivateKey).connect(provider);
    var loggingContract = contract.connect(dummyWallet);
    loggingContract[action].apply(loggingContract, __spreadArrays(params, [overrides]));
}
exports.logRevertedTx = logRevertedTx;
function formatFilters(filters, fb) {
    if (!filters)
        return fb || {};
    if (!filters.token)
        filters.token = [];
    if (!filters.type)
        filters.type = 'shared';
    if (!Array.isArray(filters.token))
        filters.token = [filters.token];
    return filters;
}
exports.formatFilters = formatFilters;
function blockNumberToTimestamp(currentTime, currentBlockNumber, blockNumber) {
    var AVG_BLOCK_TIMES = {
        1: 13,
        42: 5
    };
    var avgBlockTime = AVG_BLOCK_TIMES[config_1["default"].chainId];
    return currentTime + avgBlockTime * 1000 * (blockNumber - currentBlockNumber);
}
exports.blockNumberToTimestamp = blockNumberToTimestamp;
function filterObj(obj, fn) {
    return Object.fromEntries(Object.entries(obj).filter(function (item) { return fn(item); }));
}
exports.filterObj = filterObj;
function formatNumber(number, key) {
    if (number === 0)
        return '-';
    if (number < 0.0001)
        number = 0;
    var format = '0.[000]';
    if (number > 1000)
        format = '0.[0]a';
    if (number < 1)
        format = '0.[0000]';
    if (key === 'long') {
        format = '0,000.[00]';
        if (number < 1)
            format = '0.[0000]';
    }
    if (key === 'usd') {
        format = '$(0.[00])';
        if (number > 1000)
            format = '$(0.[0]a)';
        if (number < 1)
            format = '$(0.[0000])';
    }
    if (key === 'usd-long') {
        format = '$(0,000.[00])';
        if (number < 1)
            format = '$(0.[0000])';
    }
    if (key === 'percent')
        format = '(0.[00])%';
    if (key === 'percent-short')
        format = '(0)%';
    return numeral_1["default"](number)
        .format(format)
        .toUpperCase();
}
exports.formatNumber = formatNumber;
