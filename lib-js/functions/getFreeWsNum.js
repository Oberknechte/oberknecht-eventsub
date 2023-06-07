"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFreeWsNum = void 0;
const __1 = require("..");
function getFreeWsNum(sym) {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
    return Object.keys((__1.i.websocketData[sym] ?? {}))?.map(a => [a, __1.i.WebSockets[sym]?.[a]?.readyState, (__1.i.websocketData[sym]?.[a]?.notifications?.length ?? 0)])?.filter(a => a[1] === 1)?.filter(a => a[2] < 100)?.[0]?.[0];
}
exports.getFreeWsNum = getFreeWsNum;
;
