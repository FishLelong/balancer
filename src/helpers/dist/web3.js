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
exports.makeProxyTransaction = exports.sendTransaction = void 0;
var contracts_1 = require("@ethersproject/contracts");
var address_1 = require("@ethersproject/address");
var abi_1 = require("@/helpers/abi");
var utils_1 = require("@/helpers/utils");
var provider_1 = require("@/helpers/provider");
var abi_2 = require("@ethersproject/abi");
function sendTransaction(web3, _a) {
    var contractType = _a[0], contractAddress = _a[1], action = _a[2], params = _a[3], overrides = _a[4];
    return __awaiter(this, void 0, void 0, function () {
        var signer, contract, contractWithSigner, gasLimitNumber, gasLimit, e_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    signer = web3.getSigner();
                    contract = new contracts_1.Contract(address_1.getAddress(contractAddress), abi_1["default"][contractType], web3);
                    contractWithSigner = contract.connect(signer);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (_b = contractWithSigner.estimateGas)[action].apply(_b, __spreadArrays(params, [overrides]))];
                case 2:
                    gasLimitNumber = _c.sent();
                    gasLimit = gasLimitNumber.toNumber();
                    overrides.gasLimit = Math.floor(gasLimit * (1 + utils_1.GAS_LIMIT_BUFFER));
                    return [4 /*yield*/, contractWithSigner[action].apply(contractWithSigner, __spreadArrays(params, [overrides]))];
                case 3: return [2 /*return*/, _c.sent()];
                case 4:
                    e_1 = _c.sent();
                    if (utils_1.isTxRejected(e_1))
                        return [2 /*return*/, Promise.reject()];
                    // Use gas price field to store tx sender since "from" will be overwritten
                    overrides.gasPrice = signer.getAddress();
                    utils_1.logRevertedTx(provider_1["default"], contract, action, params, overrides);
                    return [2 /*return*/, Promise.reject(e_1)];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.sendTransaction = sendTransaction;
function makeProxyTransaction(dsProxy, _a) {
    var contractType = _a[0], contractAddress = _a[1], action = _a[2], params = _a[3], overrides = _a[4];
    var iface = new abi_2.Interface(abi_1["default"][contractType]);
    var data = iface.encodeFunctionData(action, params);
    return ['DSProxy', dsProxy, 'execute', [contractAddress, data], overrides];
}
exports.makeProxyTransaction = makeProxyTransaction;
