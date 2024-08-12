"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeWebsocket = closeWebsocket;
const __1 = require("..");
function closeWebsocket(sym, wsnum) {
    try {
        __1.i.WebSockets[sym][wsnum].close();
        if (__1.i.websocketData[sym][wsnum].subscriptions)
            Object.keys(__1.i.websocketData[sym][wsnum].subscriptions).forEach((id) => {
                delete __1.i.eventsubClientData[sym].subscriptions[id];
            });
        __1.i.websocketData[sym][wsnum].subscriptions = [];
    }
    catch (e) { }
    return;
}
