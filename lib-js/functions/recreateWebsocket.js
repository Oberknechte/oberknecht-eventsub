"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recreateWebsocket = recreateWebsocket;
const __1 = require("..");
const ws_1 = require("ws");
function recreateWebsocket(sym, oldWsNum) {
    return new Promise((resolve, reject) => {
        if (!__1.i.websocketData[sym]?.[oldWsNum])
            return reject(Error("Websocket not found"));
        let clientData = __1.i.eventsubClientData[sym];
        const wsNum = clientData.wsNum;
        clientData.wsNum++;
        let emitter = __1.i.OberknechtEmitter[sym];
        const ws = (__1.i.WebSockets[sym][wsNum] = new ws_1.WebSocket(clientData.wsUrl));
        __1.i.websocketData[sym][wsNum] = {
            get readyState() {
                return ws.readyState;
            },
            subscriptions: {},
        };
        let oldWSData = __1.i.websocketData[sym][oldWsNum];
        // Object.keys(oldWSData.subscriptions).forEach((id) => {
        //   i.websocketData[sym][wsNum].subscriptions[id] =
        //     oldWSData.subscriptions[id];
        // });
        ws.on("open", () => {
            emitter.emit(["open", "ws:open", `ws:${wsNum}:open`], {
                wsNum: wsNum,
            });
        });
        ws.on("close", (code, reason) => {
            emitter.emit(["close", "ws:close", `ws:${wsNum}:close`], {
                code: code,
                reason: reason,
                wsNum: wsNum,
            });
            if (__1.i.websocketData?.[sym]?.[wsNum]?.heartbeatInterval)
                clearInterval(__1.i.websocketData[sym][wsNum].heartbeatInterval);
            if (code === 1000 || !__1.i.eventsubClientData[sym]._options.autoReconnect)
                return;
            recreateWebsocket(sym, wsNum).catch((e) => {
                emitter.emitError(["error", "ws:error", `ws:${wsNum}:error`], {
                    error: e,
                    wsNum: wsNum,
                });
                setTimeout(() => {
                    recreateWebsocket(sym, wsNum);
                }, 60000);
            });
        });
        ws.on("error", (e) => {
            emitter.emitError(["error", "ws:error", `ws:${wsNum}:error`], {
                error: e,
                wsNum: wsNum,
            });
        });
        ws.on("message", (responseRaw) => {
            const response = Buffer.from(responseRaw).toString("utf-8");
            const responseParsed = JSON.parse(response);
            emitter.emit(["message", "ws:message", `ws:${wsNum}:message`], {
                response: responseParsed,
                wsNum: wsNum,
            });
            __1.i.websocketData[sym][wsNum].lastAlive = Date.now();
            __1.i.websocketData[sym][wsNum].pendingPings = 0;
        });
        function heartbeat() {
            if (__1.i.websocketData[sym][wsNum].pendingPings > 2) {
                ws.close();
                return;
            }
            __1.i.websocketData[sym][wsNum].pendingPings++;
        }
        __1.i.websocketData[sym][wsNum].heartbeatInterval = setInterval(heartbeat, 10000);
    });
}
