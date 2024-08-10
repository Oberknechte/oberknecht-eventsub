"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeWebsocket = closeWebsocket;
const __1 = require("..");
function closeWebsocket(sym, wsnum) {
    try {
        __1.i.WebSockets[sym][wsnum].close();
        if (__1.i.websocketData[sym][wsnum].subscriptions)
            __1.i.websocketData[sym][wsnum].subscriptions.forEach((subscription) => {
                let index = __1.i.eventsubClientData[sym].subscriptions.indexOf(subscription);
                if (index !== -1)
                    __1.i.eventsubClientData[sym].subscriptions.splice(index);
            });
        __1.i.websocketData[sym][wsnum].subscriptions = [];
    }
    catch (e) { }
    return;
}
