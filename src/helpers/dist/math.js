"use strict";
exports.__esModule = true;
exports.calcPoolInGivenTokenRemove = exports.calcPoolInGivenWeightDecrease = exports.calcSingleInGivenWeightIncrease = exports.calcSingleOutGivenPoolIn = exports.calcSingleInGivenPoolOut = exports.calcPoolInGivenSingleOut = exports.calcPoolOutGivenSingleIn = exports.calcSpotPrice = exports.calcInGivenOut = exports.calcOutGivenIn = exports.bdiv = exports.bmul = void 0;
var bignumber_1 = require("./bignumber");
var BONE = new bignumber_1["default"](10).pow(18);
var EXIT_FEE = new bignumber_1["default"](0);
var BPOW_PRECISION = BONE.idiv(new bignumber_1["default"](10).pow(10));
function btoi(a) {
    return a.idiv(BONE);
}
function bfloor(a) {
    return btoi(a).times(BONE);
}
function bsubSign(a, b) {
    if (a.gte(b)) {
        var res = a.minus(b);
        var bool = false;
        return { res: res, bool: bool };
    }
    else {
        var res = b.minus(a);
        var bool = true;
        return { res: res, bool: bool };
    }
}
function bmul(a, b) {
    var c0 = a.times(b);
    var c1 = c0.plus(BONE.div(new bignumber_1["default"](2)));
    var c2 = c1.idiv(BONE);
    return c2;
}
exports.bmul = bmul;
function bdiv(a, b) {
    var c0 = a.times(BONE);
    var c1 = c0.plus(b.div(new bignumber_1["default"](2)));
    var c2 = c1.idiv(b);
    return c2;
}
exports.bdiv = bdiv;
function bpowi(a, n) {
    var z = !n.modulo(new bignumber_1["default"](2)).eq(new bignumber_1["default"](0)) ? a : BONE;
    for (n = n.idiv(new bignumber_1["default"](2)); !n.eq(new bignumber_1["default"](0)); n = n.idiv(new bignumber_1["default"](2))) {
        a = bmul(a, a);
        if (!n.modulo(new bignumber_1["default"](2)).eq(new bignumber_1["default"](0))) {
            z = bmul(z, a);
        }
    }
    return z;
}
function bpowApprox(base, exp, precision) {
    var a = exp;
    var _a = bsubSign(base, BONE), x = _a.res, xneg = _a.bool;
    var term = BONE;
    var sum = term;
    var negative = false;
    var LOOP_LIMIT = 1000;
    var idx = 0;
    for (var i = 1; term.gte(precision); i++) {
        idx += 1;
        // Some values cause it to lock up the browser
        // Test case: Remove Liquidity, single asset, poolAmountIn >> max
        // Should be halted before calling this, but...
        // Retain this halt after a max iteration limit as a backstop/failsafe
        if (LOOP_LIMIT == idx) {
            break;
        }
        var bigK = new bignumber_1["default"](i).times(BONE);
        var _b = bsubSign(a, bigK.minus(BONE)), c = _b.res, cneg = _b.bool;
        term = bmul(term, bmul(c, x));
        term = bdiv(term, bigK);
        if (term.eq(new bignumber_1["default"](0)))
            break;
        if (xneg)
            negative = !negative;
        if (cneg)
            negative = !negative;
        if (negative) {
            sum = sum.minus(term);
        }
        else {
            sum = sum.plus(term);
        }
    }
    return sum;
}
function bpow(base, exp) {
    var whole = bfloor(exp);
    var remain = exp.minus(whole);
    var wholePow = bpowi(base, btoi(whole));
    if (remain.eq(new bignumber_1["default"](0))) {
        return wholePow;
    }
    var partialResult = bpowApprox(base, remain, BPOW_PRECISION);
    return bmul(wholePow, partialResult);
}
function calcOutGivenIn(tokenBalanceIn, tokenWeightIn, tokenBalanceOut, tokenWeightOut, tokenAmountIn, swapFee) {
    var weightRatio = bdiv(tokenWeightIn, tokenWeightOut);
    var adjustedIn = BONE.minus(swapFee);
    adjustedIn = bmul(tokenAmountIn, adjustedIn);
    var y = bdiv(tokenBalanceIn, tokenBalanceIn.plus(adjustedIn));
    var foo = bpow(y, weightRatio);
    var bar = BONE.minus(foo);
    return bmul(tokenBalanceOut, bar);
}
exports.calcOutGivenIn = calcOutGivenIn;
function calcInGivenOut(tokenBalanceIn, tokenWeightIn, tokenBalanceOut, tokenWeightOut, tokenAmountOut, swapFee) {
    var weightRatio = bdiv(tokenWeightOut, tokenWeightIn);
    var diff = tokenBalanceOut.minus(tokenAmountOut);
    var y = bdiv(tokenBalanceOut, diff);
    var foo = bpow(y, weightRatio);
    foo = foo.minus(BONE);
    var tokenAmountIn = BONE.minus(swapFee);
    tokenAmountIn = bdiv(bmul(tokenBalanceIn, foo), tokenAmountIn);
    return tokenAmountIn;
}
exports.calcInGivenOut = calcInGivenOut;
function calcSpotPrice(tokenBalanceIn, tokenWeightIn, tokenBalanceOut, tokenWeightOut, swapFee) {
    var numer = bdiv(tokenBalanceIn, tokenWeightIn);
    var denom = bdiv(tokenBalanceOut, tokenWeightOut);
    var ratio = bdiv(numer, denom);
    var scale = bdiv(BONE, bsubSign(BONE, swapFee).res);
    return bmul(ratio, scale);
}
exports.calcSpotPrice = calcSpotPrice;
function calcPoolOutGivenSingleIn(tokenBalanceIn, tokenWeightIn, poolSupply, totalWeight, tokenAmountIn, swapFee) {
    var normalizedWeight = bdiv(tokenWeightIn, totalWeight);
    var zaz = bmul(BONE.minus(normalizedWeight), swapFee);
    var tokenAmountInAfterFee = bmul(tokenAmountIn, BONE.minus(zaz));
    var newTokenBalanceIn = tokenBalanceIn.plus(tokenAmountInAfterFee);
    var tokenInRatio = bdiv(newTokenBalanceIn, tokenBalanceIn);
    var poolRatio = bpow(tokenInRatio, normalizedWeight);
    var newPoolSupply = bmul(poolRatio, poolSupply);
    var poolAmountOut = newPoolSupply.minus(poolSupply);
    return poolAmountOut;
}
exports.calcPoolOutGivenSingleIn = calcPoolOutGivenSingleIn;
function calcPoolInGivenSingleOut(tokenBalanceOut, tokenWeightOut, poolSupply, totalWeight, tokenAmountOut, swapFee) {
    var normalizedWeight = bdiv(tokenWeightOut, totalWeight);
    var zoo = BONE.minus(normalizedWeight);
    var zar = bmul(zoo, swapFee);
    var tokenAmountOutBeforeSwapFee = bdiv(tokenAmountOut, BONE.minus(zar));
    var newTokenBalanceOut = tokenBalanceOut.minus(tokenAmountOutBeforeSwapFee);
    var tokenOutRatio = bdiv(newTokenBalanceOut, tokenBalanceOut);
    var poolRatio = bpow(tokenOutRatio, normalizedWeight);
    var newPoolSupply = bmul(poolRatio, poolSupply);
    var poolAmountInAfterExitFee = poolSupply.minus(newPoolSupply);
    var poolAmountIn = bdiv(poolAmountInAfterExitFee, BONE.minus(EXIT_FEE));
    return poolAmountIn;
}
exports.calcPoolInGivenSingleOut = calcPoolInGivenSingleOut;
function calcSingleInGivenPoolOut(tokenBalanceIn, tokenWeightIn, poolSupply, totalWeight, poolAmountOut, swapFee) {
    var normalizedWeight = bdiv(tokenWeightIn, totalWeight);
    var newPoolSupply = poolSupply.plus(poolAmountOut);
    var poolRatio = bdiv(newPoolSupply, poolSupply);
    var boo = bdiv(BONE, normalizedWeight);
    var tokenInRatio = bpow(poolRatio, boo);
    var newTokenBalanceIn = bmul(tokenInRatio, tokenBalanceIn);
    var tokenAmountInAfterFee = newTokenBalanceIn.minus(tokenBalanceIn);
    var zar = bmul(BONE.minus(normalizedWeight), swapFee);
    var tokenAmountIn = bdiv(tokenAmountInAfterFee, BONE.minus(zar));
    return tokenAmountIn;
}
exports.calcSingleInGivenPoolOut = calcSingleInGivenPoolOut;
function calcSingleOutGivenPoolIn(tokenBalanceOut, tokenWeightOut, poolSupply, totalWeight, poolAmountIn, swapFee) {
    var normalizedWeight = bdiv(tokenWeightOut, totalWeight);
    var poolAmountInAfterExitFee = bmul(poolAmountIn, BONE.minus(EXIT_FEE));
    var newPoolSupply = poolSupply.minus(poolAmountInAfterExitFee);
    var poolRatio = bdiv(newPoolSupply, poolSupply);
    var tokenOutRatio = bpow(poolRatio, bdiv(BONE, normalizedWeight));
    var newTokenBalanceOut = bmul(tokenOutRatio, tokenBalanceOut);
    var tokenAmountOutBeforeSwapFee = tokenBalanceOut.minus(newTokenBalanceOut);
    var zaz = bmul(BONE.minus(normalizedWeight), swapFee);
    var tokenAmountOut = bmul(tokenAmountOutBeforeSwapFee, BONE.minus(zaz));
    return tokenAmountOut;
}
exports.calcSingleOutGivenPoolIn = calcSingleOutGivenPoolIn;
function calcSingleInGivenWeightIncrease(tokenBalance, tokenWeight, tokenWeightNew) {
    var deltaWeight = tokenWeightNew.minus(tokenWeight);
    var tokenBalanceIn = bmul(tokenBalance, bdiv(deltaWeight, tokenWeight));
    return tokenBalanceIn;
}
exports.calcSingleInGivenWeightIncrease = calcSingleInGivenWeightIncrease;
function calcPoolInGivenWeightDecrease(totalWeight, tokenWeight, tokenWeightNew, poolSupply) {
    var deltaWeight = tokenWeight.minus(tokenWeightNew);
    var poolAmountIn = bmul(poolSupply, bdiv(deltaWeight, totalWeight));
    return poolAmountIn;
}
exports.calcPoolInGivenWeightDecrease = calcPoolInGivenWeightDecrease;
function calcPoolInGivenTokenRemove(totalWeight, tokenWeight, poolSupply) {
    var poolAmountIn = bdiv(bmul(poolSupply, tokenWeight), totalWeight);
    return poolAmountIn;
}
exports.calcPoolInGivenTokenRemove = calcPoolInGivenTokenRemove;
