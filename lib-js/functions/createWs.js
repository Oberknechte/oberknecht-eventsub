"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWs = void 0;
const __1 = require("..");
const ws_1 = require("ws");
const messageParser_1 = require("../parser/messageParser");
const subscribe_1 = require("./subscribe");
function createWs(sym, oldWsNum, oldWSError) {
    let clientData = __1.i.eventsubClientData[sym];
    const wsNum = clientData.wsNum;
    clientData.wsNum++;
    if (!__1.i.WebSockets[sym])
        __1.i.WebSockets[sym] = {};
    if (!__1.i.websocketData[sym])
        __1.i.websocketData[sym] = {};
    let oldWSData = __1.i.websocketData[sym]?.[oldWsNum];
    let useRecreateWSNum = oldWsNum ?? wsNum;
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
        if (__1.i.websocketData?.[sym]?.[wsNum]?.heartbeatInterval)
            clearInterval(__1.i.websocketData[sym][wsNum].heartbeatInterval);
        if (code === 1000 || !__1.i.eventsubClientData[sym]._options.autoReconnect)
            return;
        setTimeout(() => {
            createWs(sym, useRecreateWSNum, {
                code: code,
                reason: reason,
            }).catch((e) => {
                OberknechtEmitter.emitError(["error", "ws:error", `ws:${wsNum}:error`], {
                    error: e,
                    wsNum: wsNum,
                });
            });
        }, 30000);
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
        __1.i.websocketData[sym][wsNum].lastAlive = Date.now();
        __1.i.websocketData[sym][wsNum].pendingPings = 0;
    });
    ws.on("ping", () => {
        ws.pong();
        __1.i.websocketData[sym][wsNum].lastAlive = Date.now();
        __1.i.websocketData[sym][wsNum].pendingPings = 0;
    });
    ws.on("pong", () => {
        __1.i.websocketData[sym][wsNum].lastAlive = Date.now();
        __1.i.websocketData[sym][wsNum].pendingPings = 0;
    });
    function heartbeat() {
        if (__1.i.websocketData[sym][wsNum].pendingPings >
            __1.i.eventsubClientData[sym]?._options?.wsHeartbeatUntilReconnect ??
            2) {
            ws.close(1012);
            return;
        }
        ws.ping();
        __1.i.websocketData[sym][wsNum].pendingPings++;
    }
    __1.i.websocketData[sym][wsNum].heartbeatInterval = setInterval(heartbeat, __1.i.eventsubClientData[sym]?._options?.wsHeartbeatInterval ?? 5000);
    return new Promise((resolve) => {
        return OberknechtEmitter.once(`ws:${wsNum}:session_welcome`, () => {
            resolve(wsNum);
            if (!oldWSData)
                return;
            Promise.all(Object.keys(oldWSData.subscriptions).map((id) => {
                return new Promise((resolve2, reject2) => {
                    let subscription = oldWSData.subscriptions[id];
                    let wsArgs = subscription.wsArgs;
                    (0, subscribe_1.subscribe)(sym, wsArgs[0], wsArgs[1], wsArgs[2], wsArgs[3])
                        .then((r) => {
                        OberknechtEmitter.emit([
                            "resubscribe",
                            "resubscribeSuccess",
                            `ws:${wsNum}:resubscribe`,
                            `ws:${wsNum}:resubscribeSuccess`,
                        ], {
                            success: true,
                            resubscribeData: r,
                            resubscribeArgs: wsArgs,
                            oldWSError: oldWSError,
                        });
                    })
                        .catch((e) => {
                        OberknechtEmitter.emit([
                            "resubscribe",
                            "resubscribeError",
                            `ws:${wsNum}:resubscribe`,
                            `ws:${wsNum}:resubscribeError`,
                        ], {
                            success: false,
                            error: e,
                            resubscribeArgs: wsArgs,
                            oldWSError: oldWSError,
                        });
                    });
                });
            })).then(() => {
                delete __1.i.websocketData[sym][oldWsNum];
                useRecreateWSNum = wsNum;
            });
            useRecreateWSNum = wsNum;
        });
    });
}
exports.createWs = createWs;
