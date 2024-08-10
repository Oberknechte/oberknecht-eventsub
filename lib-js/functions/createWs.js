"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWs = createWs;
const __1 = require("..");
const ws_1 = require("ws");
const messageParser_1 = require("../parser/messageParser");
function createWs(sym) {
    let clientData = __1.i.eventsubClientData[sym];
    const wsNum = clientData.wsNum;
    clientData.wsNum++;
    if (!__1.i.WebSockets[sym])
        __1.i.WebSockets[sym] = {};
    if (!__1.i.websocketData[sym])
        __1.i.websocketData[sym] = {};
    let OberknechtEmitter = __1.i.OberknechtEmitter[sym];
    let ws = (__1.i.WebSockets[sym][wsNum] = new ws_1.WebSocket(clientData.wsUrl));
    __1.i.websocketData[sym][wsNum] = {
        get readyState() {
            return ws.readyState;
        },
        subscriptions: [],
    };
    ws.on("open", () => {
        OberknechtEmitter.emit(["open", "ws:open", `ws:${wsNum}:open`], {
            wsNum: wsNum,
        });
    });
    ws.on("close", (code, reason) => {
        OberknechtEmitter.emit(["close", "ws:close", `ws:${wsNum}:close`], {
            code: code,
            reason: reason,
            wsNum: wsNum,
        });
    });
    ws.on("error", (e) => {
        OberknechtEmitter.emitError(["error", "ws:error", `ws:${wsNum}:error`], {
            error: e,
            wsNum: wsNum,
        });
    });
    ws.on("message", (responseRaw) => {
        const response = Buffer.from(responseRaw).toString("utf-8");
        const responseParsed = JSON.parse(response);
        OberknechtEmitter.emit(["message", "ws:message", `ws:${wsNum}:message`], {
            response: responseParsed,
            wsNum: wsNum,
        });
        (0, messageParser_1.messageParser)(sym, responseParsed, wsNum);
    });
    return new Promise((resolve) => {
        return __1.i.OberknechtEmitter[sym].once(`ws:${wsNum}:session_welcome`, () => {
            return resolve(wsNum);
        });
    });
}
