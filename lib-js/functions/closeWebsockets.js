"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeWebsockets = closeWebsockets;
const __1 = require("..");
const closeWebsocket_1 = require("./closeWebsocket");
function closeWebsockets(sym) {
    Object.keys(__1.i.WebSockets[sym] ?? {}).forEach((wsnum) => {
        (0, closeWebsocket_1.closeWebsocket)(sym, parseInt(wsnum));
    });
    __1.i.eventsubClientData[sym].subscriptions = {};
}
