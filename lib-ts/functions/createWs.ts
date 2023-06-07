import { i } from "..";
import { WebSocket } from "ws";
import { messageParser } from "../parser/messageParser";

export function createWs(sym) {
    let clientData = i.eventsubClientData[sym];
    const wsNum = clientData.wsNum;
    clientData.wsNum++;

    if (!i.WebSockets[sym]) i.WebSockets[sym] = {};
    if (!i.websocketData[sym]) i.websocketData[sym] = {};

    let OberknechtEmitter = i.OberknechtEmitter[sym];

    let ws = i.WebSockets[sym][wsNum] = new WebSocket(clientData.wsUrl);
    i.websocketData[sym][wsNum] = {
        get readyState() { return ws.readyState },
        subscriptions: []
    };

    ws.on("open", () => {
        OberknechtEmitter.emit(["open", "ws:open", `ws:${wsNum}:open`], { wsNum: wsNum });
    });

    ws.on("close", (code, reason) => {
        OberknechtEmitter.emit(["close", "ws:close", `ws:${wsNum}:close`], { code: code, reason: reason, wsNum: wsNum });
    });

    ws.on("error", (e) => {
        OberknechtEmitter.emitError(["error", "ws:error", `ws:${wsNum}:error`], { error: e, wsNum: wsNum });
    });

    ws.on("message", (responseRaw) => {
        const response = Buffer.from(responseRaw).toString("utf-8");
        const responseParsed = JSON.parse(response);
        OberknechtEmitter.emit(["message", "ws:message", `ws:${wsNum}:message`], { response: responseParsed, wsNum: wsNum });
        messageParser(sym, responseParsed, wsNum);
    });

    return new Promise((resolve) => {
        return i.OberknechtEmitter[sym].once(`ws:${wsNum}:session_welcome`, () => {
            return resolve(wsNum);
        });
    });
};