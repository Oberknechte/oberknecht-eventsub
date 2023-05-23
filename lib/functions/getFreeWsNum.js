let i = require("..");

/** @param {Symbol} sym */
function getFreeWsNum(sym) {
    // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
    return Object.keys((i.websocketData[sym] ?? {}))?.map(a => [a, i.WebSockets[sym]?.[a]?.readyState, (i.websocketData[sym]?.[a]?.notifications?.length ?? 0)])?.filter(a => a[1] === 1)?.filter(a => a[2] < 100)?.[0]?.[0];
};

module.exports = getFreeWsNum;